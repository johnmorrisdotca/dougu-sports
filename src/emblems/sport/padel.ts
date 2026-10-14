// Padel racket and ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Padel racket and ball. */
export const SPORT_PADEL = /* @__PURE__ */ defineIcon("sport:padel", "Padel racket and ball", "パデルのラケットとボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["m", "M30 3c13 0 19 8 19 18 0 8-5 14-12 18v8h-14v-8c-7-4-12-10-12-18C11 11 17 3 30 3z"],
  ["t", `${circ(25, 14, 1.5)}${circ(31, 14, 1.5)}${circ(37, 14, 1.5)}${circ(22, 21, 1.5)}${circ(28, 21, 1.5)}${circ(34, 21, 1.5)}${circ(40, 21, 1.5)}${circ(25, 28, 1.5)}${circ(31, 28, 1.5)}${circ(37, 28, 1.5)}`],
  ["s", "M25 47h10v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2z"],
  ["p", circ(51, 51, 8)],
  ["t", "M44 48q7 2 14 0"],
  ],
});
