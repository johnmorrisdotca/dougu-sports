// The ball renderer: one procedural engine for every sphere and every prolate ball. A ball is drawn in true 3D: a rotation, an orthographic projection, back faces dropped, panels cut at the limb
// along the limb itself, then radial-gradient shading and a grain that stays where it is while the ball turns. A ball is a `BallSpec`: its shape (the semi-axes of an ellipsoid), its
// view, its material and a `draw` function that lays panels, seams and dots on the unit sphere; the engine does the rest.
import { type BallFrameOptions, type Piece, grainDef, hasPrint, type PieceOptions, type PieceSize, type PrintOptions, type PrintRenderer, type ResolvedOptions, type ResolvedPaint, blend, escape, hashOf, labelled, mix, num, radians, resolveOptions, wrapPiece } from "./ball.core.ts";
import { type M3, type V3, add, apply, basis, cross, dot, ellipseOf, len, mul, norm, rotation, sampleRing, sub } from "./ball.math.ts";

/** How a ball takes the light. */
export interface Material {
  /** The colour of the shadowed side; by default the base colour made darker. */
  shade?: string;
  /** 0 (matt) to 1 (a hard bright highlight). */
  gloss: number;
  /** A polished metal: the sky above and the ground below are mirrored in it. */
  metal?: boolean;
  /** How dark the limb is, 0 to 1 (1 by default). */
  rim?: number;
  /** The grain: `f` is the noise's frequency per unit of the 100 by 100 box, `a` its relief. */
  grain?: { f: number; a: number; seed?: number };
}

/** What a ball's `draw` lays things with. Points are unit vectors on the sphere the ball is made on (an ellipsoid ball is stretched after). */
export interface Surface {
  /** True in the line style: a panel with `ink` is filled with the ink, a stroke without `deco` is drawn in it, and the rest is left out. */
  readonly line: boolean;
  /** The ball's radius in the box (the longest semi-axis). */
  readonly radius: number;
  /** The width of the thinnest line that still shows at this size, in box units. */
  readonly minWidth: number;
  /** The screen position of a point and how squarely it faces you (1 facing, 0 on the limb, below 0 hidden). */
  project(u: V3): [number, number, number];
  /** A closed polygon on the surface, cut at the limb. Its edges follow the sphere. `n` is the samples an edge gets. */
  panel(ring: readonly V3[], fill: string, o?: { ink?: boolean; opacity?: number; n?: number; rule?: "evenodd" }): string;
  /** Several closed polygons of one fill, drawn as one path (a smaller document than a path for each). */
  panels(rings: ReadonlyArray<readonly V3[]>, fill: string, o?: { ink?: boolean; opacity?: number; n?: number; rule?: "evenodd" }): string;
  /** A curve on the surface: only what faces you. `closed` joins its ends; `deco` marks a line that is not part of the ball's form (a highlight), which the line style leaves out. */
  stroke(pts: readonly V3[], colour: string, width: number, o?: StrokeOptions): string;
  /** Several curves drawn as one path. */
  strokes(curves: ReadonlyArray<readonly V3[]>, colour: string, width: number, o?: StrokeOptions): string;
  /** A raised seam: a shadow, the colour and a highlight along the curve. */
  seam(pts: readonly V3[], colour: string, width: number, o?: { closed?: boolean; light?: string; opacity?: number }): string;
  /** Small round marks lying on the surface (holes, dimples, dots): each is a cap of `radius` radians round its centre. */
  dots(centres: readonly V3[], radius: number, fill: string, o?: { opacity?: number; ink?: boolean; light?: boolean }): string;
  /** The facing of a point: 1 straight at you, 0 on the limb. */
  facing(u: V3): number;
  /** A point of space, in units of the ball's radius from its centre (not on the surface): its screen position and depth (positive is toward you). */
  space(p: V3): [number, number, number];
  /** The whole disc of the ball filled with a colour (a sphere's silhouette). */
  fill(colour: string): string;
  /** The ball's view, for a module that draws what the engine does not (`ball.region.ts`). Opaque to everything else. */
  readonly view: Geometry;
  /** Where a ball's printing sits: the middle of its label area in the ball's own frame, and the right-hand and upward directions there. Only a ball that is printed has one. */
  readonly home: HomeFrame | undefined;
}

export interface StrokeOptions {
  /** Digits kept after the point in the path (1 by default; lettering asks for 2). */
  digits?: number;
  closed?: boolean;
  ink?: boolean;
  deco?: boolean;
  opacity?: number;
  dx?: number;
  dy?: number;
  dash?: string;
}

export interface BallSpec {
  /** The semi-axes of the ellipsoid along x, y and z before the view turns it. A sphere is `[1, 1, 1]`; a football is longer along x. */
  axes?: V3;
  /**
   * Makes a prolate ball pointed at the ends. The ball is a body of revolution about its long axis whose radius at a distance x from the middle (as a fraction of the half length) is `(1 - x^2)^point`
   * times the cross-section's semi-axis: 0.5 is the ellipsoid, and nearer 1 the ends are drawn to a point (a football's). The cross-section's two semi-axes must be equal.
   */
  point?: number;
  /** The default view in degrees. */
  view: { yaw: number; pitch: number; roll: number };
  /** The main colour of the ball (what `tint` replaces). */
  base: string;
  /** The colour the whole ball is filled with before its panels are laid on, where it is not `base` (a soccer ball is white, its pentagons are `base`). */
  ground?: string;
  mat: Material;
  /** Lays the panels and seams. `base` is the main colour, or the tint; `accent` is the second colour or undefined. `custom` is what a caller asked to paint and print (a ball that takes it reads it; the rest ignore it). */
  draw: (s: Surface, base: string, accent: string | undefined, colors?: readonly [string, string, string], custom?: Custom) => string;
  /**
   * Where a ball carries a logo and lettering: the middle of the label area (`c`) and the way up there (`up`), as directions in the ball's own frame, how far it reaches from the middle (`reach`, radians),
   * the view that shows it (`view`, used instead of `view` when the caller prints something) and the ball's own word for the script and the stamp (`word`).
   */
  home?: { c: V3; up: V3; reach: number; view: { yaw: number; pitch: number; roll: number }; word: string };
  /** Where the ball's centre is in the 100 by 100 box (50, 50 by default): a hammer's head sits in a corner to leave room for the wire. */
  centre?: readonly [number, number];
  /** Where the ball is in space, in units of its radius from the middle of the whole (0, 0, 0 by default), turned with it: a hammer's head is at one end of the hammer, which turns about its middle. */
  at?: V3;
  /** The fraction of the box's radius the ball takes (1 by default): a hammer's head is small, to leave room for its wire. */
  fit?: number;
  /** What is attached to the ball and sticks out of it (a hammer's wire and handle): drawn behind the ball or in front of it, by what is nearer to you. */
  attach?: (s: Surface, base: string) => { behind: string; front: string };
}

/** The label area of a printed ball: its middle, and the right-hand and upward directions there, and how far it reaches. */
export interface HomeFrame {
  c: V3;
  ex: V3;
  up: V3;
  reach: number;
}

/** What a caller asked a ball to be painted and printed with. */
export interface Custom {
  paint: ResolvedPaint | undefined;
  print: PrintOptions | undefined;
  /** Draws the print, when the caller has it; without it a ball draws no print. */
  printer: PrintRenderer | undefined;
}

export const EPS = 1e-6;
const STEP = Math.PI / 18;

export interface Geometry {
  /** The centre of the ball on the screen, and the middle of the whole (where a point of `space` is measured from). */
  cx: number;
  cy: number;
  ox: number;
  oy: number;
  axes: V3;
  rot: M3;
  k: number;
  /** The unit sphere's point is visible when its dot with `w` is above 0. */
  w: V3;
  wl: number;
  /** The third row of the rotation: the direction of the eye in the ball's own frame. */
  rz: V3;
  /** The exponent of a pointed ball's profile, or undefined for an ellipsoid. */
  point: number | undefined;
}

