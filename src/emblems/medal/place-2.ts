// A badge for second place: a bevelled silver disc with its numeral. Drawn for this package.
import { definePlace } from "../emblem.medal.ts";

/**
 * A badge for second place.
 * @example
 * ```ts
 * import { MEDAL_PLACE_2 } from "@johnmorrisdotca/dougu-sports";
 * console.log(MEDAL_PLACE_2.id, MEDAL_PLACE_2.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const MEDAL_PLACE_2 = /* @__PURE__ */ definePlace("medal:place-2", "Second place badge", "2位のバッジ", 2, "silver");
