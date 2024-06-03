"use server"

import { db } from "@/db"
import { integrationEnumSchema, integrations } from "@/db/schema"
import { env } from "@/env"
import CryptoJS from "crypto-js"

import { clickupClient } from "../clickup"
import { getCachedUser } from "../queries/user"

export const getClickupClientUrl = async () => {
  return new Promise<string>((resolve, reject) => {
    try {
      resolve(
        clickupClient.code.getUri({
          authorizationUri: `https://app.clickup.com/api`,
        })
      )
    } catch (error) {
      reject(error)
    }
  })
}

export const addClickupIntegration = async (url: string) => {
  const user = await getCachedUser()

  console.log(url)

  if (!user) {
    return null
  }

  const token = await clickupClient.code.getToken(url)

  console.log(token)

  if (!token) {
    return null
  }

  await db.insert(integrations).values({
    userId: user.id,
    name: integrationEnumSchema.Enum.clickup,
    accessToken: CryptoJS.AES.encrypt(
      token.accessToken,
      env.CRYPTO_SECRET
    ).toString(),
  })

  return token.accessToken
}
