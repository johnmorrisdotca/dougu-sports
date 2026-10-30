// A tall silver goblet with a gilt rim, narrowing to a slim stem and a small knob, on a flared round pedestal with one dark groove, with four slender fluted blades that rise from the knob and lean out past the rim, each a few parallel strips,
// two in front and two behind. Drawn for this package from photographs of the trophy (docs/likeness.md): the blades are bundles of tubes, the fluting is left to the strips, and the plate on the pedestal and the stars are left out.
import { defineLathe } from "../emblem.lathe.ts";

const BLADE = [[3.2, 47.4], [7.3, 34.2], [10.8, 23.8], [14.2, 13.3], [17.6, 4]] as const;
const strips = (a: number) => [-3.4, 0, 3.4].map((d) => ({ a: a + d, w: 2, pts: BLADE }));

/** The MLS Cup (the Philip F. Anschutz Trophy): a tall silver goblet with a gilt rim on a flared pedestal, with four fluted blades leaning out from its stem. */
export const TROPHY_MLS_CUP = /* @__PURE__ */ defineLathe("trophy:mls-cup", "MLS Cup", "MLSカップ", "ours", {
  metal: "silver",
  box: "-0.8 0 65.6 65.6",
  turnBox: "-13.3 -14.2 90.5 90.5",
  tones: { gilt: "#c9a24a", dark: "#2a2c31" },
  tilt: 9,
  solids: [
    {
      open: true,
      p: [
        [5.5, 9, 1, "gilt"], [7.2, 9.1, 1, "gilt"], [7.3, 9.05, 1, "main"], [13.3, 9], [20.3, 8.8], [27.2, 7.8], [30.7, 6.5], [34.2, 5], [36.3, 3.6], [38.4, 2.6], [39.8, 2, 1], [40.8, 2.6, 1], [41.7, 2.2], [43.8, 5.2], [45, 6.6], [46.7, 5.4, 1],
        [47.6, 10.3, 1], [52.1, 11.7], [52.4, 11.8, 1, "dark"], [53.2, 12, 1, "dark"], [53.3, 12, 1, "main"], [61.2, 13.6, 1], [62, 13.8, 1],
      ],
    },
  ],
  handles: [...strips(62), ...strips(-62), ...strips(118), ...strips(-118)],
  plate: { y0: 55, y1: 60 },
});
