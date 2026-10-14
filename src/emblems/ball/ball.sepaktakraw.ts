// Sepak takraw ball: woven rattan. Six bands, each of three strands, run round the ball as the six great circles that pass through the corners of an icosahedron, which leaves twelve
// pentagonal holes and twenty triangular ones (the ISTAF law gives 12 holes and 20 intersections). Where two bands cross one goes over: the weave is worked out, not drawn by hand.
import { defineBall } from "./ball.engine.ts";
import { type V3, cross, dot, norm, smallCircle } from "./ball.math.ts";
import { mix } from "./ball.core.ts";

const PHI = (1 + Math.sqrt(5)) / 2;
const CORNERS: V3[] = [[0, 1, PHI], [0, 1, -PHI], [1, PHI, 0], [1, -PHI, 0], [PHI, 0, 1], [-PHI, 0, 1]];
const AXES: V3[] = CORNERS.map((v) => norm(v));
const SAMPLES = 48;
/** Half the width of a band, and the gap between its strands, in radians. */
const GAP = 0.034;

const ring = (a: V3, d = 0): V3[] => smallCircle(a, Math.PI / 2 + d, SAMPLES);
const piece = (a: V3, centre: V3, d = 0, half = 0.2): V3[] => smallCircle(a, Math.PI / 2 + d, 24).filter((p) => dot(p, centre) > Math.cos(half));

/** The two points where band `i` crosses band `j`. */
const crossings = (i: number, j: number): V3[] => {
  const c = norm(cross(AXES[i], AXES[j]));
  return [c, [-c[0], -c[1], -c[2]]];
};

export const BALL_SEPAK_TAKRAW = /* @__PURE__ */ defineBall({
  id: "ball:sepak-takraw",
  en: "Sepak takraw ball",
  ja: "セパタクローボール",
  size: { extentMm: 133.7, diameterMm: 133.7, circumferenceMm: 420, massG: [170, 180], rule: "ISTAF Law of the Game (Rules of the Game), Law 4 The Ball (Sepaktakraw Ball), 4.1-4.5", note: "Men's ball (410 to 430 mm round); diameter worked out from the middle of the range. The 2013 edition of the law, the newest found." },
  spec: {
    view: { yaw: 14, pitch: 20, roll: 0 },
    base: "#d3a24f",
    ground: "#2c1a0a",
    mat: { gloss: 0.35, shade: "#2a1604", rim: 0.9, grain: { f: 1.8, a: 0.4 } },
    draw: (s, base) => {
      const edge = mix(base, -0.5);
      const band = (curves: V3[][], closed: boolean): string =>
        s.strokes(curves, edge, 6.2, { closed }) + s.strokes(curves, base, 5.0, { closed, ink: false }) + s.strokes(curves.flatMap((c) => [c]), mix(base, 0.3), 0.5, { closed, deco: true, opacity: 0.5 });
      const strand = (curves: V3[][], closed: boolean): string => s.strokes(curves, edge, 0.55, { closed, ink: false, opacity: 0.8 });
      // Every band, then the strands' dividing lines.
      let out = band(AXES.map((a) => ring(a)), true);
      out += strand(AXES.flatMap((a) => [ring(a, GAP), ring(a, -GAP)]), true);
      // The weave: at each crossing, the band chosen by parity is drawn again over the other.
      const over: Array<[V3, V3]> = [];
      for (let i = 0; i < AXES.length; i++) {
        for (let j = i + 1; j < AXES.length; j++) {
          crossings(i, j).forEach((c, k) => over.push([AXES[(i + j + k) % 2 === 0 ? i : j], c]));
        }
      }
      out += band(over.map(([a, c]) => piece(a, c)), false);
      out += strand(over.flatMap(([a, c]) => [piece(a, c, GAP), piece(a, c, -GAP)]), false);
      return out;
    },
  },
});
