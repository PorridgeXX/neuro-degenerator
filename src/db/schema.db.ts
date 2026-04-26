import {
  pgTable,
  PgTable,
  serial,
  text,
  integer,
  bigint,
} from "drizzle-orm/pg-core";

export const textMessages = pgTable("textMessages", {
  id: serial("id").primaryKey(),
  chatId: bigint("chat_id", { mode: "number" }).notNull(),
  text: text("text").notNull(),
});

export const mediaMessages = pgTable("mediaMessages", {
  id: serial("id").primaryKey(),
  chatId: bigint("chat_id", { mode: "number" }).notNull(),
  fileId: text("file_id").notNull(),
  fileUniqueId: text("file_unique_id").notNull(),
});

export const messagesCounter = pgTable("messagesCounter", {
  chatId: bigint("chat_id", { mode: "number" }).notNull(),
  count: integer("count").default(0),
});
