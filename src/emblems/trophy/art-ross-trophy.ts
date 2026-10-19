// A wide silver bowl chased with garlands, on a small footed cup, standing on a tall square pyramid of red-brown wood that widens a long way toward its foot and is set with rows of round silver plates. Drawn for this
// package from a photograph taken from one corner (docs/likeness.md); the round plates are left out and the plate band is left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Art Ross Trophy: a wide chased silver bowl on a tall tapering wooden pyramid. */
export const TROPHY_ART_ROSS_TROPHY = /* @__PURE__ */ defineLathe("trophy:art-ross-trophy", "Art Ross Trophy", "アート・ロス賞", "ours", {
  metal: "silver",
  box: "-1.9 -1.1 67.8 67.8",
  turnBox: "-18.5 -10.6 101 101",
  tones: { wood: "#7d3b1c" },
  tilt: 12,
  solids: [
    {
      open: true,
      p: [[3, 12.8, 1], [4.4, 13], [6.5, 12.9], [9, 12.4], [11.5, 11.4], [14, 9.8], [16.2, 7.8], [18, 5.6], [19.6, 3.7, 1], [20.5, 4.1], [21.4, 5.8], [22.2, 7.7], [24.1, 7.9, 1]],
      decor: [["ring", 5.2]],
    },
    { sides: 4, turn: -45, tone: "wood", p: [[24.5, 17.2, 1, "wood"], [58.4, 27.8, 1, "wood"], [58.4, 28.6, 1, "wood"], [61, 29.4, 1, "wood"]] },
  ],
  plate: { y0: 40, y1: 48, tone: "wood", face: 0 },
});
