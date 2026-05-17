import OpenAI from "openai";
import { config } from "@/app/config";
import { count, eq, sql } from "drizzle-orm";
import { db, textMessages } from "@/db";
import { parseGenerationOutput, type CommandInput } from "@/parsers";
import { GenerationFormatError, logger, NotEnoughMessagesError } from "@/utils";

const PROMPT = `You are neurogenerator postironical content for telegram chat bot. You get list of a real messages from a chat.
Your purpose: create only 2 sentences, thats sound chaotic and ironical. You can take some parts from different messages and concat them to create postmodernironical humor.

Rules:
- You can only use words and phrases from list.
- You can cut messages and mix them
- You can change order of words and phrases
- DO NOT ADD WORDS, THAT NOT IN A LIST!
- Every time chose different words, don't focus on the same words

Techniques you may use (mix them, do not rely on a single one):
- Cut messages and reorder fragments, you can maximum take 3 messages for title or subtitle to reorder them.
- If two messages share a common word (typically a conjunction or a frequent word), you can splice them through that word: take the beginning of one message up to the shared word and continue with the tail of another message after the same word. Use this only when the shared word sits naturally in both messages — do not force it every time.
- Combine unrelated fragments for absurd contrast.

Answer format: only 2 sentences, each with a new line. No numeration, no interlude, no explanation, no quotes.

Examples of good answer:
Oh, well, that means a whole day of playing computer tinkoff 5816
this is how it feels to write on sharps - ultrasound
  `;

const LIMIT = 30;
const MAX_RETRIES = 3;
const MIN_MESSAGES = 2;
const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: config.api.key,
});

export const textGeneration = async (input: CommandInput) => {
  const messages = await db
    .select({ text: textMessages.text })
    .from(textMessages)
    .where(eq(textMessages.chatId, input.chatId))
    .orderBy(sql`RANDOM()`)
    .limit(LIMIT);

  if (messages.length < MIN_MESSAGES) {
    throw new NotEnoughMessagesError(messages.length, MIN_MESSAGES);
  }

  const formatted = messages.map((m, i) => `${i + 1}. ${m.text}`).join("\n");

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      temperature: 1.5,
      messages: [
        { role: "system", content: PROMPT },
        { role: "user", content: `Список сообщений:\n\n${formatted}` },
      ],
    });
    try {
      return parseGenerationOutput(response.choices[0]?.message.content);
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
