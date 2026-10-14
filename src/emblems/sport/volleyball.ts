// Volleyball: a pictogram of the ball, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** One panel seam, from the edge past the middle to the edge, turned about the centre three times, each with a second seam beside it. */
const SEAMS = ((): string => {
  const turn = (x: number, y: number, deg: number): string => {
    const a = (deg * Math.PI) / 180;
    return `${(32 + (x - 32) * Math.cos(a) - (y - 32) * Math.sin(a)).toFixed(1)} ${(32 + (x - 32) * Math.sin(a) + (y - 32) * Math.cos(a)).toFixed(1)}`;
  };
  let d = "";
  for (const base of [0, 120, 240]) {
    for (const shift of [0, 17]) {
      d += `M${turn(32, 8, base + shift)}Q${turn(35, 35, base + shift)} ${turn(52.8, 44, base + shift)}`;
    }
  }
  return d;
})();

/** Volleyball. */
export const SPORT_VOLLEYBALL = /* @__PURE__ */ defineIcon("sport:volleyball", "Volleyball", "バレーボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", circ(32, 32, 24)],
    ["t", SEAMS],
  ],
});
