// Kyudo: a pictogram of the long bow, its string and an arrow, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Kyudo. */
export const SPORT_KYUDO = /* @__PURE__ */ defineIcon("sport:kyudo", "Kyudo", "弓道", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["b", "M30 3Q4 12 9 36Q13 54 28 61"],
    ["s", "M7.6 33.6L13.8 34.6L13.2 44L7 43z"],
    ["t", "M30 3L28 61"],
    ["n", "M29 32H57"],
    ["k", "M57 32L47.6 27.6V36.4z"],
    ["t", "M32.4 32L29 28.4M32.4 32L29 35.6M37.4 32l-3.4-3.6M37.4 32l-3.4 3.6"],
  ],
});
