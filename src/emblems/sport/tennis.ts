// Tennis: a pictogram of a racket and a ball, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon, ellipsePath as ell } from "../emblem.shapes.ts";

/** Tennis. */
export const SPORT_TENNIS = /* @__PURE__ */ defineIcon("sport:tennis", "Tennis", "テニス", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["p", ell(27, 19, 14, 17)],
    ["t", "M27 2v34M20 4v30M34 4v30M13 19h28M15 11h24M15 27h24"],
    ["n", "M20 35.4l5.8 8.8M34 35.4l-5.8 8.8"],
    ["s", "M24.4 44h5.2v14.4a2.6 2.6 0 0 1-5.2 0z"],
    ["m", circ(49, 51, 8)],
    ["t", "M42.8 46.6Q47 51 43 56M55.2 46.4Q51 51 55 55.6"],
  ],
});
