import type { Filter, Context } from "grammy";

export type TextMessageInput = {
  chatId: number;
  text: string;
};

export const parseTextMessageInput = (
  ctx: Filter<Context, "message:text">,
): TextMessageInput => {
  const message = ctx.message;

  if (!message) throw new Error("No message in context");

  return {
    chatId: ctx.chatId,
    text: message.text,
  };
};
