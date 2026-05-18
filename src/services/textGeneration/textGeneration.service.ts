import OpenAI from "openai";
import { config } from "@/app/config";
import { parseGenerationOutput } from "@/parsers";
import { GenerationFormatError, logger } from "@/utils";
import type { Prompt } from ".";
const MAX_RETRIES = 3;

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: config.api.key,
});

export const textGeneration = async (messages: string[], prompt: Prompt) => {
  const formatted = messages.map((t, i) => `${i + 1}. ${t}`).join("\n");
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      temperature: 1.5,
      messages: [
        { role: "system", content: prompt.prompt },
        { role: "system", content: prompt.context },
        { role: "user", content: `Список сообщений:\n\n${formatted}` },
      ],
    });
    try {
      const output = parseGenerationOutput(
        response.choices[0]?.message.content,
      );
      return output;
    } catch (err) {
      if (!(err instanceof GenerationFormatError)) {
        throw err;
      }
      lastError = err;
      logger.warn(
        { attempt, output: response.choices[0]?.message.content },
        "Can't generate",
      );
    }
  }
  throw new GenerationFormatError("Retries exceeded", { cause: lastError });
};
