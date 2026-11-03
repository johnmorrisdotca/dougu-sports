// International football: the pictogram of the ball with a stripe near each end on the two panels next to the laces only (IFAF Rule 1, Section 3), drawn for this package from `ball:football-ifaf`, in a 64 by 64 box.
import { defineIcon } from "../emblem.shapes.ts";
import { footballModel } from "./nfl.ts";

/**
 * American football, international rules.
 * @example
 * ```ts
 * import { SPORT_IFAF } from "@johnmorrisdotca/dougu-sports";
 * console.log(SPORT_IFAF.id, SPORT_IFAF.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const SPORT_IFAF = /* @__PURE__ */ defineIcon("sport:ifaf", "International football", "国際アメフト", "ours", footballModel("top"));
