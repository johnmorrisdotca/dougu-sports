// Basketball: a pictogram drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Basketball. */
export const SPORT_NBA = /* @__PURE__ */ defineIcon("sport:nba", "Basketball", "バスケットボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", circ(32, 32, 24)],
    ["t", "M32 8V56M8 32H56"],
    ["t", "M14 14.6Q25 32 14 49.4M50 14.6Q39 32 50 49.4"],
  ],
});
