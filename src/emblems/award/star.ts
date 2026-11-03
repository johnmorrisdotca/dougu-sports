// Star: a five-pointed star with a bevelled face, drawn for this package, in metal, line and flat colour.
import { defineIcon, starPath } from "../emblem.shapes.ts";

/**
 * Star.
 * @example
 * ```ts
 * import { AWARD_STAR } from "@johnmorrisdotca/dougu-sports";
 * console.log(AWARD_STAR.id, AWARD_STAR.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const AWARD_STAR = /* @__PURE__ */ defineIcon("award:star", "Star", "星", "ours", {
  metal: "gold",
  front: [
    ["m", starPath(32, 34, 29, 12.4)],
    ["e", starPath(32, 35, 18.6, 7.8), "1.8"],
    ["l", "M32 8.4l5 14.6-5 3.6-5-3.6z"],
  ],
});
