// Softball: an optic-yellow ball with red stitches along the seam (88 here, which the rule leaves free).
import { SEAMED_HOME, seamedBall } from "./ball.family.seamed.ts";

export const BALL_SOFTBALL = /* @__PURE__ */ seamedBall({
  id: "ball:softball",
  en: "Softball",
  ja: "ソフトボール",
  size: { extentMm: 97.1, diameterMm: 97.1, circumferenceMm: 305.0, massG: [178.0, 198.4], rule: "WBSC Official Rules of Softball Slow Pitch 2026-2029, Appendix 3 (Ball Specifications), B. Dimensions and Specifications and 'Ball standards' table; Fast Pitch 2026-2029 Appendix 3 gives the same 12 in ball", note: "The 12 in ball (the 11 in ball is 279.5 mm round). Diameter worked out from the middle of the circumference range." },
  base: "#d8e22a",
  b: 0.4,
  view: { yaw: 18, pitch: 28, roll: -10 },
  mat: { gloss: 0.35, shade: "#4c5a10", grain: { f: 1.4, a: 0.12 } },
  home: SEAMED_HOME("softball"),
  groove: "#8a9420",
  stitch: { colour: "#d0262c", count: 88, half: 0.085, width: 0.95, lean: 0.04 },
});
