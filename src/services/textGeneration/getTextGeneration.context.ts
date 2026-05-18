import { db, generations } from "@/db";
import type { CommandInput } from "@/parsers";
import { desc, eq } from "drizzle-orm";

export const getGenerationContext = async (
  input: CommandInput,
): Promise<string[]> => {
  const rows = await db
    .select({ title: generations.title, subtitle: generations.subtitle })
    .from(generations)
    .where(eq(generations.chatId, input.chatId))
    .orderBy(desc(generations.createdAt))
    .limit(5);
  return rows.map((r) => (r.title, r.subtitle));
};
