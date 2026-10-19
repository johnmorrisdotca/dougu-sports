// A tall silver cup: a wide flared bowl with a smooth engraved band at the rim and swirled flutes below it, a collar and a neck with a ring of beads, three narrow rings that step out, and a barrel of five bands that
// widens a little toward a black base. Drawn for this package from photographs of the cup standing alone (docs/likeness.md): the heights and radii are measured on them, and the bands are left plain, for the engraving option.
import { defineLathe } from "../emblem.lathe.ts";

/** The Stanley Cup of the National Hockey League: a fluted bowl, a beaded neck, three stepped rings and a barrel of five bands on a black base. */
export const TROPHY_STANLEY_CUP = /* @__PURE__ */ defineLathe("trophy:stanley-cup", "Stanley Cup", "スタンレー・カップ", "ours", {
  metal: "silver",
  turnBox: "-6.9 -6.4 77.7 77.7",
  tones: { dark: "#1b1c20" },
  tilt: 9,
  solids: [
    {
      open: true,
      p: [
        [3.3, 8.9, 1], [4.4, 9], [6.3, 8.9], [7.6, 8.5], [9.1, 8], [10.4, 7.1], [11.3, 6], [12, 4.8], [12.7, 3.6], [13.4, 3, 1],
        [14.2, 3.4], [14.9, 4.9], [15.1, 5.3, 1],
        [17.8, 5.2, 1], [17.8, 5, 1], [18.2, 5, 1], [18.2, 5.9, 1], [22.2, 5.9, 1], [22.2, 5.6, 1], [22.6, 5.6, 1], [22.6, 6.9, 1], [26.4, 6.9, 1], [26.7, 6.7, 1], [27.3, 7.6, 1], [28.2, 7.9], [29, 9.6], [29.8, 10.9], [30.7, 11.5],
        [36.2, 11.7], [41.3, 11.75], [47.2, 11.8], [52.8, 11.85], [55, 11.85, 1],
        [55.8, 13, 1, "dark"], [58.4, 13.3, 1, "dark"], [59.5, 12.3, 0, "dark"], [60.5, 9.6, 1, "dark"],
      ],
      decor: [["ring", 6.4], ["ring", 11.3], ["dots", 14.6, 28, 0.9], ["ring", 36.2], ["ring", 41.3], ["ring", 47.2], ["ring", 52.8], ["helix", 7.2, 11.2, 18, 0.13]],
    },
  ],
  plate: { y0: 31.6, y1: 35.6 },
});
