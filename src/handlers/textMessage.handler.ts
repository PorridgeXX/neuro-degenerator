import { Composer } from "grammy";
import { forwardChecker } from "../utils/forward.utils";
import { db, insertTextSchema, textMessages } from "../db";
import { logger } from "../utils";

export const textMessageComposer = new Composer();

textMessageComposer.on("message:text").filter(
  (ctx) => forwardChecker(ctx),
  async (ctx) => {
    const result = insertTextSchema.safeParse({
      chatId: ctx.chat.id,
      text: ctx.message.text,
    });

    if (!result.success) {
      logger.error(`Can't add message to db ${result.error}`);
      return;
    }
    await db.insert(textMessages).values(result.data);
  },
);
