import OpenAI from "openai";
import { config } from "@/app/config";
import { parseGenerationOutput } from "@/parsers";
import { GenerationFormatError, logger } from "@/utils";
import type { Prompt } from ".";
const MAX_RETRIES = 3;

const clientOpenrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.api.key,
});

export const textGeneration = async (messages: string[], prompt: Prompt) => {
  const formatted = messages.map((t, i) => `${i + 1}. ${t}`).join("\n");
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await clientOpenrouter.chat.completions.create({
      model: "inclusionai/ling-2.6-flash",
      messages: [
        { role: "system", content: prompt.prompt },
        { role: "user", content: prompt.context }, // divided for cache
        { role: "user", content: `Список сообщений:\n\n${formatted}` },
      ],
      response_format: { type: "text" },
      reasoning_effort: "low",
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
