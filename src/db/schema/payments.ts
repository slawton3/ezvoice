import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"

// @see: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const payments = pgTable("payments", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  stripeAccountId: varchar("stripe_account_id", { length: 256 }).notNull(),
  stripeAccountCreatedAt: timestamp("stripe_account_created_at"),
  stripeAccountExpiresAt: timestamp("stripe_account_expires_at"),
  detailsSubmitted: boolean("details_submitted").notNull().default(false),
  ...lifecycleDates,
})

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
