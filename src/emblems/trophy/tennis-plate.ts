// A broad silver dish on a pedestal, with a raised rim and rings of gilt and rounded panels on its face. Drawn for this package; a generic trophy.
import { defineLathe } from "../emblem.lathe.ts";

/** A silver salver with a gilt pattern. */
export const TROPHY_TENNIS_PLATE = /* @__PURE__ */ defineLathe("trophy:tennis-plate", "Plate on a pedestal", "台付きの大皿", "ours", {
  metal: "silver",
  tilt: 36,
  tones: { gilt: "#d9a620", plain: "#9aa3ad" },
  solids: [
    {
      open: true,
      p: [[21, 29.5, 1], [23.6, 28.6], [27.6, 11, 1], [28.6, 6, 1], [40, 3.6, 1], [46, 8.6, 1], [46, 10.6, 1], [50, 10.6, 1], [50, 12, 1], [54, 12, 1]],
      decor: [["disc", 28, "gilt"], ["disc", 25.6, "main"], ["pills", 22.6, 10, 22, 3.6, "plain"], ["disc", 18.6, "gilt"], ["disc", 15.6, "main"], ["pills", 11, 4, 36, 3.6, "plain"], ["disc", 6.4, "gilt"], ["disc", 3.8, "main"]],
    },
  ],
});
