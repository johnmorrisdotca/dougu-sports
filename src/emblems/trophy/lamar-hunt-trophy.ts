// The Lamar Hunt Trophy: the trophy of the American Football Conference champion, the same drawing as the George Halas Trophy (lathe.conference.ts), because the two trophies are one design. Drawn for this package from
// photographs (docs/likeness.md); the shield and the conference letters on the plate and the engraving on the base are left out.
import { defineLathe } from "../emblem.lathe.ts";
import { NFL_CONFERENCE } from "../lathe.conference.ts";

/** The Lamar Hunt Trophy: an open football of polished silver, a laced ribbon in front and two curved bands behind, standing on its tip on a round flared base over a black foot. */
export const TROPHY_LAMAR_HUNT_TROPHY = /* @__PURE__ */ defineLathe("trophy:lamar-hunt-trophy", "Lamar Hunt Trophy", "ハント・トロフィー", "ours", NFL_CONFERENCE);
