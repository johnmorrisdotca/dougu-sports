// A tall black board that is a little wider at its foot, with a silver baseball bat laid across it from the top left to the foot at the right, an oval badge near the top and a plate at the bottom. Drawn for this package from
// photographs of the award being carried (docs/likeness.md); the badge and the plate carry no lettering, and the plate takes the engraving option.
import { bar, defineFlat, ellipsePath } from "../emblem.shapes.ts";

/** The Silver Slugger Award: a silver bat across a tall black board with an oval badge and a plate. */
export const TROPHY_SILVER_SLUGGER_AWARD = /* @__PURE__ */ defineFlat("trophy:silver-slugger-award", "Silver Slugger Award", "シルバースラッガー賞", "ours", {
  metal: "silver",
  ribbon: "#17181c",
  front: [
    ["r", "M22 6L48 8.4L53.6 58.4L16.4 60.6Z"],
    ["e", "M24.4 9.2L46 11L50.6 55.6L19.6 57.6Z", "1"],
    ["m", ellipsePath(37, 14.6, 8.6, 5.4)],
    ["r", ellipsePath(37, 14.6, 6.2, 3.4)],
    ["m", bar(8, 3.6, 55, 53.6, 3.4)],
    ["m", bar(6.4, 2, 9.2, 5, 4.2)],
    ["m", "M22 44h22l1.6 12.2H23.6z"],
  ],
  rim: 3,
  engrave: { front: { x: 34, y: 50, w: 17, h: 8 } },
});
