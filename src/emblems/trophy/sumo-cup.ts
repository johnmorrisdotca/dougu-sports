// A tall silver cup on a tall stepped stand: a wide bell of a bowl with a gilt rim, a knopped stem, and on each side an ornate handle that sweeps up past the rim and ends in a crested curl like a bird's
// head, with a trailing plume below it. Drawn for this package from what such a cup is known to look like; a generic trophy that carries no name, mark or engraving.
import { defineLathe } from "../emblem.lathe.ts";

/** The handle of one side: it swings out from the bowl, rises past the rim, and ends in a crest that curls over like a bird's head. */
const side = (a: number) => ({ a, w: 2.4, tone: "gilt", pts: [[8.4, 27], [14, 25], [18.4, 18], [17.6, 10], [15.2, 3.8], [18, 1.6], [20.2, 3.6]] }) as const;

/** A tall silver cup with phoenix-crested handles on a tall stand. */
export const TROPHY_SUMO_CUP = /* @__PURE__ */ defineLathe("trophy:sumo-cup", "Phoenix-handle cup", "鳳凰飾りの銀杯", "ours", {
  metal: "silver",
  tones: { dark: "#2b2f36", gilt: "#d9a620" },
  solids: [
    {
      open: true,
      p: [
        [8, 11.6, 1, "gilt"], [10.2, 11.2, 1, "gilt"],
        [10.2, 10.6, 1], [14, 9.8], [20, 8.4], [25.4, 6.6], [28.6, 5, 1],
        [28.6, 5.4, 1, "gilt"], [30.4, 5.4, 1, "gilt"],
        [30.4, 3.2, 1], [33, 3.2], [35.4, 4.8], [37.2, 3.6], [39.4, 3.2, 1],
        [39.4, 6, 1, "gilt"], [41.2, 6, 1, "gilt"],
        [41.2, 8, 1], [43.4, 8.4, 1],
        [43.4, 9.6, 1, "dark"], [47, 9.6, 1, "dark"],
        [47, 11.6, 1, "gilt"], [48.6, 11.6, 1, "gilt"],
        [48.6, 13.2, 1, "dark"], [58, 13.2, 1, "dark"],
      ],
    },
  ],
  handles: [side(90), side(-90)],
  plate: { y0: 50.4, y1: 56.6, tone: "dark" },
});
