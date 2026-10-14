// Canadian football: a pictogram drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { defineIcon } from "../emblem.shapes.ts";
import { SPORT_NFL } from "./nfl.ts";

/** Canadian football. */
export const SPORT_CFL = /* @__PURE__ */ defineIcon("sport:cfl", "Canadian football", "カナディアンフットボール", "ours", SPORT_NFL.model);
