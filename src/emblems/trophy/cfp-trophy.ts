// An upright dark football with a gilt rim, set on a tall slim column of gold that is widest under the ball and narrows toward a small flared collar, over a black round drum with a plate band. Drawn for this package from photographs
// of the trophy standing on its base (docs/likeness.md), at a distance, so it is approximate: the ball's laces are the engine's, and the lettering and the marks on the drum and the column are left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The College Football Playoff national championship trophy: an upright football on a tall gold column that narrows to a collar, over a black drum. */
export const TROPHY_CFP_TROPHY = /* @__PURE__ */ defineLathe("trophy:cfp-trophy", "CFP Trophy", "CFPトロフィー", "ours", {
  metal: "gold",
  box: "-0.4 0 64.7 64.7",
  turnBox: "-3.1 0 70 70",
  tones: { dark: "#14161b", ball: "#1c2029" },
  tilt: 9,
  solids: [
    {
      p: [
        [18.5, 4.4, 1], [24, 4.1], [32, 3.2], [39.2, 2.4, 1], [40.1, 3.2, 1], [43.4, 4, 1], [43.6, 4.6, 1], [45, 4.6, 1],
        [45.1, 6.2, 1, "dark"], [46, 7, 1, "dark"], [47.5, 7.15, 1, "dark"], [61.7, 7.15, 1, "dark"], [62.2, 6.9, 1, "dark"],
      ],
    },
  ],
  balls: [{ kind: "football", cx: 32, cy: 11.6, r: 6.35, ry: 9.6, tone: "ball" }],
  plate: { y0: 48, y1: 58, face: 0 },
});
