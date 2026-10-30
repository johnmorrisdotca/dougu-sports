// The WNBA championship trophy of today (the design used since 2023): a polished silver basketball, its seams cut as grooves, held up high and off to one side on three thin silver rods that lean forward from small
// collars on a low, rounded, triangular plinth. The ball is about a third of the trophy's height. Drawn for this package from photographs (docs/likeness.md) in 3D parts (lathe.ballrods.ts), so it turns; the maker's
// mark, the league's mark and every letter are left out, and the plinth's front takes the `engrave` option.
import { defineLathe } from "../emblem.lathe.ts";
import { BALL_ON_RODS } from "../lathe.ballrods.ts";

/** The WNBA Championship Trophy: a silver basketball on three leaning rods over a low triangular plinth. */
export const TROPHY_WNBA_CHAMPIONSHIP_TROPHY = /* @__PURE__ */ defineLathe("trophy:wnba-championship-trophy", "WNBA Championship Trophy", "WNBA優勝トロフィー", "ours", BALL_ON_RODS);
