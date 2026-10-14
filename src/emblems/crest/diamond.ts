// A diamond with a thin diamond inside it, tinted by a team's colours, with the team's letters on it or a star. Drawn for this package.
import { defineFlat, starPath } from "../emblem.shapes.ts";

/** A diamond with a thin diamond inside it. */
export const CREST_DIAMOND = /* @__PURE__ */ defineFlat("crest:diamond", "Diamond crest", "ひし形のエンブレム", "ours", {
  metal: "flat",
  color: "#2d5a8c",
  ribbon: "#f4f0e4",
  front: [
    ["m", "M32 3L61 32 32 61 3 32z"],
    ["r", "M32 9L55 32 32 55 9 32z"],
    ["m", "M32 14L50 32 32 50 14 32z"],
    ["e", "M32 6L58 32 32 58 6 32z", "1.4"],
    ["l", "M32 14L14 32l7 0 11-11z"],
  ],
  blank: [["f", starPath(32, 33, 11, 4.6), "#ffffff"]],
  letters: [32, 32, 20],
  rim: 3,
});
