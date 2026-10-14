// Golf ball (not one of our sports; a bonus): white, with a dimple pattern. The rules fix the size and mass, not the dimples.
import { dottedBall } from "./ball.family.dotted.ts";

export const BALL_GOLF = /* @__PURE__ */ dottedBall({
  id: "ball:golf",
  en: "Golf ball",
  ja: "ゴルフボール",
  size: { extentMm: 42.67, diameterMm: 42.67, massG: [0, 45.93], rule: "Rules of Equipment (R&A / USGA), Part 4 Conformance of Balls, 4.2 Weight and 4.3 Size", note: "A minimum diameter and a maximum mass: the rules set no maximum size and no minimum weight." },
  base: "#f7f7f5",
  count: 190,
  radius: 0.066,
  depth: 0.2,
  light: false,
  mark: "#5a6070",
  mat: { gloss: 0.85, shade: "#2a3350", grain: undefined },
});
