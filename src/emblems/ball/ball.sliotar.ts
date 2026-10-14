// Sliotar: a cork-cored leather ball for hurling, with a raised rib along its seam.
import { seamedBall } from "./ball.family.seamed.ts";

export const BALL_SLIOTAR = /* @__PURE__ */ seamedBall({
  id: "ball:sliotar",
  en: "Sliotar",
  ja: "シリター",
  size: { extentMm: 70.5, diameterMm: 70.5, massG: [110, 116], rule: "GAA Official Guide Part 2, Rules of Specification, Rule 4.4(i)", note: "The rule gives a diameter that leaves out the raised rib." },
  base: "#efe8d4",
  b: 0.36,
  view: { yaw: 22, pitch: 34, roll: 8 },
  mat: { gloss: 0.4, shade: "#4a3a20", grain: { f: 1.3, a: 0.2 } },
  strip: { colour: "#ded4b6", width: 2.4, raised: true },
  stitch: { colour: "#8a7a58", count: 90, half: 0.05, width: 0.6, lean: 0.0 },
});
