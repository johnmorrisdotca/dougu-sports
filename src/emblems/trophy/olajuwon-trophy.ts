// A gold defender (wide stance, one arm up) as one mass inside a crystal net on a dark foot. Drawn for this package from the published description of the Hakeem Olajuwon Trophy (docs/likeness.md);
// no freely licensed photograph was found, so approximate; the figure is mass only, the lettering is left out, and the plate takes the engraving option.
import { defineFlat } from "../emblem.shapes.ts";

/** The Hakeem Olajuwon Trophy: a gold defender in a crystal net on a dark foot. */
export const TROPHY_OLAJUWON_TROPHY = /* @__PURE__ */ defineFlat("trophy:olajuwon-trophy", "Olajuwon Trophy", "オラジュワン・トロフィー", "ours", {
  metal: "silver",
  ribbon: "#2a2218",
  front: [
    ["r", "M12 49.2h40l2.6 9.6H9.4z"],
    ["m", "M13.2 8.6Q32 2.8 50.8 8.6L47.2 43.6Q32 50.2 16.8 43.6Z"],
    ["e", "M15 8.2Q32 3.4 49 8.2", "2"],
    ["f", "M22.4 14.8Q32 10.6 41.6 15.2L46.8 12.4L44.2 20.6L40.4 34.8L46.2 43.2L36.4 42.4L32 36.2L27.6 42.4L17.8 43.2L23.6 34.8L19.6 20.6L17.2 12.8Z", "#c4a35a"],
    ["t", "M18.4 16L32 24L45.6 16M16.8 28L32 36L47.2 28M19.2 38L32 45L44.8 38"],
    ["m", "M17.6 53h28.8l1 4.2H16.6z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 55.2, w: 24, h: 3 } },
});
