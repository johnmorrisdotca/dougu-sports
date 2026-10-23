// A silver bowl over three bronze skaters (the centre one with an arm raised) on a tall silver block and a dark foot. Drawn for this package from a Hockey Hall of Fame collection photograph of the Jim Gregory
// General Manager of the Year Award (docs/likeness.md); the photograph is only looked at; the figures are mass only, and the shield, lettering and the row of nameplates are left out. The plate takes the engraving option.
import { circlePath, defineFlat, ellipsePath } from "../emblem.shapes.ts";

/** The Jim Gregory Trophy: a silver bowl over three bronze skaters on a tall silver block. */
export const TROPHY_GREGORY_TROPHY = /* @__PURE__ */ defineFlat("trophy:gregory-trophy", "Gregory Trophy", "グレゴリー・トロフィー", "ours", {
  metal: "silver",
  ribbon: "#1a1612",
  front: [
    ["r", "M10 52.4h44l-2 7.2H12z"],
    ["m", "M18.4 34.6h27.2v18.2H18.4z"],
    ["m", ellipsePath(32, 10.8, 18.4, 6.2)],
    ["e", ellipsePath(32, 10.8, 15.2, 4.6), "1.4"],
    ["f", "M28.6 14.2Q32.8 12.4 36.8 15.2Q38.6 21.6 36.4 28.8Q32 32.2 27.8 28.4Q26.4 20.6 28.6 14.2Z", "#8a5a32"],
    ["f", circlePath(32.2, 12.4, 2.4), "#8a5a32"],
    ["f", "M34.8 15.6L38.4 8.2L40.8 9.4L36.6 17.8Z", "#8a5a32"],
    ["f", "M18.8 18.4Q22.6 16.6 26.2 19.2Q27.6 24.6 25.8 30.8Q21.6 33.6 18.2 30.2Q16.8 23.8 18.8 18.4Z", "#8a5a32"],
    ["f", circlePath(21.8, 16.8, 2.2), "#8a5a32"],
    ["f", "M39.2 18.2Q43.2 16.4 46.8 19.2Q48.2 24.8 46.4 31Q42 33.8 38.6 30.2Q37.2 23.6 39.2 18.2Z", "#8a5a32"],
    ["f", circlePath(42.4, 16.6, 2.2), "#8a5a32"],
    ["m", "M20.4 54.8h23.2l0.8 3.2H19.6z"],
  ],
  // From behind the three skaters are still the body. The default back keeps only the metal, and that is thinner than the front.
  back: [
    ["r", "M10 52.4h44l-2 7.2H12z"],
    ["m", "M18.4 34.6h27.2v18.2H18.4z"],
    ["m", ellipsePath(32, 10.8, 18.4, 6.2)],
    ["f", "M28.6 14.2Q32.8 12.4 36.8 15.2Q38.6 21.6 36.4 28.8Q32 32.2 27.8 28.4Q26.4 20.6 28.6 14.2Z", "#8a5a32"],
    ["f", circlePath(32.2, 12.4, 2.4), "#8a5a32"],
    ["f", "M34.8 15.6L38.4 8.2L40.8 9.4L36.6 17.8Z", "#8a5a32"],
    ["f", "M18.8 18.4Q22.6 16.6 26.2 19.2Q27.6 24.6 25.8 30.8Q21.6 33.6 18.2 30.2Q16.8 23.8 18.8 18.4Z", "#8a5a32"],
    ["f", circlePath(21.8, 16.8, 2.2), "#8a5a32"],
    ["f", "M39.2 18.2Q43.2 16.4 46.8 19.2Q48.2 24.8 46.4 31Q42 33.8 38.6 30.2Q37.2 23.6 39.2 18.2Z", "#8a5a32"],
    ["f", circlePath(42.4, 16.6, 2.2), "#8a5a32"],
    ["m", "M20.4 54.8h23.2l0.8 3.2H19.6z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 56.4, w: 20, h: 2.8 } },
});
