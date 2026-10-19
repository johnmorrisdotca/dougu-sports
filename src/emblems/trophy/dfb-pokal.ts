// A tall gilt cup with a wide straight bowl whose rim carries a ring of round stones, a band of relief figures round it and a ribbed collar, narrowing to a slim waist, then a stepped foot of many fine rings. Drawn for
// this package from a clear rendering of the trophy (docs/likeness.md): the half widths are measured down its silhouette; the relief figures, the stones' green and the lettering are left out (the band takes the engraving option).
import { defineLathe } from "../emblem.lathe.ts";

/** The DFB-Pokal: a tall gilt cup with a band round its bowl, a slim waist and a ringed foot. */
export const TROPHY_DFB_POKAL = /* @__PURE__ */ defineLathe("trophy:dfb-pokal", "DFB-Pokal", "DFBポカール", "ours", {
  metal: "gold",
  turnBox: "-9.7 -10.1 83.4 83.4",
  tones: { green: "#2a8a5a" },
  tilt: 8,
  solids: [
    {
      open: true,
      p: [
        [3, 12.6, 1], [4.7, 13.1], [6.3, 13.1], [8, 12.2], [11.3, 12], [16.3, 11.6], [21.2, 11.1], [26.2, 10.5], [29.5, 10.5], [32.8, 10], [36.1, 9.5], [37.8, 7.4], [39.4, 5.4], [41.1, 4.4], [42.8, 5.4], [44.4, 7], [46.1, 8.8],
        [47.7, 9.6, 1], [49.3, 9.9], [51, 10], [52.7, 10.1], [54.3, 10.2], [56, 10.3], [57.7, 10.4], [59.3, 10.5], [61, 11.8, 1],
      ],
      decor: [["dots", 4.6, 22, 1.2], ["ring", 7.6], ["ring", 28], ["ring", 33.2], ["ring", 48.6], ["ring", 51.2], ["ring", 53.8], ["ring", 56.4], ["ring", 59]],
    },
  ],
  plate: { y0: 14, y1: 24 },
});
