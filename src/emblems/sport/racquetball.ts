// Racquetball racket and ball: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Racquetball racket and ball. */
export const SPORT_RACQUETBALL = /* @__PURE__ */ defineIcon("sport:racquetball", "Racquetball racket", "ラケットボールのラケット", "ours", {
  box: "-0.3 0 64.6 64.6",
  metal: "flat",
  ink: true,
  front: [
  ["p", "M27 4c11 0 16 7 16 16s-5 15-12 18v5h-8v-5C16 35 11 29 11 20S16 4 27 4z"],
  ["t", "M27 4v34M20 6v30M34 6v30M12 20h30M15 11h24M15 29h24"],
  ["s", "M23 43h8v16a4 4 0 0 1-8 0z"],
  ["m", circ(50, 49, 9)],
  ],
});
