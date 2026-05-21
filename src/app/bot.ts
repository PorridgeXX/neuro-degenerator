import { Bot, GrammyError, HttpError } from "grammy";
import { textMessageComposer, photoComposer, gifComposer } from "@/handlers";
import { chatCounterMiddleware, forwardCheckerMiddleware } from "@/middlewares";
import { config } from "@/app/config";
import { logger } from "@/utils";
import { slopCommandHandler, helpCommandHandler } from "@/commands";
import { autoQuote } from "@roziscoding/grammy-autoquote";

export const bot = new Bot(config.bot.token);
bot.catch((err) => {
  const ctx = err.ctx;
  const e = err.error;
  logger.error(
    { err: e, updateId: ctx.update.update_id },
    "Error while handling update",
  );
  if (e instanceof GrammyError) {
    logger.error({ description: e.description }, "Error in request");
  }
  if (e instanceof HttpError) {
    logger.error({ err: e }, "Could not contact Telegram");
  }
});

//Settings
bot.use(autoQuote()); // always reply on messages
//Commands
bot.use(slopCommandHandler).use(helpCommandHandler);
//Composers
bot
  .use(chatCounterMiddleware)
  .use(forwardCheckerMiddleware)
  .use(textMessageComposer)
  .use(gifComposer)
  .use(photoComposer);
