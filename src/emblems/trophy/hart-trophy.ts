// A tall slender trophy: a gilt flame-shaped bulb that comes to a point, on a long tapering silver column that swells into a domed bell, standing on a dark octagonal base that widens toward the foot and carries silver plates. Drawn for this package from photographs (docs/likeness.md); the plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Hart Memorial Trophy: a gilt bulb on a tall silver stem over an octagonal plated base. */
export const TROPHY_HART_TROPHY = /* @__PURE__ */ defineLathe("trophy:hart-trophy", "Hart Trophy", "ハート賞", "ours", {
  metal: "silver",
  turnBox: "-2.8 0 69.6 69.6",
  tones: { gilt: "#d19a4a", wood: "#43301f" },
  tilt: 10,
  solids: [
    {
      p: [
        [3, 0.1, 1, "gilt"], [3.7, 0.9], [4.5, 1.9], [5.4, 3.3], [6.6, 4.8], [8, 6], [10.5, 7.3], [16.2, 7.9], [19.1, 7.9], [22, 7.2], [23.4, 5.7], [24.1, 3.9], [24.5, 3.3, 1, "gilt"],
        [24.5, 4.4, 1, "main"], [25.1, 3.4, 1], [27.7, 2.6], [31.7, 1.9], [36.3, 1.4], [44.4, 1], [45.2, 1.4], [46, 3.2], [47.4, 4.6], [48.6, 5.7, 1],
      ],
    },
    {
      sides: 8,
      tone: "wood",
      p: [[48.8, 6.8, 1, "main"], [51.4, 7, 1, "main"], [51.4, 7, 1, "wood"], [61, 7.65, 1, "wood"]],
    },
  ],
  plate: { y0: 54, y1: 59, tone: "wood", face: 0 },
});
