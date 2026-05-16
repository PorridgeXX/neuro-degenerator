import type { TextMessageInput } from "@/parsers";
import { db, textMessages } from "@/db";

export const textMessageService = async (input: TextMessageInput) => {
  await db.insert(textMessages).values({
    chatId: input.chatId,
    text: input.text,
  });
};
