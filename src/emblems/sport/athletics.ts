// Running track: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Running track. */
export const SPORT_ATHLETICS = /* @__PURE__ */ defineIcon("sport:athletics", "Running track", "陸上競技のトラック", "ours", {
  box: "-3.7 -3.7 71.4 71.4",
  metal: "flat",
  ink: true,
  front: [
  ["m", "M20 10h24a22 22 0 0 1 0 44H20a22 22 0 0 1 0-44z"],
  ["p", "M20 20h24a12 12 0 0 1 0 24H20a12 12 0 0 1 0-24z"],
  ["t", "M20 15h24a17 17 0 0 1 0 34H20a17 17 0 0 1 0-34z"],
  ],
});
