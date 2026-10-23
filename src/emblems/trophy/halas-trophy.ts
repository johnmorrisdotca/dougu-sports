// A hollow silver football outline on a short three-sided pylon. Drawn for this package from the published description of the 2010 George Halas Trophy (docs/likeness.md): the NFC counterpart of the Lamar Hunt
// Trophy, made to resemble the championship cup; no freely licensed photograph of the object was found (Wikimedia Commons search 2026-10-23), so approximate; the lettering and the conference mark are left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The George Halas Trophy: a hollow silver football on a short three-sided stand. */
export const TROPHY_HALAS_TROPHY = /* @__PURE__ */ defineLathe("trophy:halas-trophy", "Halas Trophy", "ハラス・トロフィー", "ours", {
  metal: "silver",
  turnBox: "-6.8 -4.2 77.6 77.6",
  tilt: 12,
  solids: [{ sides: 3, turn: -60, p: [[38.4, 6.4, 1], [58.6, 11.2, 1], [61, 11.6, 1]] }],
  handles: [{ a: 90, w: 2.6, pts: [[8.4, 20.4], [4.6, 28.8], [0.2, 34.6], [-4.2, 36.2], [-7.4, 32.4], [-8.2, 24.8], [-6.4, 16.2], [-2.4, 8.8], [2.6, 4.2], [7.2, 4.8], [10.2, 9.6], [10.4, 16.8], [8.4, 20.4]] }],
  plate: { y0: 46, y1: 52, face: 0 },
});
