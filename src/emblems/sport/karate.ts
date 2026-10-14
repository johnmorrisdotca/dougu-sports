// Karate: a pictogram of the karate-gi, drawn for this package in a 64 by 64 box: a lighter suit than the judogi's, with three-quarter sleeves (WKF 2.2.1 j), a wide V of plain lapels, a short jacket, a belt tied low with its ends hanging
// and straight trousers. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { bar, defineIcon } from "../emblem.shapes.ts";

/** Karate. */
export const SPORT_KARATE = /* @__PURE__ */ defineIcon("sport:karate", "Karate", "空手", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M20 36H44L45.6 61H34.6L32 46L29.4 61H18.4Z"],
    ["m", "M26 6Q32 3.8 38 6L45 8.6L62.2 32.9L54.9 38.1L45.4 23L45 40H19L18.6 23L9.1 38.1L1.8 32.9L19 8.6Z"],
    ["k", "M27 5.6H37L32 20Z"],
    ["n", bar(37, 6.4, 24, 40, 3)],
    ["k", "M18.8 31H45.2V35.4H18.8Z"],
    ["k", "M28.4 29.8H35.6V36.4H28.4Z"],
    ["k", "M29.6 36L27.2 48h4L32.6 36zM34.4 36L36.8 48h-4L31.4 36z"],
  ],
});
