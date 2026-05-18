CREATE TABLE "chat_settings" (
	"chat_id" bigint PRIMARY KEY NOT NULL,
	"custom_prompt" text,
	"temperature" real,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" bigint,
	"title" text NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_settings" ADD CONSTRAINT "chat_settings_chat_id_messages_counter_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_counter"("chat_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_chat_id_messages_counter_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_counter"("chat_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_settings_chat_id_idx" ON "chat_settings" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX "generations_chat_created_idx" ON "generations" USING btree ("chat_id","created_at");