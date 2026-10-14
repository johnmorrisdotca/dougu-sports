// Round net: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon, ellipsePath as ell } from "../emblem.shapes.ts";

/** Round net. */
export const SPORT_ROUNDNET = /* @__PURE__ */ defineIcon("sport:roundnet", "Round net", "ラウンドネット", "ours", {
  metal: "flat",
  ink: true, ribbon: "#e0a81c",
  front: [
  ["p", ell(32, 30, 25, 12)],
  ["t", "M7 30q25 10 50 0M20 20q-3 10 0 20M32 18v24M44 20q3 10 0 20"],
  ["m", ell(32, 30, 25, 12)],
  ["p", ell(32, 30, 20, 9)],
  ["n", "M12 40l-5 16M52 40l5 16M32 42v14"],
  ["r", circ(50, 12, 6)],
  ],
});
