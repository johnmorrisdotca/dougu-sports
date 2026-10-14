// Oval ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon, ellipsePath as ell } from "../emblem.shapes.ts";

/** Oval ball. */
export const SPORT_AFL = /* @__PURE__ */ defineIcon("sport:afl", "Oval ball", "オーストラリアンフットボールのボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["m", ell(32, 32, 15, 25)],
  ["t", "M32 10v44M26 22h12M26 30h12M26 38h12M26 46h12"],
  ["n", "M20 18c8 4 16 4 24 0M20 46c8-4 16-4 24 0"],
  ],
});
