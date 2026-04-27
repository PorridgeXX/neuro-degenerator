import { db } from "../../db";
import { messagesCounter } from "../../db";
import { sql } from "drizzle-orm";
import { logger } from "../../utils";

export async function chatCounter(chatId: number) {
  const [row] = await db
    .insert(messagesCounter)
    .values({ chatId, count: 1 })
    .onConflictDoUpdate({
      target: messagesCounter.chatId,
      set: { count: sql`${messagesCounter.count} + 1` },
    })
    .returning({ count: messagesCounter.count });

  if (!row) {
    logger.error(`no row`);
    return;
  }
  return row.count;
}
