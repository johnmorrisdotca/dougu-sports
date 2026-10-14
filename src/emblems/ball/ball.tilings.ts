// Tilings of the sphere for the soccer balls with other panel counts than the 32 of the classic one. Each is worked out here from a polyhedron or a curve, never copied from a ball: the 26 panels are the
// faces of a rhombicuboctahedron, the 12 the faces of a dodecahedron, the 14 a truncated cube whose twelve long edges are bent into an S (so the six octagons become propellers and the eight
// corners stay triangles), and the 6 a ring of twisted gores. Every panel is a ring of unit vectors; the edges between vertices follow the sphere (spherical interpolation), as an inflated ball's do.
import { type V3, add, apply, arc, cross, dot, len, lonLat, mul, norm, rotation, slerp, sub } from "./ball.math.ts";

const PHI = (1 + Math.sqrt(5)) / 2;

/** A tiling: the panels with their centres, and every edge between two panels once. */
export interface Tiling {
  /** Each panel as a ring of unit vectors, in order round its centre. */
  panels: V3[][];
  centres: V3[];
  /** Which kind each panel is (its position in `KINDS` of the tiling). */
  kinds: number[];
  /** Every seam once, as a curve on the sphere. */
  seams: V3[][];
}

const signs = [-1, 1] as const;

/** The vertices of a solid, each normalised onto the unit sphere, with no point twice. */
function unique(points: V3[]): V3[] {
  const out: V3[] = [];
  for (const p of points) if (!out.some((q) => len(sub(p, q)) < 1e-6)) out.push(p);
  return out;
}

/** The three coordinates in every order. */
const orders = (a: number, b: number, c: number): V3[] => [[a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]];

/** Every vertex of a solid on a face: the ones farthest along the face's outward direction, in order round it. */
function ringOf(verts: readonly V3[], centre: V3): V3[] {
  const top = Math.max(...verts.map((v) => dot(v, centre)));
  const on = verts.filter((v) => dot(v, centre) > top - 1e-6);
  const ex = norm(sub(on[0], mul(centre, dot(on[0], centre))));
  const ey = cross(centre, ex);
  return on.sort((p, q) => Math.atan2(dot(p, ey), dot(p, ex)) - Math.atan2(dot(q, ey), dot(q, ex)));
}

const keyOf = (v: V3): string => v.map((x) => Math.round(x * 1000)).join(",");

/** The seams of a set of rings: each edge once, as an arc of `samples` steps. */
function seamsOf(rings: readonly V3[][], samples: number): V3[][] {
  const seen = new Set<string>();
  const out: V3[][] = [];
  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      const key = [keyOf(a), keyOf(b)].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(arc(a, b, samples));
    }
  }
  return out;
}

const tiling = (verts: readonly V3[], centres: readonly V3[], kinds: readonly number[], samples: number): Tiling => {
  const panels = centres.map((c) => ringOf(verts, c));
  return { panels, centres: [...centres], kinds: [...kinds], seams: seamsOf(panels, samples) };
};

let rhombi: Tiling | undefined;

/**
 * The 26-panel layout: a rhombicuboctahedron. Its 24 vertices are the permutations of (+-1, +-1, +-(1 + sqrt 2)); its faces are 8 triangles (about the corners of a cube, kind 0), 6 squares about the
 * face directions (kind 1) and 12 squares about the edge directions (kind 2).
 */
export function rhombicuboctahedron(): Tiling {
  if (rhombi !== undefined) return rhombi;
  const L = 1 + Math.SQRT2;
  const verts = unique(signs.flatMap((a) => signs.flatMap((b) => signs.flatMap((c) => orders(a, b, c * L)))).map(norm));
  const corners: V3[] = [];
  const faces: V3[] = [];
  const edges: V3[] = [];
  for (const a of signs) for (const b of signs) for (const c of signs) corners.push(norm([a, b, c]));
  for (const a of signs) faces.push([a, 0, 0], [0, a, 0], [0, 0, a]);
  for (const a of signs) for (const b of signs) edges.push(norm([a, b, 0]), norm([a, 0, b]), norm([0, a, b]));
  rhombi = tiling(verts, [...corners, ...faces, ...edges], [...corners.map(() => 0), ...faces.map(() => 1), ...edges.map(() => 2)], 5);
  return rhombi;
}

