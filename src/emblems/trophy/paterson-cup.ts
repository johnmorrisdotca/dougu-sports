// A wide two-handled silver bowl with a straight engraved band round its rim, on a short stem and a silver foot ring, standing on a dark turned wooden base of three stages. The handles are
// scrolled ears: each starts as a small curl against the bowl under the band, swings out and up past the rim and ends in a volute above it. Drawn for this package from a 1912 photograph (the
// proportions, the shape of the ears and the stages of the base were measured on it; docs/likeness.md); the band is left plain, for the engraving option. The ribbon the cup is shown with is not drawn.
import { defineLathe } from "../emblem.lathe.ts";

/** The cup of the Pacific Coast Hockey Association, 1912: a wide bowl with a straight band, scrolled ear handles and a dark wooden base. */
export const TROPHY_PATERSON_CUP = /* @__PURE__ */ defineLathe("trophy:paterson-cup", "Paterson Cup", "パターソン・カップ", "ours", {
  metal: "silver",
  tilt: 8,
  box: "-1.3 -0.7 66.6 66.6",
  turnBox: "-18.5 -21.2 101 101",
  tones: { wood: "#2a211d" },
  solids: [
    {
      open: true,
      p: [
        [12.8, 21.1, 1], [19.9, 21.1, 1],
        [20.5, 20.9], [22, 20.8], [24.5, 20.4], [27.3, 19.7], [29.5, 18.9], [31.6, 17.9], [33.3, 16.1], [34.8, 13.7], [36, 11.3], [37, 9.2], [38.4, 6.8, 1],
        [39.4, 7.4, 1], [39.9, 11.6, 1], [41.1, 12, 1],
        [41.1, 15.1, 1, "wood"], [42.2, 15.5, 0, "wood"], [44.2, 14.5, 0, "wood"], [46, 13.6, 0, "wood"], [48, 12.9, 0, "wood"], [50, 13.1, 0, "wood"], [51.4, 14, 0, "wood"], [52.2, 15.8, 1, "wood"],
        [52.8, 17.2, 0, "wood"], [54, 17.6, 0, "wood"], [56, 18.2, 0, "wood"], [58.5, 18.5, 0, "wood"], [61.3, 18.4, 1, "wood"],
      ],
      decor: [["ring", 14.2], ["ring", 18.8]],
    },
  ],
  handles: [
    { a: 90, w: 3, pts: [[19.2, 27.4], [18.2, 24.8], [20.8, 22.7], [26.5, 21.9], [30.2, 18], [30.9, 12.3], [28.6, 7.6], [24.7, 5.8], [21.8, 7.3], [23.4, 9.2]] },
    { a: -90, w: 3, pts: [[19.2, 27.4], [18.2, 24.8], [20.8, 22.7], [26.5, 21.9], [30.2, 18], [30.9, 12.3], [28.6, 7.6], [24.7, 5.8], [21.8, 7.3], [23.4, 9.2]] },
  ],
  plate: { y0: 14.2, y1: 18.8 },
});
