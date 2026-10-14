// What a printed or stitched ball is decorated with: shapes laid on the sphere (a curved blade, a star, a ring of dots, a chevron), rows of stitches along a seam, a lace across a slit, and the scuffs of
// worn leather. Every shape is drawn flat in a frame that touches the sphere at a point and is carried onto the sphere from there, so it turns with the ball and foreshortens as a mark printed on it does.
// Pure functions on points; the ball engine (ball.engine.ts) draws what they make.
import type { Surface } from "./ball.engine.ts";
import { type V3, add, basis, cross, dot, mul, norm, slerp, spread, sub } from "./ball.math.ts";

type P2 = readonly [number, number];

/** A frame on the sphere at `c`: `(x, y)` is a point of the plane that touches the sphere there (x toward `toward`, y a quarter turn from it), carried onto the sphere. */
export function frameAt(c: V3, toward?: V3): (x: number, y: number) => V3 {
  let ex: V3;
  if (toward === undefined) ex = basis(c)[0];
  else ex = norm(sub(toward, mul(c, dot(toward, c))));
  const ey = cross(c, ex);
  return (x, y) => norm(add(c, add(mul(ex, x), mul(ey, y))));
}

/** A flat shape put on the sphere. */
export const place = (frame: (x: number, y: number) => V3, shape: readonly P2[]): V3[] => shape.map(([x, y]) => frame(x, y));

/** The shape turned by `angle` radians about the middle and scaled. */
export function turned(shape: readonly P2[], angle: number, scale = 1): P2[] {
  const c = Math.cos(angle), s = Math.sin(angle);
  return shape.map(([x, y]) => [(x * c - y * s) * scale, (x * s + y * c) * scale]);
}

/** A regular polygon of `n` sides with a corner at angle `start`. */
export const ngon = (n: number, r: number, start = 0): P2[] => Array.from({ length: n }, (_, i) => [r * Math.cos(start + (2 * Math.PI * i) / n), r * Math.sin(start + (2 * Math.PI * i) / n)] as const);

/** A star of `n` points, corners alternately at `outer` and `inner`. */
export const star = (n: number, outer: number, inner: number, start = -Math.PI / 2): P2[] =>
  Array.from({ length: 2 * n }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = start + (Math.PI * i) / n;
    return [r * Math.cos(a), r * Math.sin(a)] as const;
  });

/**
 * A tongue: a shape along a spine, `spine(u)` for u from 0 to 1, as wide as `width(u)` (to each side of the spine, so twice that across). It is a leaf, a flame, a blade, a ribbon or a shard according to the
 * spine and the width given. The result is a closed outline of `2 (steps + 1)` points.
 */
export function tongue(spine: (u: number) => P2, width: (u: number) => number, steps = 10): P2[] {
  const left: P2[] = [], right: P2[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const [x, y] = spine(u);
    const [x2, y2] = spine(Math.min(1, u + 0.01));
    const [x1, y1] = spine(Math.max(0, u - 0.01));
    const l = Math.hypot(x2 - x1, y2 - y1) || 1;
    const nx = -(y2 - y1) / l, ny = (x2 - x1) / l;
    const w = width(u);
    left.push([x + nx * w, y + ny * w]);
    right.push([x - nx * w, y - ny * w]);
  }
  return [...left, ...right.reverse()];
}

/** A spiral spine from radius `r0` to `r1` that turns through `sweep` radians, starting at angle `a`. */
export const spiral = (r0: number, r1: number, a: number, sweep: number) => (u: number): P2 => [(r0 + (r1 - r0) * u) * Math.cos(a + sweep * u), (r0 + (r1 - r0) * u) * Math.sin(a + sweep * u)];

/** A straight spine from one point to another. */
export const line = (a: P2, b: P2) => (u: number): P2 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

/** A bump that is 0 at both ends and `h` in the middle; `p` below 1 makes it fuller. */
export const lens = (h: number, p = 1) => (u: number): number => h * Math.sin(Math.PI * u) ** p;

/** A taper from `h` at the start to 0 at the end. */
export const taper = (h: number, p = 1) => (u: number): number => h * (1 - u) ** p;

/** The length of a curve on the sphere, in radians. */
export function lengthOf(pts: readonly V3[]): number {
  let total = 0;
  for (let i = 0; i + 1 < pts.length; i++) total += Math.acos(Math.max(-1, Math.min(1, dot(pts[i], pts[i + 1]))));
  return total;
}

