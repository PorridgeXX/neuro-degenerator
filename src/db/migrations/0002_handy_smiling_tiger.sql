CREATE TYPE "public"."chatType" AS ENUM('private', 'supergroup', 'group', 'channel');--> statement-breakpoint
ALTER TABLE "messages_counter" ADD COLUMN "chatType" "chatType" DEFAULT 'group' NOT NULL;