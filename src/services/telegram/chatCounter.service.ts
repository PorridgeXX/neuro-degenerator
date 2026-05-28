import { db, messagesCounter } from "@/db";
import type { ChatCounterInput } from "@/parsers";
import { sql } from "drizzle-orm";

export async function chatCounter(input: ChatCounterInput) {
  const [row] = await db
    .insert(messagesCounter)
    .values({ chatId: input.chatId, chatType: input.chatType, count: 1 })
    .onConflictDoUpdate({
      target: messagesCounter.chatId,
      set: { count: sql`${messagesCounter.count} + 1` },
    })
    .returning({ count: messagesCounter.count });

  if (!row) {
    throw new Error("Failed to update chat counter");
  }
  return row.count;
}
