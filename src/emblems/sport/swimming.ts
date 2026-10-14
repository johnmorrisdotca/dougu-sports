// Swimmer: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Waves: a wavy line across the box at a height. */
const wave = (y: number): string => `M3 ${y}q7-6 14 0t14 0 14 0 14 0`;

/** Swimmer. */
export const SPORT_SWIMMING = /* @__PURE__ */ defineIcon("sport:swimming", "Swimmer", "競泳の選手", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["p", circ(23, 24, 5.5)],
  ["b", "M30 31l17-9M13 38c8-5 18-6 30-3"],
  ["n", wave(46)],
  ["n", wave(55)],
  ],
});
