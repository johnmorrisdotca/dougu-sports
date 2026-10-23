// A tall dark plaque with a raised silver top, a large oval medallion holding a filled batter (mass only, no portrait) and a plate at the foot. Drawn for this package from public descriptions of the
// modern Jackie Robinson Award plaque (docs/likeness.md); no freely licensed photograph was found, so approximate; the medallion's portrait and all lettering are left out, and the plate takes the engraving option.
import { bar, circlePath, defineFlat, ellipsePath } from "../emblem.shapes.ts";

/** The Jackie Robinson Award, Major League Baseball's Rookie of the Year Award of each league: a dark plaque with an oval medallion and a batter. */
export const TROPHY_JACKIE_ROBINSON_AWARD = /* @__PURE__ */ defineFlat("trophy:jackie-robinson-award", "Jackie Robinson Award", "ジャッキー・ロビンソン賞", "ours", {
  metal: "silver",
  ribbon: "#1e2024",
  front: [
    ["r", "M12 4.5Q23 3.2 32 3.2Q41 3.2 52 4.5L52.6 56Q52.6 61.4 46 61.4H18Q11.4 61.4 11.4 56Z"],
    ["e", "M15 7.4Q23.6 6.2 32 6.2Q40.4 6.2 49 7.4", "1.4"],
    ["m", ellipsePath(32, 27, 16.2, 18.4)],
    ["r", ellipsePath(32, 27, 13.4, 15.4)],
    ["o", circlePath(30.6, 18.6, 3.1)],
    ["m", "M26.2 22.2Q31.2 20.6 36.8 23.4L38.2 36.2Q32.4 38.4 25.8 35.8Z"],
    ["m", "M26.4 35.4L23.6 43.8Q26.2 45 29.2 43.6L30.8 36.2Z"],
    ["m", "M33.4 36.4L35.8 44.2Q38.8 45.2 41.2 43.6L37.4 35.8Z"],
    ["m", bar(36.8, 16.4, 45.6, 38.6, 2.2)],
    ["m", "M18.4 48.6h27.2l2 7.4H16.4z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 52.4, w: 22, h: 5 } },
});
