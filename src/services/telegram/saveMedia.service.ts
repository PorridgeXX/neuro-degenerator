import type { Context } from "grammy";
import { logger } from "../../utils";
import { config } from "../../app/config";
import path from "path";

export const saveMediaService = async (ctx: Context) => {
  if (!ctx.message?.photo) {
    logger.error("No photo in media service");
    return;
  }

  const photo = ctx.message.photo.at(-1);
  if (!photo) {
    logger.error("Photo array is empty");
    return;
  }

  try {
    const file = await ctx.getFile();
    const dir = path.resolve("./uploads");
    const media = await fetch(
      `https://api.telegram.org/file/bot${config.bot.token}/${file.file_path}`,
    );
    const filePath = path.join(
      dir,
      `${file.file_unique_id}${path.extname(file.file_path ?? ".jpg")}`,
    );
    await Bun.write(filePath, media);
    return filePath;
  } catch (err) {
    logger.error(`Something went wrong with telegram API ${err}`);
  }
};
