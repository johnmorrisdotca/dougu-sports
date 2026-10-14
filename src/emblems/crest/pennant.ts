// A pennant on a pole, tinted by a team's colours, with the team's letters on it or a star. Drawn for this package.
import { defineFlat, starPath } from "../emblem.shapes.ts";

/** A pennant on a pole. */
export const CREST_PENNANT = /* @__PURE__ */ defineFlat("crest:pennant", "Pennant crest", "ペナント形のエンブレム", "ours", {
  metal: "flat",
  color: "#2d5a8c",
  ribbon: "#f4f0e4",
  front: [
    ["m", "M9 3h4v58H9z"],
    ["m", "M13 8L58 32 13 56z"],
    ["r", "M13 8L58 32 52 35 13 14z"],
    ["e", "M16 12.6L50.4 32 16 51.4z", "1.2"],
    ["l", "M16 13l16 8-16 4z"],
  ],
  blank: [["f", starPath(28, 33, 9, 3.8), "#ffffff"]],
  letters: [29, 33, 17],
  rim: 3,
});
