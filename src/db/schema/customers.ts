import { index, pgTable, text, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { lifecycleDates } from "./utils"

export const customers = pgTable(
  "customers",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(), // prefix_ + nanoid (12)
    name: text("name"),
    email: text("email"),
    storeConnectId: varchar("store_connect_id").unique(), // stripe connect
    stripeCustomerId: varchar("stripe_customer_id").unique().notNull(),
    ...lifecycleDates,
  },
  (table) => ({
    stripeCustomerIdIdx: index("customers_stripe_customer_id_idx").on(
      table.stripeCustomerId
    ),
  })
)
export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert
