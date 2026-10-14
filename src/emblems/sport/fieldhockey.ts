// Hooked stick and ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Hooked stick and ball. */
export const SPORT_FIELDHOCKEY = /* @__PURE__ */ defineIcon("sport:fieldhockey", "Hooked stick", "フィールドホッケー", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["b", "M46 5L30 42c-2 6-7 10-15 10"],
  ["p", circ(48, 52, 6)],
  ],
});
