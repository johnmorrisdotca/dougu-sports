// A small two-handled silver cup with a straight-sided bowl, two thin rings under its lip and a short flared foot, standing on a black stack of three drums, each wrapped in a plate band edged with silver, the lowest the widest, on a flat black disc. Drawn for this package
// from a photograph of the cup on its base (docs/likeness.md): the heights and radii are measured on it, and the plate bands are left plain, for the engraving option.
import { defineLathe } from "../emblem.lathe.ts";

/** The Kelly Cup of the ECHL: a two-handled silver cup on three black drums with silver-edged bands. */
export const TROPHY_KELLY_CUP = /* @__PURE__ */ defineLathe("trophy:kelly-cup", "Kelly Cup", "ケリー・カップ", "ours", {
  metal: "silver",
  box: "-1.3 -0.7 66.6 66.6",
  turnBox: "-13.1 -10.7 90.2 90.2",
  tones: { dark: "#17181c" },
  tilt: 9,
  solids: [
    {
      open: true,
      p: [
        [1.95, 8.2, 1], [2.4, 8.4], [2.9, 8.2, 1], [3.1, 7.4, 1], [4.5, 7.35], [9, 7.3], [9.4, 7.1], [11, 6.7], [12.6, 6.2], [14.2, 5.4], [15.2, 4.6], [15.9, 3.8], [16.4, 3.3, 1], [17.3, 3.2],
        [17.7, 3.6], [18.3, 4.2], [19.1, 4.9], [19.9, 5.9], [20.5, 6.5], [20.8, 6.7, 1],
        [21.1, 7, 1, "dark"], [21.6, 7.5, 1, "dark"], [21.7, 7.5, 1, "main"], [22, 7.5, 1, "main"], [22.1, 7.5, 1, "dark"], [24.2, 7.5, 1, "dark"], [24.3, 7.5, 1, "main"], [24.6, 7.5, 1, "main"],
        [24.7, 7.8, 1, "dark"], [25.4, 8.2, 1, "dark"], [26.8, 8.6, 1, "dark"], [27.8, 9.5, 1, "dark"], [28.6, 10.6, 1, "dark"],
        [28.7, 11.35, 1, "main"], [29.1, 11.35, 1, "main"], [29.2, 11.35, 1, "dark"], [37.3, 11.4, 1, "dark"], [37.4, 11.4, 1, "main"], [37.8, 11.4, 1, "main"],
        [37.9, 12.2, 1, "dark"], [39.5, 13.6, 1, "dark"], [40.8, 13.7, 1, "dark"], [41.8, 14.6, 1, "dark"], [43.6, 15.4, 1, "dark"],
        [43.7, 15.9, 1, "main"], [44.1, 15.9, 1, "main"], [44.2, 15.9, 1, "dark"], [58.2, 15.9, 1, "dark"], [58.3, 15.9, 1, "main"], [58.7, 15.9, 1, "main"],
        [58.8, 16.2, 1, "dark"], [59.6, 17.2, 1, "dark"], [61.7, 17.5, 1, "dark"],
      ],
      decor: [["ring", 7.1], ["ring", 7.9]],
    },
  ],
  handles: [90, -90].map((a) => ({
    a,
    w: 1.0,
    pts: [[7.6, 3.95], [8.6, 3.2], [9.2, 1.9], [10.5, 1.15], [11.8, 1.6], [12.3, 3.4], [12.2, 5.3], [11.9, 6.2], [10.9, 9.4], [8.7, 12.6], [7.1, 14.8]] as const,
  })),
  plate: { y0: 44.2, y1: 58.2 },
});
