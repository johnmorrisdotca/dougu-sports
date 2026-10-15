// Contrast of colours, for choosing a thread or an ink that shows on the ball. Imports only the core's colour reader.
import { hexOf, readColour } from "./ball.core.ts";

const luminance = (hex: string): number => {
  const rgb = readColour(hex) ?? [128, 128, 128];
  const f = (c: number): number => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
};

/** The contrast of two colours, 1 to 21. */
export function contrast(a: string, b: string): number {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** The stitch colour for a ball: the wanted one if it is a colour, else the ball's own thread, cream, navy or near-black, whichever shows on every colour the ball is. */
export function stitchFor(grounds: readonly string[], wanted: string | undefined, fallback: string): string {
  const w = wanted === undefined ? undefined : readColour(wanted);
  if (w !== undefined) return hexOf(w);
  return [fallback, "#f4f0e6", "#1b2a5c", "#101418"].find((c) => grounds.every((g) => contrast(c, g) >= 2.2)) ?? fallback;
}
