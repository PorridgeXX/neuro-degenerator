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
const PAD_X = 90;
const PAD_TOP = 58;
const BORDER = 3;
const INNER_PAD = 10;
const IMG_W = OUT_W - PAD_X * 2;
const IMG_H = 740;
const MAX_TEXT_W = IMG_W - 40;

const TITLE_SIZE = 72;
const SUBTITLE_SIZE = 32;
const TITLE_GAP = 22;
const SUBTITLE_GAP = 10;
const BOTTOM_PAD = 40;

const BOT_HANDLE = "@neurodegeneration_bot";
const HANDLE_SIZE = 18;
const HANDLE_RIGHT_MARGIN = 60;
const HANDLE_GAP_PAD = 12;

function drawCompressedText(
  ctx: SKRSContext2D,
  text: string,
  centerX: number,
  topY: number,
  maxWidth: number,
  fontSize: number,
  bold: boolean,
  fontName: string,
) {
  ctx.font = `${bold ? "bold " : ""}${fontSize}px ${fontName}`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const width = ctx.measureText(text).width;

  if (width <= maxWidth) {
    ctx.fillText(text, centerX, topY);
    return;
  }

  const scaleX = maxWidth / width;
  ctx.save();
  ctx.translate(centerX, topY);
  ctx.scale(scaleX, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
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

  const textBlockH =
    TITLE_SIZE +
    (output.subtitle ? SUBTITLE_GAP + SUBTITLE_SIZE : 0) +
    BOTTOM_PAD;

  const OUT_H = PAD_TOP + IMG_H + TITLE_GAP + textBlockH;

  const canvas = createCanvas(OUT_W, OUT_H);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, OUT_W, OUT_H);

  const innerW = IMG_W - BORDER * 2 - INNER_PAD * 2;
  const innerH = IMG_H - BORDER * 2 - INNER_PAD * 2;
  ctx.drawImage(
    source,
    0,
    0,
    source.width,
    source.height,
    PAD_X + BORDER + INNER_PAD,
    PAD_TOP + BORDER + INNER_PAD,
    innerW,
    innerH,
  );

  const frameLeft = PAD_X;
  const frameRight = PAD_X + IMG_W;
  const frameTop = PAD_TOP;
  const frameBottom = PAD_TOP + IMG_H;

  ctx.font = `${HANDLE_SIZE}px TimesNew`;
  const handleWidth = ctx.measureText(BOT_HANDLE).width;

  const gapRight = frameRight - HANDLE_RIGHT_MARGIN;
  const gapLeft = gapRight - handleWidth - HANDLE_GAP_PAD * 2;
  const gapCenter = (gapLeft + gapRight) / 2;

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = BORDER;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  ctx.beginPath();
  ctx.moveTo(gapRight, frameBottom);
  ctx.lineTo(frameRight, frameBottom);
  ctx.lineTo(frameRight, frameTop);
  ctx.lineTo(frameLeft, frameTop);
  ctx.lineTo(frameLeft, frameBottom);
  ctx.lineTo(gapLeft, frameBottom);
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.font = `${HANDLE_SIZE}px TimesNew`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(BOT_HANDLE, gapCenter, frameBottom);

  const titleY = PAD_TOP + IMG_H + TITLE_GAP;
  drawCompressedText(
    ctx,
    output.title,
    OUT_W / 2,
    titleY,
    MAX_TEXT_W,
    TITLE_SIZE,
    false,
    "TimesNew",
  );

  if (output.subtitle) {
    const subtitleY = titleY + TITLE_SIZE + SUBTITLE_GAP;
    drawCompressedText(
      ctx,
      output.subtitle,
      OUT_W / 2,
      subtitleY,
      MAX_TEXT_W,
      SUBTITLE_SIZE,
      false,
      "TimesNew",
    );
  }

  return canvas.encode("png");
};
