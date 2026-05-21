const OUT_W = 1280;
const PAD_X = 90;
const PAD_TOP = 58;
const BORDER = 3;
const INNER_PAD = 10;
const IMG_W = OUT_W - PAD_X * 2;
const IMG_H = 740;
const MAX_TEXT_W = IMG_W - 40;

const TITLE_SIZE = 72;
const SUBTITLE_SIZE = 38;
const TITLE_GAP = 22;
const SUBTITLE_GAP = 10;
const BOTTOM_PAD = 40;

export type DemotivatorText = { title: string; subtitle?: string };

export type TextSlot = {
  centerX: number;
  y: number;
  size: number;
  maxWidth: number;
};

export type DemotivatorLayout = {
  canvas: { width: number; height: number };
  frame: { left: number; top: number; right: number; bottom: number };
  media: { x: number; y: number; width: number; height: number };
  border: { width: number };
  title: TextSlot;
  subtitle: TextSlot | null;
};

export function calculateDemotivatorLayout(
  text: DemotivatorText,
): DemotivatorLayout {
  const hasSubtitle = !!text.subtitle;
  const textBlockH =
    TITLE_SIZE + (hasSubtitle ? SUBTITLE_GAP + SUBTITLE_SIZE : 0) + BOTTOM_PAD;
  const OUT_H = PAD_TOP + IMG_H + TITLE_GAP + textBlockH;

  const titleY = PAD_TOP + IMG_H + TITLE_GAP;
  const subtitleY = hasSubtitle ? titleY + TITLE_SIZE + SUBTITLE_GAP : null;

  return {
    canvas: { width: OUT_W, height: OUT_H },
    frame: {
      left: PAD_X,
      top: PAD_TOP,
      right: PAD_X + IMG_W,
      bottom: PAD_TOP + IMG_H,
    },
    media: {
      x: PAD_X + BORDER + INNER_PAD,
      y: PAD_TOP + BORDER + INNER_PAD,
      width: IMG_W - BORDER * 2 - INNER_PAD * 2,
      height: IMG_H - BORDER * 2 - INNER_PAD * 2,
    },
    border: { width: BORDER },
    title: {
      centerX: OUT_W / 2,
      y: titleY,
      size: TITLE_SIZE,
      maxWidth: MAX_TEXT_W,
    },
    subtitle:
      subtitleY !== null
        ? {
            centerX: OUT_W / 2,
            y: subtitleY,
            size: SUBTITLE_SIZE,
            maxWidth: MAX_TEXT_W,
          }
        : null,
  };
}
