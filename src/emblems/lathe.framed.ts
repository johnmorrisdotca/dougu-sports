// The small 3D that a body of revolution's own `framed` drawer use (`FramedCtx` in emblem.lathe.ts): a point turned by the yaw and placed the way the body's surface is placed, a polished-metal shade for a facet from the way it
// faces, a smooth curve through a table of measurements, and the paths of polygons. Nothing here knows any one emblem; a body with no framed parts does not take this module. Imports only the core.
import { type Rgb, mix } from "./emblem.core.ts";
import type { FramedCtx } from "./emblem.lathe.ts";

/** A point or a direction: x to the right, y down, z toward the eye at rest, in the lathe's units about the axis x = 0 (drawn at x = 32). */
export type V3 = readonly [x: number, y: number, z: number];

const RAD = Math.PI / 180;
const one = (n: number): string => String(Math.round(n * 10) / 10 + 0);
const two = (n: number): string => String(Math.round(n * 100) / 100 + 0);

/** The turn and the eye of a drawing: rotate a point about the axis, place it on the page, and say how near the eye it is and whether a direction faces the eye. */
export function viewOf(c: Pick<FramedCtx, "yaw" | "s">): {
  rot: (v: V3) => V3;
  at: (r: V3) => readonly [number, number];
  depth: (r: V3) => number;
  facing: (n: V3) => number;
} {
  const cy = Math.cos(c.yaw * RAD);
  const sy = Math.sin(c.yaw * RAD);
  const ce = Math.sqrt(1 - c.s * c.s);
  return {
    rot: (v) => [v[0] * cy + v[2] * sy, v[1], v[2] * cy - v[0] * sy],
    at: (r) => [32 + r[0], r[1] + c.s * r[2]],
    depth: (r) => r[2] * ce - r[1] * c.s,
    facing: (n) => n[2] * ce - n[1] * c.s,
  };
}

export const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const unit = (a: V3): V3 => {
  const m = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / m, a[1] / m, a[2] / m];
};
/** The normal of a facet from its first, middle and last points (a quadrilateral's diagonals). */
export const normalOf = (p: readonly V3[]): V3 => unit(cross(sub(p[2] as V3, p[0] as V3), sub(p[p.length - 1] as V3, p[1] as V3)));

const smooth = (x: number, a: number, b: number): number => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * How light polished metal is where a facet faces some way: -1 (black) to 1 (white), for a rotated, unit normal and the elevation of the eye `s`. Two sided, because a thin sheet is seen from either side. A polished
 * surface shows what it mirrors, so the shade is read off a small room: a bright sky above, a dark band at the horizon, a mid floor and a bright window to the upper left. A facet that turns from the sky to the floor
 * as a band twists runs from white through black to grey, the way chrome does.
 */
export function chrome(n: V3, s: number): number {
  const ce = Math.sqrt(1 - s * s);
  const eye: V3 = [0, -s, ce];
  let m = n;
  let d = m[0] * eye[0] + m[1] * eye[1] + m[2] * eye[2];
  if (d < 0) {
    m = [-m[0], -m[1], -m[2]];
    d = -d;
  }
  const r: V3 = [2 * d * m[0] - eye[0], 2 * d * m[1] - eye[1], 2 * d * m[2] - eye[2]];
  const up = -r[1];
  const window = r[2] > 0 ? Math.exp(-(((r[0] + 0.5) / 0.34) ** 2 + ((up - 0.4) / 0.3) ** 2)) : 0;
  const v = -0.12 + 0.95 * smooth(up, -0.12, 0.4) - 0.6 * Math.exp(-(((up + 0.02) / 0.14) ** 2)) + 0.75 * window;
  return Math.max(-0.72, Math.min(0.9, v));
}

/** A colour for a shade from `chrome`, kept to a few steps so that neighbouring facets that differ by a hair are one colour. */
export const shadeOf = (rgb: Rgb, v: number, steps = 24): string => mix(rgb, Math.round(v * steps) / steps);

/** A smooth curve through a table of `[x, y]` points that never overshoots them (monotone cubic), as a function of x; outside the table it holds the end values. */
export function curve(table: readonly (readonly [number, number])[]): (x: number) => number {
  const n = table.length;
  const dx = table.slice(1).map((p, i) => p[0] - (table[i] as readonly [number, number])[0]);
  const dy = table.slice(1).map((p, i) => p[1] - (table[i] as readonly [number, number])[1]);
  const m = dy.map((d, i) => d / (dx[i] as number));
  const t = table.map((_, i) => (i === 0 ? (m[0] as number) : i === n - 1 ? (m[n - 2] as number) : (m[i - 1] as number) * (m[i] as number) <= 0 ? 0 : (2 * (m[i - 1] as number) * (m[i] as number)) / ((m[i - 1] as number) + (m[i] as number))));
  return (x) => {
    const first = table[0] as readonly [number, number];
    const last = table[n - 1] as readonly [number, number];
    if (x <= first[0]) return first[1];
    if (x >= last[0]) return last[1];
    let i = 0;
    while (x > (table[i + 1] as readonly [number, number])[0]) i++;
    const a = table[i] as readonly [number, number];
    const w = dx[i] as number;
    const u = (x - a[0]) / w;
    const u2 = u * u;
    const u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * a[1] + (u3 - 2 * u2 + u) * w * (t[i] as number) + (-2 * u3 + 3 * u2) * (table[i + 1] as readonly [number, number])[1] + (u3 - u2) * w * (t[i + 1] as number);
  };
}

/** A straight-line table: the value at x between the two points either side of it. */
export function lin(table: readonly (readonly [number, number])[]): (x: number) => number {
  return (x) => {
    const first = table[0] as readonly [number, number];
    if (x <= first[0]) return first[1];
    for (let i = 1; i < table.length; i++) {
      const b = table[i] as readonly [number, number];
      if (x <= b[0]) {
        const a = table[i - 1] as readonly [number, number];
        return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
      }
    }
    return (table[table.length - 1] as readonly [number, number])[1];
  };
}

/** The points as a path: a closed polygon, or an open line. */
export const line = (pts: readonly (readonly [number, number])[], closed: boolean, digits: 1 | 2 = 1): string => {
  const w = digits === 1 ? one : two;
  return `M${pts.map((p) => `${w(p[0])} ${w(p[1])}`).join("L")}${closed ? "z" : ""}`;
};
