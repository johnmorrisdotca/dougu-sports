// Rugby ball: a classic white ball, pointed at the ends, with four panels, a pebbled grip all over, and two bands of colour round it on each side: a wide one and a thin one. The colour is the ball's
// `tint` (a navy blue by default; the Laws do not set a colour and the ball carries no brand).
import { defineBall } from "./ball.engine.ts";
import { seamAt, tipRing } from "./ball.family.prolate.ts";
import { mix } from "./ball.core.ts";
import { spread } from "./ball.math.ts";

const GRIP = spread(260, 0.4);
const QUARTER = Math.PI / 2;
const WHITE = "#f4f2ec";

export const BALL_RUGBY = /* @__PURE__ */ defineBall({
  id: "ball:rugby",
  en: "Rugby ball",
  ja: "ラグビーボール",
  size: { extentMm: 290.0, lengthMm: 290.0, circumferenceMm: 600.0, longCircumferenceMm: 755.0, massG: [410, 460], rule: "World Rugby Laws of the Game (Rugby Union), Law 2 The ball, clauses 1-7" },
  spec: {
    // Worked out from the Laws' 600 mm girth, 290 mm length and 755 mm long girth.
    axes: [1, 0.6586, 0.6586],
    point: 0.561,
    view: { yaw: -30, pitch: 20, roll: -30 },
    base: "#1f4e9c",
    ground: WHITE,
    mat: { gloss: 0.4, shade: "#1a2030", grain: { f: 0.9, a: 0.18 } },
    draw: (s, base) => {
      let out = "";
      // The grip: pebbles over the whole ball, a little darker than the white, each with its own highlight.
      out += s.dots(GRIP, 0.03, mix(WHITE, -0.16), { opacity: 0.8, ink: false, light: false });
      // The seams, tip to tip, then the bands over them.
      out += s.strokes([0, 1, 2, 3].map((k) => seamAt(k * QUARTER + QUARTER / 2)), mix(WHITE, -0.3), 1.1);
      for (const sign of [1, -1] as const) {
        out += s.stroke(tipRing(sign, 1.02, 96), base, 9, { closed: true, ink: false });
        out += s.stroke(tipRing(sign, 1.3, 96), base, 3, { closed: true, ink: false });
      }
      return out;
    },
  },
});
