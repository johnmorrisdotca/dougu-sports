// Sumo: a pictogram of the referee's war fan, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Sumo. */
export const SPORT_SUMO = /* @__PURE__ */ defineIcon("sport:sumo", "Sumo", "相撲", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M32 3C46.4 3 55 12.6 55 24.6C55 36 45 44 38.4 46.4H25.6C19 44 9 36 9 24.6C9 12.6 17.6 3 32 3Z"],
    ["k", circ(32, 24, 9.4)],
    ["n", "M32 46.4V54"],
    ["s", "M28.6 46.4h6.8v8.2a3.4 3.4 0 0 1-6.8 0z"],
    ["k", "M29.4 58.4h5.2l1.2 4.6H28.2z"],
  ],
});
