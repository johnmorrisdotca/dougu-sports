// The geometry of a ball: vectors, the rotation, the curves a seam is made of. Pure functions on numbers; nothing here writes SVG.

export type V3 = readonly [number, number, number];
export type M3 = readonly [V3, V3, V3];

export const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a: V3): number => Math.hypot(a[0], a[1], a[2]);
export const norm = (a: V3): V3 => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
/** The point `t` of the way along the great circle from `a` to `b` (unit vectors): a spherical linear interpolation. */
export function slerp(a: V3, b: V3, t: number): V3 {
  const d = Math.max(-1, Math.min(1, dot(a, b)));
  const omega = Math.acos(d);
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  return add(mul(a, Math.sin((1 - t) * omega) / s), mul(b, Math.sin(t * omega) / s));
}
/** A unit vector from longitude and latitude in radians: longitude 0 faces +z, 90 degrees faces +x, latitude is toward +y. */
export const lonLat = (lon: number, lat: number): V3 => [Math.sin(lon) * Math.cos(lat), Math.sin(lat), Math.cos(lon) * Math.cos(lat)];

/** The rotation of a view: `yaw` about the vertical axis, then `pitch` about the horizontal one, then `roll` about the line of sight. */
export function rotation(yaw: number, pitch: number, roll: number): M3 {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll);
  const ry: M3 = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]];
  const rx: M3 = [[1, 0, 0], [0, cp, -sp], [0, sp, cp]];
  const rz: M3 = [[cr, -sr, 0], [sr, cr, 0], [0, 0, 1]];
  return matmul(rz, matmul(rx, ry));
}
export function matmul(a: M3, b: M3): M3 {
  const col = (j: number): V3 => [b[0][j], b[1][j], b[2][j]];
  const row = (i: number): V3 => [dot(a[i], col(0)), dot(a[i], col(1)), dot(a[i], col(2))];
  return [row(0), row(1), row(2)];
}
export const apply = (m: M3, v: V3): V3 => [dot(m[0], v), dot(m[1], v), dot(m[2], v)];
export const transpose = (m: M3): M3 => [[m[0][0], m[1][0], m[2][0]], [m[0][1], m[1][1], m[2][1]], [m[0][2], m[1][2], m[2][2]]];

/** Points along the great circle with this unit normal, `n` of them, starting from a chosen direction (or any) around the circle. */
export function greatCircle(normal: V3, n = 96, from?: V3): V3[] {
  const a = norm(normal);
  const ref = from ?? (Math.abs(a[0]) < 0.9 ? ([1, 0, 0] as const) : ([0, 1, 0] as const));
  const u = norm(sub(ref, mul(a, dot(ref, a))));
  const w = cross(a, u);
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * 2 * Math.PI;
    return add(mul(u, Math.cos(t)), mul(w, Math.sin(t)));
  });
}
/** Points of the small circle at angular distance `angle` (radians) from the unit axis. */
export function smallCircle(axis: V3, angle: number, n = 96, from?: V3): V3[] {
  const a = norm(axis);
  const c = Math.cos(angle), s = Math.sin(angle);
  return greatCircle(a, n, from).map((p) => add(mul(a, c), mul(p, s)));
}
/** The arc of a great circle from `a` to `b`, `n` steps (n + 1 points). */
export const arc = (a: V3, b: V3, n: number): V3[] => Array.from({ length: n + 1 }, (_, i) => slerp(a, b, i / n));

/** A basis (u, w) of the plane perpendicular to the unit vector. */
export function basis(a: V3): [V3, V3] {
  const ref: V3 = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = norm(sub(ref, mul(a, dot(ref, a))));
  return [u, cross(a, u)];
}

/** Evenly spread points on a sphere (a Fibonacci spiral), `n` of them; `phase` turns the whole set about the y axis. */
export function spread(n: number, phase = 0): V3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = i * golden + phase;
    return [Math.cos(t) * r, y, Math.sin(t) * r] as const;
  });
}

/** The seam of a baseball or a tennis ball: the curve x=(1-b)cos t + b cos 3t, y=(1-b)sin t - b sin 3t, z=2sqrt(b(1-b)) sin 2t. It lies on the unit sphere for any b. */
export function seamCurve(b: number, n = 120): V3[] {
  const o: V3[] = [];
  const z = 2 * Math.sqrt(b * (1 - b));
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    o.push([(1 - b) * Math.cos(t) + b * Math.cos(3 * t), (1 - b) * Math.sin(t) - b * Math.sin(3 * t), z * Math.sin(2 * t)]);
  }
  return o;
}

/** The singular values and the angle of the ellipse that a 2 by 3 matrix makes of the unit sphere: its semi-axes (largest first) and the direction of the first, in radians. */
export function ellipseOf(rows: readonly [V3, V3]): { rx: number; ry: number; angle: number } {
  const a = dot(rows[0], rows[0]);
  const b = dot(rows[0], rows[1]);
  const d = dot(rows[1], rows[1]);
  const tr = a + d;
  const disc = Math.sqrt(Math.max(0, ((a - d) / 2) ** 2 + b * b));
  const l1 = tr / 2 + disc;
  const l2 = Math.max(0, tr / 2 - disc);
  return { rx: Math.sqrt(l1), ry: Math.sqrt(l2), angle: 0.5 * Math.atan2(2 * b, a - d) };
}

/** A ring's edges followed along the sphere: each edge from a vertex to the next is sampled `n` times (n = 1 keeps the vertices). */
export function sampleRing(ring: readonly V3[], n: number): V3[] {
  if (n <= 1) return [...ring];
  const out: V3[] = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    for (let j = 0; j < n; j++) out.push(slerp(a, b, j / n));
  }
  return out;
}
