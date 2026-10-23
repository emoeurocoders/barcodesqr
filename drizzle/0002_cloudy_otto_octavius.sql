-- Hand-edited: existing rows need a slug before the column can be NOT NULL.
ALTER TABLE "qr_code" ADD COLUMN "slug" text;--> statement-breakpoint
UPDATE "qr_code" SET "slug" = substr(md5(random()::text || "id"), 1, 8) WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "qr_code" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "qr_code" ADD COLUMN "scans" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_slug_unique" UNIQUE("slug");
