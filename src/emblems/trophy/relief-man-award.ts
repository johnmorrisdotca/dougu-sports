// A silver fire-fighter's helmet, a tall dome with a wide brim that turns up at the edge, seated on a short chrome column with a flared collar, over a square block of walnut on a stepped walnut base. Drawn for this
// package from a photograph of one of the trophies on its base (docs/likeness-sources.md): the helmet is a third of the height, the brim is as wide as the base, the column is narrow and the block is as tall as the helmet
// and the column together. The helmet's front shield and ridge, the plate on the block and all the lettering and marks are left out, so the helmet is drawn as a round dome.
import { defineLathe } from "../emblem.lathe.ts";

/** The Relief Man Award, given from 1976 to 2012 to the best reliever of each league: a silver fire helmet on a chrome column over a walnut block and base. */
export const TROPHY_RELIEF_MAN_AWARD = /* @__PURE__ */ defineLathe("trophy:relief-man-award", "Relief Man Award", "リリーフマン賞", "ours", {
  metal: "silver",
  tones: { wood: "#4d2b19", brass: "#cfa94a" },
  tilt: 10,
  box: "-0.5 0 64.9 64.9",
  turnBox: "-7.2 0 78.3 78.3",
  solids: [
    { sides: 4, turn: -28, tone: "wood", p: [[55.4, 14.8, 1], [56.4, 16.4, 1], [57.4, 16.8], [60.4, 17.4, 1], [60.9, 17, 1]] },
    { sides: 4, turn: -28, tone: "wood", p: [[31.9, 12.6, 1], [32.3, 13, 1], [55.6, 13.1, 1]], decor: [["panel", 0, 37, 52.5, 0.2, 0.8, "brass"]] },
    {
      p: [
        [3.2, 1.6, 1], [4.2, 3.4], [6, 6.4], [9, 9.2], [12.4, 11], [16, 12], [18.2, 12.4, 1],
        [19.4, 13.6], [20.4, 15.2], [20.9, 16.3, 1], [21.4, 16.2, 1], [21.9, 15.3, 1],
        [22.7, 11], [23.2, 5.2, 1], [23.4, 4.8, 1],
        [30.4, 4.8, 1], [31, 5.7, 1], [32.1, 6.1], [33.2, 6.6, 1],
      ],
      decor: [["ring", 30.8], ["patch", 6.6, 17.2, -48, 48, "brass"], ["mer", 4.2, 15.5, 9, 20]],
    },
  ],
  plate: { y0: 40, y1: 49.5, face: 0, tone: "brass" },
});