/** How a point of the unit sphere is carried to the ball's surface: an ellipsoid's scaling, and for a pointed ball a narrowing of the cross-section toward the ends. */
const shapeOf = (g: Geometry, u: V3): V3 => {
  const f = g.point === undefined ? 1 : Math.max(0, 1 - u[0] * u[0]) ** (g.point - 0.5);
  return [u[0] * g.axes[0], u[1] * g.axes[1] * f, u[2] * g.axes[2] * f];
};

/** How squarely a point of the sphere faces the eye, before it is scaled: above 0 is the side you see. For an ellipsoid it is the dot of the point with `w`; for a pointed ball the surface's normal is worked out. */
export const visOf = (g: Geometry, u: V3): number => {
  if (g.point === undefined) return dot(u, g.w);
  const rest = Math.max(0, 1 - u[0] * u[0]);
  const a = g.axes[0];
  const b = g.axes[1];
  const nx = 2 * b * g.point * u[0] * rest ** (g.point - 0.5);
  return (g.rz[0] * nx + g.rz[1] * a * u[1] + g.rz[2] * a * u[2]) / (a * b);
};

export const project = (g: Geometry, u: V3): [number, number] => {
  const q = apply(g.rot, shapeOf(g, u));
  return [g.cx + g.k * q[0], g.cy - g.k * q[1]];
};

const point = (g: Geometry, u: V3): string => {
  const [x, y] = project(g, u);
  return `${num(x)} ${num(y)}`;
};

const crossing = (a: V3, b: V3, va: number, vb: number): V3 => {
  const t = va / (va - vb);
  return norm(add(mul(a, 1 - t), mul(b, t)));
};

/** The outline of a ring on the surface, cut where it passes behind the limb and joined along the limb. */
function ringPath(g: Geometry, ring: readonly V3[]): string {
  const vis = ring.map((p) => visOf(g, p));
  const start = vis.findIndex((v) => v > EPS);
  if (start < 0) return "";
  const n = ring.length;
  const out: string[] = [];
  let lastExit: V3 | undefined;
  out.push(`M${point(g, ring[start])}`);
  for (let j = 1; j <= n; j++) {
    const i = (start + j) % n;
    const p = (start + j - 1) % n;
    const vp = vis[p], vi = vis[i];
    if (vp > EPS && vi > EPS) {
      if (j < n) out.push(`L${point(g, ring[i])}`);
    } else if (vp > EPS) {
      lastExit = crossing(ring[p], ring[i], vp, vi);
      out.push(`L${point(g, lastExit)}`);
    } else if (vi > EPS && lastExit !== undefined) {
      const entry = crossing(ring[p], ring[i], vp, vi);
      for (const q of limbArc(g, lastExit, entry)) out.push(`L${point(g, q)}`);
      out.push(`L${point(g, entry)}`);
      if (j < n) out.push(`L${point(g, ring[i])}`);
    }
  }
  return `${out.join("")}Z`;
}

/** The points of the limb between two points on it, the short way round (the ends left out). */
function limbArc(g: Geometry, from: V3, to: V3): V3[] {
  const wn = norm(g.w);
  const e1 = norm(sub(from, mul(wn, dot(from, wn))));
  const e2 = cross(wn, e1);
  let delta = Math.atan2(dot(to, e2), dot(to, e1));
  if (delta === 0 && dot(to, e1) < 0) delta = Math.PI;
  const steps = Math.max(1, Math.ceil(Math.abs(delta) / STEP));
  const out: V3[] = [];
  for (let i = 1; i < steps; i++) {
    const t = (delta * i) / steps;
    out.push(add(mul(e1, Math.cos(t)), mul(e2, Math.sin(t))));
  }
  return out;
}

