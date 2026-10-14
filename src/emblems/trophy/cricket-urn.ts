// A small terracotta urn: a flared lip, a narrow neck with two square handles, an egg-shaped belly, a stem and a round foot on a wooden base. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** A small terracotta urn. */
export const TROPHY_CRICKET_URN = /* @__PURE__ */ defineLathe("trophy:cricket-urn", "Urn", "取っ手付きの壺", "ours", {
  metal: "flat",
  color: "#a8442f",
  tones: { wood: "#b98a4f" },
  solids: [
    {
      p: [
        [6, 5, 1], [8, 4.4], [10, 3.2, 1], [13, 2.9, 1], [15, 3.6], [19, 7.2], [24, 9.2], [31, 8.8], [38, 5.4], [42, 3.3, 1],
        [42, 3, 1], [44, 3.6], [45.6, 5.4, 1], [45.6, 5, 1], [47.6, 5, 1],
        [47.6, 8, 1, "wood"], [49, 8, 1, "wood"], [49, 11.4, 1, "wood"], [55, 12.6, 1, "wood"],
      ],
      decor: [["ring", 17.4], ["ring", 38]],
    },
  ],
  handles: [
    { a: 90, w: 1.6, pts: [[3.2, 11], [8.4, 11], [8.4, 16.4], [8, 20]] },
    { a: -90, w: 1.6, pts: [[3.2, 11], [8.4, 11], [8.4, 16.4], [8, 20]] },
  ],
  plate: { y0: 49.4, y1: 54.6, tone: "wood" },
});
