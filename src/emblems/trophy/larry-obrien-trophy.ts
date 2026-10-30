// The Larry O'Brien Championship Trophy as redrawn for 2022: a gold basketball with grooved silver seams, set forward so that it touches the front of the vase's rim, over a tall gold vase that tapers outward to the top and is etched
// with a net of silver diamonds over its whole height, on a gold base of two stacked round discs. Drawn for this package from photographs of the 2022 design (docs/likeness.md): the ball is a little over a quarter of the height,
// the vase's rim is about three quarters of the ball's width and its foot about three quarters of its rim, and the discs' lettering (the champions' names) and the ball's valve are left out (the lower disc is a plain band that
// takes the engraving option). The trophy given up to 2021, with a smooth ball and a square plinth, is `trophy:larry-obrien-trophy-1977`.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_BALL, LATHE_EXTRAS } from "../lathe.extras.ts";

/** The Larry O'Brien Championship Trophy (2022 design): a gold ball with silver seams over a tapering gold vase with a silver net, on two round discs. */
export const TROPHY_LARRY_OBRIEN_TROPHY = /* @__PURE__ */ defineLathe("trophy:larry-obrien-trophy", "Larry O'Brien Trophy", "ラリー・オブライエン・トロフィー", "ours", {
  extras: LATHE_EXTRAS,
  ballExtras: LATHE_BALL,
  metal: "gold",
  tones: { silver: "#cfd3d8" },
  box: "-0.7 0 65.2 65.2",
  turnBox: "-9.3 -4.5 82.4 82.4",
  tilt: 10,
  solids: [
    {
      lean: [0.083, 90, 52.4],
      p: [[25.2, 7.3, 1], [25.5, 8.3], [26.3, 8.3, 1], [26.3, 8], [52.4, 5.9, 1], [52.4, 12, 1], [55.4, 12.2, 1], [55.4, 14, 1], [61.4, 14.1, 1]],
      decor: [["mesh", 27.5, 51, 7, 4, "silver", 0.28]],
    },
  ],
  balls: [{ kind: "plain", nba: true, cy: 14.5, r: 10.6, fwd: 7.4, dir: 90, seam: "silver", lean: [-18, 24] }],
  plate: { y0: 55.8, y1: 61 },
});
