// A silver basketball with grooved seams, held low in a small gold cradle of four crossed bands, over a tall flared gold trumpet etched with a diamond net, on a black ring, a gold band and a black foot. Drawn for this package
// from a photograph of the 2022 conference finals MVP trophies (docs/likeness.md): the ball is a little over four fifths of the flange's width, the cradle's bands cross just over the flange, and the lettering on the foot's band,
// the ball's valve and the etching's fine detail are left out. The Eastern trophy's twin, the Larry Bird Trophy, holds the ball on three posts as the Eastern champions' trophy does.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_BALL, LATHE_EXTRAS } from "../lathe.extras.ts";
import { NBA_TONES, TRUMPET } from "../nba.parts.ts";

const BAND = [[0, 22.9], [2.4, 22.5], [4.9, 21.5], [7.1, 20.1], [8.7, 18.6], [9.4, 17.5]] as const;

/** The Magic Johnson Trophy: the Western Conference finals MVP trophy, a silver ball in a gold cradle on a flared gold trumpet. */
export const TROPHY_MAGIC_JOHNSON_TROPHY = /* @__PURE__ */ defineLathe("trophy:magic-johnson-trophy", "Magic Johnson Trophy", "マジック・ジョンソン・トロフィー", "ours", {
  extras: LATHE_EXTRAS,
  ballExtras: LATHE_BALL,
  metal: "gold",
  tones: NBA_TONES,
  turnBox: "-3.9 0 71.7 71.7",
  tilt: 9,
  solids: [{ p: TRUMPET, decor: [["mesh", 26, 47, 7, 4, "etch", 0.28]] }, { p: [[21.2, 2.2, 1], [21.7, 3.6], [22.4, 3.9, 1], [22.4, 1.4, 1], [23.1, 1.6, 1]] }],
  handles: [35, 125, 215, 305].map((a) => ({ a, w: 0.75, pts: BAND })),
  balls: [{ kind: "plain", nba: true, cy: 12.6, r: 9.5, tone: "silver", lean: [-22, 20] }],
  plate: { y0: 56.5, y1: 59.7 },
});
