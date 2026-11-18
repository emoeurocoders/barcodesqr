CREATE TABLE "scan_daily" (
	"qr_id" text NOT NULL,
	"user_id" text NOT NULL,
	"day" date NOT NULL,
	"scans" integer DEFAULT 0 NOT NULL,
	"uniques" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "scan_daily_qr_id_day_pk" PRIMARY KEY("qr_id","day")
);
--> statement-breakpoint
CREATE TABLE "scan_event" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"qr_id" text NOT NULL,
	"user_id" text NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"visitor" text NOT NULL,
	"bot" boolean DEFAULT false NOT NULL,
	"country" text,
	"region" text,
	"city" text,
	"device" text,
	"browser" text,
	"os" text,
	"referrer" text
);
--> statement-breakpoint
CREATE TABLE "scan_visitor_day" (
	"qr_id" text NOT NULL,
	"day" date NOT NULL,
	"visitor" text NOT NULL,
	CONSTRAINT "scan_visitor_day_qr_id_day_visitor_pk" PRIMARY KEY("qr_id","day","visitor")
);
--> statement-breakpoint
ALTER TABLE "scan_daily" ADD CONSTRAINT "scan_daily_qr_id_qr_code_id_fk" FOREIGN KEY ("qr_id") REFERENCES "public"."qr_code"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_daily" ADD CONSTRAINT "scan_daily_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_event" ADD CONSTRAINT "scan_event_qr_id_qr_code_id_fk" FOREIGN KEY ("qr_id") REFERENCES "public"."qr_code"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_event" ADD CONSTRAINT "scan_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_visitor_day" ADD CONSTRAINT "scan_visitor_day_qr_id_qr_code_id_fk" FOREIGN KEY ("qr_id") REFERENCES "public"."qr_code"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scan_daily_user_day_idx" ON "scan_daily" USING btree ("user_id","day");--> statement-breakpoint
CREATE INDEX "scan_event_user_at_idx" ON "scan_event" USING btree ("user_id","at");--> statement-breakpoint
CREATE INDEX "scan_event_qr_at_idx" ON "scan_event" USING btree ("qr_id","at");