import { db, textMessages } from "@/db";
import { NotEnoughMessagesError } from "@/utils";
import { eq, sql } from "drizzle-orm";
const MIN_MESSAGES = 2;

export const getRandomTextMessages = async (
  chatId: number,
  limit: number,
): Promise<string[]> => {
  const rows = await db
    .select({ text: textMessages.text })
    .from(textMessages)
    .where(eq(textMessages.chatId, chatId))
    .orderBy(sql`RANDOM()`)
    .limit(limit);

  if (rows.length < MIN_MESSAGES)
    throw new NotEnoughMessagesError(rows.length, MIN_MESSAGES);

  return rows.map((r) => r.text);
};
