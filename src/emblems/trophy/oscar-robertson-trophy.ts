// A large polished silver basketball with grooved seams, leaning, held in a cradle of crossed gold bands over a small gold dome, on a round stepped base: a black ring, a thin gold band, a flared black drum, a tall flared gold
// skirt and a black foot. Drawn for this package from a photograph of the 2022 conference champions' trophies standing side by side (docs/likeness.md): the ball is a little under three quarters of the base's width, and the
// lettering on the skirt, the ball's valve and the cradle's finer loops are left out (the skirt is a plain band that takes the engraving option). The Eastern champions' trophy, the Bob Cousy Trophy, holds the ball on posts.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_BALL } from "../lathe.extras.ts";
import { NBA_TONES, WEST_BAND, westBase } from "../nba.parts.ts";


/** The Oscar Robertson Trophy: the Western Conference champions' trophy, a silver ball in crossed gold bands on a round black and gold base. */
export const TROPHY_OSCAR_ROBERTSON_TROPHY = /* @__PURE__ */ defineLathe("trophy:oscar-robertson-trophy", "Oscar Robertson Trophy", "オスカー・ロバートソン・トロフィー", "ours", {
  ballExtras: LATHE_BALL,
  metal: "gold",
  tones: NBA_TONES,
  box: "-2.4 0 68.7 68.7",
  turnBox: "-11.2 -0.2 86.2 86.2",
  tilt: 12,
  solids: [{ p: westBase(false) }],
  handles: [35, 125, 215, 305].map((a) => ({ a, w: 1, pts: WEST_BAND })),
  balls: [{ kind: "plain", nba: true, cy: 19.9, r: 17.4, tone: "silver", lean: [-24, 18] }],
  plate: { y0: 51.5, y1: 59.5 },
});
