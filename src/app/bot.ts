import { Bot, GrammyError, HttpError } from "grammy";
import { textMessageComposer, mediaComposer } from "@/handlers";
import { chatCounterMiddleware, forwardCheckerMiddleware } from "@/middlewares";
import { config } from "@/app/config";
import { logger } from "@/utils";
import { slopCommandHandler } from "@/handlers";
import { autoQuote } from "@roziscoding/grammy-autoquote";

export const bot = new Bot(config.bot.token);
bot.catch((err) => {
  const ctx = err.ctx;
  logger.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  logger.error(
    { err: e, updateId: ctx.update.update_id },
    "Error while handling update",
  );
  if (e instanceof GrammyError) {
    logger.error({ description: e.description }, "Error in request");
  } else if (e instanceof HttpError) {
    logger.error({ err: e }, "Could not contact Telegram");
  }
});

//Composers
bot
  .use(loggerMiddleware)
  .use(chatCounterMiddleware)
  .use(forwardCheckerMiddleware)
  .use(textMessageComposer)
  .use(mediaComposer);
