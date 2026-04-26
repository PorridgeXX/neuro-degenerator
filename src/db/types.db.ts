import { textMessages, mediaMessages, messagesCounter } from "./schema.db";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const insertTextSchema = createInsertSchema(textMessages);
export const selectTextSchema = createSelectSchema(textMessages);

export const insertMediaSchema = createInsertSchema(mediaMessages);
export const selectMediaSchema = createSelectSchema(mediaMessages);

export const insertCounterSchema = createInsertSchema(messagesCounter);
export const selectCounterSchema = createSelectSchema(messagesCounter);

export type insertText = z.infer<typeof insertTextSchema>;
export type selectText = z.infer<typeof selectTextSchema>;

export type insertMedia = z.infer<typeof insertMediaSchema>;
export type selectMedia = z.infer<typeof selectMediaSchema>;

export type insertCounter = z.infer<typeof insertCounterSchema>;
export type selectCounter = z.infer<typeof selectCounterSchema>;
