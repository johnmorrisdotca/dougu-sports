// A gold cup with a domed lid and a knob, two small handles, on a stem and a round foot. Drawn for this package.
import { defineLathe } from "../emblem.lathe.ts";

/** A cup with a domed lid and a knob. */
export const TROPHY_LIDDED_CUP = /* @__PURE__ */ defineLathe("trophy:lidded-cup", "Cup with a lid", "ふた付きカップ", "ours", {
  metal: "gold",
  solids: [
    {
      p: [
        [5, 2.2, 1], [7, 2.8, 1], [7, 3.6, 1], [8.6, 3.6, 1], [8.6, 5, 1], [10, 5, 1], [10.6, 9.2], [15.4, 12.4, 1],
        [15.4, 12.2, 1], [17, 12.4, 1], [24, 11.6], [32, 7.6], [37.4, 4.6, 1],
        [37.4, 3.2, 1], [41, 3.2, 1], [41, 7, 1], [44, 7, 1], [44, 10.6, 1], [47.4, 10.6, 1], [47.4, 13.6, 1], [52, 13.6, 1],
      ],
      decor: [["ring", 17.2]],
    },
  ],
  handles: [
    { a: 90, w: 2, pts: [[11.4, 20], [16.4, 19], [17.6, 24], [12, 29]] },
    { a: -90, w: 2, pts: [[11.4, 20], [16.4, 19], [17.6, 24], [12, 29]] },
  ],
  plate: { y0: 47.8, y1: 51.8 },
});
