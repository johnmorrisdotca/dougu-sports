// Shield: a shield with a bevelled face, drawn for this package, in metal, line and flat colour.
import { defineIcon } from "../emblem.shapes.ts";

/** Shield. */
export const AWARD_SHIELD = /* @__PURE__ */ defineIcon("award:shield", "Shield", "盾", "ours", {
  metal: "silver",
  front: [
    ["m", "M32 4L10 12v18c0 14 9 25 22 30 13-5 22-16 22-30V12z"],
    ["e", "M32 10.4L15.6 16.4V30c0 10.6 6.4 18.8 16.4 22.8 10-4 16.4-12.2 16.4-22.8V16.4z", "2"],
    ["l", "M17 18l13-5v38C21 46 17 38 17 30z"],
  ],
});
