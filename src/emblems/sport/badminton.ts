// Shuttlecock: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Shuttlecock. */
export const SPORT_BADMINTON = /* @__PURE__ */ defineIcon("sport:badminton", "Shuttlecock", "シャトルコック", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["p", "M24 44L12 8q20-6 40 0L40 44z"],
  ["t", "M28 43L19 9M32 44V7M36 43l9-34"],
  ["t", "M16 24q16-5 32 0"],
  ["m", "M24 44h16a8 8 0 0 1-16 0z"],
  ],
});
