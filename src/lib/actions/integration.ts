"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { IntegrationEnum, integrations } from "@/db/schema"
import { env } from "@/env"
import CryptoJS from "crypto-js"
import { and, eq } from "drizzle-orm"

import { getCachedUser } from "../queries/user"

export const addIntegration = async (input: {
  integration: IntegrationEnum
  refreshToken?: string
  accessToken?: string
  expiresAt?: Date | string | null
}) => {
  try {
    const user = await getCachedUser()
    if (!user) {
      throw new Error("User not found.")
    }
    const integrationRes = await db.insert(integrations).values({
      userId: user.id,
      name: input.integration,
      refreshToken: CryptoJS.AES.encrypt(
        input.refreshToken as string,
        env.CRYPTO_SECRET
      ).toString(),
      accessToken: CryptoJS.AES.encrypt(
        input.accessToken as string,
        env.CRYPTO_SECRET
      ).toString(),

      expiresAt: input.expiresAt?.toString(),
    })

    revalidatePath("/dashboard/integrations")
    return integrationRes
  } catch (error) {
    console.error(error)
  }
}

export const deleteIntegration = async (input: {
  userId: string
  integration: IntegrationEnum
}) => {
  try {
    await db
      .delete(integrations)
      .where(
        and(
          eq(integrations.userId, input.userId),
          eq(integrations.name, input.integration)
        )
      )
    return true
  } catch (error) {
    console.error(error)
    // handle error
    return false
  }
}
