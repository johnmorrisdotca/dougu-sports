// A silver medal on a ribbon of five stripes: a bevelled disc with a star, and a plain back. Drawn for this package; the ribbon carries no rings.
import { defineMedal } from "../emblem.medal.ts";

/**
 * A silver medal on a ribbon. Turned, it flips like a coin and shows its plain back.
 * @example
 * ```ts
 * import { MEDAL_SILVER } from "@johnmorrisdotca/dougu-sports";
 * console.log(MEDAL_SILVER.id, MEDAL_SILVER.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const MEDAL_SILVER = /* @__PURE__ */ defineMedal("medal:silver", "Silver medal", "銀メダル", "silver");
