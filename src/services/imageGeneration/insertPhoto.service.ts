import { loadImage, type Canvas } from "@napi-rs/canvas";
import { pathToFileURL } from "bun";
import type { DemotivatorLayout } from "./calculateLayout";
import type { RandomMedia } from "@/services/telegram";

export async function insertPhotoIntoTemplate(
  template: Canvas,
  media: RandomMedia,
  layout: DemotivatorLayout,
): Promise<Buffer> {
  const ctx = template.getContext("2d");
  const source = await loadImage(pathToFileURL(media.path));

  ctx.drawImage(
    source,
    0,
    0,
    source.width,
    source.height,
    layout.media.x,
    layout.media.y,
    layout.media.width,
    layout.media.height,
  );

  return template.encode("png");
}
