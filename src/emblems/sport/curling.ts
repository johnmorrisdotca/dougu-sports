// Curling stone: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon, ellipsePath as ell } from "../emblem.shapes.ts";

/** Curling stone. */
export const SPORT_CURLING = /* @__PURE__ */ defineIcon("sport:curling", "Curling stone", "カーリングのストーン", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["m", "M7 38c0-9 11-14 25-14s25 5 25 14v9c0 7-11 11-25 11S7 54 7 47z"],
  ["s", `${ell(32, 38, 25, 10)}`],
  ["t", "M7 44c3 5 12 8 25 8s22-3 25-8"],
  ["r", "M23 12h18a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3z"],
  ["r", "M28 21h8v9h-8z"],
  ],
});
