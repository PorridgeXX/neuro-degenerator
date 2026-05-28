import type { Context, NextFunction } from "grammy";
import { chatCounter } from "@/services/telegram";
import { logger } from "@/utils";
import { parseChatCounterInput } from "@/parsers";

export const chatCounterMiddleware = async (
  ctx: Context,
  next: NextFunction,
) => {
  const input = parseChatCounterInput(ctx);
  try {
    await chatCounter(input);
    logger.info("counter has been added to db");
  } catch (err) {
    logger.error({ err }, "Can't update counter");
  }

  await next();
};
