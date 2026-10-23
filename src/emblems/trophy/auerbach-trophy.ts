// A bronze coach as one seated mass on a wide bench, a card in one hand, on a dark stepped base. Drawn for this package from the published description of the Red Auerbach Trophy (the Lloyd Lillie sculpture;
// docs/likeness.md); no freely licensed photograph was found, so approximate; the figure is mass only, no portrait and no lettering, and the plate takes the engraving option.
import { circlePath, defineFlat } from "../emblem.shapes.ts";

/** The Red Auerbach Trophy: a bronze coach seated on a bench over a dark base. */
export const TROPHY_AUERBACH_TROPHY = /* @__PURE__ */ defineFlat("trophy:auerbach-trophy", "Auerbach Trophy", "アウアーバック賞", "ours", {
  metal: "gold",
  ribbon: "#1c1a16",
  front: [
    ["r", "M6.8 49.6h50.4l-2.2 9.2H9z"],
    ["r", "M14.8 44.2h34.4l1.6 5.4H13.2z"],
    ["m", "M8.4 36.8h47.2v8.4H8.4z"],
    ["m", "M20.4 16.6Q30.4 12.4 40.6 17.8Q44.2 26.8 41.4 36.4H21.2Q18.6 26.2 20.4 16.6Z"],
    ["o", circlePath(29.2, 14.2, 4.2)],
    ["m", "M38.8 22.6h10.4v8.2H38.8z"],
    ["m", "M18.8 24.2Q12.4 26.6 10.2 30.4L16.6 32.6Q20.2 28.8 23.6 27Z"],
    ["m", "M9.6 29.4h7.4v2.2H9.6z"],
    ["m", "M21.4 36.2L18.2 44.6L28.4 44.4L30.2 36.8Z"],
    ["m", "M33.6 36.6L36.8 44.8L46.2 44.4L41.2 36.4Z"],
    ["m", "M18 54.2h28l1 3.6H17z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 56, w: 24, h: 2.8 } },
});
