import type { Context, NextFunction } from "grammy";
import { chatCounter } from "@/services/telegram";
import { logger } from "@/utils";

export const chatCounterMiddleware = async (
  ctx: Context,
  next: NextFunction,
) => {
  if (ctx.chat) {
    try {
      await chatCounter(ctx.chat.id);
      logger.info("counter has been added to db");
    } catch (err) {
      logger.error({ err }, "Can't update counter");
    }
  }

  await next();
};
