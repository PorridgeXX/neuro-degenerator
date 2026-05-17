import type { CommandInput } from "@/parsers";
import { textGeneration } from "@/services/generation";
import { createDemotivatorService } from "@/services/imageGeneration/createDemotivator.service";
import {
  GenerationFormatError,
  NoMediaError,
  NotEnoughMessagesError,
} from "@/utils";
import type { CommandContext, Context } from "grammy";
import { InputFile } from "grammy";

class Timer {
  private startedAt: number;
  private delay: number;
  constructor(callback: Function, delay: number) {
    this.startedAt = Date.now();
    this.delay = delay;
    setTimeout(() => callback(), delay);
  }

  getRemaining() {
    const elapsed = Date.now() - this.startedAt;
    return Math.max(0, Math.ceil((this.delay - elapsed) / 1000));
  }
}

const activeTimers: Map<number, Timer> = new Map();

export const createDemotivatorController = async (
  ctx: CommandContext<Context>,
) => {
  try {
    const input: CommandInput = { chatId: ctx.chatId };

    if (!activeTimers.has(input.chatId)) {
      const output = await textGeneration(input);
      const createdDemotivator = await createDemotivatorService(output, input);
      await ctx.replyWithPhoto(new InputFile(createdDemotivator));
      activeTimers.set(
        input.chatId,
        new Timer(() => activeTimers.delete(input.chatId), 8000),
      );
      return;
    }
    await ctx.reply(
      `Ты намаслил свою штуку дрюку? Погодь погодь погодь ${activeTimers.get(input.chatId)?.getRemaining()}cек ты о масле в тачке?`,
    );
  } catch (err) {
    if (err instanceof NotEnoughMessagesError) {
      await ctx.reply("Недостаточно сообщений в чате");
      return;
    }
    if (err instanceof NoMediaError) {
      await ctx.reply("Нет картинок для создания демотиватора");
      return;
    }
    if (err instanceof GenerationFormatError) {
      await ctx.reply("Не удалось сгенерировать текст. дипсик лег хз");
      return;
    }
    throw err;
  }
};
