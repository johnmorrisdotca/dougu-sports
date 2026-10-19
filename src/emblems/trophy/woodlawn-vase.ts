// A very tall silver vase of many tiers: a small horse and rider on a domed top, a shallow dish, a ruffled tier, a wide bowl chased with flowers and fitted with two scrolled handles, a long waisted stem with a disc in it,
// a ring of horses standing round the foot of the stem, and a round base on four feet. Drawn for this package from photographs (docs/likeness.md); the chasing, the rider and the horses are left to their mass.
import { defineLathe } from "../emblem.lathe.ts";

/** The Woodlawn Vase of the Preakness Stakes: a tall tiered silver vase on a waisted stem and a round base. */
export const TROPHY_WOODLAWN_VASE = /* @__PURE__ */ defineLathe("trophy:woodlawn-vase", "Woodlawn Vase", "ウッドローン・ヴェース", "ours", {
  metal: "silver",
  turnBox: "-5.3 0 74.6 74.6",
  tilt: 9,
  solids: [
    {
      p: [
        [3, 0.5, 1], [5.8, 2.2], [9, 1.4], [9.4, 4.8, 1], [10.9, 5.2], [13.1, 5], [13.5, 3.2, 1], [13.9, 5.2], [14.7, 7.8], [17.1, 7], [17.9, 4.8, 1], [19.5, 6], [21.5, 9], [24, 10.4], [26.4, 10.4], [28.8, 8], [31.2, 4.4], [32.8, 2.4],
        [34.8, 2.2], [35.6, 4.4], [37.7, 2.6], [41.3, 3.2], [42.1, 3.8], [43.7, 3.2], [45.7, 2.6], [49.7, 6], [51.8, 7.4], [53.8, 9.6], [55, 12.5, 1], [57.8, 12.5, 1], [61, 13, 1],
      ],
      decor: [["ring", 26], ["dots", 24, 16, 0.9]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.2, pts: [[10, 22.5], [13.4, 21.5], [14.4, 24.5], [12.8, 27.5], [10.6, 28.4]] as const })),
  plate: { y0: 57.9, y1: 60.4 },
});
