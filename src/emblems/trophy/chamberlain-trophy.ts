// A gold mass palming a basketball in each hand, inside a crystal net on a dark foot. Drawn for this package from the published description of the Wilt Chamberlain Trophy (docs/likeness.md);
// no freely licensed photograph was found, so approximate; the figure is mass only, the lettering is left out, and the plate takes the engraving option.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** The Wilt Chamberlain Trophy: a gold figure palming two basketballs in a crystal net. */
export const TROPHY_CHAMBERLAIN_TROPHY = /* @__PURE__ */ defineFlat("trophy:chamberlain-trophy", "Chamberlain Trophy", "チェンバレン・トロフィー", "ours", {
  metal: "silver",
  ribbon: "#2a2218",
  front: [
    ["r", "M12 49.2h40l2.6 9.6H9.4z"],
    ["m", "M13.2 8.6Q32 2.8 50.8 8.6L47.2 43.6Q32 50.2 16.8 43.6Z"],
    ["e", "M15 8.2Q32 3.4 49 8.2", "2"],
    ["f", "M26 14.2Q32.4 11.4 38.4 14.8Q41.2 24.6 38.8 36.4Q32 41.2 25.4 36Q23.2 24.2 26 14.2Z", "#c4a35a"],
    ["f", circlePath(15.6, 22.8, 6.2), "#c4a35a"],
    ["f", circlePath(48.4, 22.8, 6.2), "#c4a35a"],
    ["t", "M18.4 16L32 24L45.6 16M16.8 28L32 36L47.2 28M19.2 38L32 45L44.8 38"],
    ["m", "M17.6 53h28.8l1 4.2H16.6z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 55.2, w: 24, h: 3 } },
});
