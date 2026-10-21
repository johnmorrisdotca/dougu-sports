// MMA: a pictogram of a cage seen from above, drawn for this package in a 64 by 64 box: an eight-sided floor inside a fence of diamond mesh. It is a generic cage: no promotion's mark and
// no name on it. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon, polygon } from "../emblem.shapes.ts";

/** Mixed martial arts. */
export const SPORT_MMA = /* @__PURE__ */ defineIcon("sport:mma", "MMA", "総合格闘技", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", polygon(32, 32, 29, 8, 22.5)],
    ["t", "M5.2 22.8L22.8 5.2M5.2 41.2L22.8 58.8M5.2 31.8L31.8 5.2M5.2 32.2L31.8 58.8M5.2 40.8L40.8 5.2M5.2 23.2L40.8 58.8M8.6 46.4L46.4 8.6M8.6 17.6L46.4 55.4M13.1 50.9L50.9 13.1M13.1 13.1L50.9 50.9M17.6 55.4L55.4 17.6M17.6 8.6L55.4 46.4M23.2 58.8L58.8 23.2M23.2 5.2L58.8 40.8M32.2 58.8L58.8 32.2M32.2 5.2L58.8 31.8M41.2 58.8L58.8 41.2M41.2 5.2L58.8 22.8"],
    ["n", polygon(32, 32, 29, 8, 22.5)],
  ],
});
