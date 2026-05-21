import { Composer } from "grammy";
import { logger } from "@/utils";
import { parseGifMessageInput } from "@/parsers";
import { saveMediaService } from "@/services/telegram";
export const gifComposer = new Composer();

gifComposer.on("message:animation", async (ctx) => {
  try {
    const gif = parseGifMessageInput(ctx);
    await saveMediaService(gif, ctx.api, "gif");
  } catch (err) {
    logger.error(err);
  }
});
