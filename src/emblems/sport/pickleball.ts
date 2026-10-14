// Pickleball paddle and ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Pickleball paddle and ball. */
export const SPORT_PICKLEBALL = /* @__PURE__ */ defineIcon("sport:pickleball", "Pickleball paddle and ball", "ピックルボールのパドルとボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["m", "M14 5h20a6 6 0 0 1 6 6v17a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V11a6 6 0 0 1 6-6z"],
  ["s", "M20 36h8v15a4 4 0 0 1-8 0z"],
  ["p", circ(46, 46, 11)],
  ["t", `${circ(42, 42, 1.6)}${circ(48, 41, 1.6)}${circ(40, 48, 1.6)}${circ(46, 48, 1.6)}${circ(51, 47, 1.6)}${circ(45, 53, 1.6)}`],
  ],
});
