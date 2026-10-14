// Judo: a pictogram of the judogi, drawn for this package in a 64 by 64 box: the jacket with its sleeves hanging out and down to the wrist (a judogi has no short sleeves: IJF C1.10), the lapels crossed left over right, the belt tied in a flat knot with the two ends hanging, and the trousers.
// The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { bar, defineIcon } from "../emblem.shapes.ts";

/** Judo. */
export const SPORT_JUDO = /* @__PURE__ */ defineIcon("sport:judo", "Judo", "柔道", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M18.6 38H45.4L47.2 60H34.4L32 45.4L29.6 60H16.8Z"],
    ["m", "M26 6Q32 3.8 38 6L45 9L61 38.4L51.2 43L46.4 27L46 39H18L17.6 27L12.8 43L3 38.4L19 9Z"],
    ["k", "M27 5.6H37L32.8 16Z"],
    ["n", bar(37.2, 6.4, 24.8, 38, 4.6)],
    ["t", "M17.6 27L18 38M46.4 27L46 38M5 35.6L14 39.8M59 35.6L50 39.8"],
    ["k", "M17.8 27.6H46.2V32H17.8Z"],
    ["k", "M28 26.4H36V33H28Z"],
    ["k", "M29.4 32L26.6 46h4.4L32.6 32zM34.6 32L37.4 46h-4.4L31.4 32z"],
  ],
});
