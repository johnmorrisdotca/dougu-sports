// A gilded two-handled cup with a domed lid and a small pineapple on top, on a stem and a round plinth. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** A two-handled cup with a lid and a small pineapple finial. */
export const TROPHY_TENNIS_CUP = /* @__PURE__ */ defineLathe("trophy:tennis-cup", "Pineapple cup", "パイナップル飾りのカップ", "ours", {
  metal: "gold",
  tones: { dark: "#2b2f36" },
  solids: [
    {
      p: [
        [11, 3, 1], [13, 4.2, 1], [13, 6.6, 1], [14.6, 6.6, 1], [14.6, 8.2], [17.4, 11.6, 1],
        [17.4, 12.2, 1], [19, 12.4, 1], [19, 12.4], [27, 11.4], [34, 7.6], [37.6, 4.8, 1],
        [37.6, 3.4, 1], [39.4, 3.4, 1], [39.4, 5.2, 1], [41.4, 5.2, 1], [41.4, 3.6, 1], [43.4, 3.6, 1], [43.4, 7, 1], [45, 7, 1],
        [45, 7.6, 1], [53, 7.6, 1], [53, 9, 1, "dark"], [57, 9, 1, "dark"],
      ],
      decor: [["dots", 17.8, 16, 0.9]],
    },
  ],
  balls: [{ kind: "pine", cy: 7.4, r: 2.2, ry: 3.6 }],
  handles: [
    { a: 90, w: 1.8, pts: [[10.8, 26], [14.8, 24.6], [17.6, 19], [17, 14], [15.2, 12.4]] },
    { a: -90, w: 1.8, pts: [[10.8, 26], [14.8, 24.6], [17.6, 19], [17, 14], [15.2, 12.4]] },
  ],
  plate: { y0: 45.8, y1: 52.6 },
});
