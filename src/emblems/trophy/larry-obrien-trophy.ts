// A gold basketball over a net, on a body that is a gold hoop that narrows and flares like a net seen from the side, with a long smooth taper to a round foot. Drawn for this package from a photograph of the trophy on a table
// (docs/likeness.md); the ball is a quarter of the height, the body is wide at the hoop and narrows to a little over two thirds of that width at the foot, and the lettering and the net's strands are left out (the strands are a
// diamond net in the model).
import { defineLathe } from "../emblem.lathe.ts";

/** The Larry O'Brien Championship Trophy: a gold basketball over a hoop and a tapering net-shaped body on a round foot. */
export const TROPHY_LARRY_OBRIEN_TROPHY = /* @__PURE__ */ defineLathe("trophy:larry-obrien-trophy", "Larry O'Brien Trophy", "オブライエン・トロフィー", "ours", {
  metal: "gold",
  turnBox: "-3.2 0 70.4 70.4",
  tilt: 8,
  solids: [
    {
      p: [[24.2, 3.2, 1], [26.4, 4.4], [28, 10.2, 1], [28.7, 10.4, 1], [29.6, 9.9], [44, 7.9], [57.6, 6.1, 1], [58.3, 7.4, 1], [61, 7.8, 1]],
      decor: [["net", 30, 56, 8]],
    },
  ],
  balls: [{ kind: "basket", cy: 13.9, r: 10.7 }],
  plate: { y0: 53, y1: 58, face: 0 },
});
