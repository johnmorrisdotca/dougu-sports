// Medal: a ribbon with a notched end and a star hanging from it, drawn for this package, in metal, line and flat colour.
import { defineIcon, starPath } from "../emblem.shapes.ts";

/** Medal on a ribbon. */
export const AWARD_MEDAL = /* @__PURE__ */ defineIcon("award:medal", "Medal", "メダル", "ours", {
  metal: "gold",
  ribbon: "#c0392b",
  front: [
    ["r", "M21 3h22v26L32 23.4 21 29z"],
    ["e", "M26 3v22M38 3v22", "1.4"],
    ["m", "M32 27.4a2.6 2.6 0 1 1 0 5.2a2.6 2.6 0 1 1 0-5.2z"],
    ["m", starPath(32, 46, 16.4, 7)],
    ["l", "M32 34.6l3.4 8-9.4 1.4z"],
  ],
});
