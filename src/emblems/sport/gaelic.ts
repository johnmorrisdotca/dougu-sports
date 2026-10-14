// Round ball with seams: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Round ball with seams. */
export const SPORT_GAELIC = /* @__PURE__ */ defineIcon("sport:gaelic", "Round ball with seams", "ゲーリック・フットボールのボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["p", circ(32, 32, 24)],
  ["t", "M10 22q22 12 44 0M10 42q22-12 44 0M32 8v48M18 12q8 20 0 40M46 12q-8 20 0 40"],
  ],
});
