// Judo: a pictogram of the judogi, drawn for this package in a 64 by 64 box: the jacket with its sleeves out, the lapels crossed left over right, the belt tied in a flat knot with the two ends hanging, and the trousers.
// The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { bar, defineIcon } from "../emblem.shapes.ts";

/** Judo. */
export const SPORT_JUDO = /* @__PURE__ */ defineIcon("sport:judo", "Judo", "柔道", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M18.6 38H45.4L47.2 60H34.4L32 45.4L29.6 60H16.8Z"],
    ["m", "M26 6Q32 3.8 38 6L45 9L60.4 23L56.6 30.4L46.4 26.2L46 39H18L17.6 26.2L7.4 30.4L3.6 23L19 9Z"],
    ["k", "M27 5.6H37L32.8 16Z"],
    ["n", bar(37.2, 6.4, 24.8, 38, 4.6)],
    ["t", "M17.6 26.2L18 38M46.4 26.2L46 38"],
    ["k", "M17.8 27.6H46.2V32H17.8Z"],
    ["k", "M28 26.4H36V33H28Z"],
    ["k", "M29.4 32L26.6 46h4.4L32.6 32zM34.6 32L37.4 46h-4.4L31.4 32z"],
  ],
});
