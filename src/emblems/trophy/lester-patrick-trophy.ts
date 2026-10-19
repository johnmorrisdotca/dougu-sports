// A bronze figure of a man standing at ease, on a thin silver plate, over a tall square pedestal of reddish wood with a moulded cap and foot, a plate under the cap and a long column of small plates. Drawn for this package from a
// photograph (docs/likeness.md); the figure is simplified (src/emblems/emblem.figure.ts) and the plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";
import { skater } from "../emblem.figure.ts";

const figure = skater(3, 28.2, "bronze", "bronze", 0.8, false);

/** The Lester Patrick Trophy: a bronze standing figure on a tall square pedestal of reddish wood. */
export const TROPHY_LESTER_PATRICK_TROPHY = /* @__PURE__ */ defineLathe("trophy:lester-patrick-trophy", "Lester Patrick Trophy", "レスター・パトリック賞", "ours", {
  metal: "silver",
  turnBox: "-4.4 0 72.8 72.8",
  tones: { bronze: "#4d3b2d", dark: "#2b2420", wood: "#7a3a1e" },
  tilt: 10,
  solids: [
    ...figure.solids,
    { sides: 4, turn: -45, p: [[28.2, 6.4, 1, "main"], [29.6, 6.4, 1, "main"]] },
    {
      sides: 4,
      turn: -45,
      tone: "wood",
      p: [[29.8, 10.8, 1, "wood"], [32.1, 10.8, 1, "wood"], [32.1, 9.5, 1, "wood"], [57.3, 9.5, 1, "wood"], [57.3, 11.1, 1, "wood"], [61, 11.1, 1, "wood"]],
    },
  ],
  balls: figure.balls,
  plate: { y0: 34, y1: 38, tone: "wood", face: 0 },
});
