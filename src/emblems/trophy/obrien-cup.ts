// A wide shallow gilt bowl with a pair of thin wire handles, on a short flared stem and a dark block, between two bronze skaters that bend forward over their sticks, standing on a long low oblong base of dark bronze and
// two wider tiers under it set with round wreaths and plates. Drawn for this package from a photograph (docs/likeness.md); it is a front view as a flat drawing, because the base is long and not round, the skaters are
// simplified to their mass, and the reliefs and the lettering are left out.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** The skater on the left as points of an outline; the one on the right is the same turned about the block. */
const SKATER: readonly (readonly [number, number])[] = [
  [11, 13.2], [14, 12.6], [15.4, 14.6], [19.8, 16.4], [22.6, 21.8], [22, 25.4], [20.4, 25.8], [19.2, 23], [18.2, 24.4], [19.2, 29.6], [23.2, 29.6], [23.2, 30.8], [15.6, 30.8], [15.6, 29.6],
  [17.4, 28.8], [16.6, 23.8], [12.6, 22.2], [7.8, 23], [3.6, 26.2], [3, 25.2], [6.4, 21.6], [10.8, 20.2], [10, 16.2],
];
const outline = (points: readonly (readonly [number, number])[], flip: boolean): string => `M${points.map(([x, y]) => `${flip ? 60.4 - x : x} ${y}`).join("L")}Z`;

/** The O'Brien Cup of the National Hockey Association and the early NHL: a gilt bowl between two bronze skaters on a long dark base. */
export const TROPHY_OBRIEN_CUP = /* @__PURE__ */ defineFlat("trophy:obrien-cup", "O'Brien Cup", "オブライエン・カップ", "ours", {
  metal: "gold",
  ribbon: "#4a3322",
  front: [
    ["r", "M2.7 30.8h53.6l1.2 1.6v10.2l-1.4 1.6H4.2L2.7 42.4z"],
    ["r", "M2.3 44.4h57.6l1.3 1.6v6.4L60 54H3.6L2.3 52.4V46z"],
    ["r", "M2.3 54.8h58.9l.2 4H2.5z"],
    ["r", outline(SKATER, false)],
    ["r", outline(SKATER, true)],
    ["r", "M24.4 18.7h14.7v11.1H24.4z"],
    ["m", "M10.5 7.2Q30.2 4.6 49.8 7.2Q47.6 13.4 38.6 14.2H22.4Q13 13.2 10.5 7.2Z"],
    ["m", "M27 14.2h6.4l1.2 2.6h-8.8zM25.2 18.7l1.6-2h6.8l1.6 2z"],
    ["e", circlePath(8.5, 47.6, 2.1), "1"],
    ["e", circlePath(30.2, 47.6, 2.1), "1"],
    ["e", circlePath(52, 47.6, 2.1), "1"],
    ["t", "M10.4 8.4Q9.2 5.4 3.8 6M50 8.4Q51.2 5.4 56.6 6"],
    ["m", "M27 21.4h6.4v4.4H27z"],
  ],
  rim: 3,
  engrave: { front: { x: 30.2, y: 23.6, w: 5.4, h: 2.6 } },
});