type Dodecahedron = Tiling & { colour: number[] };
let dodeca: Dodecahedron | undefined;

/**
 * The 12-panel layout: a dodecahedron. Its 20 vertices are (+-1, +-1, +-1) and the cyclic permutations of (0, +-1/phi, +-phi); its 12 pentagons are about the directions of an icosahedron's vertices,
 * (+-1, 0, +-phi) and its cyclic permutations. `colour` gives each pentagon one of four colours so that no two neighbours share one (the icosahedron's vertices can be coloured with four).
 */
export function dodecahedron(): Dodecahedron {
  if (dodeca !== undefined) return dodeca;
  const verts: V3[] = [];
  for (const a of signs) for (const b of signs) for (const c of signs) verts.push(norm([a, b, c]));
  for (const a of signs) for (const b of signs) verts.push(norm([0, a / PHI, b * PHI]), norm([a / PHI, b * PHI, 0]), norm([b * PHI, 0, a / PHI]));
  const centres: V3[] = [];
  for (const a of signs) for (const b of signs) centres.push(norm([a, 0, b * PHI]), norm([0, b * PHI, a]), norm([b * PHI, a, 0]));
  const t = tiling(verts, centres, centres.map(() => 0), 5);
  // Neighbours are at the icosahedron's edge angle: cos = 1/sqrt 5.
  const next = (i: number, j: number): boolean => Math.abs(dot(centres[i], centres[j]) - 1 / Math.sqrt(5)) < 1e-6;
  const colour: number[] = centres.map(() => -1);
  const paint = (i: number): boolean => {
    if (i === centres.length) return true;
    for (let c = 0; c < 4; c++) {
      if (centres.every((_, j) => j >= i || !next(i, j) || colour[j] !== c)) {
        colour[i] = c;
        if (paint(i + 1)) return true;
      }
    }
    colour[i] = -1;
    return false;
  };
  paint(0);
  dodeca = { ...t, colour };
  return dodeca;
}

/** A point of the arc from `a` to `b`, `t` of the way along it, pushed sideways (along the sphere, square to the arc) by `lift` times the chord. */
function bent(a: V3, b: V3, t: number, lift: number, ease = 0): V3 {
  const p = slerp(a, b, t);
  const tangent = norm(sub(b, mul(p, dot(b, p))));
  const side = cross(p, tangent);
  return norm(add(p, mul(side, lift * len(sub(b, a)) * Math.sin(2 * Math.PI * t) * (1 - ease + ease * Math.sin(Math.PI * t)))));
}

export interface Propellers {
  /** The eight triangles, about the corners of a cube. */
  triangles: V3[][];
  /** The six propellers, about the faces of a cube, as dense rings (use them with one sample per edge). */
  propellers: V3[][];
  /** Every seam once: the 24 straight edges of the triangles and the 12 S-curves between propellers. */
  seams: V3[][];
  triangleCentres: V3[];
  propellerCentres: V3[];
  /** The axis of the cube each propeller is on (0 for x, 1 for y, 2 for z). */
  axis: number[];
}

let props: Map<number, Propellers> | undefined;

/**
 * The 14-panel layout: a truncated cube (vertices the permutations of (+-xi, +-1, +-1); the regular one has xi = sqrt 2 - 1, and 0.42 here makes the triangles a little larger) has 8 triangles and
 * 6 octagons, and the octagons meet each other along 12 edges. Each of those edges is bent into an S: `lift` times its length to the side a quarter of the way along and the same the other way
 * three quarters of the way along (eased to meet the corners gently), so the curve is the same turned half a turn about the edge's middle, and the tiling keeps the cube's rotations (and loses its
 * mirrors, so it has a hand). The octagons then have four straight sides, against the triangles, and four S-shaped ones: propellers.
 */
