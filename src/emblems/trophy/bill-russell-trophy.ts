// A gold basketball with grooved silver seams, seated in the mouth of a tall gold trumpet: the flange is wider than the body under it, the body narrows in a long smooth curve to a slim waist a little under half the
// body's width, flares into a round foot of two tiers, and is etched with a net of silver diamonds. Drawn for this package from photographs of the 2022 trophy standing beside the championship trophy and the conference finals
// MVP trophies (docs/likeness.md): the heights and radii are measured on a photograph of the whole row, the ball is a little under a third of the height, and the lettering on the foot's band and the ball's valve are left out
// (the band takes the engraving option).
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_BALL, LATHE_EXTRAS } from "../lathe.extras.ts";

/** The Bill Russell NBA Finals Most Valuable Player Trophy: a gold basketball with silver seams in a net-etched gold trumpet over a stepped round foot. */
export const TROPHY_BILL_RUSSELL_TROPHY = /* @__PURE__ */ defineLathe("trophy:bill-russell-trophy", "Bill Russell Trophy", "ビル・ラッセル・トロフィー", "ours", {
  extras: LATHE_EXTRAS,
  ballExtras: LATHE_BALL,
  metal: "gold",
  tones: { silver: "#cfd3d8" },
  box: "-0.3 0 64.6 64.6",
  turnBox: "-4.6 0 73.1 73.1",
  tilt: 10,
  solids: [
    {
      p: [
        [22.8, 11, 1], [23, 12], [23.9, 12, 1], [24, 10.7, 1],
        [25, 10.25], [27, 9.7], [29.3, 9.3], [31.4, 8.65], [33.5, 7.98], [35.7, 7.45], [37.8, 6.9], [39.9, 6.4], [42, 5.9], [44, 5.4], [45.5, 5.05], [47, 4.8], [50.5, 4.8], [51.6, 5.05], [52.7, 5.6], [53.7, 6.9], [54.8, 8.6], [55.9, 9.7, 1],
        [55.9, 9.9, 1], [58, 10.4], [59.2, 10.7, 1], [59.2, 11, 1], [61.3, 11, 1],
      ],
      decor: [["mesh", 25.5, 46, 8, 5, "silver", 0.3], ["ring", 57.2]],
    },
  ],
  balls: [{ kind: "plain", nba: true, cy: 13.3, r: 10.1, seam: "silver", lean: [-16, 22] }],
  plate: { y0: 59.4, y1: 61 },
});
