// A wide dark plaque whose face is a large silver baseball cap in profile (crown, button and bill) over a plate. Drawn for this package from public descriptions of the BBWAA Manager of the Year
// plaque (docs/likeness.md); no freely licensed photograph was found, so approximate; the lettering is left out, and the plate takes the engraving option.
import { defineFlat, ellipsePath } from "../emblem.shapes.ts";

/** The Manager of the Year Award of each major league: a dark plaque with a silver cap and a plate. */
export const TROPHY_MLB_MANAGER_AWARD = /* @__PURE__ */ defineFlat("trophy:mlb-manager-award", "Manager of the Year", "最優秀監督賞", "ours", {
  metal: "silver",
  ribbon: "#1c1e22",
  front: [
    ["r", "M6 7h52v50H6z"],
    ["e", "M9.4 10.4h45.2v43.2H9.4z", "1.6"],
    ["m", "M22 14.6Q34 8.8 46.4 15.2Q50.2 22.6 48.6 30.8Q36 35.2 21.6 31.2Q18.4 22.8 22 14.6Z"],
    ["m", "M8.6 29.2Q16.4 24.8 24.8 26.4L34.6 28.2L34.2 33.6Q20.4 35.6 9.8 32.4Z"],
    ["o", ellipsePath(34.8, 16.4, 2.6, 1.8)],
    ["t", "M24.6 18.4Q34 14.8 44.2 19.2"],
    ["m", "M14.8 48.2h34.4l1.6 6.6H13.2z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 51.6, w: 28, h: 4.6 } },
});
