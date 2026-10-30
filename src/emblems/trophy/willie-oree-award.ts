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
  tones: { dark: "#15110c", band: "#6f5322", high: "#e2c680", hat: "#b8923f" },
  turnBox: "-5.8 -4.8 75.6 75.6",
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
    { open: false, p: [[7.9, 4.8, 1], [8, 6.6], [8.2, 7.7], [8.5, 7.9, 1], [8.8, 7.6], [8.9, 6.1, 1], [8.9, 4.8, 1]] },
  ],
  parts: [
    {
      kind: "cut",
      t: 8.5,
      layers: [
        ["hat", "M27.8 7.4C27.8 7.1 27.8 6.3 27.8 5.7C27.9 5 28.2 4.3 28.4 3.7C28.6 3.2 28.8 2.8 29.1 2.5C29.4 2.1 29.8 1.8 30.2 1.8C30.6 1.7 31 2.1 31.4 2.4C31.8 2.7 32.1 3.6 32.5 3.6C32.9 3.5 33.3 2.5 33.8 2.2C34.3 1.8 35.1 1.5 35.5 1.5C36 1.5 36.3 2 36.6 2.5C36.9 2.9 37.1 3.5 37.2 4.3C37.3 5 37.4 6.9 37.4 6.9C37.4 6.9 37.1 7.5 37.1 7.5C37.1 7.5 31.9 7.6 31.9 7.6C31.9 7.6 28.1 7.5 28.1 7.5C28.1 7.5 27.9 7.7 27.8 7.4Z"],
        ["band", "M31.9 3.2C32.1 2.9 32.5 3 32.8 3.1C33 3.1 33.4 3.1 33.5 3.7C33.6 4.4 33.5 6.3 33.3 6.9C33.1 7.4 32.5 7.2 32.3 6.9C32 6.5 32 5.6 31.9 5C31.9 4.4 31.8 3.5 31.9 3.2Z", "dk"],
        ["high", "M35 2C35.1 1.8 35.8 1.7 36.1 1.8C36.4 2 36.6 2.3 36.8 2.9C36.9 3.4 37 4.9 36.9 5.1C36.8 5.3 36.5 4.4 36.2 4.1C36 3.7 35.6 3.4 35.4 3.1C35.2 2.7 34.9 2.2 35 2Z", "lt"],
        ["band", "M27.8 6.7L37.4 6.5L37.4 8.1L27.8 8.2Z"],
        ["hat", "M35.7 6.9C35.9 6.6 36.4 6.5 36.8 6.5C37.1 6.5 37.6 6.6 37.8 6.9C38 7.1 38 7.8 37.8 8.1C37.6 8.3 37.1 8.2 36.8 8.2C36.4 8.2 35.9 8.3 35.7 8.1C35.5 7.8 35.5 7.1 35.7 6.9Z", "fl"],
      ],
    },
    { kind: "ribbon", steps: 16, pts: [[0.3, 9.3, -1.3, 75, 1.7], [0.4, 12.7, -1.3, 75, 1.7], [0.3, 18.8, -1.2, 75, 1.7], [0.4, 24.9, -1.2, 78, 1.7], [0.6, 31.8, -1.1, 75, 1.7], [0.3, 37.8, -1.1, 69, 1.7], [0.1, 43.9, -1, 63, 1.7], [0.3, 46.5, -1, 49, 1.7]] },
    { kind: "ribbon", steps: 16, pts: [[0.1, 9.3, 0.2, -78, 2.8], [-0.3, 12.7, 0.3, -70, 2.8], [-1.3, 18.8, 0.4, -56, 2.8], [-2.9, 24.9, 0.5, -52, 2.8], [-4, 31.8, 0.6, -54, 2.8], [-4.4, 37, 0.7, -68, 2.8], [-3.5, 42.2, 0.8, -56, 2.8], [-2.2, 46.7, 0.9, -30, 2.8]] },
    { kind: "ribbon", steps: 16, pts: [[0.6, 9.3, 1, 79, 3.1], [1.1, 12.7, 1.1, 72, 3.1], [2, 18.8, 1.1, 62, 3.1], [3.2, 24.9, 1.2, 52, 3.1], [4.4, 31.8, 1.2, 50, 3.1], [5.3, 37, 1.3, 56, 3.1], [5.3, 42.2, 1.3, 58, 3.1], [4.6, 46.7, 1.4, 30, 3.1]] },
    { kind: "box", tone: "main", x: [4.6, 6.4], y: [6.7, 8.2], z: [-1.2, 1.2] },
  ],
  plate: { y0: 51.3, y1: 58.6, tone: "dark" },
});
