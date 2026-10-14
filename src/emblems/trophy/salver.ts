// A broad gold dish with a raised rim on a low foot. Drawn for this package.
import { defineLathe } from "../emblem.lathe.ts";

/** A broad dish on a low foot, with a banded rim. */
export const TROPHY_SALVER = /* @__PURE__ */ defineLathe("trophy:salver", "Salver", "足付きの丸盆", "ours", {
  metal: "gold",
  tilt: 24,
  solids: [{ open: true, p: [[22, 30, 1], [24.4, 30, 1], [29, 22, 1], [34, 8, 1], [34, 4.8, 1], [42, 3.8, 1], [42, 9.4, 1], [46, 10.4, 1], [48, 12.6, 1], [51, 12.6, 1]], decor: [["disc", 26.4, "main"]] }],
  plate: { y0: 48.2, y1: 50.8 },
});
