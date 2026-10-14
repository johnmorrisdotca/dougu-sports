// The soccer balls of the other two games the Laws of the Game cover: futsal (size 4, a low-bouncing ball, often brighter than the outdoor one) and beach soccer (size 5, softer, often bright). Both are drawn
// on constructions of our own (the 32-panel and the 14-panel propeller layout), in colours of our own choosing: no brand's ball, no tournament's pattern.
import { defineBall } from "./ball.engine.ts";
import { mix } from "./ball.core.ts";
import { shrink, truncatedIcosahedron } from "./ball.polyhedra.ts";
import { LAYOUTS } from "./ball.soccer.panels.ts";
import { SOCCER_SIZE } from "./ball.soccer.size.ts";

const FUTSAL_BLUE = "#1673e6";

export const BALL_FUTSAL = /* @__PURE__ */ defineBall({
  id: "ball:futsal",
  en: "Futsal ball",
  ja: "フットサルボール",
  size: {
    extentMm: 200.5,
    diameterMm: 200.5,
    circumferenceMm: 630.0,
    massG: [400, 440],
    rule: "Futsal Laws of the Game 2025/26, Law 2 The Ball, section 1 Qualities and measurements",
    note: "Size 4. Diameter worked out from the middle of the circumference range (62 to 64 cm). Pressure 0.6 to 0.9 atm (600 to 900 g/cm2) at sea level; the first rebound from a 2 m drop must be between 50 cm and 65 cm, which is what makes it a low-bounce ball. The Laws let associations change the size and weight for youth and other categories.",
  },
  spec: {
    view: { yaw: 30, pitch: 24, roll: 8 },
    base: FUTSAL_BLUE,
    ground: "#f6f8fb",
    mat: { gloss: 0.4, shade: "#16305a", grain: { f: 1.4, a: 0.24 } },
    draw(s, base, accent) {
      const t = truncatedIcosahedron();
      let out = "";
      for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
      // A smaller pentagon of the second colour inside each one.
      t.pentagons.forEach((p, i) => {
        out += s.panel(shrink(p, t.pentagonCentres[i], 0.5), accent ?? "#ffd21f", { n: 2 });
      });
      out += s.strokes(t.edges, mix(base, -0.4), 1.1);
      out += s.strokes(t.edges, "#fff", 0.4, { deco: true, opacity: 0.4, dx: 0.3, dy: 0.35 });
      return out;
    },
  },
});

export const BALL_BEACH_SOCCER = /* @__PURE__ */ defineBall({
  id: "ball:beach-soccer",
  en: "Beach soccer ball",
  ja: "ビーチサッカーボール",
  size: {
    ...SOCCER_SIZE,
    massG: [400, 440],
    rule: "Beach Soccer Laws of the Game 2024-25, Law 2 The Ball, section 1 Qualities and measurements",
    note: "Size 5. Diameter worked out from the middle of the circumference range (68 to 70 cm). Pressure 0.4 to 0.6 atm (400 to 600 g/cm2) at sea level, lower than an 11-a-side ball's, so the ball is softer; the mass is 400 to 440 g, 10 g under the 11-a-side minimum.",
  },
  spec: {
    view: { yaw: 16, pitch: 14, roll: 0 },
    base: "#f5b81c",
    ground: "#f5b81c",
    mat: { gloss: 0.55, shade: "#4a2a10", grain: { f: 1.2, a: 0.1 } },
    draw: (s, base, accent) =>
      LAYOUTS[14](s, { light: base, mid: accent ?? "#f0661e", deep: "#12a8d8", dark: "#1b2a66", seam: mix(base, -0.55) }),
  },
});
