// Handball: a pictogram of a goal and the ball, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Handball. */
export const SPORT_HANDBALL = /* @__PURE__ */ defineIcon("sport:handball", "Handball", "ハンドボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["p", "M5 9h40v33H5z"],
    ["t", "M13 9v33M21 9v33M29 9v33M37 9v33M5 17h40M5 25h40M5 33h40"],
    ["b", "M5 44V9h40v35"],
    ["m", circ(44, 44, 14)],
    ["t", "M44 30v28M30 44h28"],
    ["t", "M34.4 34.4Q44 44 34.4 53.6M53.6 34.4Q44 44 53.6 53.6"],
  ],
});
