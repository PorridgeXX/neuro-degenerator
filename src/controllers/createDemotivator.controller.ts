import { type CommandInput } from "@/parsers";
import {
  getPrompt,
  setGenerationContext,
  textGeneration,
} from "@/services/textGeneration";
import { getRandomMedia, getRandomTextMessages } from "@/services/telegram";
import { createDemotivatorService } from "@/services/imageGeneration/";
import { InternalServerError, RateLimitError } from "openai";
import {
  GenerationFormatError,
  NoMediaError,
  NotEnoughMessagesError,
  Timer,
} from "@/utils";
import { type CommandContext, type Context, InputFile } from "grammy";

export const createDemotivatorController = async (
  ctx: CommandContext<Context>,
) => {
  const input: CommandInput = { chatId: ctx.chatId };
  const remaining = Timer.getRemaining(input.chatId);
  if (remaining !== undefined) {
    await ctx.reply(
      `Ты намаслил свою штуку дрюку? Погодь погодь погодь ${remaining}cек ты о масле в тачке?`,
    );
    return;
  }
  Timer.start(input.chatId);
  try {
    const messages = await getRandomTextMessages(input.chatId, 30);
    const media = await getRandomMedia(input.chatId);
    const prompt = await getPrompt(input);
    const output = await textGeneration(messages, prompt);
    await setGenerationContext(output.title, output.subtitle, input);
    const result = await createDemotivatorService(output, media);
    const file = new InputFile(result.buffer);

    if (result.kind === "animation") {
      await ctx.replyWithAnimation(file);
    }
    if (result.kind === "photo") {
      await ctx.replyWithPhoto(file);
    }
  } catch (err) {
    Timer.clear(input.chatId);
    if (err instanceof NotEnoughMessagesError) {
      await ctx.reply("Недостаточно сообщений в чате");
      return;
    }
    if (err instanceof NoMediaError) {
      await ctx.reply("Нет картинок для создания демотиватора");
      return;
    }
    if (err instanceof GenerationFormatError || err instanceof RateLimitError) {
      await ctx.reply("Я обосрался. Попробуй позже");
      return;
    }
    if (err instanceof InternalServerError) {
      await ctx.reply("ИИ сегодня отдыхает. Попробуй попозже хз");
    }
    if (err) throw err;
  }
};
