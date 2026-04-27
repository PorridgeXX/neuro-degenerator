import { Composer } from "grammy";
import { db, insertMediaSchema, mediaMessages } from "../db";
import { saveMediaService } from "../services/telegram";
import { logger } from "../utils";
export const mediaComposer = new Composer();

mediaComposer.on("message:photo", async (ctx) => {
  const photo = await saveMediaService(ctx);
  const result = insertMediaSchema.safeParse({
    chatId: ctx.chat.id,
    mediaType: "photo",
    fileUniqueId: ctx.message.photo.at(-1)?.file_unique_id,
    path: photo,
  });

  if (!result.success) {
    logger.error(`Check your data before put it in database ${result.error}`);
    return;
  }
  await db.insert(mediaMessages).values(result.data);
});
