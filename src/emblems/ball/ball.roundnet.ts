// Roundnet ball: a small bright ball of eight panels, yellow and orange (our colouring).
import { defineBall } from "./ball.engine.ts";
import { octants8 } from "./ball.family.panelled.ts";

export const BALL_ROUNDNET = /* @__PURE__ */ defineBall({
  id: "ball:roundnet",
  en: "Roundnet ball",
  ja: "ラウンドネットボール",
  size: { extentMm: 105, diameterMm: 105, circumferenceMm: 330, massG: [80, 90], rule: "International Roundnet Federation (IRF) Rules, Chapter 1 Equipment and Court, 1.1.2 Set Dimensions, 1.1.4 Ball Characteristics, 1.1.5 Ball Inflation", note: "International Roundnet Federation rules (330 mm round, 10 mm either way); the rules give no diameter." },
  spec: {
    view: { yaw: 35, pitch: 28, roll: 0 },
    base: "#f5dc16",
    mat: { gloss: 0.6, shade: "#4a3a04", grain: { f: 1.4, a: 0.14 } },
    draw: (s, base) => octants8(s, (sx, sy, sz) => (sx * sy * sz > 0 ? base : "#f08a1c"), "#7a5a10", 1.2),
  },
});
