import type { Context, NextFunction } from "grammy";

export const forwardCheckerMiddleware = async (
  ctx: Context,
  next: NextFunction,
) => {
  if (ctx.has(":forward_origin")) {
    return;
  }

  await next();
};
