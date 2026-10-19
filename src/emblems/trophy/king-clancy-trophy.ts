// A tall silver lidded cup: a pointed finial on a collar, a high domed lid, a broad body with a band of scrolls under the lid and a ring of leaves on its side, two tall looped handles, a fluted lower body, a knopped
// stem and a domed foot, on a round base of honey-brown wood in two stepped tiers with a band of plates. Drawn for this package from a photograph (docs/likeness.md); the plates and the wreath are left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The King Clancy Memorial Trophy: a tall lidded two-handled silver cup on a knopped stem over a round wooden base. */
export const TROPHY_KING_CLANCY_TROPHY = /* @__PURE__ */ defineLathe("trophy:king-clancy-trophy", "King Clancy Trophy", "キング・クランシー賞", "ours", {
  metal: "silver",
  turnBox: "-4.2 0 72.2 72.2",
  tones: { wood: "#b36820" },
  tilt: 10,
  solids: [
    {
      p: [
        [3, 0.1, 1], [3.6, 0.6], [4.6, 0.8], [5.6, 0.4], [6.4, 0.7, 1], [7.4, 3, 1], [8.4, 2.6, 1], [10.4, 1.3], [13.9, 1.5], [15.4, 4], [16.4, 6], [17.1, 8.7, 1], [17.4, 8.9], [20.4, 8.9, 1],
        [21.9, 8.6], [26.9, 8.5], [29.3, 8, 1], [32.8, 6.2], [35.3, 4.2], [35.8, 3.7, 1], [36.7, 2], [38.3, 1.4], [40.8, 2.2], [42.5, 3.2], [43.6, 5.2], [45.1, 6.5], [45.8, 6.7, 1],
      ],
      decor: [["ring", 20.4], ["ring", 29.3], ["mer", 29.8, 35, 22]],
    },
    {
      tone: "wood",
      p: [[45.3, 7.2, 1, "wood"], [48.6, 7.5], [49.9, 8.4], [50.5, 9.6, 1, "wood"], [57.6, 10, 1, "wood"], [57.8, 10.3, 1, "wood"], [60, 10.7], [61, 10.5, 1, "wood"]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.6, pts: [[7.8, 15.8], [10.6, 16.7], [11.4, 19.5], [11.6, 25], [10.8, 29.5], [8.6, 32.5], [7.4, 33.6]] as const })),
  plate: { y0: 52, y1: 56.5, tone: "wood" },
});
