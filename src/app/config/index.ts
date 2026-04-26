import { z } from "zod";

const env = z
  .object({
    BOT_TOKEN: z.string().min(1),
    API_KEY: z.string().min(1),
    DATABASE_URL: z.string(),
  })
  .parse(process.env);

export const config = {
  bot: { token: env.BOT_TOKEN },
  api: { key: env.API_KEY },
  db: { url: env.DATABASE_URL },
} as const;
