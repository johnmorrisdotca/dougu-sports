// A tall ring of thirty slender silver poles that stand on a gilt rim and carry a gilt pennant at the top of each, the tops on a ring that is tilted, so that the front poles are the shortest and the back ones the tallest; the ring is a little narrower at the top. It stands on a
// wide round silver base with a gilt band, and a baseball sits at the foot of the ring (not drawn: it is hidden by the poles from the side). Drawn for this package from a photograph (docs/likeness.md); the lettering on the
// band and the base is left out, and the base's band is plain, for the engraving option.
import { defineLathe } from "../emblem.lathe.ts";

/** The Commissioner's Trophy of Major League Baseball: thirty poles with pennants in a ring over a wide round base. */
export const TROPHY_COMMISSIONERS_TROPHY = /* @__PURE__ */ defineLathe("trophy:commissioners-trophy", "Commissioner's Trophy", "MLB優勝トロフィー", "ours", {
  metal: "silver",
  turnBox: "-9 -6.5 81.9 81.9",
  tones: { gilt: "#d9a620", pole: "#c2c9d0", accent: "#e0b030" },
  tilt: 8,
  solids: [
    {
      p: [[48.8, 11.3, 1, "gilt"], [50.2, 11.8, 1, "gilt"], [50.2, 13.1, 1], [51, 13.4, 1], [57.6, 13.6, 1], [59.3, 13.9, 1], [61, 14, 1]],
    },
  ],
  poles: { n: 30, y0: 49, r0: 11, r1: 10.3, top1: 24, top2: 3.8, size: 3.5, tilted: true },
  plate: { y0: 52.4, y1: 56.6 },
});
