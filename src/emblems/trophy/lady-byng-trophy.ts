// A silver lidded cup with a small finial, a chased body with a band at the waist, two broad flat ear handles, a knopped stem and a spreading foot, on a block of honey-brown wood with a moulded top and foot and a plate on
// the front. Drawn for this package from a photograph (docs/likeness.md); the chasing is left out and the plate is left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Lady Byng Memorial Trophy: a lidded two-handled silver cup on a knopped stem over a wooden block. */
export const TROPHY_LADY_BYNG_TROPHY = /* @__PURE__ */ defineLathe("trophy:lady-byng-trophy", "Lady Byng Trophy", "レディ・ビング賞", "ours", {
  metal: "silver",
  turnBox: "-7.1 0 78.2 78.2",
  tones: { wood: "#9a5a22", ivory: "#dfe3d2" },
  tilt: 10,
  solids: [
    {
      p: [
        [3, 0.3, 1], [4.3, 0.9], [5.6, 0.6], [6.3, 1.8, 1], [7.4, 4.4], [8.7, 6.3, 1], [9.2, 6.2, 1], [11.8, 7], [14.4, 6.9], [17.1, 6.2], [19.3, 5.1], [19.9, 5.4, 1], [22, 5.4, 1],
        [22.5, 3.5, 1], [23.5, 1.8, 1], [25.5, 2.4], [26.3, 3.3], [27.2, 2.4], [28.5, 1.5], [30.7, 1.4], [31.8, 2.2], [32.6, 3.1], [33.5, 2.2], [34.4, 2, 1], [35.6, 3.5], [37.3, 5.5], [39, 6.9], [40.1, 6.9, 1],
      ],
      decor: [["ring", 9.6], ["ring", 19.6], ["ring", 21.8]],
    },
    {
      sides: 4,
      turn: -45,
      tone: "wood",
      p: [[40.3, 13, 1, "wood"], [42.6, 13.7, 1, "wood"], [43, 15.6, 1, "wood"], [57.9, 15.6, 1, "wood"], [57.9, 16.8, 1, "wood"], [61, 16.8, 1, "wood"]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.8, tone: "ivory", pts: [[6.2, 11.4], [9.2, 11.8], [10.2, 14.5], [9.3, 17.5], [7, 20], [5, 21.2]] as const })),
  plate: { y0: 46, y1: 55, tone: "wood", face: 0 },
});
