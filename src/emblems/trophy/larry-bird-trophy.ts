// A silver basketball with grooved seams on three slim gold posts over a small gold dish, over the same tall flared gold trumpet as the Western trophy, on a black ring, a gold band and a black foot. Drawn for this package from
// a photograph of the 2022 conference finals MVP trophies (docs/likeness.md); the lettering and the ball's valve are left out. The Western trophy's twin, the Magic Johnson Trophy, holds the ball in crossed bands.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_BALL, LATHE_EXTRAS } from "../lathe.extras.ts";
import { NBA_TONES, TRUMPET } from "../nba.parts.ts";

const POST = (deg: number) => ({ at: [8.6, deg] as const, p: [[18.6, 0.8, 1], [23, 0.8, 1]] as const });

/** The Larry Bird Trophy: the Eastern Conference finals MVP trophy, a silver ball on three gold posts over a flared gold trumpet. */
export const TROPHY_LARRY_BIRD_TROPHY = /* @__PURE__ */ defineLathe("trophy:larry-bird-trophy", "Larry Bird Trophy", "ラリー・バード・トロフィー", "ours", {
  extras: LATHE_EXTRAS,
  ballExtras: LATHE_BALL,
  metal: "gold",
  tones: NBA_TONES,
  box: "-0.3 0 64.6 64.6",
  turnBox: "-3.9 0 71.8 71.8",
  tilt: 11,
  solids: [
    { p: TRUMPET, decor: [["mesh", 26, 47, 7, 4, "etch", 0.28]] },
    { open: true, p: [[18.4, 7.2, 1], [19.2, 7], [21, 5.4], [22.4, 2.6], [22.9, 1.2, 1]] },
    POST(0), POST(120), POST(240),
  ],
  balls: [{ kind: "plain", nba: true, cy: 11.8, r: 9.4, tone: "silver", lean: [18, 14] }],
  plate: { y0: 56.5, y1: 59.7 },
});
