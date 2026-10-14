// Baseball: a pictogram drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** The stitches across the two seams: short ticks at right angles to each curve, which bows toward the middle as it runs from top to bottom. */
const STITCHES = ((): string => {
  let d = "";
  for (const side of [1, -1]) {
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
      const bow = 21.2 * t * (1 - t);
      const x = side === 1 ? 15.4 + bow : 48.6 - bow;
      const y = 14 + 36 * t;
      const slope = side * 21.2 * (1 - 2 * t);
      const l = Math.hypot(36, slope);
      d += `M${(x - (36 / l) * 2.6).toFixed(1)} ${(y + (slope / l) * 2.6).toFixed(1)}L${(x + (36 / l) * 2.6).toFixed(1)} ${(y - (slope / l) * 2.6).toFixed(1)}`;
    }
  }
  return d;
})();

/** Baseball. */
export const SPORT_MLB = /* @__PURE__ */ defineIcon("sport:mlb", "Baseball", "野球", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", circ(32, 32, 24)],
    ["t", "M15.4 14Q26 32 15.4 50M48.6 14Q38 32 48.6 50"],
    ["t", STITCHES],
  ],
});
