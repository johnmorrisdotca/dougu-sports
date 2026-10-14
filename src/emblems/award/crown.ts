// Crown: three points tipped with balls over a jewelled band, drawn for this package, in metal, line and flat colour.
import { circlePath, defineIcon } from "../emblem.shapes.ts";

/** Crown. */
export const AWARD_CROWN = /* @__PURE__ */ defineIcon("award:crown", "Crown", "王冠", "ours", {
  metal: "gold",
  ribbon: "#c0392b",
  front: [
    ["m", "M8 48L5 19L20 31L32 11L44 31L59 19L56 48z"],
    ["e", "M12.4 43.4L10.6 28.6L21 37L32 19.6L43 37L53.4 28.6L51.6 43.4", "1.6"],
    ["o", `${circlePath(5, 17, 3.6)}${circlePath(32, 9, 3.8)}${circlePath(59, 17, 3.6)}`],
    ["m", "M8 50h48v8H8z"],
    ["r", `${circlePath(18, 54, 2.2)}${circlePath(32, 54, 2.2)}${circlePath(46, 54, 2.2)}`],
    ["l", "M12 24l6.4 5.2-1.6 12L13.6 41z"],
  ],
});
