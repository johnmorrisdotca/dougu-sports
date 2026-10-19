// A gilt globe in a silver ring, held up by bands of silver that rise from a slim central column over a black domed base with a gilt rim and a ring of silver discs: the bands are four curved strips that spring from the
// ring, sweep down and in to the base; the column is a slim silver rod. Drawn for this package from a photograph whose top was cut off (docs/likeness.md), so the globe's size is estimated from the ring; the discs and the
// lettering on the ring are left out (the ring takes the engraving option).
import { defineLathe } from "../emblem.lathe.ts";

/** The ICC Cricket World Cup trophy: a gilt globe in a silver ring on swept silver bands over a black dome. */
export const TROPHY_CRICKET_WORLD_CUP = /* @__PURE__ */ defineLathe("trophy:cricket-world-cup", "Cricket World Cup", "クリケットW杯", "ours", {
  metal: "silver",
  turnBox: "-3.8 0 71.6 71.6",
  tones: { gilt: "#d9a620", dark: "#16171b" },
  tilt: 10,
  solids: [
    { p: [[12.2, 12.35, 1], [18.2, 12.35, 1]], decor: [["ring", 13.6], ["ring", 16.8]] },
    { p: [[24.6, 1.4, 1], [47.4, 1.5, 1]] },
    { p: [[47, 3.9, 1, "gilt"], [48, 5.2, 1, "gilt"], [48, 5.4, 1, "dark"], [49, 7], [50.9, 8.5], [55.8, 9.6], [59.7, 10], [61, 9.8, 1, "gilt"]] },
  ],
  handles: [0, 90, 180, 270].map((a) => ({ a, w: 1.4, pts: [[12.2, 15.8], [11.8, 23.3], [9.8, 33.1], [7.2, 41.2], [4.4, 47]] as const })),
  balls: [{ kind: "globe", cy: 14.5, r: 10.7, tone: "gilt" }],
  plate: { y0: 51, y1: 57, tone: "dark" },
});
