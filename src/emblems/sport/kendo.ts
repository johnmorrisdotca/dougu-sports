// Kendo: a pictogram of the helmet, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon, ellipsePath as ell } from "../emblem.shapes.ts";

/** Kendo. */
export const SPORT_KENDO = /* @__PURE__ */ defineIcon("sport:kendo", "Kendo", "剣道", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M32 4C48 4 58 12 58 26V36Q58 44 51 48L47 48V24H17V48L13 48Q6 44 6 36V26C6 12 16 4 32 4Z"],
    ["m", "M14 49L17 59Q32 65 47 59L50 49Z"],
    ["p", ell(32, 34, 17, 18)],
    ["t", "M16 28H48M15.6 34H48.4M16.6 40H47.4M32 17V51"],
    ["t", "M13 10Q32 4 51 10M10.6 16Q32 10 53.4 16"],
  ],
});
