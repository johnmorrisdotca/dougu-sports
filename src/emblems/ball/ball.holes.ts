// A ball with real holes (a pickleball): each hole on the near side is cut out of the shell, so you see through it into the hollow ball, and each hole on the far side is cut out of the inside of the
// back, so where the two line up the page itself shows through. A hole is a short cylinder drilled through the shell along the line to the ball's centre: it is a cap on the outside and the same cap, a
// shell's thickness deeper, on the inside. Drawn in order, front to back: the inside of the ball (a dark, shaded disc with the far holes cut out of it), the wall of each near hole (the crescent of the
// bore that faces you, lit or shaded by where it points), then the shell, which has the near holes cut out of it by a mask. Orthographic, like the rest of the engine.
import type { Surface } from "./ball.engine.ts";
import { hashOf, mix, num } from "./ball.core.ts";
import { type V3, add, basis, cross, ellipseOf, mul, norm } from "./ball.math.ts";

/**
 * Where a ball is drilled: the hole centres on the unit sphere, a hole's radius as the angle of its cap in radians, and the shell's thickness as a fraction of the ball's radius (0.05 by default).
 * With `long` the holes are slots instead of circles: `radius` is then half the width of a slot, `long` is half its length (both in radians, `long` at least `radius`), and `dirs` has, for each
 * centre, a direction along the ball's surface at that centre (it is made to lie in the surface) that the slot's length runs along. The ends of a slot are half circles.
 */
export interface Holes {
  centres: readonly V3[];
  radius: number;
  wall?: number;
  long?: number;
  dirs?: readonly V3[];
}

/** What a hole's opening is on the screen: the path of its outline, its middle and the facing of the hole it belongs to. */
interface Opening {
  d: string;
  x: number;
  y: number;
  facing: number;
}

/** What `holeLayers` makes: the definitions, the inside of the ball (drawn first), the edges drawn on the shell, and the mask that cuts the near holes out of everything on the shell, if there is one. */
export interface HoleLayers {
  defs: string;
  behind: string;
  edge: string;
  mask: string | undefined;
}

/** The outline of a slot as points in the plane that touches the sphere at its middle, `a` along the length and `b` across: two straight sides and a half circle at each end. */
function capsule(half: number, long: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  const run = long - half;
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const t = -Math.PI / 2 + (Math.PI * i) / steps;
    out.push([run + half * Math.cos(t), half * Math.sin(t)]);
  }
  for (let i = 0; i <= steps; i++) {
    const t = Math.PI / 2 + (Math.PI * i) / steps;
    out.push([-run + half * Math.cos(t), half * Math.sin(t)]);
  }
  return out;
}

/** A polygon as a path: the first point, then the steps between rounded points (so the outline does not drift), to a tenth of a unit of the box. */
function polygon(pts: ReadonlyArray<readonly [number, number]>): string {
  const r = (v: number): number => Math.round(v * 10) / 10;
  let x = r(pts[0][0]), y = r(pts[0][1]);
  let out = `M${num(x)} ${num(y)}l`;
  for (let i = 1; i < pts.length; i++) {
    const nx = r(pts[i][0]), ny = r(pts[i][1]);
    out += `${i === 1 ? "" : " "}${num(nx - x)} ${num(ny - y)}`;
    x = nx;
    y = ny;
  }
  return `${out}z`;
}

/** The slot's outline as points on the sphere (or `depth` below it: the bore is a cylinder along the line to the ball's centre), for a slot with this middle and this direction along its length. */
export function slotRing(m: V3, dir: V3, half: number, long: number, depth = 0): V3[] {
  const t1 = norm(add(dir, mul(m, -(dir[0] * m[0] + dir[1] * m[1] + dir[2] * m[2]))));
  const t2 = cross(m, t1);
  return capsule(half, long).map(([a, b]) => {
    const r = Math.hypot(a, b) || 1e-9;
    const k = Math.sin(r) / r;
    return add(mul(m, Math.cos(r) - depth), add(mul(t1, a * k), mul(t2, b * k)));
  });
}

/** The slot's outline `depth` below the surface, as the polygon it makes on the screen. */
function slot(s: Surface, m: V3, dir: V3, holes: Holes, depth: number): Opening | undefined {
  const pts = slotRing(m, dir, holes.radius, holes.long ?? holes.radius, depth).map((p) => {
    const q = s.project(p);
    return [q[0], q[1]] as const;
  });
  const c = s.project(mul(m, 1 - depth));
  return { d: polygon(pts), x: c[0], y: c[1], facing: s.facing(m) };
}

/** The circle of the hole's bore at `depth` below the surface (0 on the outside), as the ellipse it makes on the screen; undefined where it is too thin to draw. */
function bore(s: Surface, m: V3, radius: number, depth: number): Opening | undefined {
  const [t1, t2] = basis(m);
  const sr = Math.sin(radius), cr = Math.cos(radius) - depth;
  const c = s.project(mul(m, cr));
  const o = s.project([0, 0, 0]);
  const pa = s.project(mul(t1, sr));
  const pb = s.project(mul(t2, sr));
  const da = [pa[0] - o[0], pa[1] - o[1]];
  const db = [pb[0] - o[0], pb[1] - o[1]];
  const { rx, ry, angle } = ellipseOf([[da[0], db[0], 0], [da[1], db[1], 0]]);
  if (rx < 0.05) return undefined;
  const ry2 = Math.max(ry, 0.05);
  const ax = Math.cos(angle) * rx, ay = Math.sin(angle) * rx;
  const arcs = `a${num(rx)} ${num(ry2)} ${num((angle * 180) / Math.PI, 0)} 1 0`;
  return { d: `M${num(c[0] + ax)} ${num(c[1] + ay)}${arcs}${num(-2 * ax)} ${num(-2 * ay)}${arcs}${num(2 * ax)} ${num(2 * ay)}`, x: c[0], y: c[1], facing: s.facing(m) };
}