/** A curve resampled at points a fixed distance apart along it (radians), the ends included. */
export function resample(pts: readonly V3[], step: number): V3[] {
  const total = lengthOf(pts);
  const n = Math.max(1, Math.round(total / step));
  const out: V3[] = [pts[0]];
  let walked = 0;
  let k = 0;
  for (let i = 1; i <= n; i++) {
    const target = (total * i) / n;
    while (k + 1 < pts.length - 1 && walked + Math.acos(Math.max(-1, Math.min(1, dot(pts[k], pts[k + 1])))) < target) {
      walked += Math.acos(Math.max(-1, Math.min(1, dot(pts[k], pts[k + 1]))));
      k++;
    }
    const seg = Math.acos(Math.max(-1, Math.min(1, dot(pts[k], pts[k + 1])))) || 1e-9;
    out.push(slerp(pts[k], pts[k + 1], Math.max(0, Math.min(1, (target - walked) / seg))));
  }
  return out;
}

/** A curve moved sideways along the sphere by `d` radians (to the left of its direction for a positive `d`). */
export function offset(pts: readonly V3[], d: number): V3[] {
  return pts.map((p, i) => {
    const t = sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)]);
    return norm(add(p, mul(norm(cross(p, t)), d)));
  });
}

/** Short stitches along a seam, running with it: a dash and a gap of `step / 2` each. `side` moves the row to one side of the seam. */
export function running(curves: ReadonlyArray<readonly V3[]>, step = 0.07, side = 0): V3[][] {
  const out: V3[][] = [];
  for (const curve of curves) {
    const pts = resample(side === 0 ? curve : offset(curve, side), step / 2);
    for (let i = 0; i + 1 < pts.length; i += 2) out.push([pts[i], pts[i + 1]]);
  }
  return out;
}

/** Stitches across a seam: a short mark every `step` radians, `half` to each side of the seam, leaning along it by `lean` (a hand stitch's cross). */
export function across(curves: ReadonlyArray<readonly V3[]>, step = 0.09, half = 0.022, lean = 0): V3[][] {
  const out: V3[][] = [];
  for (const curve of curves) {
    const pts = resample(curve, step);
    for (let i = 1; i + 1 < pts.length; i++) {
      const t = norm(sub(pts[i + 1], pts[i - 1]));
      const side = norm(cross(pts[i], t));
      out.push([norm(add(add(pts[i], mul(side, half)), mul(t, -lean))), norm(add(sub(pts[i], mul(side, half)), mul(t, lean)))]);
    }
  }
  return out;
}

/** A small deterministic number in [0, 1) from two integers, for scuffs and pixels that must be the same every time. */
export function noise(a: number, b = 0): number {
  let h = Math.imul(a + 374761393, 668265263) ^ Math.imul(b + 1274126177, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** The scuffs of worn leather: soft dark patches and a few pale ones, spread over the ball. */
export function scuffs(s: Surface, dark: string, pale: string, o?: { dark?: number; pale?: number; seed?: number; size?: number }): string {
  const seed = o?.seed ?? 1;
  const k = o?.size ?? 1;
  const mark = (pts: readonly V3[], base: number, fill: string, opacity: number): string => {
    let out = "";
    pts.forEach((p, i) => {
      const r = (base + 0.07 * noise(i, seed)) * k;
      out += s.dots([p], r, fill, { opacity: opacity * (0.6 + 0.8 * noise(i, seed + 9)), light: false });
    });
    return out;
  };
  return mark(spread(o?.dark ?? 16, seed), 0.075, dark, 0.13) + mark(spread(o?.pale ?? 9, seed + 3), 0.05, pale, 0.2);
}

/**
 * A lace across a slit: the slit along `along` from the middle `c` (`length` radians long), a row of eyelets down each side and a lace that crosses from side to side, tied off with two ends. Returns the
 * slit, the eyelet centres, the crossing strokes and the ends, for the caller to draw.
 */
export function lacing(c: V3, along: V3, length: number, pairs: number, gap = 0.03): { slit: V3[]; eyelets: V3[]; crossings: V3[][]; ends: V3[][] } {
  const f = frameAt(c, along);
  const at = (x: number, y: number): V3 => f(x, y);
  const slit = Array.from({ length: 7 }, (_, j) => at(-length / 2 + (length * j) / 6, 0));
  const xs = Array.from({ length: pairs }, (_, i) => -length / 2 + (length * (i + 0.5)) / pairs);
  const eyelets = xs.flatMap((x) => [at(x, gap), at(x, -gap)]);
  const crossings: V3[][] = [];
  for (let i = 0; i + 1 < pairs; i++) {
    crossings.push([at(xs[i], gap), at(xs[i + 1], -gap)], [at(xs[i], -gap), at(xs[i + 1], gap)]);
  }
  const last = xs[pairs - 1];
  const ends = [[at(last, gap), at(last + gap * 1.4, gap * 2.2)], [at(last, -gap), at(last + gap * 1.8, -gap * 1.8)]];
  return { slit, eyelets, crossings, ends };
}
