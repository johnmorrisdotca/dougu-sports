// A gold soccer ball held up on a tapering stand with a stepped base. Drawn for this package.
import { defineLathe } from "../emblem.lathe.ts";

/** A soccer ball held up on a tapering stand. */
export const TROPHY_SOCCER_BALL = /* @__PURE__ */ defineLathe("trophy:soccer-ball", "Soccer ball trophy", "サッカーのトロフィー", "ours", {
  metal: "gold",
  solids: [{ p: [[27, 4.4, 1], [38, 3.4], [47, 5.4, 1], [47, 8, 1], [51, 8, 1], [51, 12.4, 1], [55, 12.4, 1], [55, 15, 1], [59, 15, 1]] }],
  balls: [{ kind: "soccer", cy: 16, r: 11.4 }],
});
