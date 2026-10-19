// A tall gilt two-handled cup with a lid crowned by a pineapple, a deep body with a chased band under the lid and a fluted lower bowl, a short waisted stem with a ring of beads, and a tall plain cylinder plinth with a plate
// and a dark foot; the two handles are flat scrolls that open into a round head by the lid and run down the sides of the body. Drawn for this package from a photograph (docs/likeness.md); the chasing and the lettering are left out and the plinth takes the engraving option.
import { defineLathe } from "../emblem.lathe.ts";

/** The Wimbledon Gentlemen's Singles Trophy: a gilt lidded two-handled cup with a pineapple on a tall round plinth. */
export const TROPHY_WIMBLEDON_GENTLEMENS_TROPHY = /* @__PURE__ */ defineLathe("trophy:wimbledon-gentlemens-trophy", "Gentlemen's Singles Trophy", "ウィンブルドン男子", "ours", {
  metal: "gold",
  turnBox: "-4.4 -0.8 72.8 72.8",
  tones: { wood: "#1d1c24" },
  tilt: 9,
  solids: [
    {
      p: [
        [3, 0.2, 1], [4.4, 2.2], [6.4, 3], [8.2, 2.6], [9.2, 2.2, 1], [9.4, 5.2, 1], [11, 5.8], [11.8, 7.6], [13.2, 10.4], [14.3, 12.2, 1], [16.4, 12.5, 1], [19.8, 10.5], [24.6, 10], [29.3, 9.2], [33.2, 8.4], [36.1, 6.7], [38.4, 3.4], [40.4, 2.5], [41.8, 3.4], [43.7, 2.8], [45.6, 5.2],
        [47.1, 6.6, 1], [48, 8.5, 1], [48.5, 8.4], [58.6, 8.4], [59.8, 8.7, 1],
        [60, 10.3, 1, "wood"], [61, 10.3, 1, "wood"],
      ],
      decor: [["ring", 14.8], ["ring", 33.8], ["dots", 15.6, 28, 0.8], ["mer", 34.5, 37.5, 22]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 2.2, pts: [[11.5, 17.6], [14.6, 15.9], [14, 14.2], [12.4, 15.4], [12.6, 20], [11.2, 24.6], [9.8, 28.4]] as const })),
  plate: { y0: 51, y1: 57 },
});