export function propellers14(lift = 0.2, steps = 14, xi = 0.42, ease = 0.5): Propellers {
  props ??= new Map();
  const key = lift * 1000 + steps + xi * 1e6 + ease * 1e9;
  const hit = props.get(key);
  if (hit !== undefined) return hit;
  const verts = unique(signs.flatMap((a) => signs.flatMap((b) => signs.flatMap((c) => orders(a * xi, b, c)))).map(norm));
  const cornerDirs: V3[] = [];
  for (const a of signs) for (const b of signs) for (const c of signs) cornerDirs.push(norm([a, b, c]));
  const faceDirs: V3[] = [];
  for (const a of signs) faceDirs.push([a, 0, 0], [0, a, 0], [0, 0, a]);
  // Two vertices that differ in one coordinate only are the ends of an edge between two octagons.
  const raw = (v: V3): V3 => {
    const m = Math.max(...v.map(Math.abs));
    return [v[0] / m, v[1] / m, v[2] / m];
  };
  const betweenOctagons = (a: V3, b: V3): boolean => {
    const x = raw(a), y = raw(b);
    return [0, 1, 2].filter((i) => Math.abs(x[i] - y[i]) > 1e-6).length === 1;
  };
  const triangles = cornerDirs.map((c) => ringOf(verts, c));
  const propellers = faceDirs.map((f) => {
    const ring = ringOf(verts, f);
    const out: V3[] = [];
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      if (!betweenOctagons(a, b)) {
        out.push(...arc(a, b, 4).slice(0, 4));
        continue;
      }
      // The same curve from either octagon: it is defined from the end that comes first, and walked backwards from the other.
      const forward = keyOf(a) < keyOf(b);
      const [p, q] = forward ? [a, b] : [b, a];
      for (let k = 0; k < steps; k++) out.push(bent(p, q, forward ? k / steps : 1 - k / steps, lift, ease));
    }
    return out;
  });
  const seams: V3[][] = seamsOf(triangles, 6);
  const seen = new Set<string>();
  for (const f of faceDirs) {
    const ring = ringOf(verts, f);
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      if (!betweenOctagons(a, b)) continue;
      const [p, q] = keyOf(a) < keyOf(b) ? [a, b] : [b, a];
      const k = `${keyOf(p)}|${keyOf(q)}`;
      if (seen.has(k)) continue;
      seen.add(k);
      seams.push(Array.from({ length: steps + 1 }, (_, j) => bent(p, q, j / steps, lift, ease)));
    }
  }
  const result: Propellers = { triangles, propellers, seams, triangleCentres: cornerDirs, propellerCentres: faceDirs, axis: faceDirs.map((f) => f.findIndex((x) => x !== 0)) };
  props.set(key, result);
  return result;
}

export interface Gores {
  /** Each panel as a ring running up one seam and down the next. */
  panels: V3[][];
  centres: V3[];
  /** The seams, each from one pole to the other. */
  seams: V3[][];
  /** Each panel cut across into `bands` pieces, so that every piece is small enough to be drawn as a plain polygon; `gore` is the panel a piece is of. */
  pieces: Array<{ ring: V3[]; gore: number }>;
}

/**
 * Six (or `count`) gores: panels between seams that each run from one pole to the other and turn through `twist` degrees of longitude on the way, so the seams are long S-like spirals. The
 * whole is then tilted by the rotation `tilt` (yaw, pitch and roll in degrees) so that the poles are not on the ball's spin axis.
 */
export function gores(count = 6, twist = 150, tilt: readonly [number, number, number] = [0, 0, 0], steps = 24, bands = 4): Gores {
  const m = rotation((tilt[0] * Math.PI) / 180, (tilt[1] * Math.PI) / 180, (tilt[2] * Math.PI) / 180);
  const at = (i: number, s: number): V3 => apply(m, lonLat((2 * Math.PI * i) / count + ((twist * Math.PI) / 180) * (s / 2), (s * Math.PI) / 2));
  const seam = (i: number): V3[] => Array.from({ length: steps + 1 }, (_, k) => at(i, -1 + (2 * k) / steps));
  const seams = Array.from({ length: count }, (_, i) => seam(i));
  const panels = seams.map((up, i) => {
    const down = [...seam((i + 1) % count)].reverse();
    return [...up, ...down.slice(1, -1)];
  });
  const centres = panels.map((_, i) => apply(m, lonLat((2 * Math.PI * (i + 0.5)) / count, 0)));
  const per = steps / bands;
  const pieces: Gores["pieces"] = [];
  for (let i = 0; i < count; i++) {
    const left = seams[i], right = seams[(i + 1) % count];
    for (let b = 0; b < bands; b++) {
      const from = b * per, to = (b + 1) * per;
      pieces.push({ ring: [...left.slice(from, to + 1), ...right.slice(from, to + 1).reverse()], gore: i });
    }
  }
  return { panels, centres, seams, pieces };
}
