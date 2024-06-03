"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { integrationEnumSchema, integrations } from "@/db/schema"
import { env } from "@/env"
import CryptoJS from "crypto-js"
import { and, eq } from "drizzle-orm"

import { getCachedUser } from "../queries/user"
import { qbOauthClient, qbOauthOptions } from "../quickbooks"

export const generateAuthorizationUrl = async () => {
  return new Promise<string>((resolve) => {
    resolve(qbOauthClient.authorizeUri(qbOauthOptions))
  })
}

export const getQuickbooksToken = async () => {
  const token = await refreshQuickbooksToken()

  if (!token) {
    return null
  }

  return token.json["access_token"] as string
}

export const refreshQuickbooksToken = async () => {
  const user = await getCachedUser()

  if (!user) {
    return null
  }

  const token = await db.query.integrations.findFirst({
    where: and(
      eq(integrations.userId, user.id),
      eq(integrations.name, integrationEnumSchema.Enum.quickbooks)
    ),
  })

  if (!token) {
    throw new Error("Quickbooks token not found")
  }

  if (
    token.updatedAt != null &&
    token.updatedAt >= new Date(Date.now() - 1000 * 60 * 60)
  ) {
    const response = await qbOauthClient.refreshUsingToken(
      CryptoJS.AES.decrypt(
        token.refreshToken as string,
        env.CRYPTO_SECRET
      ).toString(CryptoJS.enc.Utf8)
    )

    return response
  }

  return null
}

export const revokeQuickbooksToken = async () => {
  const user = await getCachedUser()

  if (!user) {
    return null
  }

  const token = await db.query.integrations.findFirst({
    where: and(
      eq(integrations.userId, user.id),
      eq(integrations.name, integrationEnumSchema.Enum.quickbooks)
    ),
  })

  if (!token) {
    return null
  }

  const refreshToken = CryptoJS.AES.decrypt(
    token.refreshToken as string,
    env.CRYPTO_SECRET
  ).toString(CryptoJS.enc.Utf8)

  await qbOauthClient
    .revoke({
      refresh_token: refreshToken,
    })
    .catch((e) => {
      console.error(e)
    })

  console.log("deleting from db")
  await db
    .delete(integrations)
    .where(
      and(
        eq(integrations.userId, user.id),
        eq(integrations.name, integrationEnumSchema.Enum.quickbooks)
      )
    )

  revalidatePath("/dashboard/integrations")
}

// export const createQuickbooksInvoice = async (input: {
//   userId: string
//   invoice: {
//     customer: {
//       name: string
//       email: string
//     }
//     line: {
//       description: string
//       amount: number
//     }[]
//   }
// }) => {
//   const token = await db.query.integrations.findFirst({
//     where: and(
//       eq(integrations.userId, input.userId),
//       eq(integrations.name, integrationEnumSchema.Enum.quickbooks)
//     ),
//   })

//   if (!token) {
//     return null
//   }

//   const response = await qbOauthClient.createInvoice({
//     token: CryptoJS.AES.decrypt(
//       token.refreshToken as string,
//       env.CRYPTO_SECRET
//     ).toString(CryptoJS.enc.Utf8),
//     invoice: input.invoice,
//   })

//   return response
// }
