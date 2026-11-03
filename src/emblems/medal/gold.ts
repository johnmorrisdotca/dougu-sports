// A gold medal on a ribbon of five stripes: a bevelled disc with a star, and a plain back. Drawn for this package; the ribbon carries no rings.
import { defineMedal } from "../emblem.medal.ts";

/**
 * A gold medal on a ribbon. Turned, it flips like a coin and shows its plain back.
 * @example
 * ```ts
 * import { MEDAL_GOLD } from "@johnmorrisdotca/dougu-sports";
 * console.log(MEDAL_GOLD.id, MEDAL_GOLD.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const MEDAL_GOLD = /* @__PURE__ */ defineMedal("medal:gold", "Gold medal", "金メダル", "gold");
