import type { Context, NextFunction } from "grammy";
import { logger } from "../utils";

export const loggerMiddleware = async (ctx: Context, next: NextFunction) => {
  logger.info(ctx);
  await next();
};
