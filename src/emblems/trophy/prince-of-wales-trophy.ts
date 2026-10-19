// A tall silver vase that flares from a narrow cup to a wide ornamented mouth, under a broad flat lid and a feathered finial, held up by three legs shaped like hockey sticks that sweep out and down round a clear crystal, on a
// dark octagonal base with a plate. Drawn for this package from a photograph (docs/likeness.md); the feathers of the finial are one gilt knob, the ornament of the band is a ring, and the plate is left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Prince of Wales Trophy: a tall flared silver vase on three stick-shaped legs round a crystal, on a dark octagonal base. */
export const TROPHY_PRINCE_OF_WALES_TROPHY = /* @__PURE__ */ defineLathe("trophy:prince-of-wales-trophy", "Prince of Wales Trophy", "ウェールズ杯", "ours", {
  metal: "silver",
  turnBox: "-5 0 74 74",
  tones: { glass: "#d6eaf0", dark: "#191b20", gilt: "#c9974a" },
  tilt: 10,
  solids: [
    {
      p: [
        [3, 0.1, 1, "gilt"], [4, 1.8], [5.2, 2.4], [6.6, 1.6], [7.3, 1.3, 1, "main"], [8.3, 3.5], [9.2, 5.9], [10, 8.1, 1], [11, 7.5], [11.9, 5.4, 1], [12.4, 6.4, 1], [14.8, 6.4, 1],
        [15.1, 5.2, 1], [23.4, 4.4], [28.2, 3.9], [29, 4.6, 1], [30.8, 4.6], [32.5, 3.5], [34.1, 1.6, 1],
      ],
      decor: [["ring", 12.8], ["ring", 14.5], ["ring", 29.5]],
    },
    { p: [[43.4, 0.6, 1, "glass"], [45.5, 3.2], [47.6, 4.6], [50.3, 4.8, 1, "glass"]] },
    {
      sides: 8,
      turn: -22.5,
      tone: "dark",
      p: [[50.2, 11.6, 1, "main"], [51.8, 11.6, 1, "main"], [51.8, 11.2, 1, "dark"], [61, 12.4, 1, "dark"]],
    },
  ],
  handles: [90, -90, 180].map((a) => ({ a, w: 2.5, pts: [[2.2, 34.4], [3.1, 37.9], [3.9, 43.2], [6, 47], [8.2, 49.6]] as const })),
  balls: [{ kind: "plain", cy: 35.6, r: 0.8, tone: "gilt" }],
  plate: { y0: 53.4, y1: 58.4, tone: "dark", face: 0 },
});
