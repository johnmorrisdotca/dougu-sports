// A gilt globe held up by two figures that rise from a base and spiral round each other, bulging under the globe and drawn in to a slim waist before they flare to their feet, on a round base with two bands of green malachite
// either side of a gilt band. Drawn for this package from a photograph (docs/likeness.md); the two figures are the model's three spiral strands, the continents are the engine's globe, and the lettering on the band is left out
// (the band takes the engraving option).
import { defineLathe } from "../emblem.lathe.ts";

/** The FIFA World Cup: a gilt globe held up by two spiral figures, over a malachite and gilt base. */
export const TROPHY_FIFA_WORLD_CUP = /* @__PURE__ */ defineLathe("trophy:fifa-world-cup", "FIFA World Cup", "FIFAワールドカップ", "ours", {
  metal: "gold",
  turnBox: "-3 0 69.9 69.9",
  tones: { green: "#1f6b4a" },
  tilt: 9,
  solids: [
    {
      p: [
        [15, 9.6, 1], [18, 10.6], [22, 10.2], [26, 8.8], [30, 7.4], [34, 6.3], [38, 5.3], [42, 4.4], [46, 3.6], [49.6, 3.6], [51, 4.9, 1],
        [51.2, 7.2, 1, "green"], [53.6, 8.4], [55.4, 8.4, 1], [55.5, 8.9, 1, "main"], [57.4, 8.9, 1], [57.5, 8.2, 1, "green"], [61, 8.1, 1],
      ],
      decor: [["helix", 17, 50, 3, 0.65]],
    },
  ],
  balls: [{ kind: "globe", cy: 14.4, r: 10.8 }],
  plate: { y0: 55.5, y1: 57.4, tone: "main" },
});
