// A silver football in a kicking position, tilted nose up and to the right, on a three-sided pylon that is narrow under the ball and widens to a flat foot, with a plain face to the front for the plate. Drawn for this package from
// a clear rendering and a photograph of the trophy in a showcase (docs/likeness.md); the shield and the lettering on the pylon are left out, and the foot's three arched cut-outs are a plain edge.
import { defineLathe } from "../emblem.lathe.ts";

/** The Vince Lombardi Trophy: a silver football tilted over a tall three-sided pylon that widens to its foot. */
export const TROPHY_LOMBARDI_TROPHY = /* @__PURE__ */ defineLathe("trophy:lombardi-trophy", "Lombardi Trophy", "ロンバルディ・トロフィー", "ours", {
  metal: "silver",
  turnBox: "-4.8 0 73.5 73.5",
  tilt: 8,
  solids: [{ sides: 3, turn: -60, p: [[23.9, 5, 1], [61, 12, 1]] }],
  balls: [{ kind: "football", cx: 32, cy: 13.4, r: 6.8, ry: 13, rot: 40 }],
  plate: { y0: 40, y1: 47, face: 0 },
});
