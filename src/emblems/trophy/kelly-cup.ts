// A small two-handled silver cup with a straight-sided bowl, two thin rings under its lip and a short flared foot, standing on a black stack of three drums, each wrapped in a plate band edged with silver, the lowest the widest, on a flat black disc. Drawn for this package
// from a photograph of the cup on its base (docs/likeness.md): the heights and radii are measured on it, and the plate bands are left plain, for the engraving option.
import { defineLathe } from "../emblem.lathe.ts";

/** The Kelly Cup of the ECHL: a two-handled silver cup on three black drums with silver-edged bands. */
export const TROPHY_KELLY_CUP = /* @__PURE__ */ defineLathe("trophy:kelly-cup", "Kelly Cup", "ケリー・カップ", "ours", {
  metal: "silver",
  box: "-1.4 -1 66.9 66.9",
  turnBox: "-12.7 -10.1 89.5 89.5",
  tones: { dark: "#17181c" },
  tilt: 9,
  solids: [
    {
      open: true,
      p: [
        [1.7, 8.4, 1], [2.2, 8.6], [2.6, 8.4, 1], [2.9, 7.4, 1], [3.1, 7.2], [6.2, 7.2], [6.55, 7.75], [6.9, 7.2], [7.6, 7.2], [7.95, 7.8], [8.3, 7.15], [12.9, 6.95], [13.7, 6.5], [14.8, 5.65], [15.3, 5], [15.8, 4.55], [15.9, 4.2, 1], [16.4, 4.15, 1],
        [16.5, 3.1, 1], [18.1, 3], [18.5, 4.4], [18.9, 5.3], [19.4, 5.9], [19.9, 6.25], [20.4, 6.4], [20.9, 6.4, 1],
        [21.1, 7, 1, "dark"], [21.6, 7.5, 1, "dark"], [21.7, 7.5, 1, "main"], [22, 7.5, 1, "main"], [22.1, 7.5, 1, "dark"], [24.2, 7.5, 1, "dark"], [24.3, 7.5, 1, "main"], [24.6, 7.5, 1, "main"],
        [24.7, 7.8, 1, "dark"], [26.2, 8.5, 1, "dark"], [28.6, 10.6, 1, "dark"],
        [28.7, 11.35, 1, "main"], [29.1, 11.35, 1, "main"], [29.2, 11.35, 1, "dark"], [37.3, 11.4, 1, "dark"], [37.4, 11.4, 1, "main"], [37.8, 11.4, 1, "main"],
        [37.9, 12.2, 1, "dark"], [40, 13.6, 1, "dark"], [43.6, 15.4, 1, "dark"],
        [43.7, 15.9, 1, "main"], [44.1, 15.9, 1, "main"], [44.2, 15.9, 1, "dark"], [58.2, 15.9, 1, "dark"], [58.3, 15.9, 1, "main"], [58.7, 15.9, 1, "main"],
        [58.8, 16.2, 1, "dark"], [59.6, 17.2, 1, "dark"], [61.7, 17.5, 1, "dark"],
      ],
      decor: [["ring", 6.7], ["ring", 8.1]],
    },
  ],
  handles: [90, -90].map((a) => ({
    a,
    w: 0.42,
    pts: [[7.7, 3.9], [8.5, 3.1], [9.5, 2], [10.2, 1.1], [11.3, 1.4], [12, 2.4], [12.5, 3.9], [12.2, 6], [10.9, 8.9], [9.6, 11.1], [8.1, 13.2], [7, 14.5], [7.3, 15]] as const,
  })),
  plate: { y0: 44.2, y1: 58.2 },
});
