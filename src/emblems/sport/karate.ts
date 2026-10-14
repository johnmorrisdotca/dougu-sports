// Karate: a pictogram of a clenched fist seen from the front, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Karate. */
export const SPORT_KARATE = /* @__PURE__ */ defineIcon("sport:karate", "Karate", "空手", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M14 30V21a4.5 4.5 0 0 1 9 0v9zM23 30V17a4.5 4.5 0 0 1 9 0v13zM32 30V17a4.5 4.5 0 0 1 9 0v13zM41 30V21a4.5 4.5 0 0 1 9 0v9z"],
    ["m", "M14 28H50V46Q50 59 37 59H27Q14 59 14 46Z"],
    ["m", "M19 34H45a4.4 4.4 0 0 1 0 8.8H19a4.4 4.4 0 0 1 0-8.8z"],
    ["t", "M16 50Q32 55 48 50"],
  ],
});
