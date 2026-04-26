import type { Context, Filter } from "grammy";

export function forwardChecker(ctx: Filter<Context, "message">) {
  return !ctx.has(":forward_origin");
}
