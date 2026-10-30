// A large polished silver basketball with grooved seams on three slim gold posts over a small gold dish, on a round stepped base: a gold plate, three black tiers, a tall plain gold drum and a black foot. Drawn for this package
// from a photograph of the 2022 conference champions' trophies standing side by side (docs/likeness.md): the posts stand at the corners of a triangle a little wider than the dish, and the lettering on the drum and the ball's
// valve are left out (the drum is a plain band that takes the engraving option). The Western champions' trophy, the Oscar Robertson Trophy, holds the ball in crossed bands.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_BALL } from "../lathe.extras.ts";
import { NBA_TONES, eastBase, eastTop } from "../nba.parts.ts";

/** The Bob Cousy Trophy: the Eastern Conference champions' trophy, a silver ball on three gold posts over a round black and gold base. */
export const TROPHY_BOB_COUSY_TROPHY = /* @__PURE__ */ defineLathe("trophy:bob-cousy-trophy", "Bob Cousy Trophy", "ボブ・クージー・トロフィー", "ours", {
  ballExtras: LATHE_BALL,
  metal: "gold",
  tones: NBA_TONES,
  box: "-2.3 0 68.6 68.6",
  turnBox: "-10.5 -1.1 85 85",
  tilt: 13,
  solids: [{ p: eastBase(false) }, ...eastTop()],
  balls: [{ kind: "plain", nba: true, cy: 19.2, r: 17.3, tone: "silver", lean: [20, -16] }],
  plate: { y0: 49, y1: 57 },
});
