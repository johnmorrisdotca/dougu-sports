// Karate: a pictogram of a clenched fist, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Karate. */
export const SPORT_KARATE = /* @__PURE__ */ defineIcon("sport:karate", "Karate", "空手", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M13 26Q13 14 25 14H39Q51 14 51 26V44Q51 54 41 54H25Q13 54 13 44Z"],
    ["n", "M23 14V31M32 14V31M41 14V31"],
    ["k", "M10 33H42Q47 33 47 38.6Q47 44.4 42 44.4H10Q5 44.4 5 38.6Q5 33 10 33Z"],
  ],
});
