import type { SKRSContext2D } from "@napi-rs/canvas";
import type { TextSlot } from "./calculateLayout";

export function drawCompressedText(
  ctx: SKRSContext2D,
  text: string,
  slot: TextSlot,
  opts: { bold?: boolean; font?: string; color?: string } = {},
) {
  const { bold = false, font = "TimesNew", color = "#fff" } = opts;

  ctx.font = `${bold ? "bold " : ""}${slot.size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const width = ctx.measureText(text).width;

  if (width <= slot.maxWidth) {
    ctx.fillText(text, slot.centerX, slot.y);
    return;
  }

  const scaleX = slot.maxWidth / width;
  ctx.save();
  ctx.translate(slot.centerX, slot.y);
  ctx.scale(scaleX, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}
