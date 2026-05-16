import { Composer } from "grammy";
import { textMessageService } from "@/services/telegram";
import { logger } from "@/utils";
import { parseTextMessageInput } from "@/parsers";

export const textMessageComposer = new Composer();

textMessageComposer.on("message:text", async (ctx) => {
  try {
    const input = parseTextMessageInput(ctx);
    await textMessageService(input);
  } catch (err) {
    logger.error(err);
  }
});
