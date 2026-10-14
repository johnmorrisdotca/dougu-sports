// Squash racket and ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon, ellipsePath as ell } from "../emblem.shapes.ts";

/** Squash racket and ball. */
export const SPORT_SQUASH = /* @__PURE__ */ defineIcon("sport:squash", "Squash racket", "スカッシュのラケット", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["p", ell(28, 19, 12, 16)],
  ["t", "M28 3v32M22 5v28M34 5v28M16 19h24M18 11h20M18 27h20"],
  ["n", "M23 34l5 11 5-11"],
  ["s", "M25 45h6v14a3 3 0 0 1-6 0z"],
  ["k", circ(50, 51, 6)],
  ["p", `${circ(48, 49, 1.5)}`],
  ],
});
