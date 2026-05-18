import { db, generations } from "@/db";
import type { CommandInput } from "@/parsers";

export const setGenerationContext = async (
  title: string,
  subtitle: string,
  input: CommandInput,
) => {
  await db.insert(generations).values({
    chatId: input.chatId,
    title: title,
    subtitle: subtitle,
  });
};
