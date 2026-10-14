// A round badge with a ring inside its edge, tinted by a team's colours, with the team's letters on it or a star. Drawn for this package.
import { circlePath, defineFlat, starPath } from "../emblem.shapes.ts";

/** A round badge with a ring inside its edge. */
export const CREST_ROUNDEL = /* @__PURE__ */ defineFlat("crest:roundel", "Round crest", "丸形のエンブレム", "ours", {
  metal: "flat",
  color: "#2d5a8c",
  ribbon: "#f4f0e4",
  front: [
    ["o", circlePath(32, 32, 28)],
    ["r", circlePath(32, 32, 23.4)],
    ["o", circlePath(32, 32, 20.4)],
    ["e", circlePath(32, 32, 26.2), "1.4"],
    ["l", "M12 28a21 21 0 0 1 15-15 22 22 0 0 0-10 21z"],
  ],
  blank: [["f", starPath(32, 33, 13, 5.4), "#ffffff"]],
  letters: [32, 32, 24],
  rim: 3,
});
