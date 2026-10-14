// The classic soccer ball: 32 panels, twelve black pentagons and twenty white hexagons, laid on a truncated icosahedron; and a coloured one with a motif of our own (a triangle on each hexagon
// pointing at its three pentagons). No brand, no tournament's pattern.
import { defineBall } from "./ball.engine.ts";
import { truncatedIcosahedron } from "./ball.polyhedra.ts";
import { add, mul, norm } from "./ball.math.ts";
import { blend, mix } from "./ball.core.ts";
import { SOCCER_SIZE } from "./ball.soccer.size.ts";

const SEAM = "#6b7180";

export const BALL_SOCCER = /* @__PURE__ */ defineBall({
  id: "ball:soccer",
  en: "Soccer ball",
  ja: "サッカーボール",
  size: SOCCER_SIZE,
  spec: {
    view: { yaw: 30, pitch: 24, roll: 8 },
    base: "#1e2025",
    ground: "#f8f8f6",
    mat: { gloss: 0.8, shade: "#2a3450", grain: { f: 1.1, a: 0.16 } },
    draw(s, base) {
      const t = truncatedIcosahedron();
      let out = "";
      for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
      out += s.strokes(t.edges, SEAM, 1.15);
      out += s.strokes(t.edges, "#fff", 0.45, { deco: true, opacity: 0.5, dx: 0.3, dy: 0.35 });
      return out;
    },
  },
});

export const BALL_SOCCER_COLOUR = /* @__PURE__ */ defineBall({
  id: "ball:soccer-colour",
  en: "Soccer ball, coloured",
  ja: "サッカーボール（カラー）",
  size: SOCCER_SIZE,
  spec: {
    view: { yaw: 30, pitch: 24, roll: 8 },
    base: "#d4283c",
    ground: "#f8f8f6",
    mat: { gloss: 0.8, shade: "#3a2030", grain: { f: 1.1, a: 0.16 } },
    draw(s, base) {
      const t = truncatedIcosahedron();
      const light = blend(base, "#ffffff", 0.45);
      let out = "";
      t.hexagons.forEach((_, i) => {
        const c = t.hexagonCentres[i];
        out += s.panel(
          t.hexagonPentagonSides[i].map((m) => norm(add(mul(c, 0.38), mul(m, 0.62)))),
          light,
          { n: 2 },
        );
      });
      for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
      out += s.strokes(t.edges, mix(base, -0.35), 1.1);
      out += s.strokes(t.edges, "#fff", 0.45, { deco: true, opacity: 0.45, dx: 0.3, dy: 0.35 });
      return out;
    },
  },
});
