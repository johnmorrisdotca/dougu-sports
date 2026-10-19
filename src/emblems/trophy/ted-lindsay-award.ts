// A skater in a red-brown jersey with a bronze face, leaning into a stride with his stick, balanced on one skate on a pin, over a tall hexagonal pillar of black glass faced with engraved plates and silver corner posts, standing on a wide
// flared hexagonal base of silver plates. Drawn for this package from a photograph (docs/likeness.md); the figure is simplified (src/emblems/emblem.figure.ts), the plates and the lettering are left out.
import { defineLathe } from "../emblem.lathe.ts";
import { skater } from "../emblem.figure.ts";

const figure = skater(3, 23.8, "bronze", "skin", 1.3);

/** The Ted Lindsay Award: a skater on a tall black hexagonal pillar over a flared silver base. */
export const TROPHY_TED_LINDSAY_AWARD = /* @__PURE__ */ defineLathe("trophy:ted-lindsay-award", "Ted Lindsay Award", "テッド・リンゼイ賞", "ours", {
  metal: "silver",
  box: "-0.3 0 64.6 64.6",
  turnBox: "-5.2 0 74.4 74.4",
  tones: { bronze: "#8a3d2a", skin: "#b48a52", dark: "#17181c", glass: "#1b1d22" },
  tilt: 10,
  solids: [
    ...figure.solids,
    { p: [[23.8, 0.7, 1], [24.6, 0.5, 1]] },
    { sides: 6, p: [[24.6, 8.4, 1, "main"], [25.5, 8.6, 1, "main"], [25.5, 6, 1, "glass"], [28.7, 8.3, 1, "glass"], [51.5, 8.4, 1, "glass"]], tone: "glass" },
    { sides: 6, p: [[51.5, 9, 1, "main"], [57, 12.6, 1, "main"], [58.8, 12.8, 1, "main"], [61, 12.8, 1, "dark"]] },
  ],
  handles: figure.handles,
  balls: figure.balls,
  plate: { y0: 36, y1: 46, tone: "glass", face: 0 },
});
