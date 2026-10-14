// Woven ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Woven ball. */
export const SPORT_SEPAKTAKRAW = /* @__PURE__ */ defineIcon("sport:sepaktakraw", "Woven ball", "セパタクローの編み目のボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["m", circ(32, 32, 24)],
  ["t", "M32 8v48M8 32h48M32 8c-13 9-13 39 0 48M32 8c13 9 13 39 0 48M8 32c9-11 39-11 48 0M8 32c9 11 39 11 48 0"],
  ],
});
