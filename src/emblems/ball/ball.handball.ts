// Handball: a 32-panel ball (twelve pentagons, twenty hexagons) with a sticky matt grip, here in navy and yellow of our own choosing.
import { defineBall } from "./ball.engine.ts";
import { truncatedIcosahedron } from "./ball.polyhedra.ts";
import { mix } from "./ball.core.ts";

export const BALL_HANDBALL = /* @__PURE__ */ defineBall({
  id: "ball:handball",
  en: "Handball",
  ja: "ハンドボール",
  size: { extentMm: 187.8, diameterMm: 187.8, circumferenceMm: 590.0, massG: [425, 475], rule: "IHF Rules of the Game (Indoor Handball), Rule 3 The Ball, 3.1-3.3; sizes 0 and 00 and panel count from IHF Ball Regulations (XIII) Articles 2 and 3", note: "IHF size 3 with resin (men and youths from 16). Diameter worked out from the middle of the circumference range. The IHF Ball Regulations ask for at least 32 panels on a leather ball." },
  spec: {
    view: { yaw: 30, pitch: 24, roll: 8 },
    base: "#1f3f8f",
    ground: "#f1c21b",
    mat: { gloss: 0.3, shade: "#1a1a30", grain: { f: 1.3, a: 0.22 } },
    draw: (s, base) => {
      const t = truncatedIcosahedron();
      let out = "";
      for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
      out += s.strokes(t.edges, mix(base, -0.45), 1.15);
      out += s.strokes(t.edges, "#fff", 0.4, { deco: true, opacity: 0.35, dx: 0.3, dy: 0.35 });
      return out;
    },
  },
});
