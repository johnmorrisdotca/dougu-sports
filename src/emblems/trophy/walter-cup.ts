// A wide shallow silver bowl with a zigzag band under its rim, set between two tall flat blades shaped like hockey sticks that stand out from a heavy round silver base and lean away from each other. Drawn for this package from
// photographs of the cup being carried, taken from the side and at a distance (docs/likeness.md), so it is approximate: the blades are tubes in the lathe, the bowl is a body of revolution, and the lettering on the base is left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The Walter Cup of the Professional Women's Hockey League: a shallow bowl between two stick-shaped blades over a round base. */
export const TROPHY_WALTER_CUP = /* @__PURE__ */ defineLathe("trophy:walter-cup", "Walter Cup", "ウォルター・カップ", "ours", {
  metal: "silver",
  box: "-0.5 0 65 65",
  turnBox: "-14.3 -16.2 92.6 92.6",
  tilt: 12,
  solids: [
    { open: true, p: [[20, 13.8, 1], [21.8, 13.5], [24.5, 12.4], [27, 9.6], [29, 5.4], [30.4, 3, 1], [31, 2.4, 1], [31, 2.2, 1], [50, 3.4, 1]], decor: [["ring", 23.2], ["mer", 21, 26, 36]] },
    { p: [[50.5, 6, 1], [52, 10.6], [54.4, 12.6, 1], [55.8, 14.8, 1], [60.5, 15.2, 1]] },
  ],
  handles: [90, -90].map((a) => ({ a, w: 2.6, pts: [[6, 52], [10, 40], [14, 22], [17, 8], [18, 3]] as const })),
  plate: { y0: 56, y1: 60, face: 0 },
});
