import {
  createCanvas,
  loadImage,
  GlobalFonts,
  type SKRSContext2D,
} from "@napi-rs/canvas";
import { db, mediaMessages } from "@/db";
import { eq, sql } from "drizzle-orm";
import { pathToFileURL } from "bun";
import path from "node:path";
import type { CommandInput, GenerationOutput } from "@/parsers";
import { NoMediaError } from "@/utils";

const fontPath = path.resolve(import.meta.dir, "fonts/TimesNewRoman.ttf");
GlobalFonts.registerFromPath(fontPath, "TimesNew");

const OUT_W = 1280;
const OUT_H = 1024;

const PAD_X = 90;
const PAD_TOP = 58;
const BORDER = 3;
const IMG_W = OUT_W - PAD_X * 2;
const IMG_H = 740;
const MAX_TEXT_W = IMG_W - 40;

function fitText(
  ctx: SKRSContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  minSize: number,
  bold: boolean,
  fontName: string,
): number {
  let size = maxSize;
  ctx.font = `${bold ? "bold " : ""}${size}px ${fontName}`;
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 2;
    ctx.font = `${bold ? "bold " : ""}${size}px ${fontName}`;
  }
  return size;
}

export const createDemotivatorService = async (
  output: GenerationOutput,
  input: CommandInput,
) => {
  const response = await db
    .select({ path: mediaMessages.path })
    .from(mediaMessages)
    .where(eq(mediaMessages.chatId, BigInt(input.chatId)))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!response[0]) throw new NoMediaError(input.chatId);

  const source = await loadImage(pathToFileURL(response[0].path));

  const canvas = createCanvas(OUT_W, OUT_H);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, OUT_W, OUT_H);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = BORDER;
  ctx.strokeRect(PAD_X, PAD_TOP, IMG_W, IMG_H);

  const scale = Math.max(IMG_W / source.width, IMG_H / source.height);
  const sw = IMG_W / scale;
  const sh = IMG_H / scale;
  const sx = (source.width - sw) / 2;
  const sy = (source.height - sh) / 2;
  ctx.drawImage(
    source,
    sx,
    sy,
    sw,
    sh,
    PAD_X + BORDER,
    PAD_TOP + BORDER,
    IMG_W - BORDER * 2,
    IMG_H - BORDER * 2,
  );

  const titleY = PAD_TOP + IMG_H + 22;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const titleSize = fitText(
    ctx,
    output.title,
    MAX_TEXT_W,
    72,
    36,
    true,
    "TimesNew",
  );
  ctx.fillText(output.title, OUT_W / 2, titleY);

  if (output.subtitle) {
    const subtitleY = titleY + titleSize + 10;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    fitText(ctx, output.subtitle, MAX_TEXT_W, 32, 24, false, "TimesNew");
    ctx.fillText(output.subtitle, OUT_W / 2, subtitleY);
  }

  return canvas.encode("png");
};
