CREATE TYPE "public"."media_type" AS ENUM('photo', 'gif');--> statement-breakpoint
CREATE TABLE "media_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" bigint NOT NULL,
	"mediaType" "media_type" NOT NULL,
	"path" text NOT NULL,
	"file_unique_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages_counter" (
	"chat_id" bigint PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" bigint NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media_messages" ADD CONSTRAINT "media_messages_chat_id_messages_counter_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_counter"("chat_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_messages" ADD CONSTRAINT "text_messages_chat_id_messages_counter_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_counter"("chat_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_messages_chat_id_idx" ON "media_messages" USING btree ("chat_id");--> statement-breakpoint
CREATE UNIQUE INDEX "media_messages_file_unique_id_idx" ON "media_messages" USING btree ("chat_id","file_unique_id");--> statement-breakpoint
CREATE INDEX "text_messages_chat_id_idx" ON "text_messages" USING btree ("chat_id");