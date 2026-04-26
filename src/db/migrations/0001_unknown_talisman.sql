ALTER TABLE "mediaMessages" ALTER COLUMN "chat_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "messagesCounter" ALTER COLUMN "chat_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "textMessages" ALTER COLUMN "chat_id" SET DATA TYPE bigint;