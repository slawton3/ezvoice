import { db } from "@/db"
import { integrations, IntegrationSelectSchema } from "@/db/schema"
import { eq } from "drizzle-orm"

import { getCachedUser } from "../queries/user"

export const getIntegrations = async (): Promise<
  IntegrationSelectSchema[] | null
> => {
  const user = await getCachedUser()

  if (!user) {
    return null
  }

  const connectedIntegrations = await db
    .select()
    .from(integrations)
    .where(eq(integrations.userId, user.id))

  return connectedIntegrations
}
