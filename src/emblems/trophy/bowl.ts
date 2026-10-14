// A round gold bowl on a short stem and a foot. Drawn for this package.
import { defineLathe } from "../emblem.lathe.ts";

/** A round bowl on a short foot. */
export const TROPHY_BOWL = /* @__PURE__ */ defineLathe("trophy:bowl", "Bowl", "ボウル", "ours", {
  metal: "gold",
  turnBox: "-6.7 -9.2 77.4 77.4",
  solids: [{ open: true, p: [[16, 25, 1], [19, 24.8], [30, 15], [38, 7, 1], [38, 4.6, 1], [46, 3.6, 1], [46, 9, 1], [49, 9, 1], [49, 13.4, 1], [54, 13.4, 1]], decor: [["ring", 21]] }],
  plate: { y0: 49.2, y1: 53.8 },
});
