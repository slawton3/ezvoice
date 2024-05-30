CREATE TABLE IF NOT EXISTS "addresses" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"line1" text,
	"line2" text,
	"city" text,
	"state" text,
	"postal_code" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"store_connect_id" varchar,
	"stripe_customer_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "customers_store_connect_id_unique" UNIQUE("store_connect_id"),
	CONSTRAINT "customers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(36),
	"email" text NOT NULL,
	"token" text NOT NULL,
	"referred_by" text,
	"communication" boolean DEFAULT false NOT NULL,
	"newsletter" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "notifications_email_unique" UNIQUE("email"),
	CONSTRAINT "notifications_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"stripe_account_id" varchar(256) NOT NULL,
	"stripe_account_created_at" timestamp,
	"stripe_account_expires_at" timestamp,
	"details_submitted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
ALTER TABLE "email_subscriptions" ALTER COLUMN "created_at" SET DEFAULT '2024-05-29T02:20:12.177Z';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customers_stripe_customer_id_idx" ON "customers" ("stripe_customer_id");--> statement-breakpoint
ALTER TABLE "email_subscriptions" ADD CONSTRAINT "email_subscriptions_email_unique" UNIQUE("email");