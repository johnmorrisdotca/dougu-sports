// A badge for third place: a bevelled bronze disc with its numeral. Drawn for this package.
import { definePlace } from "../emblem.medal.ts";

/**
 * A badge for third place.
 * @example
 * ```ts
 * import { MEDAL_PLACE_3 } from "@johnmorrisdotca/dougu-sports";
 * console.log(MEDAL_PLACE_3.id, MEDAL_PLACE_3.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const MEDAL_PLACE_3 = /* @__PURE__ */ definePlace("medal:place-3", "Third place badge", "3位のバッジ", 3, "bronze");
