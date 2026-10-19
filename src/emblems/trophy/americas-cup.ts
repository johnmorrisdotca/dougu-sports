// A tall silver ewer in the shape of a jug: a wide flaring neck with a long lip, a slim chased neck, a broad low belly that bulges out like a bun, a waisted stem with a chased band and a stepped round foot. A big spiral
// handle with an urn-shaped finial in its upright rises from the belly on the right, and the lip sweeps out to the left as a spout. Drawn for this package from a photograph (docs/likeness.md); the chasing is left out, the
// lip is a tube and the foot takes the engraving option. The old photograph is black and white, so the metal is the usual silver.
import { defineLathe } from "../emblem.lathe.ts";

/** The America's Cup: a tall silver ewer with a spout and a great spiral handle. */
export const TROPHY_AMERICAS_CUP = /* @__PURE__ */ defineLathe("trophy:americas-cup", "America's Cup", "アメリカズカップ", "ours", {
  metal: "silver",
  turnBox: "-7.9 -8.6 79.8 79.8",
  tilt: 9,
  solids: [
    {
      open: true,
      p: [
        [10.6, 4.5, 1], [11.4, 6.3], [13, 4.7], [15.6, 2.4], [18.7, 3.4], [22.9, 4.5], [25.6, 4.7], [28.2, 5.9], [30.3, 7.5], [32.1, 8.7], [35, 11.5], [38.7, 10.5], [41.3, 7.5], [43.9, 5.4], [46.6, 6.2], [48.7, 5.6], [50.5, 2.4], [52.6, 2.6],
        [54.4, 3.3], [56.5, 6], [58.4, 7.9], [61, 9.4, 1],
      ],
      decor: [["ring", 46.8], ["ring", 29]],
    },
  ],
  handles: [
    { a: 90, w: 1.1, pts: [[4.7, 29.8], [7.9, 30.8], [6.6, 25.6], [5.8, 23.5], [6, 20.3], [6.6, 16.6], [6.9, 13], [7.3, 9.8], [7.9, 6.9], [9.7, 4.6], [11.3, 3.5], [12.3, 4.6], [11.5, 6.4], [10, 5.9]] },
    { a: -90, w: 1.5, pts: [[3.1, 13.2], [5.2, 12.4], [6.8, 10.6], [8.7, 9.6]] },
  ],
  plate: { y0: 56, y1: 60 },
});
