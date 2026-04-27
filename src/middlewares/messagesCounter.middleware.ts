import type { Context, NextFunction } from "grammy";
import { chatCounter } from "../services/telegram";
import { logger } from "../utils";

export const chatCounterMiddleware = async (
  ctx: Context,
  next: NextFunction,
) => {
  logger.warn("counter has been added to db11");
  if (ctx.chat) {
    try {
      await chatCounter(ctx.chat.id);
      logger.warn("counter has been added to db");
    } catch (err) {
      logger.error(`Can't update counter ${err}`);
      return;
    }
  }

  await next();
};
