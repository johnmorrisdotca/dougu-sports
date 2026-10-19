// A tall silver beaker-shaped cup with a chased bowl and a rolled rim, two long scrolled handles that loop from the rim out and back to the lower bowl, a knotted stem and an ornate foot, standing on two stacked blocks of
// dark wood with copper trim, each faced with rows of plates, and a moulded plinth. Drawn for this package from photographs (docs/likeness.md); the plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Calder Memorial Trophy: a tall two-handled cup on two stacked blocks of dark plated wood. */
export const TROPHY_CALDER_TROPHY = /* @__PURE__ */ defineLathe("trophy:calder-trophy", "Calder Trophy", "カルダー賞", "ours", {
  metal: "silver",
  box: "-0.4 0 64.7 64.7",
  turnBox: "-10.2 -4.2 84.2 84.2",
  tones: { wood: "#2b1710", copper: "#b0682a" },
  tilt: 10,
  solids: [
    {
      open: true,
      p: [
        [3.3, 6.5, 1], [4.2, 6.7], [7.7, 6.8], [11, 6.6], [14, 5.9], [16, 4.9], [17.8, 3.9], [21, 2.2], [23.2, 1.5], [24.6, 1.7], [26.3, 1.9], [27.6, 3.5], [28.6, 4.4, 1],
      ],
    },
    {
      sides: 4,
      turn: -45,
      tone: "wood",
      p: [
        [28.8, 10, 1, "copper"], [30, 13.4, 1, "copper"], [31.8, 13.4, 1, "copper"], [31.8, 14.2, 1, "wood"], [42.2, 14.2, 1, "wood"], [42.2, 15.9, 1, "copper"], [43.4, 15.9, 1, "copper"],
        [43.4, 15.6, 1, "wood"], [57.6, 16, 1, "wood"], [57.6, 17.2, 1, "copper"], [59, 17.5, 1, "copper"], [59, 18.5, 1, "copper"], [61, 18.7, 1, "copper"],
      ],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.3, pts: [[5.9, 7.5], [7.4, 8.2], [8, 10.5], [7.9, 13], [7, 16], [5.3, 18.6], [3.6, 20]] as const })),
  plate: { y0: 46, y1: 52, tone: "wood", face: 0 },
});
