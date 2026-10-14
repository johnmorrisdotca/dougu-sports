// A heraldic shield with a band across the top, tinted by a team's colours, with the team's letters on it or a star. Drawn for this package.
import { defineFlat, starPath } from "../emblem.shapes.ts";

/** A heraldic shield with a band across the top. */
export const CREST_SHIELD = /* @__PURE__ */ defineFlat("crest:shield", "Shield crest", "盾形のエンブレム", "ours", {
  metal: "flat",
  color: "#2d5a8c",
  ribbon: "#f4f0e4",
  front: [
    ["m", "M9 5h46v23c0 15-10 24-23 30C19 52 9 43 9 28z"],
    ["r", "M9 5h46v9H9z"],
    ["e", "M12.5 8.5h39v19.5c0 12.5-8.3 20.6-19.5 26C21.8 48.6 12.5 40.5 12.5 28z", "1.4"],
    ["l", "M13 16h10L13 30z"],
  ],
  blank: [["f", starPath(32, 34, 12, 5), "#ffffff"]],
  letters: [32, 37, 24],
  rim: 3,
});
