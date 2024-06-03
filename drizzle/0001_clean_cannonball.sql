ALTER TABLE "integrations" DROP CONSTRAINT "integrations_refresh_token_unique";--> statement-breakpoint
ALTER TABLE "email_subscriptions" ALTER COLUMN "created_at" SET DEFAULT '2024-06-02T02:52:22.434Z';--> statement-breakpoint
ALTER TABLE "integrations" ALTER COLUMN "refresh_token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "access_token" text;