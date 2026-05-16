import { z } from "zod";

const env = z
  .object({
    BOT_TOKEN: z.string().min(1),
    API_KEY: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_NAME: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
    POSTGRES_PORT: z.string().min(1).transform(Number),
  })
  .parse(process.env);

export const config = {
  bot: { token: env.BOT_TOKEN },
  api: { key: env.API_KEY },
  db: {
    host: env.POSTGRES_HOST,
    name: env.POSTGRES_NAME,
    password: env.POSTGRES_PASSWORD,
    db: env.POSTGRES_DB,
    port: env.POSTGRES_PORT,
  },
} as const;
