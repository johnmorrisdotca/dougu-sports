// Ice skate: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Ice skate. */
export const SPORT_SKATING = /* @__PURE__ */ defineIcon("sport:skating", "Ice skate", "スケート靴", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["p", "M16 6h15v24l17 8c6 3 9 6 9 11v2H16z"],
  ["s", "M14 47h44v5H14z"],
  ["t", "M20 14h8M20 20h8M20 26h8"],
  ["b", "M8 57h50"],
  ["n", "M20 52v5M50 52v5"],
  ],
});
