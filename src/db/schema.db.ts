import {
  pgTable,
  serial,
  text,
  integer,
  bigint,
  index,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const mediaTypeEnum = pgEnum("media_type", ["photo", "gif"]);

export const messagesCounter = pgTable("messages_counter", {
  chatId: bigint("chat_id", { mode: "number" }).primaryKey(),
  count: integer("count").default(0).notNull(),
});

export const textMessages = pgTable(
  "text_messages",
  {
    id: serial("id").primaryKey(),
    chatId: bigint("chat_id", { mode: "number" })
      .notNull()
      .references(() => messagesCounter.chatId),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("text_messages_chat_id_idx").on(table.chatId)],
);

export const mediaMessages = pgTable(
  "media_messages",
  {
    id: serial("id").primaryKey(),
    chatId: bigint("chat_id", { mode: "number" })
      .notNull()
      .references(() => messagesCounter.chatId),
    fileId: text("file_id").notNull(),
    fileUniqueId: text("file_unique_id").notNull(),
    mediaType: mediaTypeEnum().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("media_messages_chat_id_idx").on(table.chatId)],
);
