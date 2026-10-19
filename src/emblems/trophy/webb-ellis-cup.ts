// A tall gilt two-handled cup with a lid crowned by a pineapple finial, a deep straight body with a ruffled lid band and a chased lower bowl, a short waisted stem with a leafy knop, a plain round plinth and a dark wooden
// foot; the two handles are large scrolls that spring from the lid, curl out and sweep down in a hook. Drawn for this package from a photograph (docs/likeness.md); the chasing and the lettering are left out, and the
// plinth takes the engraving option.
import { defineLathe } from "../emblem.lathe.ts";

/** The Webb Ellis Cup: a gilt lidded two-handled cup with a pineapple finial on a round plinth. */
export const TROPHY_WEBB_ELLIS_CUP = /* @__PURE__ */ defineLathe("trophy:webb-ellis-cup", "Webb Ellis Cup", "ウェブ・エリス・カップ", "ours", {
  metal: "gold",
  turnBox: "-5.6 -2.7 75.3 75.3",
  tones: { wood: "#4a2a24" },
  tilt: 9,
  solids: [
    {
      p: [
        [3, 0.3, 1], [5.6, 2.6], [8.2, 2.3], [9.8, 1.9], [11.4, 4.8], [13.3, 7.4], [15.2, 9.3, 1], [15.9, 9.7], [17.2, 8.5], [18.5, 9.7], [24.3, 8.7], [33.9, 9.2], [37.1, 7.9], [39.4, 3.9], [40.7, 3.2], [42.3, 4.5], [44.5, 8.7], [45.5, 8.4],
        [46.8, 7.7], [47.8, 8.4], [58.1, 8.9, 1],
        [58.3, 10.4, 1, "wood"], [61.3, 10.6, 1, "wood"],
      ],
      decor: [["ring", 16.6], ["ring", 36], ["dots", 15.6, 30, 0.8]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 2.2, pts: [[10.6, 17], [15.6, 14.6], [18.8, 17.6], [18, 22.6], [15.2, 27.4], [11.4, 31]] as const })),
  plate: { y0: 49, y1: 57.2 },
});
