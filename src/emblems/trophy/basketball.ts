// A ball resting over a rim and a net, on a tapered column and a stepped base, all in gold. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** A gold ball resting over a net and rim, on a tapered column and base. */
export const TROPHY_BASKETBALL = /* @__PURE__ */ defineLathe("trophy:basketball", "Basketball trophy", "バスケットボールのトロフィー", "ours", {
  metal: "gold",
  turnBox: "-5 0 74 74",
  solids: [
    {
      p: [
        [22, 11.2, 1], [24.4, 11.2, 1], [24.4, 10.4, 1], [37, 3.8, 1], [37, 3, 1], [47, 3, 1],
        [47, 6, 1], [50, 6, 1], [50, 12.5, 1], [54, 12.5, 1], [54, 14.8, 1], [58.5, 14.8, 1],
      ],
      decor: [["net", 24.6, 36.6, 12]],
    },
  ],
  balls: [{ kind: "basket", cy: 12.4, r: 10 }],
  plate: { y0: 54.2, y1: 58.4 },
});
