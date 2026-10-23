// A gilt sculpture of a pitcher in a fireman's helmet (wide brim under a dome), mid-throw with the front knee up, on a two-tier wooden pedestal with a plate at the foot. Drawn for this package from
// public descriptions of the Rolaids Relief Man Award, the "fireman" trophy (docs/likeness.md); no freely licensed photograph was found, so approximate; the figure is mass only, the lettering is left
// out, and the plate takes the engraving option. The sponsor's name is not in the id.
import { circlePath, defineFlat, ellipsePath } from "../emblem.shapes.ts";

/** The Relief Man Award: a gilt pitcher in a fire helmet on a wooden pedestal. */
export const TROPHY_RELIEF_MAN_AWARD = /* @__PURE__ */ defineFlat("trophy:relief-man-award", "Relief Man Award", "リリーフマン賞", "ours", {
  metal: "gold",
  ribbon: "#8a5a30",
  front: [
    ["r", "M12 46h40l3.2 12.4H8.8z"],
    ["r", "M20 39.6h24l2.4 6.4H17.6z"],
    ["m", ellipsePath(32, 14.8, 13.6, 3.6)],
    ["m", "M23.2 8.2Q32 3.6 41.2 8.8Q43.4 13.6 41.6 16.8Q32 20.2 22.8 16.4Q21.2 12.2 23.2 8.2Z"],
    ["m", "M26.4 17.6Q32 16.2 37.8 18.2Q40.2 22.6 39.4 31.4Q32.2 35.6 24.8 31.8Q23.4 24.2 26.4 17.6Z"],
    ["m", "M37.6 21.2Q47.2 15.6 53.4 13.2L51.2 17.6Q44.6 21.8 39.2 26.8Z"],
    ["o", circlePath(54.2, 12.8, 2.2)],
    ["m", "M24.6 21.4Q16.8 26.4 13.2 32.6L18.4 34.2Q22.2 28.6 27.2 25.2Z"],
    ["m", "M26.8 31.6L22.2 41.4L28.6 41.2L31.2 33.2Z"],
    ["m", "M33.4 32.4L39.6 28.6L43.4 38.8L37.2 40.8Z"],
    ["m", "M14.4 53.2h35.2l1.4 4.2H13z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 55.4, w: 30, h: 3.2 } },
});
