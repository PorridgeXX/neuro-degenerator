import { Composer } from "grammy";
import { textMessageService } from "@/services/telegram";
import { logger } from "@/utils";
import { parseTextMessageInput } from "@/parsers";

export const textMessageComposer = new Composer();

textMessageComposer.on("message:text", async (ctx) => {
  try {
    await textMessageService(ctx);
  } catch (err) {
    logger.error(err);
  }
});
