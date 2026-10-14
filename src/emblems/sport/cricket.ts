// Cricket: a pictogram of a bat and a ball, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { bar, circlePath as circ, defineIcon } from "../emblem.shapes.ts";


/** Cricket. */
export const SPORT_CRICKET = /* @__PURE__ */ defineIcon("sport:cricket", "Cricket", "クリケット", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", bar(9, 55, 34, 30, 14).replace(/^/, "")],
    ["b", "M33 31L45 19"],
    ["k", bar(44, 20, 55, 9, 5.4)],
    ["m", circ(48, 49, 8)],
    ["t", "M42 43.6Q47 47 43 54.4M54 43.4Q50 47 54 54.4"],
  ],
});
