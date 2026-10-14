// Teqball: the soccer ball's 32 panels in our colours, teal and white, with a pale inset on each hexagon.
import { defineBall } from "./ball.engine.ts";
import { shrink, truncatedIcosahedron } from "./ball.polyhedra.ts";
import { blend, mix } from "./ball.core.ts";

export const BALL_TEQBALL = /* @__PURE__ */ defineBall({
  id: "ball:teqball",
  en: "Teqball ball",
  ja: "テックボール用ボール",
  size: { extentMm: 216.4, diameterMm: 216.4, circumferenceMm: 680.0, massG: [370, 400], rule: "FITEQ Official Rules and Regulations of Teqball 2026, Rule 3 The Official Ball, 3.1.1-3.1.6", note: "Diameter worked out from the middle of the circumference range." },
  spec: {
    view: { yaw: 30, pitch: 24, roll: 8 },
    base: "#0f9aa8",
    ground: "#f6f8f8",
    mat: { gloss: 0.7, shade: "#0c2a40", grain: { f: 1.1, a: 0.1 } },
    draw: (s, base) => {
      const t = truncatedIcosahedron();
      const inset = blend(base, "#ffffff", 0.82);
      let out = "";
      t.hexagons.forEach((h, i) => (out += s.panel(shrink(h, t.hexagonCentres[i], 0.38), inset, { n: 2 })));
      for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
      out += s.strokes(t.edges, mix(base, -0.4), 1.1);
      out += s.strokes(t.edges, "#fff", 0.4, { deco: true, opacity: 0.4, dx: 0.3, dy: 0.35 });
      return out;
    },
  },
});
