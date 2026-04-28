import { Composer } from "grammy";
import { saveMediaService } from "../services/telegram";
import { logger } from "../utils";
export const mediaComposer = new Composer();

mediaComposer.on("message:photo", async (ctx) => {
  try {
    saveMediaService(ctx);
  } catch (err) {
    logger.error(`Failed to save media ${err}`);
  }
});