export interface Run {
  pts: Array<[number, number, number]>;
}

/** The parts of a curve that face you, each as screen points with their facing. The curve is cut exactly at the limb. */
export function visibleRuns(g: Geometry, pts: readonly V3[], closed: boolean): Run[] {
  const n = pts.length;
  const vis = pts.map((p) => visOf(g, p) / g.wl);
  const at = (u: V3, f: number): [number, number, number] => {
    const [x, y] = project(g, u);
    return [x, y, f];
  };
  const runs: Run[] = [];
  let cur: Run | undefined;
  const total = closed ? n : n - 1;
  // Start a closed curve at a hidden point so that no run is split at the start; a curve wholly facing you is one closed run.
  let first = 0;
  if (closed) {
    const hidden = vis.findIndex((v) => v <= 0);
    if (hidden < 0) {
      return [{ pts: [...pts.map((p, i) => at(p, vis[i])), at(pts[0], vis[0])] }];
    }
    first = hidden;
  }
  for (let j = 0; j < total; j++) {
    const i = (first + j) % n;
    const m = (first + j + 1) % n;
    const a = pts[i], b = pts[m];
    const va = vis[i], vb = vis[m];
    if (va > 0 && vb > 0) {
      if (cur === undefined) {
        cur = { pts: [at(a, va)] };
        runs.push(cur);
      }
      cur.pts.push(at(b, vb));
    } else if (va > 0) {
      const c = crossing(a, b, va * g.wl, vb * g.wl);
      if (cur === undefined) {
        cur = { pts: [at(a, va)] };
        runs.push(cur);
      }
      cur.pts.push(at(c, 0));
      cur = undefined;
    } else if (vb > 0) {
      const c = crossing(a, b, va * g.wl, vb * g.wl);
      cur = { pts: [at(c, 0), at(b, vb)] };
      runs.push(cur);
    }
  }
  return runs;
}

export const pathOf = (pts: Array<[number, number, number]>, digits = 1): string => pts.map((p, i) => `${i === 0 ? "M" : "L"}${num(p[0], digits)} ${num(p[1], digits)}`).join("");

/** A number written as short as SVG allows: no leading zero, and the space left out where the next number's own sign or point shows where it starts. */
const tight = (text: string, after: string): string => {
  const t = text.replace(/^(-?)0\./, "$1.");
  return after === "" || t.startsWith("-") || (t.startsWith(".") && after.includes(".")) ? t : ` ${t}`;
};

/** A run as a path of relative moves in `digits` decimals, written tight: about half the bytes of `pathOf`. Each step is the difference of the rounded points, so the line does not drift. */
function relativePath(pts: Array<[number, number, number]>, digits: number): string {
  const r = (v: number): number => Math.round(v * 10 ** digits) / 10 ** digits;
  const first = pts[0] as [number, number, number];
  let x = r(first[0]), y = r(first[1]);
  let out = `M${num(x, digits)} ${num(y, digits)}l`;
  let last = "";
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i] as [number, number, number];
    const nx = r(p[0]), ny = r(p[1]);
    for (const v of [nx - x, ny - y]) {
      const t = tight(num(v, digits), last);
      out += t;
      last = t.trim();
    }
    x = nx;
    y = ny;
  }
  return out;
}

/** A curve's visible parts as paths: a stroke is thinner where it turns toward the limb (three steps), so it does not sit on the ball like a wire. */
function runPaths(runs: Run[], colour: string, width: number, extra: string, digits = 1): string {
  const tiers: string[][] = [[], [], []];
  const factor = [1, 0.74, 0.5];
  const tierOf = (f: number): number => (f > 0.55 ? 0 : f > 0.25 ? 1 : 2);
  for (const run of runs) {
    let kind = -1;
    let piece: Array<[number, number, number]> = [];
    const flush = (): void => {
      if (piece.length > 1) tiers[kind].push(digits > 1 ? relativePath(piece, digits) : pathOf(piece, digits));
      piece = [];
    };
    for (const p of run.pts) {
      const k = tierOf(p[2]);
      if (k !== kind) {
        const last = piece.at(-1);
        flush();
        kind = k;
        piece = last === undefined ? [] : [last];
      }
      piece.push(p);
    }
    flush();
  }
  const make = (d: string[], w: number): string => (d.length === 0 ? "" : `<path d="${d.join("")}" fill="none" stroke="${colour}" stroke-width="${num(w, 2)}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`);
  return make(tiers[2], width * factor[2]) + make(tiers[1], width * factor[1]) + make(tiers[0], width);
}

