/* eslint-disable */

import { DB } from "@/db"
import { users } from "@/db/schema"
import { env } from "@/env.mjs"
import { SubscriptionPlans, subscriptionPlans } from "@/types"
import { clerkClient } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { event as gaEvent } from "nextjs-google-analytics"
import type Stripe from "stripe"

import { storeSubscriptionPlans } from "@/config/subscription"
import { setUserCreditsMutation } from "@/app/_actions/credits"

import { resend } from "./resend"

// retrieves a Stripe customer id for a given user if it exists or creates a new one
export const getOrCreateStripeCustomerIdForUser = async ({
  stripe,
  userId,
  db,
}: {
  stripe: Stripe
  userId: string
  db: DB
}) => {
  // get user from database
  const dbUser = await db.select().from(users).where(eq(users.id, userId))

  const user = dbUser[0]

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  // create a new customer
  const customer = await stripe.customers.create({
    email: user?.email ?? undefined,
    name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
  })

  // update with new customer id
  const updatedUser = await db
    .update(users)
    .set({
      stripeCustomerId: customer.id,
    })
    .where(eq(users.id, userId))

  if (updatedUser) {
    return customer.id
  }
}

export const handleInvoicePaid = async ({
  event,
  stripe,
  db,
}: {
  event: Stripe.Event
  stripe: Stripe
  db: DB
}) => {
  try {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId = invoice.subscription
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId as string
    )

    const userId = invoice.subscription_details?.metadata?.userId
    const planName = invoice.subscription_details?.metadata?.planName

    if (!userId || !planName) {
      throw new Error("User not found" + invoice.metadata)
    }

    // Update the price id and set the new period end
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })

    // update user with subscription data
    await db
      .update(users)
      .set({
        stripeSubscriptionId: subscription.id,
        stripeSubscriptionStatus: subscription.status,
        stripeCurrentPeriodEnd: subscription.current_period_end,
        subscriptionPlan: planName as SubscriptionPlans,
      })
      .where(eq(users.id, userId))

    const plans = [
      ...storeSubscriptionPlans.Monthly,
      ...storeSubscriptionPlans.Yearly,
    ]

    // update user credits
    setUserCreditsMutation(
      plans.find((p) => p.id === planName)?.credits ?? 0,
      userId
    )
  } catch (e) {
    console.error(e)
  }
}

export const handleSubscriptionCreatedOrUpdated = async ({
  event,
  db,
}: {
  event: Stripe.Event
  db: DB
}) => {
  const subscription = event.data.object as Stripe.Subscription
  const plan = subscription.metadata.planName as SubscriptionPlans

  const userId = subscription?.metadata?.userId

  if (!userId) {
    throw new Error("User not found" + subscription.metadata)
  }

  const data = {
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripeSubscriptionStatus: subscription.status,
    stripeCurrentPeriodEnd: subscription.current_period_end,
    subscriptionPlan: plan,
  }
  await db
    .update(users)
    .set({
      ...data,
    })
    .where(eq(users.id, userId))

  gaEvent("purchase_subscription")
}

export const handleSubscriptionCanceled = async ({
  event,
  db,
}: {
  event: Stripe.Event
  db: DB
}) => {
  const subscription = event.data.object as Stripe.Subscription

  const userId = subscription?.metadata?.userId

  if (!userId) {
    throw new Error("User not found" + subscription.metadata)
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  await resend.sendEmail({
    subject: "Subscription Canceled",
    to: env.EMAIL_FROM_ADDRESS,
    from: env.EMAIL_FROM_ADDRESS,
    text: `Subscription canceled for user ${user?.email}`,
  })

  await db
    .update(users)
    .set({
      stripeSubscriptionId: null,
      stripeSubscriptionStatus: null,
      stripeCurrentPeriodEnd: null,
      subscriptionPlan: subscriptionPlans.Values.AUTH,
    })
    .where(eq(users.id, userId))
}
