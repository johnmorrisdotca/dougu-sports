// A badge for first place: a bevelled gold disc with its numeral. Drawn for this package.
import { definePlace } from "../emblem.medal.ts";

/**
 * A badge for first place.
 * @example
 * ```ts
 * import { MEDAL_PLACE_1 } from "@johnmorrisdotca/dougu-sports";
 * console.log(MEDAL_PLACE_1.id, MEDAL_PLACE_1.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const MEDAL_PLACE_1 = /* @__PURE__ */ definePlace("medal:place-1", "First place badge", "1位のバッジ", 1, "gold");
