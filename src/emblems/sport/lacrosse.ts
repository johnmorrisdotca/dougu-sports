// Lacrosse stick: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Lacrosse stick. */
export const SPORT_LACROSSE = /* @__PURE__ */ defineIcon("sport:lacrosse", "Lacrosse stick", "ラクロスのスティック", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["b", "M10 60L40 24"],
  ["p", "M36 28C30 16 44 4 54 8s4 20-18 20z"],
  ["t", "M40 24l8-12M44 26l8-12M36 28l14-6"],
  ["m", circ(14, 14, 7)],
  ],
});
