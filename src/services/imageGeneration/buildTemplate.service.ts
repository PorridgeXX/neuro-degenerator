import { createCanvas, GlobalFonts, type Canvas } from "@napi-rs/canvas";
import path from "node:path";
import type { DemotivatorLayout, DemotivatorText } from "./calculateLayout";
import { drawCompressedText } from "./drawCompressedText";

const fontPath = path.resolve(import.meta.dir, "fonts/TimesNewRoman.ttf");
GlobalFonts.registerFromPath(fontPath, "TimesNew");

const BOT_HANDLE = "@neurodegeneration_bot";
const HANDLE_SIZE = 18;
const HANDLE_RIGHT_MARGIN = 60;
const HANDLE_GAP_PAD = 12;

export function buildDemotivatorTemplate(
  text: DemotivatorText,
  layout: DemotivatorLayout,
): Canvas {
  const canvas = createCanvas(layout.canvas.width, layout.canvas.height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, layout.canvas.width, layout.canvas.height);

  ctx.font = `${HANDLE_SIZE}px TimesNew`;
  const handleWidth = ctx.measureText(BOT_HANDLE).width;
  const gapRight = layout.frame.right - HANDLE_RIGHT_MARGIN;
  const gapLeft = gapRight - handleWidth - HANDLE_GAP_PAD * 2;
  const gapCenter = (gapLeft + gapRight) / 2;

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = layout.border.width;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  ctx.beginPath();
  ctx.moveTo(gapRight, layout.frame.bottom);
  ctx.lineTo(layout.frame.right, layout.frame.bottom);
  ctx.lineTo(layout.frame.right, layout.frame.top);
  ctx.lineTo(layout.frame.left, layout.frame.top);
  ctx.lineTo(layout.frame.left, layout.frame.bottom);
  ctx.lineTo(gapLeft, layout.frame.bottom);
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(BOT_HANDLE, gapCenter, layout.frame.bottom);

  drawCompressedText(ctx, text.title, layout.title);
  if (text.subtitle && layout.subtitle) {
    drawCompressedText(ctx, text.subtitle, layout.subtitle);
  }

  return canvas;
}
