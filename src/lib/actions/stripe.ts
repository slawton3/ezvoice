"use server"

import { cache } from "react"
import { PlanWithPrice, UserPlan } from "@/types"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { addDays } from "date-fns"
import { z } from "zod"

import { pricingConfig } from "@/config/pricing"

import { getErrorMessage } from "../handle-error"
import { stripe } from "../stripe"
import { absoluteUrl, formatPrice, getUserEmail } from "../utils"
import { userPrivateMetadataSchema } from "../validations/auth"
import { managePlanSchema } from "../validations/stripe"

// Retrieve prices for all plans from Stripe
export async function getPlans(): Promise<PlanWithPrice[]> {
  return await cache(
    async () => {
      const standardPriceId = pricingConfig.plans.standard.stripePriceId
      const proPriceId = pricingConfig.plans.pro.stripePriceId

      const [standardPrice, proPrice] = await Promise.all([
        stripe.prices.retrieve(standardPriceId),
        stripe.prices.retrieve(proPriceId),
      ])

      const currency = proPrice.currency

      return Object.values(pricingConfig.plans).map((plan) => {
        const price =
          plan.stripePriceId === proPriceId
            ? proPrice
            : plan.stripePriceId === standardPriceId
              ? standardPrice
              : null

        return {
          ...plan,
          price: formatPrice((price?.unit_amount ?? 0) / 100, { currency }),
        }
      })
    }
    // ["subscription-plans"],
    // {
    //   revalidate: 3600, // every hour
    //   tags: ["subscription-plans"],
    // }
  )()
}

// Getting the subscription plan by store id
export async function getPlan(input: {
  userId: string
}): Promise<UserPlan | null> {
  try {
    const user = await clerkClient.users.getUser(input.userId)

    if (!user) {
      throw new Error("User not found.")
    }

    const userPrivateMetadata = userPrivateMetadataSchema.parse(
      user.privateMetadata
    )

    // Check if user is subscribed
    const isSubscribed =
      !!userPrivateMetadata.stripePriceId &&
      !!userPrivateMetadata.stripeCurrentPeriodEnd &&
      addDays(
        new Date(userPrivateMetadata.stripeCurrentPeriodEnd),
        1
      ).getTime() > Date.now()

    const plan = isSubscribed
      ? Object.values(pricingConfig.plans).find(
          (plan) => plan.stripePriceId === userPrivateMetadata.stripePriceId
        )
      : pricingConfig.plans.free

    if (!plan) {
      throw new Error("Plan not found.")
    }

    // Check if user has canceled subscription
    let isCanceled = false
    if (isSubscribed && !!userPrivateMetadata.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(
        userPrivateMetadata.stripeSubscriptionId
      )
      isCanceled = stripePlan.cancel_at_period_end
    }

    return {
      ...plan,
      stripeSubscriptionId: userPrivateMetadata.stripeSubscriptionId,
      stripeCurrentPeriodEnd: userPrivateMetadata.stripeCurrentPeriodEnd,
      stripeCustomerId: userPrivateMetadata.stripeCustomerId,
      isSubscribed,
      isCanceled,
      isActive: isSubscribed && !isCanceled,
    }
  } catch (err) {
    return null
  }
}

// Managing subscription by store id
export async function managePlan(input: z.infer<typeof managePlanSchema>) {
  try {
    const billingUrl = absoluteUrl("/dashboard/billing")

    const user = await currentUser()

    if (!user) {
      throw new Error("User not found.")
    }

    const email = getUserEmail(user)

    // If the user is already subscribed to a plan, we redirect them to the Stripe billing portal
    if (input.isSubscribed && input.stripeCustomerId && input.isCurrentPlan) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: input.stripeCustomerId,
        return_url: billingUrl,
      })

      return {
        data: {
          url: stripeSession.url,
        },
        error: null,
      }
    }

    // If the user is not subscribed to a plan, we create a Stripe Checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: email,
      line_items: [
        {
          price: input.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    })

    return {
      data: {
        url: stripeSession.url ?? billingUrl,
      },
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
