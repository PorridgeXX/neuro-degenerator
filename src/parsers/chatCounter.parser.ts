import type { Context } from "grammy";

export type ChatCounterInput = {
  chatId: number;
  chatType: "group" | "supergroup" | "channel" | "private";
};

export const parseChatCounterInput = (ctx: Context): ChatCounterInput => {
  const chat = ctx.chat;
  if (!chat) throw new Error("Chat not found");
  const chatType = chat.type;
  return { chatId: chat.id, chatType };
};
