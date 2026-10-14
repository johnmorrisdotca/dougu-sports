// A gilded two-handled cup with a lid: tall scrolled handles that rise above the rim, a domed lid with a tall finial, a rounded bowl on a knopped stem, and a plain plinth. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** A gilded two-handled cup with a lid. */
export const TROPHY_RUGBY_CUP = /* @__PURE__ */ defineLathe("trophy:rugby-cup", "Gilded cup with a lid", "ふた付きの金色のカップ", "ours", {
  metal: "gold",
  turnBox: "-6 -8.8 76.1 76.1",
  tones: { dark: "#3a2a22" },
  solids: [
    {
      p: [
        [2.6, 1.4, 1], [6, 1.9], [9, 2.6, 1], [9, 3.4, 1], [11, 3.4, 1], [11, 6, 1], [12.4, 6], [15, 10, 1],
        [15, 11, 1], [16.6, 11.4, 1], [16.6, 11.4], [24, 11.2], [31, 8.4], [34.6, 5, 1],
        [34.6, 3.6, 1], [37, 3.6, 1], [37, 5.6, 1], [39, 5.6, 1], [39, 3.8, 1], [41, 3.8, 1], [41, 7.6, 1], [42.4, 7.6, 1],
        [42.4, 8.4, 1], [52, 8.4, 1], [52, 10.4, 1, "dark"], [56, 10.4, 1, "dark"],
      ],
      decor: [["dots", 16.4, 18, 0.8]],
    },
  ],
  handles: [
    { a: 90, w: 1.5, pts: [[9.4, 28], [14.2, 26], [17.6, 20], [17.6, 12.6], [15.6, 10.4], [16.6, 8.6]] },
    { a: -90, w: 1.5, pts: [[9.4, 28], [14.2, 26], [17.6, 20], [17.6, 12.6], [15.6, 10.4], [16.6, 8.6]] },
  ],
  plate: { y0: 43.4, y1: 51.2 },
});
