import { Composer } from "grammy";
import { logger } from "@/utils";
import { broadcastMessage } from "@/services/telegram/broadcast.service";
import { config } from "@/app/config";
export const channelPostComposer = new Composer();

channelPostComposer.on("channel_post", async (ctx) => {
  if (ctx.channelPost.chat.id !== config.channel.channel) return;
  try {
    await broadcastMessage(ctx);
  } catch (err) {
    logger.error(err);
  }
});
