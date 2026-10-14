// A tall silver cup: a flared bowl on a short stem and a collar, a bell that widens over a stack of bands, each a little wider than the one above, and a dark foot. Drawn for this package; it is a
// generic cup and carries no name, mark or engraving.
import { defineLathe } from "../emblem.lathe.ts";

/** A tall silver cup: a small bowl on a collar over a tall tiered barrel of widening bands. */
export const TROPHY_HOCKEY_CUP = /* @__PURE__ */ defineLathe("trophy:hockey-cup", "Banded silver cup", "段重ねの銀カップ", "ours", {
  metal: "silver",
  tones: { dark: "#2b2f36" },
  solids: [
    {
      open: true,
      p: [
        [3, 11.4, 1], [6, 10.6], [9.5, 6.6], [12, 4.4, 1],
        [13.4, 3.8, 1], [13.4, 5.6, 1], [15, 5.6, 1], [15, 4.4, 1], [17.4, 4.6, 1], [17.4, 5.8, 1],
        [19.4, 6], [22.6, 7.3], [25.6, 8.2, 1],
        [25.6, 10.4, 1], [30.8, 10.4, 1], [30.8, 10.9, 1], [36.2, 10.9, 1], [36.2, 11.4, 1], [41.6, 11.4, 1], [41.6, 11.9, 1], [47, 11.9, 1], [47, 12.4, 1], [52.4, 12.4, 1],
        [52.4, 13.6, 1, "dark"], [58, 13.6, 1, "dark"],
      ],
      decor: [["mer", 4.5, 10, 14]],
    },
  ],
});
