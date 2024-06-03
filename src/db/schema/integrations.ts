import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"

// enums
export const integrationEnum = pgEnum("name", ["clickup", "quickbooks"])
export const integrationEnumSchema = z.enum(integrationEnum.enumValues)

// table
export const integrations = pgTable("integrations", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(),
  userId: varchar("user_id", { length: 36 }),
  name: integrationEnum("name").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: text("expires_at"),
  ...lifecycleDates,
})

// export types
export type IntegrationEnum = z.infer<typeof integrationEnumSchema>
const integrationsSelectSchema = createSelectSchema(integrations)
export type IntegrationSelectSchema = z.infer<typeof integrationsSelectSchema>
export type IntegrationInsertSchema = typeof integrations.$inferSelect
