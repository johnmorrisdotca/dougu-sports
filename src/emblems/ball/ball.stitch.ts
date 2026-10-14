// Stitches and rows along a curve on the sphere: short marks that cross a seam, spaced evenly along it.
import { type V3, add, cross, dot, mul, norm, sub } from "./ball.math.ts";

/** The point of a closed or open curve at a fraction of its length, and the tangent there. */
function pointAt(pts: readonly V3[], closed: boolean, cumulative: number[], total: number, f: number): { p: V3; t: V3 } {
  const target = f * total;
  let i = 0;
  while (i < cumulative.length - 2 && cumulative[i + 1] < target) i++;
  const a = pts[i], b = pts[(i + 1) % pts.length];
  const span = cumulative[i + 1] - cumulative[i] || 1;
  const k = (target - cumulative[i]) / span;
  const p = norm(add(mul(a, 1 - k), mul(b, k)));
  return { p, t: norm(sub(b, a)) };
}

/** Marks across a curve: `count` marks evenly along it; a mark runs `half` radians either side of the seam and leans along it by `lean`. A `v` mark has two legs that meet on the seam (a baseball's stitch). */
export function stitches(pts: readonly V3[], closed: boolean, count: number, half: number, o?: { lean?: number; v?: boolean; offset?: number; phase?: number }): V3[][] {
  const n = pts.length;
  const cumulative = [0];
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    cumulative.push(cumulative[i] + Math.acos(Math.max(-1, Math.min(1, dot(a, b)))));
  }
  const total = cumulative[cumulative.length - 1];
  const out: V3[][] = [];
  const lean = o?.lean ?? 0;
  const shift = o?.offset ?? 0;
  for (let i = 0; i < count; i++) {
    const f = closed ? (i + (o?.phase ?? 0)) / count : (i + 0.5) / count;
    const { p, t } = pointAt(pts, closed, cumulative, total, f);
    const side = norm(cross(p, t));
    const c = norm(add(p, mul(side, shift)));
    const a = norm(add(add(c, mul(side, half)), mul(t, -lean)));
    const b = norm(add(sub(c, mul(side, half)), mul(t, -lean)));
    if (o?.v === true) out.push([a, norm(add(c, mul(t, lean))), b]);
    else out.push([a, b]);
  }
  return out;
}

/** A dashed row: segments of a curve, each `dash` of every `period` long as a fraction of the curve. */
export function dashes(pts: readonly V3[], closed: boolean, count: number, fill = 0.5): V3[][] {
  const n = pts.length;
  const out: V3[][] = [];
  const per = n / count;
  for (let i = 0; i < count; i++) {
    const from = i * per;
    const to = from + per * fill;
    const seg: V3[] = [];
    for (let j = Math.floor(from); j <= Math.ceil(to); j++) {
      const idx = closed ? j % n : Math.min(j, n - 1);
      seg.push(pts[idx]);
    }
    if (seg.length > 1) out.push(seg);
  }
  return out;
}
