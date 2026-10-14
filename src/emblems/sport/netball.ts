// Ball and hoop: a pictogram of the equipment, drawn for this package, in a 64 by 64 box. The metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon, ellipsePath as ell } from "../emblem.shapes.ts";

/** Ball and hoop. */
export const SPORT_NETBALL = /* @__PURE__ */ defineIcon("sport:netball", "Ball and hoop", "ネットボールのゴール", "ours", {
  metal: "flat",
  ink: true,
  front: [
  ["n", "M46 62V16"],
  ["p", ell(46, 14, 11, 3.4)],
  ["t", "M35 14l3 13h16l3-13M42 15l2 12M50 15l-2 12M37 21h18"],
  ["m", circ(19, 42, 13)],
  ["t", "M6 42h26M19 29v26M10 34q9 8 18 0M10 50q9-8 18 0"],
  ],
});
