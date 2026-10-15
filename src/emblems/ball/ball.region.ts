// A region of a sphere on the left of a closed curve, drawn as the outline it has on the screen. Kept out of the engine so that a ball with no two-tone colouring does not carry it: the seamed balls import it.
import { num } from "./ball.core.ts";
import { EPS, type Geometry, type Run, type Surface, pathOf, project, visOf, visibleRuns } from "./ball.engine.ts";
import { type V3, cross, dot, norm, sub } from "./ball.math.ts";

/** The signed area of a polygon of screen points, y up (positive when it runs counterclockwise as you see it). */
function areaOf(pts: ReadonlyArray<readonly [number, number, number]>): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i] as readonly [number, number, number], q = pts[(i + 1) % pts.length] as readonly [number, number, number];
    a += p[0] * -q[1] - q[0] * -p[1];
  }
  return a / 2;
}

/** Whether a point of the sphere is on the left of a closed curve, by the nearest sample's side. */
function leftOf(ring: readonly V3[], p: V3): boolean {
  let best = Infinity, left = false;
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const q = ring[i] as V3;
    const d = 1 - dot(p, q);
    if (d < best) {
      best = d;
      left = dot(p, cross(q, norm(sub(ring[(i + 1) % n] as V3, ring[(i + n - 1) % n] as V3)))) > 0;
    }
  }
  return left;
}

/**
 * The visible part of the surface on the left of a closed curve on a sphere, as the path of its outline: the curve's visible runs, joined along the limb. Walking a run with the region on your left, the limb is
 * followed counterclockwise (as the eye sees it) from where the run leaves the disc to the next place a run comes in, so the outline closes on the correct side even for a region that is not convex.
 */
export function regionPath(g: Geometry, ring: readonly V3[]): string {
  const R = g.k;
  const vis = ring.map((p) => visOf(g, p));
  const disc = (): string => `M${num(g.cx - R, 2)} ${num(g.cy, 2)}A${num(R, 2)} ${num(R, 2)} 0 1 0 ${num(g.cx + R, 2)} ${num(g.cy, 2)}A${num(R, 2)} ${num(R, 2)} 0 1 0 ${num(g.cx - R, 2)} ${num(g.cy, 2)}Z`;
  if (!vis.some((v) => v > EPS)) return leftOf(ring, norm(g.w)) ? disc() : "";
  if (vis.every((v) => v > EPS)) {
    const pts = ring.map((p): [number, number, number] => {
      const [x, y] = project(g, p);
      return [x, y, 1];
    });
    const poly = `${pathOf(pts, 2)}Z`;
    return areaOf(pts) > 0 ? poly : disc() + poly;
  }
  const runs = visibleRuns(g, ring, true).filter((r) => r.pts.length > 1);
  if (runs.length === 0) return "";
  const angle = (p: readonly [number, number, number]): number => Math.atan2(-(p[1] - g.cy), p[0] - g.cx);
  const first = (r: Run): [number, number, number] => r.pts[0] as [number, number, number];
  const last = (r: Run): [number, number, number] => r.pts[r.pts.length - 1] as [number, number, number];
  const next = runs.map((r) => {
    const out = angle(last(r));
    let best = 0, gap = Infinity;
    runs.forEach((q, j) => {
      let d = angle(first(q)) - out;
      d -= Math.floor(d / (2 * Math.PI)) * 2 * Math.PI;
      if (d < gap) {
        gap = d;
        best = j;
      }
    });
    return { to: best, gap };
  });
  const seen = new Set<number>();
  let d = "";
  runs.forEach((_, start) => {
    if (seen.has(start)) return;
    let at = start;
    d += `M${num(first(runs[at] as Run)[0], 2)} ${num(first(runs[at] as Run)[1], 2)}`;
    while (!seen.has(at)) {
      seen.add(at);
      const r = runs[at] as Run;
      d += pathOf(r.pts.slice(1), 2).replace(/^M/, "L");
      const n = next[at] as { to: number; gap: number };
      const e = first(runs[n.to] as Run);
      d += n.gap < 1e-4 ? `L${num(e[0], 2)} ${num(e[1], 2)}` : `A${num(R, 2)} ${num(R, 2)} 0 ${n.gap > Math.PI ? 1 : 0} 0 ${num(e[0], 2)} ${num(e[1], 2)}`;
      at = n.to;
    }
    d += "Z";
  });
  return d;
}


/**
 * The part of the surface on the left of a closed curve (looking at the sphere from outside, walking along the curve in the order given), filled with a colour: what you see of it, bounded by the curve and the
 * limb. For spheres only. In the line style nothing is drawn.
 */
export function region(s: Surface, ring: readonly V3[], fill: string): string {
  if (s.line) return "";
  const d = regionPath(s.view, ring);
  return d === "" ? "" : `<path d="${d}" fill="${fill}" fill-rule="evenodd"/>`;
}
