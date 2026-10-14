// The prolate balls: American and Canadian football, rugby and Australian football. Each is an ellipsoid longer along x, with four panels whose seams run tip to tip.
import { add, arc, greatCircle, norm, slerp, smallCircle } from "./ball.math.ts";
import type { V3 } from "./ball.math.ts";
import type { Surface } from "./ball.engine.ts";

/** The point on the meridian at angle `a` from the top (+y) toward +x, in the plane z = 0. */
export const meridian = (a: number): V3 => [Math.sin(a), Math.cos(a), 0];

/** The lace of an American or Canadian football: `count` laces across a slot along the top meridian. */
export function laces(s: Surface, lace: string, slot: string, count = 8, span = 0.62, reach = 0.17): string {
  const top = Array.from({ length: 25 }, (_, i) => meridian(-span + (2 * span * i) / 24));
  let out = s.stroke(top, slot, 1.2, { ink: true });
  const cross: V3[][] = [];
  for (let i = 0; i < count; i++) {
    const a = -span * 0.82 + (2 * span * 0.82 * i) / (count - 1);
    const m = meridian(a);
    cross.push([norm(add(m, [0, 0, -reach])), norm(add(m, [0, 0, reach]))]);
  }
  out += s.stroke(top, lace, 1.7, { ink: true });
  for (const c of cross) out += s.seam([c[0], slerp(c[0], c[1], 0.5), c[1]], lace, 1.9);
  return out;
}

/** The four seams of a panelled football: two great circles through the tips, at right angles. */
export const footballSeams = (rotate = 0): V3[][] => [greatCircle([0, Math.cos(rotate), Math.sin(rotate)], 96), greatCircle([0, -Math.sin(rotate), Math.cos(rotate)], 96)];

/** A ring round the ball, near one tip: the white stripes of a Canadian football. */
export const tipRing = (sign: 1 | -1, angle: number, n = 72): V3[] => smallCircle([sign, 0, 0], angle, n);

/** A point on the long axis' meridian at `lon` round the axis, `along` radians from the equator toward +x. */
export const onBall = (along: number, round: number): V3 => norm([Math.sin(along), Math.cos(along) * Math.cos(round), Math.cos(along) * Math.sin(round)]);

/** The panel between the seam at `round` radians round the long axis and the seam a quarter turn on: a lune from tip to tip. Its first three points are the first seam. */
export const lune = (round: number): V3[] => [onBall(Math.PI / 2, round), onBall(0, round), onBall(-Math.PI / 2, round), onBall(0, round + Math.PI / 2)];

/** The seam at `round` radians round the long axis: from one tip to the other, sampled along the sphere. */
export const seamAt = (round: number): V3[] => [...arc(onBall(Math.PI / 2, round), onBall(0, round), 10), ...arc(onBall(0, round), onBall(-Math.PI / 2, round), 10).slice(1)];
