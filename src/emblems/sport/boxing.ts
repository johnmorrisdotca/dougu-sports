// Boxing: a pictogram of a boxing glove, drawn for this package in a 64 by 64 box: the padded fist with the thumb lying against its side, the curve where the fingers fold over, and the cuff with its band. It
// carries no maker's mark. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Boxing. */
export const SPORT_BOXING = /* @__PURE__ */ defineIcon("sport:boxing", "Boxing", "ボクシング", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M22 25C22 12.5 29.5 5 40 5C51 5 57 12.5 57 24L57 36C57 41.5 54 45.5 49 46.6L49 50L24 50L24 46C22.4 43.4 22 40 22 36Z"],
    ["m", "M13.5 28C9.8 28.4 8.4 33.6 11 38.4C13 42 17.6 45 24 45L24 33Z"],
    ["n", "M24 33C24 37 24 41 24 45"],
    ["t", "M30 33C37 26.4 47 26.4 56 31"],
    ["k", "M23 50H50V59H23Z"],
    ["t", "M23 54.5H50"],
  ],
});
