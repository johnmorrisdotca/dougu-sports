// A silver batter finishing a swing (the mass of a cut, a long bat, no portrait) on a dark two-step base with a plate at the front. Drawn for this package from public descriptions of the Hank Aaron
// Award sculpture (docs/likeness.md); no freely licensed photograph was found, so approximate; the lettering is left out, and the plate takes the engraving option.
import { bar, circlePath, defineFlat } from "../emblem.shapes.ts";

/** The Hank Aaron Award: a silver batter swinging on a dark stepped base. */
export const TROPHY_HANK_AARON_AWARD = /* @__PURE__ */ defineFlat("trophy:hank-aaron-award", "Hank Aaron Award", "ハンク・アーロン賞", "ours", {
  metal: "silver",
  ribbon: "#1a1c20",
  front: [
    ["r", "M6 47.6h52l-2.2 11H8.2z"],
    ["r", "M16 41.2h32l2.6 6.4H13.4z"],
    ["o", circlePath(27.6, 16.4, 3.2)],
    ["m", "M22.4 20Q29.6 17.6 36.8 21.8Q39.2 28.2 37.4 35.6Q29.8 38.8 22.2 34.8Q20.6 26.8 22.4 20Z"],
    ["o", circlePath(35.4, 24.6, 2.6)],
    ["m", bar(36.2, 23.2, 48.8, 6.8, 2.2)],
    ["m", "M47.2 5.2L52.6 3.4L54.2 8.8L48.6 9.6Z"],
    ["m", "M21.8 22.4Q14.2 27.6 12.6 33.8L18.4 35Q21.6 29.4 26 25.8Z"],
    ["m", "M24.8 34.8L20.4 42.8L27.2 42.6L29.8 35.6Z"],
    ["m", "M33.2 35.4L39.6 43L44.8 41.2L36.6 34Z"],
    ["m", "M12 53.4h40l1.2 4.2H10.8z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 55.6, w: 34, h: 3.2 } },
});
