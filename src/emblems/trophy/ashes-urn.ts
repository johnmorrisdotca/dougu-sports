// A tiny terracotta urn with a flat lid, two square handles, a long egg-shaped body that narrows to a slim waisted stem and a round foot, on a turned wooden base that flares to its foot; the label on the body is
// left out and the base takes the engraving option. Drawn for this package from a photograph (docs/likeness.md).
import { defineLathe } from "../emblem.lathe.ts";

/** The Ashes urn: a small terracotta urn with square handles on a turned wooden base. */
export const TROPHY_ASHES_URN = /* @__PURE__ */ defineLathe("trophy:ashes-urn", "The Ashes urn", "アッシズの壺", "ours", {
  metal: "bronze",
  turnBox: "-6.7 -3.1 77.4 77.4",
  color: "#7a1f26",
  tones: { wood: "#9a6030" },
  tilt: 9,
  solids: [
    {
      p: [
        [3, 2.8, 1], [3.9, 5], [5.3, 4.2], [7.1, 3.9], [11.1, 4.2], [12.9, 7.2], [20.4, 8.2], [26.2, 7.2], [32, 5.2], [36.6, 3.2], [40.1, 2.8], [42.4, 3.6], [44.8, 4.2], [45.3, 5.8], [46.5, 7.2, 1],
        [47.1, 9.4, 1, "wood"], [49.4, 11.2], [52.9, 12.6], [55.8, 13.8], [59.8, 14, 1, "wood"],
      ],
      decor: [["ring", 12.9]],
    },
  ],
  handles: [90, -90].map((a) => ({ a, w: 1.4, pts: [[4.4, 11.4], [7.4, 10.2], [7.6, 5.6], [5.2, 5.3]] as const })),
  plate: { y0: 53, y1: 58, tone: "wood" },
});
