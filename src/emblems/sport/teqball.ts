// Curved table and ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Curved table and ball. */
export const SPORT_TEQBALL = /* @__PURE__ */ defineIcon("sport:teqball", "Curved table and ball", "テックボールの湾曲した台とボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["m", "M4 30c10 10 46 10 56 0v5c-10 10-46 10-56 0z"],
  ["t", "M4 30c10 10 46 10 56 0"],
  ["n", "M18 40v16M46 40v16M26 58h12"],
  ["p", "M31 16h2v16h-2z"],
  ["p", circ(46, 14, 7)],
  ["t", "M40 12q6 4 12 0"],
  ],
});
