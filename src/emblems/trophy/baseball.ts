// A ring of thirty pennants on poles that stand round a baseball, the tops of the poles stepping up once round, on a round base. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** A ring of about thirty gold pennants standing round a silver baseball on a round base. */
export const TROPHY_BASEBALL = /* @__PURE__ */ defineLathe("trophy:baseball", "Baseball trophy", "野球のトロフィー", "ours", {
  metal: "silver",
  tones: { gilt: "#d9a620", pole: "#aab2bc", accent: "#e0b030" },
  solids: [
    {
      p: [[49, 13.4, 1, "gilt"], [51, 13.4, 1, "gilt"], [51, 13, 1], [57, 13, 1], [57, 14.6, 1, "gilt"], [60, 14.6, 1, "gilt"]],
    },
  ],
  balls: [{ kind: "base", cy: 47.4, r: 5.6 }],
  poles: { n: 30, y0: 50, r0: 11, r1: 12, top1: 5, top2: 20, size: 3.4 },
  plate: { y0: 51.2, y1: 56.8 },
});
