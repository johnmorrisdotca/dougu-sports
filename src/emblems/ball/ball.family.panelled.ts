// Balls made of curved panels: the 18-panel layout of a volleyball (six groups of three strips; the strips of a face run square to those of its neighbours), and the 8 panels of an octahedral ball.
// The strips are the faces of a cube mapped onto the sphere (a straight line on a face becomes an arc of a great circle), so every seam is a true great-circle arc.
import { type M3, type V3, apply, arc, cross, dot, greatCircle, norm } from "./ball.math.ts";
import type { Surface } from "./ball.engine.ts";
import { mix } from "./ball.core.ts";

/** The six faces of the cube as: the axis the face looks along, its sign, the axis its strips run along, and the axis across them. Neighbouring faces run square to each other. */
const FACES: ReadonlyArray<{ a: 0 | 1 | 2; sign: 1 | -1; p: 0 | 1 | 2; q: 0 | 1 | 2 }> = [
  { a: 2, sign: 1, p: 1, q: 0 },
  { a: 2, sign: -1, p: 1, q: 0 },
  { a: 0, sign: 1, p: 2, q: 1 },
  { a: 0, sign: -1, p: 2, q: 1 },
  { a: 1, sign: 1, p: 0, q: 2 },
  { a: 1, sign: -1, p: 0, q: 2 },
];

const SPLIT = 1 / 3;

const onFace = (f: (typeof FACES)[number], p: number, q: number): V3 => {
  const v: [number, number, number] = [0, 0, 0];
  v[f.a] = f.sign;
  v[f.p] = p;
  v[f.q] = q;
  return norm(v);
};

/** The turn that stands the layout on a corner of its cube: the diagonal (1, 1, 1) becomes the ball's vertical axis, so the three faces round one corner are the top and the three round the opposite corner the bottom, and the ball turns about that diagonal. */
export const ON_A_CORNER: M3 = (() => {
  const from = norm([1, 1, 1]);
  const axis = norm(cross(from, [0, 1, 0]));
  const c = dot(from, [0, 1, 0]);
  const s = Math.sqrt(1 - c * c);
  const [x, y, z] = axis;
  const k = 1 - c;
  return [
    [c + x * x * k, x * y * k - z * s, x * z * k + y * s],
    [y * x * k + z * s, c + y * y * k, y * z * k - x * s],
    [z * x * k - y * s, z * y * k + x * s, c + z * z * k],
  ];
})();

const turned = (rot: M3 | undefined, v: V3): V3 => (rot === undefined ? v : apply(rot, v));

/** The 18 panels of a ball, painted and not outlined. `colourOf(face, strip)` is the colour of strip 0, 1 or 2 of face 0 to 5; the faces are the cube's +z, -z, +x, -x, +y and -y. */
export function paintEach18(s: Surface, colourOf: (face: number, strip: number) => string, rot?: M3): string {
  let out = "";
  FACES.forEach((f, fi) => {
    const bounds = [-1, -SPLIT, SPLIT, 1];
    for (let i = 0; i < 3; i++) {
      const ring = [onFace(f, -1, bounds[i]), onFace(f, 1, bounds[i]), onFace(f, 1, bounds[i + 1]), onFace(f, -1, bounds[i + 1])].map((v) => turned(rot, v));
      out += s.panel(ring, colourOf(fi, i), { n: 6, ink: false });
    }
  });
  return out;
}

/** The 18 panels of a ball, painted and not outlined. `colours[i]` is the three strips of face i, or one colour for the middle strip and one for the outer two. */
export function paint18(s: Surface, colours: ReadonlyArray<readonly [string, string]>): string {
  return paintEach18(s, (fi, i) => {
    const [outer, middle] = colours[fi % colours.length];
    return i === 1 ? middle : outer;
  });
}

/** The seams of the 18-panel layout, each once: the lines between strips and the twelve edges of the cube. */
export function seams18(rot?: M3): V3[][] {
  const curves: V3[][] = [];
  for (const f of FACES) for (const q of [-SPLIT, SPLIT]) curves.push(arc(onFace(f, -1, q), onFace(f, 1, q), 10));
  for (const a of [-1, 1]) for (const b of [-1, 1]) {
    curves.push(arc(norm([a, b, -1]), norm([a, b, 1]), 12));
    curves.push(arc(norm([a, -1, b]), norm([a, 1, b]), 12));
    curves.push(arc(norm([-1, a, b]), norm([1, a, b]), 12));
  }
  return rot === undefined ? curves : curves.map((c) => c.map((v) => turned(rot, v)));
}

/** The 18 panels of a ball. `colours[i]` is the three strips of face i, or one colour for the middle strip and one for the outer two. */
export function strips18(s: Surface, colours: ReadonlyArray<readonly [string, string]>, seam: string, width = 1.1): string {
  const curves = seams18();
  return paint18(s, colours) + s.strokes(curves, seam, width) + s.strokes(curves, "#fff", width * 0.35, { deco: true, opacity: 0.4, dx: 0.25, dy: 0.3 });
}

/** The 18 panels of a ball, each with a colour of its own: `colours[face * 3 + strip]`, in the order of `paintEach18`. */
export function panels18(s: Surface, colours: readonly string[], seam: string, rot?: M3, width = 1.1): string {
  const curves = seams18(rot);
  return paintEach18(s, (fi, i) => colours[fi * 3 + i] as string, rot) + s.strokes(curves, seam, width) + s.strokes(curves, "#fff", width * 0.35, { deco: true, opacity: 0.4, dx: 0.25, dy: 0.3 });
}

/** The 8 panels of an octahedral ball: the octants, coloured by `pick(sx, sy, sz)`. */
export function octants8(s: Surface, pick: (sx: number, sy: number, sz: number) => string, seam: string, width = 1.1): string {
  let out = "";
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) out += s.panel([[sx, 0, 0], [0, sy, 0], [0, 0, sz]], pick(sx, sy, sz), { n: 12 });
  const circles = [greatCircle([1, 0, 0], 48), greatCircle([0, 1, 0], 48), greatCircle([0, 0, 1], 48)];
  out += s.strokes(circles, seam, width, { closed: true });
  out += s.strokes(circles, "#fff", width * 0.35, { closed: true, deco: true, opacity: 0.4, dx: 0.25, dy: 0.3 });
  return out;
}

/** A darker seam colour for a main colour. */
export const seamOf = (base: string, amount = -0.45): string => mix(base, amount);
