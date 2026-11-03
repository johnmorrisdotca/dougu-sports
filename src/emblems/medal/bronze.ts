// A bronze medal on a ribbon of five stripes: a bevelled disc with a star, and a plain back. Drawn for this package; the ribbon carries no rings.
import { defineMedal } from "../emblem.medal.ts";

/**
 * A bronze medal on a ribbon. Turned, it flips like a coin and shows its plain back.
 * @example
 * ```ts
 * import { MEDAL_BRONZE } from "@johnmorrisdotca/dougu-sports";
 * console.log(MEDAL_BRONZE.id, MEDAL_BRONZE.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const MEDAL_BRONZE = /* @__PURE__ */ defineMedal("medal:bronze", "Bronze medal", "銅メダル", "bronze");
