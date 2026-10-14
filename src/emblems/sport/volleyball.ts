// Volleyball: a pictogram of the ball, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Volleyball. */
export const SPORT_VOLLEYBALL = /* @__PURE__ */ defineIcon("sport:volleyball", "Volleyball", "バレーボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", circ(32, 32, 24)],
    ["t", "M32 8.4Q26 28 12.6 46M8.4 30Q28 26 47.6 14.8M55.6 34Q38 36 23.4 53.4"],
  ],
});
