// Professional wrestling: a pictogram of the ring, drawn for this package in a 64 by 64 box: the square canvas seen from a corner, a post at each corner with three ropes strung between them and the apron
// along the front edge. The metal style paints the canvas with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";

/** Professional wrestling. */
export const SPORT_PROWRESTLING = /* @__PURE__ */ defineIcon("sport:prowrestling", "Pro wrestling", "プロレス", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["m", "M6 50L58 50L47 38L17 38Z"],
    ["t", "M17 38L17 17M47 38L47 17M17 22.5L47 22.5M17 28L47 28M17 33.5L47 33.5"],
    ["k", "M6 50H58V58H6Z"],
    ["b", "M6 50L6 20M58 50L58 20"],
    ["t", "M6 26L17 22.5M6 33L17 28M6 40L17 33.5M58 26L47 22.5M58 33L47 28M58 40L47 33.5M6 26L58 26M6 33L58 33M6 40L58 40"],
    ["k", "M3.2 36H8.8V41H3.2ZM55.2 36H60.8V41H55.2Z"],
  ],
});
