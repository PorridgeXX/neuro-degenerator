import { db, mediaMessages } from "@/db";
import { eq, sql } from "drizzle-orm";
import { NoMediaError } from "@/utils";

export type RandomMedia = {
  path: string;
  mediaType: "photo" | "gif";
};

export const getRandomMedia = async (chatId: number): Promise<RandomMedia> => {
  const [row] = await db
    .select({ path: mediaMessages.path, type: mediaMessages.mediaType })
    .from(mediaMessages)
    .where(eq(mediaMessages.chatId, chatId))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!row) throw new NoMediaError(chatId);

  return { path: row.path, mediaType: row.type };
};
