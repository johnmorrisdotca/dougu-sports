// A tall silver column of two twisted blades that narrows toward its top like a flame, on a wide round silver base with a dark band and a stepped foot. Drawn for this package from photographs of the trophy being carried
// (docs/likeness.md), at a distance and from the side, so approximate; the two blades are helix strands on a slim cone, and the lettering on the band is left out.
import { defineLathe } from "../emblem.lathe.ts";

/** The World Series Most Valuable Player Award trophy: a twisted silver flame on a round base. */
export const TROPHY_WORLD_SERIES_MVP_TROPHY = /* @__PURE__ */ defineLathe("trophy:world-series-mvp-trophy", "World Series MVP Trophy", "ワールドシリーズMVP賞", "ours", {
  metal: "silver",
  box: "-0.5 0 65 65",
  turnBox: "-6.5 0 76.9 76.9",
  tones: { dark: "#1d1e22" },
  tilt: 10,
  solids: [
    {
      p: [[3, 0.2, 1], [8, 1.2], [20, 2.8], [36, 3.7], [48, 4, 1], [48.6, 10, 1], [50, 13, 1], [51, 14, 1, "dark"], [54, 14.3, 1, "dark"], [54.2, 13.6, 1], [57, 15.2, 1], [61, 15.4, 1]],
      decor: [["helix", 5, 48, 2, 1.3], ["helix", 5, 48, 2, 1.3]],
    },
  ],
  plate: { y0: 51, y1: 54, tone: "dark" },
});
