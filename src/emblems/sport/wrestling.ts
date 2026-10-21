// Wrestling: a pictogram of two wrestlers in the tie-up, drawn for this package in a 64 by 64 box: heads up, a hand on each other's shoulder, backs leaning in, knees bent and feet planted, on the round of the mat.
// The metal style paints the heads and the mat with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon, ellipsePath } from "../emblem.shapes.ts";

/** Wrestling. */
export const SPORT_WRESTLING = /* @__PURE__ */ defineIcon("sport:wrestling", "Wrestling", "レスリング", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", ellipsePath(32, 57, 30, 5.5)],
    ["m", circ(19, 11.5, 6)],
    ["m", circ(45, 11.5, 6)],
    ["b", "M21 21L15 37L8 46L7 56M15 37L23 47L21 56"],
    ["b", "M43 21L49 37L56 46L57 56M49 37L41 47L43 56"],
    ["b", "M21 25L34 24M43 29L30 28"],
  ],
});
