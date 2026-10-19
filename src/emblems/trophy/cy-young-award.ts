// A dark tall plaque with a raised top and a curved silver band across it, a silver V that opens upward with a hand holding a baseball between its arms, and an eight-sided plate under it. Drawn for this package from a
// photograph of the award in a case (docs/likeness.md); the band's lettering and the plate's are left out, and the plate takes the engraving option.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** The Cy Young Award: a dark plaque with a curved silver band, a V and a hand holding a baseball over a plate. */
export const TROPHY_CY_YOUNG_AWARD = /* @__PURE__ */ defineFlat("trophy:cy-young-award", "Cy Young Award", "サイ・ヤング賞", "ours", {
  metal: "silver",
  ribbon: "#1f2125",
  front: [
    ["r", "M13.5 8.5Q23 8 32 3.2Q42 8 50.5 6L51 55Q51 61 45 61H19Q13 61 13 55Z"],
    ["e", "M15.5 10Q23.5 9.4 32 5.4Q41.5 9.6 48.6 8", "1.2"],
    ["m", "M17 13Q32 0.5 47.5 11.5L47.5 14.5Q32 4.5 17 16.5Z"],
    ["m", "M16.5 18.5L22.6 15.2L32.2 36.6L41.8 14.2L47.8 17.5L36.4 44.6H27.8Z"],
    ["o", circlePath(32, 22.8, 4.9)],
    ["m", "M27.8 28Q32 26 36.2 28L35 35Q32 37 29 35Z"],
    ["m", "M21 47.4h22l3.4 3.4v4.8L43 59H21l-3.4-3.4v-4.8z"],
    ["l", "M18 19l3.2-1.8 7 17.4-2 .2z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 53.2, w: 20, h: 5.5 } },
});
