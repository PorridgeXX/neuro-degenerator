import type { Context, Filter } from "grammy";

export type GifMessageInput = {
  chatId: number;
  fileId: string;
  fileUniqueId: string;
};

export const parseGifMessageInput = (
  ctx: Filter<Context, "message:animation">,
): GifMessageInput => {
  const gif = ctx.message.animation;
  if (!gif) throw new Error("Empty gif");
  return {
    chatId: ctx.chatId,
    fileId: gif.file_id,
    fileUniqueId: gif.file_unique_id,
  };
};
