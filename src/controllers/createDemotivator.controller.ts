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

export const createDemotivatorController = async (
  ctx: CommandContext<Context>,
) => {
  try {
    const input: CommandInput = { chatId: ctx.chatId };
    const output = await textGeneration(input);

    const createdDemotivator = await createDemotivatorService(output, input);

    await ctx.replyWithPhoto(new InputFile(createdDemotivator));
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
