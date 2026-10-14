// Diver: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Waves: a wavy line across the box at a height. */
const wave = (y: number): string => `M3 ${y}q7-6 14 0t14 0 14 0 14 0`;

/** Diver. */
export const SPORT_DIVING = /* @__PURE__ */ defineIcon("sport:diving", "Diver", "飛込の選手", "ours", {
  box: "-0.3 0 64.6 64.6",
  metal: "flat",
  ink: true,
  front: [
  ["s", "M3 12h26v5H3z"],
  ["n", "M8 17v20"],
  ["p", circ(47, 38, 5)],
  ["b", "M30 10L43 32M43 32l7-4M43 32l-3 8"],
  ["n", wave(52)],
  ["t", "M46 49l-2-5M52 50l2-4"],
  ["n", wave(60)],
  ],
});
