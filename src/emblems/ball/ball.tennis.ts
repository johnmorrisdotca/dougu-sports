// Tennis ball: optic-yellow felt with a white strip of rubber along the seam. The felt's fuzz is the grain.
import { seamedBall } from "./ball.family.seamed.ts";

export const BALL_TENNIS = /* @__PURE__ */ seamedBall({
  id: "ball:tennis",
  en: "Tennis ball",
  ja: "テニスボール",
  size: { extentMm: 67.0, diameterMm: 67.0, massG: [56.0, 59.4], rule: "ITF Rules of Tennis, Rule 3 The Ball and Appendix I The Ball (a)-(c)" },
  base: "#d3e11f",
  b: 0.33,
  view: { yaw: 25, pitch: 40, roll: 15 },
  mat: { gloss: 0.12, shade: "#3f4a06", grain: { f: 1.8, a: 0.55, seed: 7 } },
  strip: { colour: "#f4f6e4", width: 2.7 },
});
