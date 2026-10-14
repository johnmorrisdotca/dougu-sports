// Table tennis paddle and ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Table tennis paddle and ball. */
export const SPORT_TABLETENNIS = /* @__PURE__ */ defineIcon("sport:tabletennis", "Table tennis paddle", "卓球のラケット", "ours", {
  metal: "flat",
  ink: true, ribbon: "#c0392b",
  front: [
  ["r", circ(26, 25, 17)],
  ["s", "M22 41h8l-1 17a3 3 0 0 1-6 0z"],
  ["p", circ(49, 47, 8)],
  ],
});
