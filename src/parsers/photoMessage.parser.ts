import type { Context, Filter } from "grammy";

export type PhotoMessageInput = {
  chatId: number;
  fileId: string;
  fileUniqueId: string;
};

export const parsePhotoMessageInput = (
  ctx: Filter<Context, "message:photo">,
): PhotoMessageInput => {
  const photo = ctx.message.photo.at(-1);
  if (!photo) throw new Error("Empty photo array");
  return {
    chatId: ctx.chat.id,
    fileId: photo.file_id,
    fileUniqueId: photo.file_unique_id,
  };
};
