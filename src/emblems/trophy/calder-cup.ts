// A silver two-handled bowl with a band of laurel leaves round its rim, on a knobbed stem that flares to a bell over a black round plinth, standing on two black blocks of wood, the upper narrower than the lower, each with plates on its faces. Drawn for this package from
// photographs of the cup (docs/likeness.md): the heights and radii are measured on them, and the plates, the lettering and the laurel's leaves are left plain.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_EXTRAS } from "../lathe.extras.ts";

/** The Calder Cup of the American Hockey League: a two-handled bowl with a laurel band on a knobbed stem, over a black plinth and two stepped black blocks. */
export const TROPHY_CALDER_CUP = /* @__PURE__ */ defineLathe("trophy:calder-cup", "Calder Cup", "カルダー・カップ", "ours", {
  extras: LATHE_EXTRAS,
  metal: "silver",
  turnBox: "-14.9 -8.7 93.9 93.9",
  tones: { dark: "#08090b", plate: "#9aa1a8" },
  tilt: 9,
  solids: [
    { sides: 4, turn: -45, tone: "dark", p: [[29.5, 14.5, 1, "dark"], [41.2, 16.1, 1, "dark"], [41.2, 23.8, 1, "dark"], [57.6, 26.4, 1, "dark"], [57.6, 24.8, 1, "dark"], [60.3, 25.2, 1, "dark"]],
      decor: [["panel", 0, 31.7, 39.9, 0.1, 0.47, "plate"], ["panel", 0, 31.7, 39.9, 0.54, 0.92, "plate"], ["panel", 0, 46.6, 56.8, 0.053, 0.31, "plate"], ["panel", 0, 46.6, 56.8, 0.375, 0.625, "plate"], ["panel", 0, 46.6, 56.8, 0.684, 0.94, "plate"]] },
    {
      open: true,
      p: [
        [3, 9.3, 1], [3.5, 9.1], [6.2, 9.1, 1], [6.6, 8.7, 1], [7.6, 9.1], [8.5, 9.3], [10.5, 9], [12.6, 7.4], [14.8, 4.2], [15.7, 3.2, 1],
        [16.9, 3.4, 1], [17.6, 3.2], [18.5, 4], [19.4, 4.6], [20.4, 4.1], [21.2, 3.4], [21.7, 3.5, 1],
        [22.5, 4.2], [23.5, 5], [24.8, 6.4], [26, 7.5, 1], [26.4, 7.6, 1],
        [26.5, 7.5, 1, "dark"], [28.5, 7.4, 0, "dark"], [29.8, 7.3, 1, "dark"],
      ],
      decor: [["ring", 3.5], ["ring", 6.2], ["dots", 4.85, 30, 0.45]],
    },
  ],
  handles: [90, -90].map((a) => ({
    a,
    w: 0.8,
    pts: [[3.7, 20.4], [5.1, 19.7], [5.9, 18], [7.1, 16.9], [9, 16], [11.2, 14.6], [13.1, 12.3], [14, 10.3], [14.5, 8], [14.1, 6], [13.1, 4.8], [11.7, 4.4], [11.1, 5.05], [11.2, 6.6], [11.7, 8.5], [11.1, 9.6], [9.4, 10.05], [8.8, 9.9]] as const,
  })),
  plate: { y0: 46.5, y1: 56.5, face: 0 },
});
