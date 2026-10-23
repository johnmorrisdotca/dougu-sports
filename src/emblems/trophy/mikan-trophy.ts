// A gold mass in a layup (one arm up at the hoop) inside a crystal net on a dark foot. Drawn for this package from the published description of the George Mikan Trophy (docs/likeness.md);
// no freely licensed photograph was found, so approximate; the figure is mass only, the lettering is left out, and the plate takes the engraving option.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** The George Mikan Trophy: a gold figure in a layup inside a crystal net. */
export const TROPHY_MIKAN_TROPHY = /* @__PURE__ */ defineFlat("trophy:mikan-trophy", "Mikan Trophy", "マイカン・トロフィー", "ours", {
  metal: "silver",
  ribbon: "#2a2218",
  front: [
    ["r", "M12 49.2h40l2.6 9.6H9.4z"],
    ["m", "M13.2 8.6Q32 2.8 50.8 8.6L47.2 43.6Q32 50.2 16.8 43.6Z"],
    ["e", "M15 8.2Q32 3.4 49 8.2", "2"],
    ["f", "M24.6 20.4Q33.2 16.8 40.8 21.6Q43.6 30.2 40.2 38.8Q32.4 43.2 24.8 38.2Q22.6 28.6 24.6 20.4Z", "#c4a35a"],
    ["f", "M30.8 18.4Q28.2 11.6 26.4 7.2L32.6 8.4Q36.8 14.2 38.2 20.8Z", "#c4a35a"],
    ["f", circlePath(26.8, 6.8, 3.6), "#c4a35a"],
    ["f", "M26.4 37.6L21.2 44.8L30.4 45L33.2 38.4Z", "#c4a35a"],
    ["f", "M36.8 37.2L44.6 30.4L48.2 40.2L40.4 43.6Z", "#c4a35a"],
    ["t", "M18.4 16L32 24L45.6 16M16.8 28L32 36L47.2 28M19.2 38L32 45L44.8 38"],
    ["m", "M17.6 53h28.8l1 4.2H16.6z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 55.2, w: 24, h: 3 } },
});
