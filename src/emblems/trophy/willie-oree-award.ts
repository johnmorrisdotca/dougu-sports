// A gold fedora with a band and a small bow, on three twisting gold ribbons that rise from a round stepped base and cross as they climb to its brim; the base is a gold drum with a black band that holds a plate, on
// a thin gold disc. Drawn for this package from photographs (docs/likeness.md); the hat is a body of revolution (a crown and a brim), the ribbons are drawn by the cut-out drawing (src/emblems/lathe.sculpt.ts), and
// the ribbons and the plate are blank: no lettering, and no mark.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_EXTRAS } from "../lathe.extras.ts";
import { LATHE_SCULPT } from "../lathe.sculpt.ts";

/** The Willie O'Ree Community Hero Award: a gold fedora on three twisting ribbons over a round gold and black base. */
export const TROPHY_WILLIE_OREE_AWARD = /* @__PURE__ */ defineLathe("trophy:willie-oree-award", "Willie O'Ree Award", "ウィリー・オリー賞", "ours", {
  metal: "gold",
  color: "#b8923f",
  extras: LATHE_EXTRAS,
  sculptor: LATHE_SCULPT,
  tones: { dark: "#15110c", band: "#6f5322" },
  turnBox: "-3.8 -0.8 71.6 71.6",
  lineWidth: 1.5,
  tilt: 10,
  solids: [
    {
      p: [
        [45.4, 7.1, 1],
        [46.3, 7.2],
        [47.2, 7.3, 1],
        [47.2, 8.6, 1],
        [47.9, 8.7],
        [50.5, 8.7, 1],
        [50.5, 8.7, 1],
        [59.5, 8.7, 1],
        [59.5, 8.7, 1],
        [60.4, 8.8],
        [60.4, 9, 1],
        [61.4, 9, 1],
      ],
      decor: [["ring", 47.9], ["ring", 59.5], ["patch", 50.6, 59.3, -50, 50, "dark"], ["patch", 50.6, 59.3, 62, 118, "dark"], ["patch", 50.6, 59.3, -118, -62, "dark"], ["patch", 50.6, 59.3, 130, 230, "dark"]],
    },
    { p: [[1.6, 1.9, 1], [1.9, 2.6], [2.7, 3.5], [4.1, 4.2], [5.8, 4.7], [7, 4.8, 1], [7.1, 4.9, 1, "band"], [8.1, 5, 1, "band"], [8.2, 4.8, 1, "main"]] },
    { open: false, p: [[7.9, 4.8, 1], [8, 6.6], [8.2, 7.7], [8.5, 7.9, 1], [8.8, 7.6], [8.9, 6.1, 1], [8.9, 4.8, 1]] },
  ],
  parts: [
    { kind: "ribbon", steps: 12, pts: [[-3.4, 46.1, 0.3, -175, 2.2], [-3, 40.9, 0.7, -151, 1.9], [-2.6, 35.7, 1.1, -126, 1.8], [-2.1, 30.4, 1.3, -102, 1.6], [-1.6, 25.2, 1.3, -78, 1.5], [-1.2, 19.9, 1.3, -54, 1.4], [-0.7, 14.7, 1.1, -29, 1.3], [-0.3, 9.5, 0.7, -5, 1.2]] },
    { kind: "ribbon", steps: 12, pts: [[4.4, 46.1, 0.6, -8, 2.2], [3.8, 40.9, 1.1, -32, 1.9], [3.2, 35.7, 1.5, -57, 1.8], [2.6, 30.4, 1.7, -81, 1.6], [1.9, 25.2, 1.8, -105, 1.5], [1.3, 19.9, 1.6, -129, 1.4], [0.8, 14.7, 1.3, -154, 1.3], [0.3, 9.5, 0.7, -178, 1.2]] },
    { kind: "ribbon", steps: 12, pts: [[-0.5, 46.1, -1.5, 110, 2.2], [0.1, 40.9, -1.5, 106, 1.9], [0.7, 35.7, -1.2, 101, 1.8], [1, 30.4, -0.8, 97, 1.6], [1.2, 25.2, -0.3, 93, 1.5], [1.1, 19.9, 0.2, 89, 1.4], [0.8, 14.7, 0.6, 84, 1.3], [0.4, 9.5, 0.7, 80, 1.2]] },
    { kind: "box", tone: "main", x: [4.5, 5.9], y: [6.5, 8.1], z: [-0.9, 0.9] },
  ],
  plate: { y0: 51.3, y1: 58.6, tone: "dark" },
});
