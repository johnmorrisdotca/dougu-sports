// International football: a pictogram drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";
import { SPORT_NFL } from "./nfl.ts";

/** American football, international rules. */
export const SPORT_IFAF = /* @__PURE__ */ defineIcon("sport:ifaf", "International football", "国際アメフト", "ours", SPORT_NFL.model);
