// A tall silver urn with a deep body that is widest above its middle, narrowing to a short knopped stem and a flared foot, a small collar at the neck, and two very large handles that rise from the rim, curl over
// and sweep down the sides almost to the foot. Drawn for this package from a photograph taken square on (docs/likeness.md); the lettering and the roundel on the body are left out, and the body is left plain for the engraving option.
import { defineLathe } from "../emblem.lathe.ts";

/** The UEFA Champions League trophy: a tall silver urn with two long looping handles. */
export const TROPHY_CHAMPIONS_LEAGUE_TROPHY = /* @__PURE__ */ defineLathe("trophy:champions-league-trophy", "Champions League Trophy", "CLトロフィー", "ours", {
  metal: "silver",
  turnBox: "-7.7 -9.1 79.3 79.3",
  tilt: 8,
  solids: [
    {
      open: true,
      p: [[12.6, 9, 1], [13, 8.4], [14.8, 7.4], [15.8, 6.8], [17.9, 9.8], [19.9, 11.5], [24.1, 12.3], [27.1, 12.3], [34.3, 11.6], [38.5, 10.8], [42, 8.8], [44.6, 6], [46.4, 3.6], [48.5, 3.4], [49.4, 4.4], [50.4, 3.2], [52.4, 2.6], [54.6, 3.6], [56.2, 5.4], [57.4, 6.4, 1], [59, 8.4], [60.5, 9, 1]],
      decor: [["ring", 14.2], ["ring", 48.4]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.2, pts: [[9.3, 15.3], [10.4, 11.6], [8.5, 8.6], [7.4, 6.4], [8.5, 4.1], [11.1, 3.4], [14.1, 5.6], [15.6, 10.1], [14.8, 19], [11.9, 30.1], [8.2, 41.2], [6.7, 44.2]] as const })),
  plate: { y0: 24, y1: 36 },
});
