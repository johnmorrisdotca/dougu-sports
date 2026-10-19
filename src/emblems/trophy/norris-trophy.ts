// A silver lidded bowl with a knobbed finial, wide at the shoulder and narrowing to a knopped stem, on a domed silver foot and a two-tiered octagonal base of pale wood faced with silver plates. Drawn for this package from
// photographs taken from one side and a little below (docs/likeness.md); the proportions are measured across the widest parts, and the plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The James Norris Memorial Trophy: a lidded silver bowl on a knopped stem over a two-tiered octagonal wooden base. */
export const TROPHY_NORRIS_TROPHY = /* @__PURE__ */ defineLathe("trophy:norris-trophy", "Norris Trophy", "ノリス賞", "ours", {
  metal: "silver",
  turnBox: "-6.2 0 76.4 76.4",
  tones: { wood: "#c47b22" },
  tilt: 10,
  solids: [
    {
      p: [
        [3, 0.2, 1], [3.7, 0.8], [4.7, 1.1], [5.6, 0.9], [6.1, 1.4, 1], [6.9, 3.1], [8.1, 5.9], [9.7, 9.3], [10.5, 10.7, 1], [10.9, 11.1, 1],
        [13, 10.8], [16.1, 10.2], [19.2, 9], [22.3, 7.1], [23.9, 5.6], [24.8, 4.4], [25.7, 3.6], [27, 3.7], [27.9, 4.3], [28.8, 3.6], [30, 4.3], [31.2, 3.7], [32.6, 3.5],
        [33.3, 4.2], [34.4, 6.8], [35.3, 8.3], [36.2, 9.3], [37.8, 9.6, 1],
      ],
      decor: [["ring", 10.7]],
    },
    { sides: 8, turn: -22.5, tone: "wood", p: [[38.6, 10.5, 1, "wood"], [47.2, 10.9, 1, "wood"]] },
    { sides: 8, turn: -22.5, tone: "wood", p: [[47.4, 15.2, 1, "wood"], [60.4, 15.6, 1, "wood"]] },
  ],
  plate: { y0: 51, y1: 57, tone: "wood", face: 0 },
});
