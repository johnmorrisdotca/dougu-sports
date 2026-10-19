// A gilt skater with a stick, in mid stride, standing in a wide flared funnel of clear amber that opens like a trumpet, on a dark tapering round base with a silver collar, a column of plates and a black foot. Drawn for this
// package from a photograph (docs/likeness.md); the figure is simplified to a body, a head, an arm and a stick, since the lathe draws bodies of revolution, and the plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";
import { skater } from "../emblem.figure.ts";

const figure = skater(3.4, 30.4, "gilt", "gilt", 1.1);

/** The Maurice Richard Trophy: a gilt skater in a flared amber funnel on a dark tapering base. */
export const TROPHY_ROCKET_RICHARD_TROPHY = /* @__PURE__ */ defineLathe("trophy:rocket-richard-trophy", "Rocket Richard Trophy", "モーリス・リシャール賞", "ours", {
  metal: "silver",
  box: "-0.8 0 65.6 65.6",
  turnBox: "-14.3 -15.6 92.7 92.7",
  tones: { gilt: "#d8a640", amber: "#ecc77f", dark: "#1c1d22" },
  tilt: 12,
  solids: [
    { open: true, tone: "amber", p: [[6.9, 22.2, 1, "amber"], [9.8, 20.8], [16.5, 16.4], [24.2, 11.6], [30.6, 9.4, 1]] },
    ...figure.solids,
    { p: [[30.6, 9.2, 1, "main"], [31.5, 9.4, 1, "main"], [31.5, 9.2, 1, "dark"], [45, 11.5, 0, "dark"], [57, 14.3, 1, "dark"], [58, 15.6], [61, 15.4, 1, "dark"]] },
  ],
  handles: figure.handles,
  balls: figure.balls,
  plate: { y0: 40, y1: 46, tone: "dark" },
});
