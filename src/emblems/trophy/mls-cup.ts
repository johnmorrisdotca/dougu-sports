// A tall silver goblet with a gilt rim whose bowl narrows steadily to a slim stem and a small knob, on a flared round pedestal with one dark groove, with four fluted blades that sweep up and out from the knob, past the rim, and curl in over it,
// each a pair of strips, two in front and two behind. Drawn for this package from photographs of the trophy (docs/likeness.md): the blades are tubes, which cannot cross in front of the cup as the real ones do, and the plate on the pedestal and the stars are left out.
import { defineLathe } from "../emblem.lathe.ts";

const BLADE = [[3.2, 47.4], [7.6, 35.5], [11.6, 24.5], [15.2, 14], [17.8, 5.8], [18.4, 3], [17.3, 1.4], [14.8, 1.6], [12, 3.8], [10.3, 7.2], [9.9, 9.6]] as const;
const strips = (a: number) => [-2.6, 2.6].map((d) => ({ a: a + d, w: 2.2, pts: BLADE }));

/** The MLS Cup (the Philip F. Anschutz Trophy): a tall silver goblet with a gilt rim on a flared pedestal, with four blades that sweep out and curl in over the rim. */
export const TROPHY_MLS_CUP = /* @__PURE__ */ defineLathe("trophy:mls-cup", "MLS Cup", "MLSカップ", "ours", {
  metal: "silver",
  box: "-1.8 -2 67.6 67.6",
  turnBox: "-14.6 -16.8 93.1 93.1",
  tones: { gilt: "#c9a24a", dark: "#2a2c31" },
  tilt: 9,
  solids: [
    {
      open: true,
      p: [
        [5.5, 9.5, 1, "gilt"], [7.2, 9.1, 1, "gilt"], [7.3, 9.05, 1, "main"], [13.3, 9], [20.3, 7.1], [23.8, 5.7], [27.2, 4.7], [30.7, 3.8], [34.2, 2.9], [37.7, 1.6], [39.8, 1.2, 1], [40.8, 2.6, 1], [41.7, 2.2], [43.8, 5.2], [45, 6.6], [46.7, 5.4, 1],
        [47.6, 10.3, 1], [52.1, 11.7], [52.4, 11.8, 1, "dark"], [53.2, 12, 1, "dark"], [53.3, 12, 1, "main"], [61.2, 13.6, 1], [62, 13.8, 1],
      ],
    },
  ],
  handles: [...strips(62), ...strips(-62), ...strips(118), ...strips(-118)],
  plate: { y0: 55, y1: 60 },
});
