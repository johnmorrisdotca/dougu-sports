// Raised legs: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Waves: a wavy line across the box at a height. */
const wave = (y: number): string => `M3 ${y}q7-6 14 0t14 0 14 0 14 0`;

/** Raised legs. */
export const SPORT_ARTISTICSWIMMING = /* @__PURE__ */ defineIcon("sport:artisticswimming", "Raised legs", "水面に上げた脚", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["b", "M25 52V9M37 52V30l9-11"],
  ["b", "M25 9l-5-3M46 19l5 1"],
  ["t", "M12 8l3 4M56 9l-3 4M33 5v5"],
  ["n", wave(52)],
  ["n", wave(60)],
  ],
});
