// The Eastern Conference champions' trophy as it was given from 2001 to 2021, before it took Bob Cousy's name: the same shape as the 2022 trophy, a large ball on three slim gold posts over a small dish, but the ball is a pale
// frosted silver with a grained finish, and the round base is black with a plate and a lower drum of polished silver in place of the gold. Drawn for this package from the 2022 trophy's measurements (docs/likeness.md) and the
// published description of the earlier one; there is no lettering. The trophy of 2022 on is `trophy:bob-cousy-trophy`.
import { defineLathe } from "../emblem.lathe.ts";
import { LATHE_BALL } from "../lathe.extras.ts";
import { NBA_TONES, eastBase, eastTop } from "../nba.parts.ts";

/** The Eastern Conference champions' trophy of 2001 to 2021: a frosted grained ball on three gold posts over a black and polished silver base. */
export const TROPHY_NBA_EASTERN_CONFERENCE_2001 = /* @__PURE__ */ defineLathe("trophy:nba-eastern-conference-2001", "Eastern Conference Trophy", "イースタン・カンファレンス・トロフィー", "ours", {
  ballExtras: LATHE_BALL,
  metal: "gold",
  tones: NBA_TONES,
  box: "-2.3 0 68.6 68.6",
  turnBox: "-10.5 -1.1 85 85",
  tilt: 13,
  solids: [{ p: eastBase(true) }, ...eastTop()],
  balls: [{ kind: "plain", nba: true, cy: 19.2, r: 17.3, tone: "frost", lean: [20, -16], grain: 260 }],
  plate: { y0: 49, y1: 57 },
});
