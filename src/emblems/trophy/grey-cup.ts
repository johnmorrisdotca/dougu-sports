// A silver two-handled cup with a wide bowl and a swirled stem on a tall truncated cone of panels: a dark ring, a short band of panels, a tall flared cone of twelve panels crossed by dark bands, and a dark foot. Drawn for this
// package from photographs (docs/likeness.md); the panels are left plain, for the engraving option, and the cone's dark bands are rings.
import { defineLathe } from "../emblem.lathe.ts";

/** The Grey Cup of the Canadian Football League: a two-handled silver cup on a tall flared cone of panels. */
export const TROPHY_GREY_CUP = /* @__PURE__ */ defineLathe("trophy:grey-cup", "Grey Cup", "グレイカップ", "ours", {
  metal: "silver",
  turnBox: "-8.9 -7.6 81.7 81.7",
  tones: { dark: "#1c1d21" },
  tilt: 9,
  solids: [
    {
      open: true,
      p: [
        [3.8, 7.1, 1], [5.4, 6.9], [8.5, 6.2], [11, 5], [13, 3.3], [14.4, 2.1, 1], [15.2, 1.7], [16.7, 2.4], [18.4, 2.1], [20, 3.4], [21.7, 4.3], [22.9, 4.5, 1],
        [23.2, 7, 1, "dark"], [25.1, 7.7, 1, "dark"],
        [25.2, 7.8, 1, "main"], [31.8, 9.3, 1, "main"],
        [31.9, 9.6, 1, "main"], [40, 11], [48.7, 12.2, 1, "main"], [49.2, 11.9, 1, "dark"], [49.9, 11.9, 1, "dark"], [50, 11.8, 1, "main"], [53.4, 12, 1, "main"], [53.8, 12.1, 1, "dark"], [54.4, 12.1, 1, "dark"],
        [54.5, 12, 1, "main"], [56.3, 12.2, 1, "main"], [56.5, 12.4, 1, "dark"], [61, 12.6, 1, "dark"],
      ],
      decor: [["mer", 25.2, 56.3, 12]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.6, pts: [[4.4, 12.8], [6.5, 11], [9.5, 8.5], [11, 5.4], [10.4, 3.8], [8.8, 4.6], [7.6, 6]] as const })),
  plate: { y0: 36, y1: 46, face: 0 },
});
