// Two tall goblets side by side, each a silver cone that narrows to its foot and is crowned with a gilt flame, the taller one behind, standing on a round silver dish over an octagonal block of honey-coloured wood with a
// stepped foot and a column of plates. Drawn for this package from a photograph (docs/likeness.md); the flames are single gilt bodies of revolution, which is simpler than the real leaping shapes, and the plates are left plain.
import { defineLathe } from "../emblem.lathe.ts";

/** The Bill Masterton Memorial Trophy: two silver cones with gilt flames on a dish over an octagonal wooden base. */
export const TROPHY_MASTERTON_TROPHY = /* @__PURE__ */ defineLathe("trophy:masterton-trophy", "Masterton Trophy", "マスタートン賞", "ours", {
  metal: "silver",
  box: "-0.4 0 64.7 64.7",
  turnBox: "-6.1 -0.1 76 76",
  tones: { gilt: "#d4a23c", wood: "#d08a2e" },
  tilt: 10,
  solids: [
    {
      at: [3.8, -90],
      p: [
        [19.8, 0.1, 1, "gilt"], [21, 1], [23, 1.9], [25, 2.3], [26.6, 2.4], [26.7, 2.7, 1, "gilt"], [27.3, 2.8, 1, "gilt"],
        [27.4, 2.5, 1, "main"], [27.9, 2.4], [33, 1.8], [38, 1.2, 1],
      ],
    },
    {
      at: [1.8, 90],
      p: [
        [3, 0.1, 1, "gilt"], [4.6, 1.2], [8, 2.5], [12, 3.1], [17, 3.4], [20.2, 3.4], [20.7, 3.7, 1, "gilt"], [21.4, 3.8, 1, "gilt"],
        [21.6, 3.5, 1, "main"], [22, 3.4], [29.2, 2.5], [38, 1.3, 1],
      ],
    },
    { p: [[38.6, 6.5, 1], [39.3, 7.3], [40.6, 7.5], [41.7, 7.3, 1]] },
    {
      sides: 8,
      turn: -22.5,
      tone: "wood",
      p: [
        [41.7, 10.4, 1, "wood"], [55.5, 10.8, 1, "wood"], [55.5, 11.6, 1, "wood"], [57.5, 11.8, 1, "wood"], [57.5, 13, 1, "wood"], [61, 14.4, 1, "wood"],
      ],
    },
  ],
  plate: { y0: 44, y1: 54, tone: "wood", face: 0 },
});
