// Baseball: a white leather ball with 108 red double stitches in V's along the figure-eight seam.
import { SEAMED_HOME, seamedBall } from "./ball.family.seamed.ts";

export const BALL_BASEBALL = /* @__PURE__ */ seamedBall({
  id: "ball:baseball",
  en: "Baseball",
  ja: "野球のボール",
  size: { extentMm: 73.8, diameterMm: 73.8, circumferenceMm: 231.77, massG: [141.75, 148.83], rule: "Official Baseball Rules, Rule 3.01 The Ball", note: "Diameter worked out from the middle of the circumference range." },
  base: "#f4f0e6",
  fixed: true,
  b: 0.4,
  view: { yaw: 18, pitch: 28, roll: -10 },
  mat: { gloss: 0.3, shade: "#4a3a2a", grain: { f: 1.4, a: 0.12 } },
  home: SEAMED_HOME("baseball"),
  groove: "#8a7a62",
  stitch: { colour: "#c4262e", count: 108, half: 0.075, width: 0.85, lean: 0.032 },
});
