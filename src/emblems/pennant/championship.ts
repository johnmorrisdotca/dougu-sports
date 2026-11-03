// A championship pennant: a long triangle of felt on a dowel, stitched round its edge, with the words and the year in felt letters. Drawn for this package: generic, no team's or league's design.
import { definePennant } from "../emblem.pennant.ts";

/**
 * A championship pennant.
 * @example
 * ```ts
 * import { PENNANT_CHAMPIONSHIP } from "@johnmorrisdotca/dougu-sports";
 * console.log(PENNANT_CHAMPIONSHIP.id, PENNANT_CHAMPIONSHIP.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const PENNANT_CHAMPIONSHIP = /* @__PURE__ */ definePennant("pennant:championship", "Championship pennant", "優勝ペナント");
