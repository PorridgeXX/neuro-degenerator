ALTER TABLE "mediaMessages" RENAME TO "media_messages";--> statement-breakpoint
ALTER TABLE "textMessages" RENAME TO "text_messages";--> statement-breakpoint
ALTER TABLE "media_messages" DROP CONSTRAINT "mediaMessages_chat_id_messages_counter_chat_id_fk";
--> statement-breakpoint
ALTER TABLE "text_messages" DROP CONSTRAINT "textMessages_chat_id_messages_counter_chat_id_fk";
--> statement-breakpoint
ALTER TABLE "media_messages" ADD CONSTRAINT "media_messages_chat_id_messages_counter_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_counter"("chat_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_messages" ADD CONSTRAINT "text_messages_chat_id_messages_counter_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_counter"("chat_id") ON DELETE no action ON UPDATE no action;