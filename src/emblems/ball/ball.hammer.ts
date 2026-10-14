// Hammer (the athletics throw): a steel ball, a wire and a grip. The wire is drawn shorter than it is (the rule allows 1.215 m overall), so that the head is still big enough to read.
import { defineBall } from "./ball.engine.ts";
import { type V3, add, cross, mul, norm } from "./ball.math.ts";

const D: V3 = norm([0.72, -0.66, 0.2]);
const U: V3 = norm(cross(D, [0, 0, 1]));
const HEAD = mul(D, -1.25);
const WIRE_START = -0.25;
const WIRE_END = 1.25;

export const BALL_HAMMER = /* @__PURE__ */ defineBall({
  id: "ball:hammer",
  en: "Hammer",
  ja: "ハンマー（ハンマー投）",
  size: { extentMm: 273, diameterMm: 120, massG: [7260, 7260], rule: "World Athletics Technical Rules (C2.1), Rule 36 Hammer Throw - 'The hammer shall conform to the following specifications' and construction text", note: "Men's hammer, whose head is 110 to 130 mm across. The wire is drawn about a fifth of its length, so the scale is that of the head; the rules give only a maximum overall length (1215 mm)." },
  spec: {
    fit: 0.44,
    at: HEAD,
    view: { yaw: 0, pitch: 0, roll: 0 },
    base: "#7e8791",
    mat: { gloss: 0.95, shade: "#0a0e14", metal: true },
    draw: () => "",
    attach: (s) => {
      const p = (v: V3): [number, number, number] => s.space(v);
      const a = p(mul(D, WIRE_START)), b = p(mul(D, WIRE_END));
      const g1 = p(add(mul(D, WIRE_END), mul(U, 0.42))), g2 = p(add(mul(D, WIRE_END), mul(U, -0.42))), g3 = p(add(mul(D, WIRE_END + 0.5), mul(U, 0)));
      const wire = `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}" stroke="${s.line ? "currentColor" : "#aeb5be"}" stroke-width="${Math.max(0.9, s.minWidth)}" stroke-linecap="round" fill="none"/>`;
      const grip = `<path d="M${g1[0].toFixed(1)} ${g1[1].toFixed(1)}L${g3[0].toFixed(1)} ${g3[1].toFixed(1)}L${g2[0].toFixed(1)} ${g2[1].toFixed(1)}Z" fill="none" stroke="${s.line ? "currentColor" : "#5a6270"}" stroke-width="${Math.max(2, s.minWidth * 1.5)}" stroke-linejoin="round" stroke-linecap="round"/>`;
      const out = wire + grip;
      return (a[2] + b[2]) / 2 < 0 ? { behind: out, front: "" } : { behind: "", front: out };
    },
  },
});