function surfaceOf(g: Geometry, line: boolean, minWidth: number, home: Surface["home"]): Surface {
  const INK = "currentColor";
  const facing = (u: V3): number => visOf(g, u) / g.wl;
  const s: Surface = {
    line,
    radius: g.k * Math.max(...g.axes),
    minWidth,
    project: (u) => {
      const [x, y] = project(g, u);
      return [x, y, facing(u)];
    },
    facing,
    space: (p) => {
      const q = apply(g.rot, p);
      return [g.ox + g.k * q[0], g.oy - g.k * q[1], q[2]];
    },
    panel(ring, fill, o) {
      if (line && o?.ink !== true) return "";
      const d = ringPath(g, sampleRing(ring, o?.n ?? 4));
      if (d === "") return "";
      return `<path d="${d}" fill="${line ? INK : fill}"${o?.rule === undefined ? "" : ` fill-rule="${o.rule}"`}${o?.opacity === undefined ? "" : ` opacity="${o.opacity}"`}/>`;
    },
    panels(rings, fill, o) {
      if (line && o?.ink !== true) return "";
      const d = rings.map((ring) => ringPath(g, sampleRing(ring, o?.n ?? 4))).join("");
      if (d === "") return "";
      return `<path d="${d}" fill="${line ? INK : fill}"${o?.rule === undefined ? "" : ` fill-rule="${o.rule}"`}${o?.opacity === undefined ? "" : ` opacity="${o.opacity}"`}/>`;
    },
    fill(colour) {
      if (line) return "";
      const sil = silhouette(g);
      return sil.d === "" ? `<circle ${sil.tag} fill="${colour}"/>` : `<path d="${sil.d}" fill="${colour}"/>`;
    },
    view: g,
    home,
    stroke: (pts, colour, width, o) => s.strokes([pts], colour, width, o),
    strokes(curves, colour, width, o) {
      if (line && (o?.deco === true || o?.ink === false)) return "";
      const runs = curves.flatMap((pts) => visibleRuns(g, pts, o?.closed === true));
      if (runs.length === 0) return "";
      const extra = `${o?.opacity === undefined || line ? "" : ` opacity="${o.opacity}"`}${o?.dash === undefined ? "" : ` stroke-dasharray="${o.dash}"`}${o?.dx === undefined && o?.dy === undefined ? "" : ` transform="translate(${o.dx ?? 0} ${o.dy ?? 0})"`}`;
      return runPaths(runs, line ? INK : colour, Math.max(width, minWidth), extra, o?.digits);
    },
    seam(pts, colour, width, o) {
      if (line) return s.stroke(pts, colour, width, { closed: o?.closed });
      const closed = o?.closed === true;
      const w = Math.max(width, minWidth);
      return (
        s.stroke(pts, "#000", w * 1.25, { closed, opacity: 0.28, dx: w * 0.18, dy: w * 0.22 }) +
        s.stroke(pts, colour, w, { closed, opacity: o?.opacity }) +
        s.stroke(pts, o?.light ?? "#fff", w * 0.32, { closed, opacity: 0.38, dx: -w * 0.16, dy: -w * 0.2 })
      );
    },
    dots(centres, radius, fill, o) {
      if (line && o?.ink !== true) return "";
      const sr = Math.sin(radius), cr = Math.cos(radius);
      const d: string[] = [];
      for (const m of centres) {
        if (facing(m) < 0.08) continue;
        const [t1, t2] = basis(m);
        const centre = project(g, mul(m, cr));
        const pa = project(g, mul(t1, sr));
        const pb = project(g, mul(t2, sr));
        const p0 = project(g, [0, 0, 0]);
        const da: [number, number] = [pa[0] - p0[0], pa[1] - p0[1]];
        const db: [number, number] = [pb[0] - p0[0], pb[1] - p0[1]];
        const { rx, ry, angle } = ellipseOf([[da[0], db[0], 0], [da[1], db[1], 0]]);
        if (rx < 0.05) continue;
        const ax = Math.cos(angle) * rx, ay = Math.sin(angle) * rx;
        const deg = num((angle * 180) / Math.PI, 0);
        const arcs = `a${num(rx)} ${num(Math.max(ry, 0.05))} ${deg} 1 0`;
        d.push(`M${num(centre[0] + ax)} ${num(centre[1] + ay)}${arcs}${num(-2 * ax)} ${num(-2 * ay)}${arcs}${num(2 * ax)} ${num(2 * ay)}`);
      }
      if (d.length === 0) return "";
      const path = d.join("");
      const hi = o?.light === false || line ? "" : `<path d="${path}" fill="none" stroke="#fff" stroke-width="${num(Math.max(0.35, minWidth * 0.3), 2)}" opacity=".3" transform="translate(.25 .35)"/>`;
      return `${hi}<path d="${path}" fill="${line ? INK : fill}"${o?.opacity === undefined ? "" : ` opacity="${o.opacity}"`}/>`;
    },
  };
  return s;
}

