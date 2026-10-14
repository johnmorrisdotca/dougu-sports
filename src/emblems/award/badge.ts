// Badge: a seal with a star and two tails of ribbon, drawn for this package, in metal, line and flat colour.
import { circlePath, defineIcon, starPath } from "../emblem.shapes.ts";

/** Badge with a star. */
export const AWARD_BADGE = /* @__PURE__ */ defineIcon("award:badge", "Badge", "バッジ", "ours", {
  metal: "gold",
  ribbon: "#c0392b",
  front: [
    ["r", "M21 41L12 61l10-4.4 5.4 6.4 4.4-17zM43 41l9 20-10-4.4-5.4 6.4-4.4-17z"],
    ["o", starPath(32, 26, 24, 21, 18)],
    ["e", circlePath(32, 26, 16.6), "2"],
    ["m", starPath(32, 26, 10.6, 4.6)],
    ["l", "M17 18a17 17 0 0 1 11-9 20 20 0 0 0-11 19z"],
  ],
});
