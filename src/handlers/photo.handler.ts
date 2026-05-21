import { Composer } from "grammy";
import { saveMediaService } from "@/services/telegram";
import { parsePhotoMessageInput } from "@/parsers";
import { logger } from "@/utils";
export const photoComposer = new Composer();

photoComposer.on("message:photo", async (ctx) => {
  try {
    const photo = parsePhotoMessageInput(ctx);
    await saveMediaService(photo, ctx.api, "photo");
  } catch (err) {
    logger.error(err);
  }
});
