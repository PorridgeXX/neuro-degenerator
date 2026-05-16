import type { Api } from "grammy";
import { config } from "@/app/config";
import { mkdir } from "fs/promises";
import { db, mediaMessages } from "@/db";
import type { PhotoMessageInput } from "@/parsers";
import path from "path";
import { eq } from "drizzle-orm";

export const saveMediaService = async (input: PhotoMessageInput, api: Api) => {
  //checking for a media in database
  const existing = await db.query.mediaMessages.findFirst({
    where: (t, { and, eq }) =>
      and(
        eq(t.chatId, BigInt(input.chatId)),
        eq(t.fileUniqueId, input.fileUniqueId),
      ),
  });

  if (existing) return;

  const file = await api.getFile(input.fileId);

  if (!file.file_path) {
    throw new Error("File path is undefined");
  }

  const media = await fetch(
    `https://api.telegram.org/file/bot${config.bot.token}/${file.file_path}`,
  );

  if (!media.ok) {
    throw new Error(`Failed to fetch media: ${media.statusText}`);
  }

  const dir = path.resolve("./uploads");
  const filePath = path.join(
    dir,
    `${file.file_unique_id}${path.extname(file.file_path)}`,
  );
  const inserted = await db
    .insert(mediaMessages)
    .values({
      chatId: BigInt(input.chatId),
      mediaType: "photo",
      fileUniqueId: file.file_unique_id,
      path: filePath,
    })
    .onConflictDoNothing()
    .returning({ id: mediaMessages.id });

  if (!inserted[0]) return;

  await mkdir(dir, { recursive: true });
  try {
    await Bun.write(filePath, media);
  } catch (err) {
    await db.delete(mediaMessages).where(eq(mediaMessages.id, inserted[0].id));
    throw err;
  }
};
