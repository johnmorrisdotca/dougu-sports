// A silver two-handled bowl with a crowned finial and a domed, chased lid, a straight upper bowl with a girdle, a chased lower body, a beaded neck and a wide foot, and two large scrolling handles that sweep out and curl
// back; on a dark hexagonal base of wood that widens toward its foot and carries rows of round silver plates. Drawn for this package from a photograph (docs/likeness.md); the chasing and the round plates are left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The Clarence S. Campbell Bowl: a lidded two-handled silver bowl on a hexagonal base of dark wood with round plates. */
export const TROPHY_CAMPBELL_BOWL = /* @__PURE__ */ defineLathe("trophy:campbell-bowl", "Campbell Bowl", "キャンベル・ボウル", "ours", {
  metal: "silver",
  turnBox: "-5.4 0 74.7 74.7",
  tones: { wood: "#3a1a12", copper: "#9c5a32" },
  tilt: 10,
  solids: [
    {
      p: [
        [3, 0.2, 1], [4, 0.8], [5, 1.5], [6.3, 2], [8, 1.7, 1], [8.5, 2.7, 1], [9.7, 4.7], [11.3, 6.7], [13, 8], [14.3, 9, 1], [15.7, 9.3, 1], [16.1, 10.7, 1], [17, 10.1], [25.7, 10, 1],
        [26.1, 10.7, 1], [27, 10.3, 1], [28, 10.1], [32.7, 9], [36, 7], [38, 4.7], [39, 3.5], [41, 3.7, 1], [42, 6.7], [43.7, 7.5, 1],
      ],
      decor: [["ring", 15.9], ["ring", 26.5], ["dots", 40, 22, 0.7], ["mer", 28.5, 35.5, 12]],
    },
    {
      sides: 6,
      turn: -30,
      tone: "wood",
      p: [[44, 10, 1, "wood"], [59.2, 12.4, 1, "wood"], [59.2, 12.6, 1, "copper"], [61, 13.1, 1, "copper"]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.7, pts: [[10.2, 18.7], [13.5, 18.3], [17.2, 19.6], [18.3, 23.3], [16.8, 26.6], [13.8, 29.6], [12.2, 31.6], [13.4, 32.6]] as const })),
  plate: { y0: 49, y1: 55, tone: "wood", face: 0 },
});
