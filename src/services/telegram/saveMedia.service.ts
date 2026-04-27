import type { Context } from "grammy";
import { config } from "../../app/config";
import path from "path";
import { mkdir } from "fs/promises";

export const saveMediaService = async (ctx: Context) => {
  if (!ctx.message?.photo) {
    throw new Error("No photo found in the message");
  }

  const photo = ctx.message.photo.at(-1);
  if (!photo) {
    throw new Error("No photo found in the message");
  }

  try {
    const file = await ctx.getFile();
    const dir = path.resolve("./uploads");
    await mkdir(dir, { recursive: true });
    if (!file.file_path) {
      throw new Error("File path is undefined");
    }
    const media = await fetch(
      `https://api.telegram.org/file/bot${config.bot.token}/${file.file_path}`,
    );
    if (!media.ok) {
      throw new Error(`Failed to fetch media: ${media.statusText}`);
    }
    const filePath = path.join(
      dir,
      `${file.file_unique_id}${path.extname(file.file_path ?? ".jpg")}`,
    );
    await Bun.write(filePath, media);
    return filePath;
  } catch (err) {
    throw new Error("Failed to save media", { cause: err });
  }
};
