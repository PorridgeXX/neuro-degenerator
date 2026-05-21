import type { GenerationOutput } from "@/parsers";
import type { RandomMedia } from "@/services/telegram";
import { calculateDemotivatorLayout } from "./calculateLayout";
import { buildDemotivatorTemplate } from "./buildTemplate.service";
import { insertPhotoIntoTemplate } from "./insertPhoto.service";
import { insertGifIntoTemplate } from "./insertGif.service";

export type DemotivatorResult =
  | { kind: "photo"; buffer: Buffer }
  | { kind: "animation"; buffer: Buffer };

export const createDemotivatorService = async (
  output: GenerationOutput,
  media: RandomMedia,
): Promise<DemotivatorResult> => {
  const layout = calculateDemotivatorLayout(output);
  const template = buildDemotivatorTemplate(output, layout);

  if (media.mediaType === "gif") {
    return {
      kind: "animation",
      buffer: await insertGifIntoTemplate(template, media, layout),
    };
  }
  return {
    kind: "photo",
    buffer: await insertPhotoIntoTemplate(template, media, layout),
  };
};