/** The silhouette of the ball in the box: a circle for a sphere, an ellipse otherwise, as the shape every layer is clipped to and shaded on. */
function silhouette(g: Geometry): { tag: string; d: string } {
  if (g.point !== undefined) {
    // A pointed ball is convex, so its outline is the hull of its projected surface.
    const pts: Array<[number, number]> = [];
    for (let i = 0; i <= 36; i++) {
      const x = Math.cos((Math.PI * i) / 36);
      const r = Math.sqrt(Math.max(0, 1 - x * x));
      for (let j = 0; j < 36; j++) pts.push(project(g, [x, r * Math.cos((2 * Math.PI * j) / 36), r * Math.sin((2 * Math.PI * j) / 36)]));
    }
    pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const turn = (o: [number, number], a: [number, number], b: [number, number]): number => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const half = (list: Array<[number, number]>): Array<[number, number]> => {
      const hull: Array<[number, number]> = [];
      for (const p of list) {
        while (hull.length >= 2 && turn(hull[hull.length - 2], hull[hull.length - 1], p) <= 0) hull.pop();
        hull.push(p);
      }
      hull.pop();
      return hull;
    };
    const hull = [...half(pts), ...half([...pts].reverse())];
    return { tag: "", d: `M${hull.map((p) => `${num(p[0], 1)} ${num(p[1], 1)}`).join("L")}Z` };
  }
  const rows: [V3, V3] = [
    [g.rot[0][0] * g.axes[0], g.rot[0][1] * g.axes[1], g.rot[0][2] * g.axes[2]],
    [-g.rot[1][0] * g.axes[0], -g.rot[1][1] * g.axes[1], -g.rot[1][2] * g.axes[2]],
  ];
  const { rx, ry, angle } = ellipseOf(rows);
  const a = g.k * rx, b = g.k * ry;
  if (Math.abs(a - b) < 0.02) return { tag: `cx="${num(g.cx, 2)}" cy="${num(g.cy, 2)}" r="${num(a, 2)}"`, d: "" };
  const ax = Math.cos(angle) * a, ay = Math.sin(angle) * a;
  const deg = num((angle * 180) / Math.PI, 1);
  const arcs = `${num(a, 2)} ${num(b, 2)} ${deg} 1 0`;
  return { tag: "", d: `M${num(g.cx + ax, 2)} ${num(g.cy + ay, 2)}A${arcs} ${num(g.cx - ax, 2)} ${num(g.cy - ay, 2)}A${arcs} ${num(g.cx + ax, 2)} ${num(g.cy + ay, 2)}Z` };
}

