// A dark octagonal plaque with a wide silver ring round its edge, inside the ring a silver diamond (a baseball diamond) with a gilt round medallion at its top, a plate in its middle and a pair of crossed bats at its foot.
// Drawn for this package from a photograph (docs/likeness.md); the medallion's portrait and all the lettering (the ring's, the diamond's and the plate's) are left out, and the plate takes the engraving option.
import { circlePath, defineFlat, polygon } from "../emblem.shapes.ts";

/** The Kenesaw Mountain Landis Memorial Baseball Award, the Most Valuable Player Award of each major league: a dark octagon with a silver ring and diamond, a medallion, a plate and crossed bats. */
export const TROPHY_MLB_MVP_AWARD = /* @__PURE__ */ defineFlat("trophy:mlb-mvp-award", "Baseball MVP award", "野球のMVP賞", "ours", {
  metal: "silver",
  ribbon: "#202226",
  front: [
    ["r", polygon(32, 32, 31, 8, 22.5)],
    ["e", polygon(32, 32, 27.6, 8, 22.5), "3.6"],
    ["m", "M32 11L53 32L32 53L11 32Z"],
    ["r", "M32 14.4L49.6 32L32 49.6L14.4 32Z"],
    ["f", circlePath(32, 21, 5.4), "#d4a23c"],
    ["m", "M21 31.6h22v7H21z"],
    ["m", "M24.4 45.6L28 43L40 49.2L38 51.6zM39.6 45.6L36 43L24 49.2L26 51.6z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 35.1, w: 19, h: 5 } },
});
