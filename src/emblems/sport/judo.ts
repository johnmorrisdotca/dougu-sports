// Judo: a pictogram of the suit and its belt, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Judo. */
export const SPORT_JUDO = /* @__PURE__ */ defineIcon("sport:judo", "Judo", "柔道", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M23.6 8L7 36.6Q5.6 39.6 8.4 41.6L14.4 45.4Q17.2 46.8 18.8 43.8L19.4 42.6V58H31V46.6H33V58H44.6V42.6L45.2 43.8Q46.8 46.8 49.6 45.4L55.6 41.6Q58.4 39.6 57 36.6L40.4 8Q32 5.6 23.6 8Z"],
    ["n", "M25.4 7.6L36 32M38.6 7.6L28 32"],
    ["k", "M19.4 38.4H44.6V44H19.4z"],
    ["k", "M29.4 44L26 56h3.6L32.4 44zM34.6 44L38 55h-3.6L31.6 44z"],
  ],
});
