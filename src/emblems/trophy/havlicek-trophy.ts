// A gold leaping mass (a running jumper) inside a crystal net on a dark foot. Drawn for this package from the published description of the John Havlicek Trophy (docs/likeness.md);
// no freely licensed photograph was found, so approximate; the figure is mass only, the lettering is left out, and the plate takes the engraving option.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** The John Havlicek Trophy: a gold runner shooting a jumper in a crystal net. */
export const TROPHY_HAVLICEK_TROPHY = /* @__PURE__ */ defineFlat("trophy:havlicek-trophy", "Havlicek Trophy", "ハブリチェック賞", "ours", {
  metal: "silver",
  ribbon: "#2a2218",
  front: [
    ["r", "M12 49.2h40l2.6 9.6H9.4z"],
    ["m", "M13.2 8.6Q32 2.8 50.8 8.6L47.2 43.6Q32 50.2 16.8 43.6Z"],
    ["e", "M15 8.2Q32 3.4 49 8.2", "2"],
    ["f", "M20.8 22.4Q28.6 14.2 38.4 12.6L47.2 10.2L44.6 16.8L40.2 28.6L48.4 38.2L40.8 40.6L32.6 32.4L24.2 40.8L16.6 36.4L26.4 28.8Z", "#c4a35a"],
    ["f", circlePath(48.6, 9.6, 3.4), "#c4a35a"],
    ["t", "M18.4 16L32 24L45.6 16M16.8 28L32 36L47.2 28M19.2 38L32 45L44.8 38"],
    ["m", "M17.6 53h28.8l1 4.2H16.6z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 55.2, w: 24, h: 3 } },
});
