// A clear football outline, a thick oval ring with a band of laces up one side and a shield-shaped mount at its foot, standing on a round silver base that flares from a narrow waist, on a flat black slab. Drawn for this
// package from a photograph (docs/likeness.md); the ring is one curve in the lathe's handle plane and leans a little, the glass is drawn in silver, and the mark on the mount and on the base and the engraving are left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The Lamar Hunt Trophy: a leaning football-shaped ring of glass on a round silver base over a black slab. */
export const TROPHY_LAMAR_HUNT_TROPHY = /* @__PURE__ */ defineLathe("trophy:lamar-hunt-trophy", "Lamar Hunt Trophy", "ハント・トロフィー", "ours", {
  metal: "silver",
  box: "-0.3 0 64.6 64.6",
  turnBox: "-8.9 -0.7 81.8 81.8",
  tones: { glass: "#c9d4dc", dark: "#17181c" },
  tilt: 18,
  solids: [
    { p: [[41, 8, 1], [42.6, 11], [45, 13.4], [52.6, 13.4], [53.6, 12.2, 1], [53.8, 12, 1]] },
    { sides: 4, turn: -45, tone: "dark", p: [[54, 20, 1, "dark"], [58.4, 22, 1, "dark"]] },
  ],
  handles: [{ a: 90, w: 2.4, tone: "glass", pts: [[9.7, 28.6], [6, 36.9], [1.3, 42.2], [-3.3, 43.2], [-6.4, 39.5], [-7.3, 32.3], [-5.7, 23.4], [-2, 15.1], [2.7, 9.8], [7.3, 8.8], [10.4, 12.5], [11.3, 19.7], [9.7, 28.6]] }],
  plate: { y0: 47, y1: 51, face: 0 },
});
