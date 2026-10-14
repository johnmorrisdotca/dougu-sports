// Padel ball: a yellow felt ball a little larger than a tennis ball's, with a seam of its own proportions.
import { seamedBall } from "./ball.family.seamed.ts";

export const BALL_PADEL = /* @__PURE__ */ seamedBall({
  id: "ball:padel",
  en: "Padel ball",
  ja: "パデルボール",
  size: { extentMm: 65.6, diameterMm: 65.6, massG: [56.0, 59.4], rule: "FIP Rules of Padel, 'The Ball' article (as extracted in FIP Game Ball Certification Process, section B) and Appendix 'Technical specifications of the padel ball'" },
  base: "#ecdc2c",
  b: 0.36,
  view: { yaw: 25, pitch: 40, roll: 15 },
  mat: { gloss: 0.1, shade: "#5a4d06", grain: { f: 1.6, a: 0.5, seed: 5 } },
  strip: { colour: "#fbfaf0", width: 2.2 },
});
