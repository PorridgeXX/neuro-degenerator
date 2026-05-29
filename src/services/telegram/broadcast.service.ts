import { db, messagesCounter } from "@/db";
import { NoChatsError } from "@/utils";
import { eq, or } from "drizzle-orm";
import type { Context, Filter } from "grammy";

export async function broadcastMessage(ctx: Filter<Context, "channel_post">) {
  const chatIds = await db
    .select({ chatId: messagesCounter.chatId })
    .from(messagesCounter)
    .where(
      or(
        eq(messagesCounter.chatType, "group"),
        eq(messagesCounter.chatType, "supergroup"),
        eq(messagesCounter.chatType, "private"),
      ),
    );

  if (chatIds.length === 0) throw new NoChatsError();

  for (const chatId of chatIds) {
    await ctx.forwardMessage(chatId.chatId);
  }
}
