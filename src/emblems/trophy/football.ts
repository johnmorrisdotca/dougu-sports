// A football standing on one end, leaning as if ready for a kick, on a tapered three-sided stand with a stepped base. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** A silver football standing on end, tilted as if ready for a kick, on a tapered three-sided stand. */
export const TROPHY_FOOTBALL = /* @__PURE__ */ defineLathe("trophy:football", "Football trophy", "アメフトのトロフィー", "ours", {
  metal: "silver",
  solids: [
    { sides: 3, p: [[28.6, 3.4, 1], [49, 10.2, 1], [49, 12.8, 1], [53.4, 12.8, 1], [53.4, 15, 1], [58.4, 15, 1]] },
  ],
  balls: [{ kind: "football", cx: 25.6, cy: 16.8, r: 9.4, ry: 13.6, rot: -28 }],
});
