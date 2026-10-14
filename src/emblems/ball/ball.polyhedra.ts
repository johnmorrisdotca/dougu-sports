// The truncated icosahedron: the 32 panels of a classic soccer ball (12 pentagons and 20 hexagons), as rings of unit vectors. Each vertex is on an edge of an icosahedron, a third of the way
// along it; the edges between vertices follow the sphere (spherical interpolation), so the panels bulge as an inflated ball's do.
import { type V3, add, arc, cross, dot, mul, norm, slerp, sub } from "./ball.math.ts";

const PHI = (1 + Math.sqrt(5)) / 2;

export interface Truncated {
  pentagons: V3[][];
  hexagons: V3[][];
  /** The centre of each pentagon and hexagon, same order. */
  pentagonCentres: V3[];
  hexagonCentres: V3[];
  /** Every edge between two panels once, as a curve on the sphere. */
  edges: V3[][];
  /** For each hexagon, the midpoints of the three edges it shares with a pentagon (alternate edges). */
  hexagonPentagonSides: V3[][];
}

let cached: Truncated | undefined;

export function truncatedIcosahedron(samples = 4): Truncated {
  if (cached !== undefined && samples === 4) return cached;
  const verts: V3[] = [];
  for (const a of [-1, 1]) for (const b of [-PHI, PHI]) verts.push(norm([0, a, b]), norm([a, b, 0]), norm([b, 0, a]));
  const near = (a: V3, b: V3): boolean => Math.abs(dot(a, b) - 1 / Math.sqrt(5)) < 1e-6;
  const third = (a: number, b: number): V3 => slerp(verts[a], verts[b], 1 / 3);
  const pentagons: V3[][] = [];
  const pentagonCentres: V3[] = [];
  verts.forEach((c, i) => {
    const nb = verts.map((_, j) => j).filter((j) => j !== i && near(c, verts[j]));
    const ex = norm(sub(verts[nb[0]], mul(c, dot(verts[nb[0]], c))));
    const ey = cross(c, ex);
    nb.sort((p, q) => Math.atan2(dot(verts[p], ey), dot(verts[p], ex)) - Math.atan2(dot(verts[q], ey), dot(verts[q], ex)));
    pentagons.push(nb.map((j) => third(i, j)));
    pentagonCentres.push(c);
  });
  const hexagons: V3[][] = [];
  const hexagonCentres: V3[] = [];
  const hexagonPentagonSides: V3[][] = [];
  for (let i = 0; i < 12; i++) {
    for (let j = i + 1; j < 12; j++) {
      if (!near(verts[i], verts[j])) continue;
      for (let k = j + 1; k < 12; k++) {
        if (!near(verts[i], verts[k]) || !near(verts[j], verts[k])) continue;
        hexagons.push([third(i, j), third(j, i), third(j, k), third(k, j), third(k, i), third(i, k)]);
        hexagonCentres.push(norm(add(add(verts[i], verts[j]), verts[k])));
        // The edges P(i,k)-P(i,j), P(j,i)-P(j,k) and P(k,j)-P(k,i) touch a pentagon (the one at i, j and k).
        const mid = (a: V3, b: V3): V3 => norm(add(a, b));
        hexagonPentagonSides.push([mid(third(i, k), third(i, j)), mid(third(j, i), third(j, k)), mid(third(k, j), third(k, i))]);
      }
    }
  }
  const seen = new Set<string>();
  const edges: V3[][] = [];
  for (const ring of [...pentagons, ...hexagons]) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      const key = [a, b].map((v) => v.map((x) => Math.round(x * 1000)).join(",")).sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(arc(a, b, samples));
    }
  }
  const result: Truncated = { pentagons, hexagons, pentagonCentres, hexagonCentres, edges, hexagonPentagonSides };
  if (samples === 4) cached = result;
  return result;
}

/** A ring pulled toward its centre by a fraction, on the sphere: the face inside the seam. */
export function shrink(ring: readonly V3[], centre: V3, by: number): V3[] {
  return ring.map((p) => norm(add(mul(p, 1 - by), mul(centre, by))));
}
