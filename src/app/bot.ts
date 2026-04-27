import { Bot, GrammyError, HttpError } from "grammy";
import { textMessageComposer } from "../handlers";
import {
  loggerMiddleware,
  chatCounterMiddleware,
  forwardCheckerMiddleware,
} from "../middlewares";
import { gifComposer } from "../handlers/gif.handler";

import { config } from "./config";
export const bot = new Bot(config.bot.token || "");
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
//Composers
bot
  .use(loggerMiddleware)
  .use(chatCounterMiddleware)
  .use(forwardCheckerMiddleware)
  .use(textMessageComposer);
