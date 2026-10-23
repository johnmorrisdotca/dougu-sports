// A bronze mass breaking out of a rock and reaching for a crystal basketball, on a five-sided base. Drawn for this package from the league's published description of the Michael Jordan Trophy
// (docs/likeness.md); no freely licensed photograph was found, so approximate; the figure is mass only (the namesake asked that it not be a likeness of him), and the lettering is left out. The plate takes the engraving option.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** The Michael Jordan Trophy: a bronze mass reaching from a rock for a crystal basketball. */
export const TROPHY_MICHAEL_JORDAN_TROPHY = /* @__PURE__ */ defineFlat("trophy:michael-jordan-trophy", "Michael Jordan Trophy", "ジョーダン・トロフィー", "ours", {
  metal: "gold",
  ribbon: "#2a241c",
  front: [
    ["r", "M18 47.4L32 43.6L46 47.4L42.6 59.2H21.4Z"],
    ["r", "M10.4 34.8Q20 28.6 32 31.2Q46 28.2 53.6 36.4Q54.8 44.6 48.4 49.2H15.2Q9.6 43.2 10.4 34.8Z"],
    ["o", circlePath(38.6, 10.4, 5.2)],
    ["m", "M22.4 18.6Q32.6 12.8 42.2 19.4Q45.4 27.8 41.6 36.8Q30.8 41.6 21.2 36.2Q19.4 26.4 22.4 18.6Z"],
    ["o", circlePath(30.4, 15.2, 4)],
    ["m", "M38.2 18.4Q44.8 14.2 48.6 11.6L46.2 16.2Q42 20.4 38.8 24.8Z"],
    ["m", "M22.8 36.2L18.6 42.8Q14.8 40.6 13.2 44.2L22.4 46.2L26.8 37.6Z"],
    ["m", "M34.6 36.8L39.8 44.6Q45.2 42.4 47.6 46L37.8 47.2L32.4 38Z"],
    ["m", "M20.8 54.6h22.4l0.8 3H20z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 56.2, w: 20, h: 2.6 } },
});
