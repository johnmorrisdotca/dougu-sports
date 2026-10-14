// A broad strap with a large central plate and a smaller plate on each side. Drawn for this package.
import { defineFlat, ellipsePath, starPath } from "../emblem.shapes.ts";

/** A broad strap with a large central plate and a smaller plate on each side. */
export const TROPHY_BELT = /* @__PURE__ */ defineFlat("trophy:belt", "Championship belt", "チャンピオンベルト", "ours", {
  metal: "gold",
  ribbon: "#2b2f36",
  front: [
    ["r", "M2 20h60v24H2z"],
    ["o", "M7 26h11v12H7zM46 26h11v12H46z"],
    ["o", ellipsePath(32, 32, 16.5, 23)],
    ["e", ellipsePath(32, 32, 13.4, 19.8), "2"],
    ["M", starPath(32, 32, 7.5, 3.2)],
    ["l", "M22 22a14 20 0 0 1 8-9 18 22 0 0 0-8 22z"],
  ],
  rim: 3,
  engrave: { front: { x: 32, y: 32, w: 20, h: 26 } },
});
