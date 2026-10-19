// A polished silver basketball held up by two thick silver tubes that slant away from it to a low slab of pale stone, the whole leaning like a swung club. Drawn for this package from a photograph of the trophy carried by a
// player (docs/likeness.md), so approximate: the ball's seams are the engine's basketball seams, the tubes are two parallel curves in one plane, and the base is a plain square slab (the real one is a wedge); no lettering.
import { defineLathe } from "../emblem.lathe.ts";

/** The WNBA Championship Trophy: a silver basketball on two slanting tubes over a low slab. */
export const TROPHY_WNBA_CHAMPIONSHIP_TROPHY = /* @__PURE__ */ defineLathe("trophy:wnba-championship-trophy", "WNBA Championship Trophy", "WNBA優勝トロフィー", "ours", {
  metal: "silver",
  box: "-0.4 0 64.7 64.7",
  turnBox: "-8.1 0 80 80",
  tones: { stone: "#cfd3d8" },
  tilt: 12,
  solids: [{ sides: 4, turn: -45, tone: "stone", p: [[53.5, 17, 1, "stone"], [60.5, 19, 1, "stone"]] }],
  handles: [
    { a: 90, w: 3.4, pts: [[-8, 22], [-2, 33], [6, 44], [14, 53.6]] },
    { a: 90, w: 3.4, pts: [[-2, 20], [4, 31], [12, 42], [19, 51.4]] },
  ],
  balls: [{ kind: "basket", cx: 26, cy: 13.5, r: 10.5 }],
  plate: { y0: 55, y1: 60, tone: "stone", face: 0 },
});
