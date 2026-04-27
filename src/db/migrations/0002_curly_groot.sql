ALTER TABLE "media_messages" ADD COLUMN "path" text NOT NULL;--> statement-breakpoint
ALTER TABLE "media_messages" DROP COLUMN "file_id";--> statement-breakpoint
ALTER TABLE "media_messages" DROP COLUMN "file_unique_id";