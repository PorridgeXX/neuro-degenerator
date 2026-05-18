import { type CommandInput } from "@/parsers";
import {
  getPrompt,
  setGenerationContext,
  textGeneration,
} from "@/services/textGeneration";
import { getRandomMedia, getRandomTextMessages } from "@/services/telegram";
import { createDemotivatorService } from "@/services/imageGeneration/";
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
  const input: CommandInput = { chatId: ctx.chatId };
  try {
    if (!activeTimers.has(input.chatId)) {
      const messages = await getRandomTextMessages(input.chatId, 30);
      const media = await getRandomMedia(input.chatId);
      const prompt = await getPrompt(input);
      const output = await textGeneration(messages, prompt);
      await setGenerationContext(output.title, output.subtitle, input);
      const createdDemotivator = await createDemotivatorService(output, media);
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
