// The Western Conference champions' trophy as it was given from 2001 to 2021, before it took Oscar Robertson's name: the same shape as the 2022 trophy, a silver basketball held in a cradle of crossed gold bands, but the ball has a
// grained finish, and the base is black at the top over a flared skirt of polished silver, with no gold band. Drawn for this package from the 2022 trophy's measurements (docs/likeness.md) and the published description of the
// earlier one: the grain is a fine speckle that turns with the ball, and there is no lettering. The trophy of 2022 on is `trophy:oscar-robertson-trophy`.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_BALL } from "../lathe.extras.ts";
import { NBA_TONES, WEST_BAND, westBase } from "../nba.parts.ts";

/** The Western Conference champions' trophy of 2001 to 2021: a grained silver ball in crossed gold bands on a black and polished silver base. */
export const TROPHY_NBA_WESTERN_CONFERENCE_2001 = /* @__PURE__ */ defineLathe("trophy:nba-western-conference-2001", "Western Conference Trophy", "ウェスタン・カンファレンス・トロフィー", "ours", {
  ballExtras: LATHE_BALL,
  metal: "gold",
  tones: NBA_TONES,
  box: "-2.4 0 68.7 68.7",
  turnBox: "-11.2 -0.2 86.2 86.2",
  tilt: 12,
  solids: [{ p: westBase(true) }],
  handles: [35, 125, 215, 305].map((a) => ({ a, w: 1, pts: WEST_BAND })),
  balls: [{ kind: "plain", nba: true, cy: 19.9, r: 17.4, tone: "silver", lean: [-24, 18], grain: 260 }],
  plate: { y0: 51.5, y1: 59.5 },
});
