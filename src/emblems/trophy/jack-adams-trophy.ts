// A silver urn that flares to a wide mouth, with a scrolled handle on each side, a garlanded lower bowl, a short stem and a round foot, and over it a framed portrait on a slender stalk; on a block with a large plate, on
// wide stepped tiers of orange-brown wood with copper edges and rows of plates. Drawn for this package from a photograph (docs/likeness.md); the portrait is a plain silver block, and the plates and the two
// round medallions beside the block are left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The Jack Adams Award: a flared silver urn with scroll handles under a framed portrait, on a wide stepped wooden base. */
export const TROPHY_JACK_ADAMS_TROPHY = /* @__PURE__ */ defineLathe("trophy:jack-adams-trophy", "Jack Adams Award", "ジャック・アダムス賞", "ours", {
  metal: "silver",
  box: "-1 0 65.9 65.9",
  turnBox: "-13.6 -0.8 91.2 91.2",
  tones: { wood: "#b8601c", copper: "#a85a2a" },
  tilt: 10,
  solids: [
    { sides: 4, turn: -45, p: [[3, 3.4, 1], [10.3, 3.4, 1]] },
    {
      p: [
        [10.3, 0.7, 1], [14.6, 0.6, 1], [14.6, 7.3, 1], [16.5, 6.8], [23.1, 6.3], [25.8, 7], [27.7, 8.1], [29.7, 6.6], [30.8, 3.1], [32.4, 1.7], [33.5, 3.1], [34.3, 5.4], [35.1, 5.6, 1],
      ],
      open: true,
    },
    {
      sides: 4,
      turn: -45,
      tone: "wood",
      p: [
        [35.2, 11.2, 1, "wood"], [45.3, 11.2, 1, "wood"], [45.3, 22, 1, "copper"], [51.2, 23.8, 1, "wood"], [51.4, 26.4, 1, "copper"], [54.1, 26.8, 1, "wood"], [54.1, 27.6, 1, "copper"], [58.3, 27.9, 1, "wood"], [58.3, 29.6, 1, "copper"], [60.8, 30, 1, "copper"],
      ],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.2, pts: [[7.6, 26.2], [8.6, 23.6], [9.4, 21], [9.5, 18.8], [8.6, 17.4], [7.5, 18.1], [8, 19.2]] as const })),
  plate: { y0: 38, y1: 44, tone: "wood", face: 0 },
});
