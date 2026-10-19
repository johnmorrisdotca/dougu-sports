// A large gilt fielder's glove with its fingers up and a laced web, set on a small tapering pedestal, with a gilt baseball on a little stand on each side, all on a wide two-tiered wooden base with a long plate at its front.
// Drawn for this package from a photograph (docs/likeness.md); the glove's lacing is a few lines, the maker's marks and the lettering are left out, and the long plate takes the engraving option.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** The Gold Glove Award: a gilt glove between two gilt baseballs on a pedestal over a wooden base. */
export const TROPHY_GOLD_GLOVE_AWARD = /* @__PURE__ */ defineFlat("trophy:gold-glove-award", "Gold Glove Award", "ゴールデングラブ賞", "ours", {
  metal: "gold",
  ribbon: "#9a6a38",
  front: [
    ["r", "M4 49h56l-2.4 9.6H6.4z"],
    ["r", "M21.4 38h21.2l2.2 11.2H19.2z"],
    ["m", "M10.4 46.6h43.2v2.4H10.4z"],
    ["o", "M16 9Q18 3 24 4.6Q26 2 30 3.6Q33 1.6 36 3.8Q40.6 3 41.8 8.6Q45.8 8 46.6 13Q48.6 24 44 31.6Q41.6 36 36 37.4H27Q21 36.4 18.6 31Q13.6 20 16 9Z"],
    ["t", "M23 11Q25 20 24 28M30 9Q31 19 30 29M37 11Q36 20 38 28"],
    ["e", "M17 33Q26 40 41 34", "1.4"],
    ["o", circlePath(10, 36, 5)],
    ["o", circlePath(54, 36, 5)],
    ["m", "M6.4 41.4l7.2 0 1.4 5.2H5z"],
    ["m", "M50.4 41.4l7.2 0 1.4 5.2h-10z"],
    ["m", "M16 52h32l.8 3.6H15.2z"],
    ["l", "M18 10Q19 5 23 6Q19 14 20 26Q16 20 18 10z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 53.8, w: 28, h: 3 } },
});