/** A hole's opening at a depth: a circle's ellipse, or a slot's outline. */
const opening = (s: Surface, holes: Holes, i: number, depth: number): Opening | undefined => {
  const m = holes.centres[i];
  const dir = holes.dirs?.[i];
  return holes.long !== undefined && dir !== undefined ? slot(s, m, dir, holes, depth) : bore(s, m, holes.radius, depth);
};

/** The light comes from the upper left, as it does everywhere else in the engine. */
const LIGHT: readonly [number, number] = [-0.62, -0.78];
/** The tones a wall is drawn in, darkest first, as amounts of the ball's colour mixed toward black. */
const TONES = [-0.6, -0.45, -0.3, -0.15] as const;

/** The signature of `holeLayers`, which a ball is handed so that its own module is the only one that carries the code. */
export type Drill = (s: Surface, id: string, holes: Holes, base: string, shape: (attrs: string) => string, minWidth: number) => HoleLayers;

export const holeLayers: Drill = (s, id, holes, base, shape, minWidth) => {
  const thick = holes.wall ?? 0.05;
  const front: Array<{ out: Opening; inn: Opening | undefined }> = [];
  const backOut: Opening[] = [];
  const backIn: Opening[] = [];
  for (let i = 0; i < holes.centres.length; i++) {
    const f = s.facing(holes.centres[i]);
    if (f >= 0.08) {
      const out = opening(s, holes, i, 0);
      if (out !== undefined) front.push({ out, inn: opening(s, holes, i, thick) });
    } else if (f <= -0.08) {
      const out = opening(s, holes, i, 0);
      const inn = opening(s, holes, i, thick);
      if (out !== undefined && inn !== undefined) {
        backOut.push(out);
        backIn.push(inn);
      }
    }
  }
  if (front.length === 0 && backOut.length === 0) return { defs: "", behind: "", edge: "", mask: undefined };

  const frontPath = front.map((h) => h.out.d).join("");
  const backOutPath = backOut.map((o) => o.d).join("");
  const backInPath = backIn.map((o) => o.d).join("");
  const key = hashOf(frontPath + "|" + backOutPath + "|" + backInPath);

  // The inside of the ball: lit a little where the light that comes through the near holes lands (low and to the right), dark toward the edge.
  let defs = `<radialGradient id="${id}i" cx=".62" cy=".66" r=".62"><stop offset="0" stop-color="${mix(base, -0.36)}"/><stop offset="1" stop-color="${mix(base, -0.72)}"/></radialGradient>`;
  let disc = shape(`fill="url(#${id}i)"`);
  if (backOut.length > 0) {
    // A far hole is open where its inner opening and its outer opening overlap: the bore leans away from you, so a hole near the far edge is a slit.
    defs += `<clipPath id="${id}o${key}"><path d="${backOutPath}"/></clipPath><mask id="${id}b${key}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="${backInPath}" fill="#000" clip-path="url(#${id}o${key})"/></mask>`;
    disc = shape(`fill="url(#${id}i)" mask="url(#${id}b${key})"`);
  }

  // The wall of each near hole: what is inside the outer opening and outside the inner one (the part of the bore that faces you), toned by whether it faces the light and how near the edge it is.
  const o = s.project([0, 0, 0]);
  const buckets: string[][] = TONES.map(() => []);
  for (const h of front) {
    if (h.inn === undefined) continue;
    const dx = h.out.x - o[0], dy = h.out.y - o[1];
    const d = Math.hypot(dx, dy) || 1;
    // The wall you see is the one on the far side of the hole, facing the middle of the ball on the screen.
    const lit = (-dx / d) * LIGHT[0] + (-dy / d) * LIGHT[1];
    const k = -0.3 + 0.2 * lit - 0.25 * (1 - h.out.facing);
    let best = 0;
    for (let i = 1; i < TONES.length; i++) if (Math.abs(TONES[i] - k) < Math.abs(TONES[best] - k)) best = i;
    buckets[best].push(h.out.d + h.inn.d);
  }
  const walls = buckets.map((b, i) => (b.length === 0 ? "" : `<path d="${b.join("")}" fill="${mix(base, TONES[i])}" fill-rule="evenodd"/>`)).join("");
  const behind = `<g clip-path="url(#${id}c)">${disc}${walls}</g>`;

  if (front.length === 0) return { defs, behind, edge: "", mask: undefined };
  // The outline of the near holes is written once and used three times.
  defs += `<path id="${id}f${key}" d="${frontPath}"/><mask id="${id}k${key}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><use href="#${id}f${key}" fill="#000"/></mask>`;
  // On the shell, round each cut: a soft shadow where the plastic turns in, and a thin lit edge (the cut face of the shell). Half of each stroke lies inside the cut and is masked away.
  const edge =
    `<use href="#${id}f${key}" fill="none" stroke="${mix(base, -0.6)}" stroke-width="${num(Math.max(1.1, minWidth * 0.8), 2)}" opacity=".22"/>` +
    `<use href="#${id}f${key}" fill="none" stroke="${mix(base, 0.5)}" stroke-width="${num(Math.max(0.3, minWidth * 0.3), 2)}" opacity=".5"/>`;
  return { defs, behind, edge, mask: `${id}k${key}` };
};
