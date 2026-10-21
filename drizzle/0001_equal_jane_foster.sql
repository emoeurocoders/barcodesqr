CREATE TABLE "qr_code" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"values" jsonb NOT NULL,
	"draft_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "qr_code_user_created_idx" ON "qr_code" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "qr_code_user_draft_idx" ON "qr_code" USING btree ("user_id","draft_key");