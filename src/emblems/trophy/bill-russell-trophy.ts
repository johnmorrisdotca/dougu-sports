// A gold basketball seated straight on the flared rim of a tall goblet: the body is a net-patterned cup that narrows in a long concave curve to a slim waist, then flares into a round foot of two stacked tiers, the upper one
// holding the plain band for the engraving. Drawn for this package from a press photograph of the trophy standing beside the championship trophy (docs/likeness.md): the ball is a third of the height, the rim is wider than the ball,
// the waist is under half the width of the rim and the foot is nearly as wide as the rim; the lettering and the etched strands are left out (the net is a diamond net in the model).
import { defineLathe } from "../emblem.lathe.ts";

/** The Bill Russell NBA Finals Most Valuable Player Trophy: a gold basketball on a flared net goblet over a stepped round foot. */
export const TROPHY_BILL_RUSSELL_TROPHY = /* @__PURE__ */ defineLathe("trophy:bill-russell-trophy", "Bill Russell Trophy", "ビル・ラッセル・トロフィー", "ours", {
  metal: "gold",
  turnBox: "-3.7 0 71.4 71.4",
  tilt: 8,
  solids: [
    {
      p: [
        [22.3, 5, 1], [22.3, 11.3, 1], [22.9, 11.3, 1], [23.5, 10.4], [24.4, 9.9],
        [26.5, 8.7], [28.7, 7.5], [32, 6.6], [35.1, 6.1], [38.5, 5.5], [41.5, 4.9], [44.2, 4.4], [46.4, 4.15], [49.6, 3.9], [50.9, 4.4], [51.9, 6.4], [52.6, 8.6, 1],
        [52.7, 9.1, 1], [56.1, 9.4, 1], [56.2, 10, 1], [58.4, 10.3, 1], [60.2, 10.4], [60.8, 9.9, 1],
      ],
      decor: [["net", 25.2, 48.6, 8, 5], ["ring", 54.2], ["ring", 56.2]],
    },
  ],
  balls: [{ kind: "basket", cy: 12.7, r: 9.4 }],
  plate: { y0: 53.4, y1: 55.9, face: 0 },
});
