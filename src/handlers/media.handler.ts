import { Composer } from "grammy";
import { saveMediaService } from "@/services/telegram";
import { parsePhotoMessageInput } from "@/parsers";
import { logger } from "@/utils";
export const mediaComposer = new Composer();

mediaComposer.on("message:photo", async (ctx) => {
  try {
    const photo = parsePhotoMessageInput(ctx);
    await saveMediaService(photo, ctx.api);
  } catch (err) {
    logger.error(err);
  }
});
