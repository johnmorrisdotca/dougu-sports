// A wide silver bowl with a chased body and a spreading lip, on a short collared stem, over a clear glass cylinder with a silver ball inside it, on a ringed silver collar over a tall black drum set with two columns of
// silver plates and a large plate, and a wide silver foot. Drawn for this package from photographs (docs/likeness.md); the chasing, the small plates and the lettering are left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The Avco World Trophy of the World Hockey Association: a silver bowl on a stem over a glass cylinder and a tall black drum with plates. */
export const TROPHY_AVCO_WORLD_TROPHY = /* @__PURE__ */ defineLathe("trophy:avco-world-trophy", "Avco World Trophy", "アブコ・トロフィー", "ours", {
  metal: "silver",
  turnBox: "-7.4 -7.4 78.8 78.8",
  tones: { dark: "#17181c", glass: "#d6e6ee" },
  tilt: 10,
  solids: [
    {
      open: true,
      p: [
        [3, 9.6, 1], [4.2, 9.5], [6.2, 9], [9, 8], [11.6, 6.4], [13.4, 4.2], [14.6, 2.6], [15.9, 2.2, 1], [16.2, 3.4, 1],
        [16.4, 4, 1, "glass"], [25.2, 4, 1, "glass"],
        [25.5, 6.5, 1, "main"], [27, 7.2, 1], [27.8, 7, 1],
        [27.8, 7.8, 1, "dark"], [56, 7.8, 1, "dark"], [56, 9, 1, "main"], [58.6, 9.4], [61, 9.6, 1],
      ],
      decor: [["ring", 25.9], ["ring", 4.6]],
    },
  ],
  balls: [{ kind: "plain", cy: 21.1, r: 2.3 }],
  plate: { y0: 36, y1: 50, tone: "dark" },
});
