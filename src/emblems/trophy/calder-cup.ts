// A silver two-handled bowl with a band of laurel leaves round its rim, on a knobbed stem that flares to a bell over a black round plinth, standing on two black blocks of wood, the upper narrower than the lower, each with plates on its faces. Drawn for this package from
// photographs of the cup (docs/likeness.md): the heights and radii are measured on them, and the plates, the lettering and the laurel's leaves are left plain.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_EXTRAS } from "../lathe.extras.ts";

/** The Calder Cup of the American Hockey League: a two-handled bowl with a laurel band on a knobbed stem, over a black plinth and two stepped black blocks. */
export const TROPHY_CALDER_CUP = /* @__PURE__ */ defineLathe("trophy:calder-cup", "Calder Cup", "カルダー・カップ", "ours", {
  extras: LATHE_EXTRAS,
  metal: "silver",
  turnBox: "-14.1 -8.7 92.3 92.3",
  tones: { dark: "#08090b", plate: "#9aa1a8" },
  tilt: 9,
  solids: [
    { sides: 4, turn: -45, tone: "dark", at: [16.1, 90], p: [[57.6, 3.9, 1, "dark"], [62.6, 4.1, 1, "dark"]] },
    { sides: 4, turn: -45, tone: "dark", at: [16.1, 270], p: [[57.6, 3.9, 1, "dark"], [62.6, 4.1, 1, "dark"]] },
    {
      sides: 4,
      turn: -45,
      tone: "dark",
      p: [[29.5, 14.5, 1, "dark"], [41.2, 16.1, 1, "dark"], [41.2, 23.8, 1, "dark"], [57.6, 26.4, 1, "dark"]],
      decor: [["panel", 0, 31.7, 39.9, 0.1, 0.47, "plate"], ["panel", 0, 31.7, 39.9, 0.54, 0.92, "plate"], ["panel", 0, 46.6, 56.8, 0.053, 0.31, "plate"], ["panel", 0, 46.6, 56.8, 0.375, 0.625, "plate"], ["panel", 0, 46.6, 56.8, 0.684, 0.94, "plate"], ["panel", 1, 31.7, 39.9, 0.12, 0.46, "plate"], ["panel", 1, 31.7, 39.9, 0.54, 0.88, "plate"], ["panel", 1, 46.6, 56.8, 0.06, 0.32, "plate"], ["panel", 1, 46.6, 56.8, 0.37, 0.63, "plate"], ["panel", 1, 46.6, 56.8, 0.68, 0.94, "plate"], ["panel", 2, 31.7, 39.9, 0.1, 0.47, "plate"], ["panel", 2, 31.7, 39.9, 0.54, 0.92, "plate"], ["panel", 2, 46.6, 56.8, 0.053, 0.31, "plate"], ["panel", 2, 46.6, 56.8, 0.375, 0.625, "plate"], ["panel", 2, 46.6, 56.8, 0.684, 0.94, "plate"], ["panel", 3, 31.7, 39.9, 0.12, 0.46, "plate"], ["panel", 3, 31.7, 39.9, 0.54, 0.88, "plate"], ["panel", 3, 46.6, 56.8, 0.06, 0.32, "plate"], ["panel", 3, 46.6, 56.8, 0.37, 0.63, "plate"], ["panel", 3, 46.6, 56.8, 0.68, 0.94, "plate"]],
    },
    {
      open: true,
      p: [
        [3, 9.5, 1], [3.5, 9.4], [6.2, 9.4, 1], [6.6, 8.9, 1], [7.6, 9.4], [8.5, 9.7], [10.5, 9.5], [12.4, 8.5], [14.1, 6.8], [15.4, 4.7], [16, 3.3, 1],
        [16.9, 3], [17.8, 3.5], [18.8, 4.1], [19.8, 4.1], [20.8, 3.6], [21.6, 2.8], [22.3, 2.7], [22.8, 4.3], [23.3, 4.4], [24.2, 5.6], [25, 6.7], [25.7, 7.3, 1], [25.8, 7.6, 1], [26.4, 7.6, 1],
        [26.5, 7.5, 1, "dark"], [28.5, 7.4, 0, "dark"], [29.8, 7.3, 1, "dark"],
      ],
      decor: [["ring", 3.5], ["ring", 6.2], ["dots", 4.85, 30, 0.45]],
    },
  ],
  handles: [90, -90].map((a) => ({
    a,
    w: 0.8,
    pts: [[4.6, 19.9], [5.4, 19.2], [6, 18], [7.1, 16.9], [9, 16], [11.2, 14.6], [13.1, 12.3], [14, 10.3], [14.5, 8], [14.1, 6], [13.1, 4.8], [11.7, 4.4], [11.1, 5.05], [11.2, 6.6], [11.7, 8.5], [11.1, 9.6], [9.4, 10.05], [8.8, 9.9]] as const,
  })),
  plate: { y0: 46.5, y1: 56.5, face: 0 },
});
