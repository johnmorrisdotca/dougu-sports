// Water polo ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Waves: a wavy line across the box at a height. */
const wave = (y: number): string => `M3 ${y}q7-6 14 0t14 0 14 0 14 0`;

/** Water polo ball. */
export const SPORT_WATERPOLO = /* @__PURE__ */ defineIcon("sport:waterpolo", "Water polo ball", "水球のボール", "ours", {
  metal: "gold",
  ink: true,
  front: [
  ["m", circ(32, 24, 17)],
  ["t", "M15 24h34M32 7c-8 9-8 25 0 34M32 7c8 9 8 25 0 34"],
  ["n", wave(47)],
  ["n", wave(56)],
  ],
});
