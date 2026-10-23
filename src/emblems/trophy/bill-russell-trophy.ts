// A gold basketball over a hoop and a tapering net-shaped body, on two stacked discs, the lower one wood. Drawn for this package from the published description of the Bill Russell NBA Finals MVP Trophy
// (docs/likeness.md): the same family as the championship cup, shorter; no freely licensed photograph was found, so approximate; the lettering and the net's strands are left out (the strands are a diamond net).
import { defineLathe } from "../emblem.lathe.ts";

/** The Bill Russell Trophy: a gold basketball over a hoop and a short net on two discs. */
export const TROPHY_BILL_RUSSELL_TROPHY = /* @__PURE__ */ defineLathe("trophy:bill-russell-trophy", "Bill Russell Trophy", "ラッセル・トロフィー", "ours", {
  metal: "gold",
  tones: { wood: "#43301f" },
  turnBox: "-4.7 0 73.4 73.4",
  tilt: 8,
  solids: [
    {
      p: [
        [20.6, 3.4, 1],
        [23.2, 4.8],
        [25.4, 10.4, 1],
        [26.4, 10.8, 1],
        [27.6, 10.2],
        [42, 8.2],
        [52.4, 6.6, 1],
        [53.6, 8.2, 1],
        [55.8, 10.4, 1, "wood"],
        [58.8, 11.6, 1, "wood"],
        [59.8, 11.8, 1],
        [61, 11.8, 1],
      ],
      decor: [["net", 27, 52, 8]],
    },
  ],
  balls: [{ kind: "basket", cy: 12.4, r: 9.4 }],
  plate: { y0: 52, y1: 57, face: 0 },
});
