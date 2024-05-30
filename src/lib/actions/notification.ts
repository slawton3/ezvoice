"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { notifications } from "@/db/schema"
import { env } from "@/env.js"
import { currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"

import { getErrorMessage } from "@/lib/handle-error"
import { resend } from "@/lib/resend"
import type { UpdateNotificationSchema } from "@/lib/validations/notification"

export async function updateNotification(input: UpdateNotificationSchema) {
  try {
    const notification = await db
      .select({
        email: notifications.email,
        newsletter: notifications.newsletter,
      })
      .from(notifications)
      .where(eq(notifications.token, input.token))
      .then((res) => res[0])

    if (!notification) {
      throw new Error("Email not found.")
    }

    const user = await currentUser()

    if (input.newsletter && !notification.newsletter) {
      await resend.emails.send({
        to: notification.email,
        from: env.EMAIL_FROM_ADDRESS,
        subject: "Welcome to our waitlist!",
        text: `Hello, ${user?.fullName}! You have been added to our waitlist.`,
      })
    }

    await db
      .update(notifications)
      .set({
        ...input,
        userId: user?.id,
      })
      .where(eq(notifications.token, input.token))

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
