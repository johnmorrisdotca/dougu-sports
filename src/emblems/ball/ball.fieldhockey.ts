// Field hockey ball: a hard white plastic ball with dimples.
import { dottedBall } from "./ball.family.dotted.ts";

export const BALL_FIELD_HOCKEY = /* @__PURE__ */ dottedBall({
  id: "ball:field-hockey",
  en: "Field hockey ball",
  ja: "フィールドホッケーボール",
  size: { extentMm: 73.0, diameterMm: 73.0, circumferenceMm: 229.5, massG: [156, 163], rule: "FIH Rules of Hockey, Equipment section 3 Ball, 3.1 a-e", note: "Diameter worked out from the middle of the circumference range." },
  base: "#f6f6f2",
  count: 110,
  radius: 0.088,
  depth: 0.22,
  light: false,
  mark: "#6a7080",
  mat: { gloss: 0.85, shade: "#2a3350", grain: undefined },
});