/** The sky and ground mirrored in a polished ball: bright above, a dark horizon, a lighter bounce below. */
const metalDef = (id: string, on: boolean): string =>
  on
    ? `<linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".3" stop-color="#fff" stop-opacity=".15"/><stop offset=".52" stop-color="#000" stop-opacity=".4"/><stop offset=".75" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient>`
    : "";

/** Draws a ball: the document for a spec, the options and a turn in radians. */
export function drawBall(title: string, key: string, spec: BallSpec, opts: ResolvedOptions, turn: { yaw: number; pitch: number; roll: number }, turning: boolean): string {
  const axes = spec.axes ?? [1, 1, 1];
  const rot = rotation(turn.yaw, turn.pitch, turn.roll);
  const rz: V3 = [rot[2][0], rot[2][1], rot[2][2]];
  const w: V3 = [rz[0] / axes[0], rz[1] / axes[1], rz[2] / axes[2]];
  const ox = spec.centre?.[0] ?? 50, oy = spec.centre?.[1] ?? 50;
  const kk = (46 * (spec.fit ?? 1)) / Math.max(...axes);
  const away = apply(rot, spec.at ?? [0, 0, 0]);
  const g: Geometry = { ox, oy, cx: ox + kk * away[0], cy: oy - kk * away[1], axes, rot, k: (46 * (spec.fit ?? 1)) / Math.max(...axes), w, wl: len(w), rz, point: spec.point };
  const line = opts.style === "line";
  const minWidth = 80 / opts.size;
  // A ball with a second colour of its own (a soccer ball's panels on a white ground) paints the body as the ground and the second colour as the panels; one with a single colour takes the body as its main colour.
  const paint = opts.paint;
  const two = spec.ground !== undefined;
  const base = opts.tint ?? (two ? paint?.second : paint?.body) ?? spec.base;
  const ground = two ? paint?.body ?? spec.ground : undefined;
  const surface = surfaceOf(g, line, minWidth, homeOf(spec));
  const layers = spec.draw(surface, base, opts.accent, opts.colors, { paint: opts.paint, print: opts.print, printer: opts.printer });
  const sil = silhouette(g);
  const id = `k${hashOf(`${key}|${opts.style}|${opts.tint ?? ""}|${opts.accent ?? ""}${opts.colors === undefined ? "" : `|${opts.colors.join("")}`}|${sil.tag}${sil.d}${paint === undefined && (opts.print === undefined || opts.printer === undefined) ? "" : `|${JSON.stringify([paint, opts.printer === undefined ? undefined : opts.print])}`}`)}`;
  // A long outline (the hull of a pointed ball) is written once, in the definitions, and used wherever the silhouette is.
  const long = sil.d.length > 400;
  const outline = long ? `<path id="${id}s" d="${sil.d}"/>` : "";
  const shape = (attrs: string): string => (sil.d === "" ? `<circle ${sil.tag} ${attrs}/>` : long ? `<use href="#${id}s" ${attrs}/>` : `<path d="${sil.d}" ${attrs}/>`);
  if (line) {
    const at = spec.attach?.(surface, base);
    const body = `${at?.behind ?? ""}${shape(`fill="none" stroke="currentColor" stroke-width="${num(Math.max(3, minWidth * 1.6), 2)}"`)}<g>${layers}</g>${at?.front ?? ""}`;
    return wrapPiece({ title, size: opts.size, theme: opts.theme, defs: outline, body: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g>` });
  }
  const m = spec.mat;
  const painted = paint?.body !== undefined || paint?.second !== undefined;
  const shade = painted && !two ? mix(paint?.second === undefined || paint.body === undefined ? base : blend(paint.body, paint.second, 0.5), -0.6) : m.shade ?? mix(base, -0.62);
  const grain = opts.grain ?? (opts.size >= 48 && !turning);
  const gr = grain && m.grain !== undefined ? m.grain : undefined;
  const rim = m.rim ?? 1;
  const stop = (o: number, colour: string, a: number): string => `<stop offset="${o}" stop-color="${colour}" stop-opacity="${num(a, 2)}"/>`;
  const defs =
    outline +
    `<clipPath id="${id}c">${shape("")}</clipPath>` +
    `<radialGradient id="${id}d" cx=".42" cy=".36" r=".86" fx=".36" fy=".3">${stop(0, shade, 0)}${stop(0.42, shade, 0)}${stop(0.78, shade, 0.34 * rim)}${stop(1, shade, 0.78 * rim)}</radialGradient>` +
    `<radialGradient id="${id}h" cx=".34" cy=".28" r=".4">${stop(0, "#fff", 0.28 + m.gloss * 0.62)}${stop(0.32, "#fff", 0.1 + m.gloss * 0.22)}${stop(1, "#fff", 0)}</radialGradient>` +
    `<radialGradient id="${id}b" cx=".5" cy=".5" r=".5">${stop(0.8, "#fff", 0)}${stop(1, "#fff", 0.16)}</radialGradient>` +
    (gr === undefined
      ? ""
      : grainDef(id, gr.f, gr.a, gr.seed));
  const inner = `<g clip-path="url(#${id}c)"${gr === undefined ? "" : ` filter="url(#${id}n)"`}>${shape(`fill="${ground ?? spec.ground ?? base}"`)}${layers}</g>`;
  const metal = m.metal === true ? shape(`fill="url(#${id}m)"`) : "";
  const overlays = shape(`fill="url(#${id}d)"`) + metal + shape(`fill="url(#${id}b)"`) + shape(`fill="url(#${id}h)"`);
  const at = spec.attach?.(surface, base);
  return wrapPiece({ title, size: opts.size, theme: opts.theme, defs: defs + metalDef(id, m.metal === true), body: `${at?.behind ?? ""}${inner}${overlays}${at?.front ?? ""}` });
}

/** A ball's label area as a surface sees it: the middle, the right-hand and the upward direction, orthogonal, and how far it reaches. */
function homeOf(spec: BallSpec): Surface["home"] {
  const h = spec.home;
  if (h === undefined) return undefined;
  const c = norm(h.c);
  const ex = norm(cross(h.up, c));
  return { c, ex, up: cross(c, ex), reach: h.reach };
}

const finite = (v: number | undefined): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** What `defineBall` takes. */
export interface BallDef {
  id: string;
  en: string;
  ja: string;
  spec: BallSpec;
  size: PieceSize;
}

/** A ball from its definition: the `Piece` the registry and the gallery take. */
export function defineBall(def: BallDef): Piece<BallSpec> {
  const render = (o: BallFrameOptions | undefined, turning: boolean): string => {
    const opts = resolveOptions(o);
    const view = hasPrint(opts.print) && opts.printer !== undefined && opts.style !== "line" && def.spec.home !== undefined ? def.spec.home.view : def.spec.view;
    return drawBall(escape(def.en), def.id, def.spec, opts, { yaw: radians(view.yaw + finite(o?.yaw), 0), pitch: radians(view.pitch + finite(o?.pitch), 0), roll: radians(view.roll + finite(o?.roll), 0) }, turning);
  };
  return {
    id: def.id,
    en: def.en,
    ja: def.ja,
    source: "generated",
    kind: "ball",
    model: def.spec,
    size: def.size,
    svg: labelled(def.en, def.ja, (o?: PieceOptions) => render(o, false)),
    frame: labelled(def.en, def.ja, (o?: BallFrameOptions) => render(o, true)),
  };
}
