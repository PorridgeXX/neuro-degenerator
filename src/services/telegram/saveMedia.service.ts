import type { Context } from "grammy";
import { config } from "../../app/config";
import { mkdir } from "fs/promises";
import { db } from "../../db";
import path from "path";

export const saveMediaService = async (ctx: Context) => {
  if (!ctx.message?.photo) {
    throw new Error("No photo found in the message");
  }

  const photo = ctx.message.photo.at(-1);

  if (!photo) {
    throw new Error("No photo found in the message");
  }

  const chat = ctx.chat;

  if (!chat) {
    throw new Error("No chat context");
  }

  const file = await ctx.getFile();

  if (!file.file_path) {
    throw new Error("File path is undefined");
  }

  const existing = await db.query.mediaMessages.findFirst({
    where: (t, { and, eq }) =>
      and(
        eq(t.chatId, BigInt(chat.id)),
        eq(t.fileUniqueId, file.file_unique_id),
      ),
  });

  if (existing) return;

  const media = await fetch(
    `https://api.telegram.org/file/bot${config.bot.token}/${file.file_path}`,
  );

  if (!media.ok) {
    throw new Error(`Failed to fetch media: ${media.statusText}`);
  }

  try {
    const dir = path.resolve("./uploads");
    await mkdir(dir, { recursive: true });

    const filePath = path.join(
      dir,
      `${file.file_unique_id}${path.extname(file.file_path)}`,
    );

    await Bun.write(filePath, media);

    return filePath;
  } catch (err) {
    throw new Error("Failed to save media", { cause: err });
  }
};
