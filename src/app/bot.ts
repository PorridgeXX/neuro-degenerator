import { Bot, GrammyError, HttpError } from "grammy";
import { textMessageComposer, mediaComposer } from "../handlers";
import {
  loggerMiddleware,
  chatCounterMiddleware,
  forwardCheckerMiddleware,
} from "../middlewares";
import { config } from "./config";
import { logger } from "../utils";

export const bot = new Bot(config.bot.token);
bot.catch((err) => {
  const ctx = err.ctx;
  logger.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    logger.error(`Error in request: ${e.description}`);
  } else if (e instanceof HttpError) {
    logger.error(`Could not contact Telegram: ${e}`);
  } else {
    logger.error(`Unknown error: ${e}`);
  }
});

//Composers
bot
  .use(loggerMiddleware)
  .use(chatCounterMiddleware)
  .use(forwardCheckerMiddleware)
  .use(textMessageComposer)
  .use(mediaComposer);
