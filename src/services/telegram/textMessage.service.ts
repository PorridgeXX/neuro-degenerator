import type { Context } from "grammy";
import { db, insertTextSchema, textMessages } from "../../db";

export const textMessageService = async (ctx: Context) => {
  if (!ctx.chat) {
    throw new Error("Can't find chat in context");
  }

  if (!ctx.message) {
    throw new Error("Can't find message in context");
  }

  const result = insertTextSchema.safeParse({
    chatId: ctx.chat.id,
    text: ctx.message.text,
  });

  if (!result.success) {
    throw new Error(`Data doesn't match with TextSchema${result.error}`);
  }

  await db.insert(textMessages).values(result.data);
};
