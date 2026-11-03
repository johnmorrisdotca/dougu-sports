// The George Halas Trophy: the trophy of the National Football Conference champion, drawn as one drawing with the Lamar Hunt Trophy (lathe.conference.ts). Drawn for this package from photographs (docs/likeness.md); the
// shield and the conference letters on the plate and the engraving on the base are left out.
import { defineLathe } from "../emblem.lathe.ts";
import { NFL_CONFERENCE } from "../lathe.conference.ts";

/**
 * The George Halas Trophy: an open football of polished silver, a laced ribbon in front and two curved bands behind, standing on its tip on a round flared base over a black foot.
 * @example
 * ```ts
 * import { TROPHY_GEORGE_HALAS_TROPHY } from "@johnmorrisdotca/dougu-sports";
 * console.log(TROPHY_GEORGE_HALAS_TROPHY.id, TROPHY_GEORGE_HALAS_TROPHY.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const TROPHY_GEORGE_HALAS_TROPHY = /* @__PURE__ */ defineLathe("trophy:george-halas-trophy", "George Halas Trophy", "ハラス・トロフィー", "ours", NFL_CONFERENCE);
