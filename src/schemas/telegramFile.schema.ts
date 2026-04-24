import * as z from "zod"

export const TelegramFileSchema = z.union([
    z.object({
        ok: z.literal(true),
        result: z.object({
            file_id: z.string(),
            file_unique_id: z.string(),
            file_size: z.number(),
            file_path: z.string()
        })
    }),
    z.object({
        ok: z.literal(false),
        error_code: z.number(),
        description: z.string()
    })
])