// A very tall silver trophy: a slim figure of a driver holding a chequered flag stands on a smooth dome, over a tall body that is wide at the shoulder and tapers a long way to a narrow neck, covered in rows of small
// relief faces, which flares into a wide drum base of faces; the flag is a handle ending in a chequered square. Drawn for this package from a photograph (docs/likeness.md); the faces are rows of beads, the figure is a slim
// body of revolution, and the lettering is left out (the drum takes the engraving option).
import { defineLathe } from "../emblem.lathe.ts";

/** The Borg-Warner Trophy of the Indianapolis 500: a tall tapering silver body of relief faces under a figure with a flag, on a drum base. */
export const TROPHY_BORG_WARNER_TROPHY = /* @__PURE__ */ defineLathe("trophy:borg-warner-trophy", "Borg-Warner Trophy", "ボルグ・ワーナー", "ours", {
  metal: "silver",
  turnBox: "-3.8 -2 71.7 71.7",
  tones: { dark: "#1d1e22" },
  tilt: 9,
  solids: [
    { p: [[3, 0.7, 1], [4, 1.3], [5.3, 0.9], [7.6, 1.5], [10.3, 1.3], [11.3, 1.6, 1]] },
    {
      p: [
        [11.3, 1.4, 1], [11.9, 3.6], [13, 5.2], [14.6, 5.9], [16.2, 5.7], [26.8, 5.1], [33.5, 4.5], [40.1, 3.5], [43.4, 2.8], [46.4, 2.4], [48, 5], [49.8, 6.3, 1], [50.7, 6.1],
        [60.9, 6.5, 1], [61.6, 7.1, 1, "dark"],
      ],
      decor: [["dots", 17, 14, 0.8], ["dots", 21.5, 14, 0.8, 12], ["dots", 26.2, 14, 0.8], ["dots", 30.8, 13, 0.8, 12], ["dots", 35.4, 12, 0.8], ["dots", 40.1, 10, 0.8, 12], ["dots", 52.6, 16, 1], ["dots", 56, 16, 1, 11], ["dots", 59.3, 16, 1]],
    },
  ],
  handles: [{ a: 90, w: 1.8, tone: "dark", pts: [[0.8, 6.8], [2.6, 5.2], [4.4, 3.8]] }],
  plate: { y0: 53, y1: 58 },
});
