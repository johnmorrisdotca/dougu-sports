// A wide silver bowl with two handles on a short stem, over a tall base that widens like a cone, with a dark band and a dark foot. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** A wide silver bowl with two handles on a tall tiered base. */
export const TROPHY_CANADIAN_BOWL = /* @__PURE__ */ defineLathe("trophy:canadian-bowl", "Wide two-handled bowl", "取っ手が二つの広いボウル", "ours", {
  metal: "silver",
  tones: { dark: "#2b2f36" },
  solids: [
    {
      open: true,
      p: [
        [8, 12.6, 1], [10, 12.2], [16.5, 8.5], [21, 4.4, 1],
        [21, 3.8, 1], [24.5, 3.4, 1], [24.5, 5.8, 1], [26, 5.8, 1], [26, 9.2, 1, "dark"], [29.4, 9.2, 1, "dark"],
        [29.4, 9.8, 1], [46.4, 14.8, 1], [46.4, 15.8, 1, "dark"], [49.6, 15.8, 1, "dark"], [49.6, 16.6, 1], [52.2, 16.6, 1], [52.2, 17.2, 1, "dark"], [58, 17.2, 1, "dark"],
      ],
      decor: [["mer", 30, 46, 11]],
    },
  ],
  handles: [
    { a: 90, w: 2.2, pts: [[8, 17], [13.4, 16], [17.4, 11.5], [15.8, 7.4], [12.8, 8.6]] },
    { a: -90, w: 2.2, pts: [[8, 17], [13.4, 16], [17.4, 11.5], [15.8, 7.4], [12.8, 8.6]] },
  ],
});
