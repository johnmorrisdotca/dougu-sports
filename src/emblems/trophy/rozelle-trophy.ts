// A silver football, the ball itself the trophy, on a short round disc. Drawn for this package from the published description of the current Pete Rozelle Trophy (docs/likeness.md); no freely licensed photograph
// of the object was found (Wikimedia Commons search 2026-10-23), so approximate; the lettering across the ball is left out, and the disc takes the engraving option.
import { defineLathe } from "../emblem.lathe.ts";

/** The Pete Rozelle Trophy: a silver football on a short round disc. */
export const TROPHY_ROZELLE_TROPHY = /* @__PURE__ */ defineLathe("trophy:rozelle-trophy", "Rozelle Trophy", "ロゼル・トロフィー", "ours", {
  metal: "silver",
  box: "-0.4 0 64.8 64.8",
  turnBox: "-5.7 0 75.4 75.4",
  tilt: 10,
  solids: [{ p: [[42.6, 10.4, 1], [45.2, 13.6], [52.8, 14.2, 1], [54.2, 13.2, 1], [58.6, 13.6, 1], [61, 13.8, 1]] }],
  balls: [{ kind: "football", cx: 32, cy: 22.4, r: 10.2, ry: 16.4, rot: 18 }],
  plate: { y0: 50, y1: 56, face: 0 },
});
