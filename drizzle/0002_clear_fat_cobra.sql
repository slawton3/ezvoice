ALTER TABLE "email_subscriptions" ALTER COLUMN "created_at" SET DEFAULT '2024-06-02T03:14:25.056Z';--> statement-breakpoint
ALTER TABLE "integrations" ADD COLUMN "expires_at" text;