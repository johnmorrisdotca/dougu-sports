// A polished silver ball held up on three thin rods that lean forward from a low, rounded, triangular plinth: the WNBA championship trophy. The pieces are placed in 3D (`framed` in emblem.lathe.ts; the helpers are in
// lathe.framed.ts): a sphere with its seams cut as grooves, three tubes that rise from small collars and meet under it, and a plinth of facets (a flat wall, a bevel and a top) that is the one thing the engraving is set on.
// Drawn for this package from photographs of the real trophy (docs/likeness.md); the maker's mark, the league's mark and every letter on it are left out.
import { type Gradient, type Rgb, mix } from "./emblem.core.ts";
import { sideText } from "./emblem.engrave.ts";
import type { FramedCtx, LatheModel } from "./emblem.lathe.ts";
import { type V3, chrome, cross, line, normalOf, shadeOf, sub, unit, viewOf } from "./lathe.framed.ts";

const RAD = Math.PI / 180;
/** The whole tripod leans forward by this much from the upright, toward `D` (the eye, a little to the left), so the ball sits forward of the plinth's centre. */
const LEAN = 18;
const D: V3 = [-0.26, 0, 0.966];
const E: V3 = [D[2], 0, -D[0]];
const AXIS: V3 = [Math.sin(LEAN * RAD) * D[0], -Math.cos(LEAN * RAD), Math.sin(LEAN * RAD) * D[2]];
/** The ball (a ball and a half-width across the plinth, two and a bit across the rods) and the rods: from the top of the plinth to the ball's underside is two and a fifth ball widths. */
const BALL = 7.6;
const RISE = 2.2 * 2 * BALL;
const TOP = 57;
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + k * b[0], a[1] + k * b[1], a[2] + k * b[2]];
const FOOT: V3 = [0, TOP, 0];
const SEAT = add(FOOT, AXIS, RISE / Math.cos(LEAN * RAD));
const CENTRE = add(SEAT, AXIS, BALL - 0.6);
/** The plinth is a rounded triangle in plan: its corners are arcs round the points of a small triangle (a flat side faces the eye at rest). Each rod stands in its own collar near a corner (two at the front, one at the back) and they lean together to a point under the ball. */
const CORE = 7.6;
const CORNER = 3.8;
const WALL = TOP + 4.3;
const RIM = TOP + 2.2;
const corner = (i: number): V3 => [0.8 * CORE * Math.sin((60 + 120 * i) * RAD), TOP, 0.8 * CORE * Math.cos((60 + 120 * i) * RAD)];
const rods = [0, 1, 2].map((i) => ({ from: corner(i), to: add(SEAT, [corner(i)[0], 0, corner(i)[2]], 0.13) }));

/** The plinth: a wall, a bevel and a top on the rounded triangle; each corner is an arc of 16 steps round a point of the small triangle. */
const SIDES = 51;
const ring = (k: number, inset: number, y: number): V3 => {
  const i = ((k % SIDES) + SIDES) % SIDES;
  const vertex = Math.floor(i / 17);
  const psi = (120 * vertex + (120 * (i % 17)) / 16) * RAD;
  const phi = (60 + 120 * vertex) * RAD;
  const r = CORNER - inset;
  return [CORE * Math.sin(phi) + r * Math.sin(psi), y, CORE * Math.cos(phi) + r * Math.cos(psi)];
};

/** The sphere's gradient: bright where it faces the light, dark at its edge, as a polished ball is. */
function sphereGradient(rgb: Rgb): Gradient {
  const id = `dgsr${rgb.map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  const list: [number, number][] = [[0, 0.88], [0.25, 0.5], [0.55, -0.02], [0.85, -0.45], [1, -0.62]];
  const stops = list.map(([at, k]) => `<stop offset="${at}" stop-color="${mix(rgb, k)}"/>`).join("");
  return { id, def: `<radialGradient id="${id}" cx=".38" cy=".3" r=".85">${stops}</radialGradient>`, fill: `url(#${id})` };
}

/** A circle on the sphere: its plane's normal and how far the plane is from the centre (a fraction of the radius). */
function circle(n: V3, k: number): V3[] {
  const ref: V3 = Math.abs(n[1]) > 0.9 ? [1, 0, 0] : [0, -1, 0];
  const u = unit(cross(n, ref));
  const w = cross(n, u);
  const r = BALL * Math.sqrt(1 - k * k);
  const c = add(CENTRE, n, k * BALL);
  return Array.from({ length: 31 }, (_, i) => add(add(c, u, r * Math.cos(i * 12 * RAD)), w, r * Math.sin(i * 12 * RAD)));
}
/** The seams of a basketball: the equator, one upright circle, and a curved seam each side of it. */
const SEAMS: readonly V3[][] = [circle([0, -1, 0], 0), circle(E, 0), circle(D, 0.55), circle(D, -0.55)];

function framed(c: FramedCtx): string {
  const v = viewOf(c);
  const main = c.tone();
  const at = (p: V3): readonly [number, number] => v.at(v.rot(p));
  let out = "";

  // The plinth: every facet that faces the eye, grouped by shade (they do not overlap), then the top.
  const wall: V3[][] = [];
  for (let k = 0; k < SIDES; k++) {
    wall.push([ring(k, 0, WALL), ring(k + 1, 0, WALL), ring(k + 1, 0, RIM), ring(k, 0, RIM)]);
    wall.push([ring(k, 0, RIM), ring(k + 1, 0, RIM), ring(k + 1, 1.4, TOP), ring(k, 1.4, TOP)]);
  }
  const groups = new Map<string, string>();
  for (const q of wall) {
    if (c.line) break;
    const mid = q.reduce((m, p) => [m[0] + p[0] / 4, m[1] + p[1] / 4, m[2] + p[2] / 4] as V3, [0, 0, 0] as V3);
    let n = unit(normalOf(q));
    const bevel = (q[0] as V3)[1] === RIM;
    const away: V3 = [mid[0], bevel ? -1.4 : 0, mid[2]];
    if (n[0] * away[0] + n[1] * away[1] + n[2] * away[2] < 0) n = [-n[0], -n[1], -n[2]];
    const turned = v.rot(n);
    if (v.facing(turned) <= 0.02) continue;
    const colour = c.flat ? mix(main.rgb, bevel ? 0.2 : -0.1) : shadeOf(main.rgb, Math.min(0.9, chrome(turned, c.s) + (bevel ? 0.25 : 0.05)), 10);
    groups.set(colour, (groups.get(colour) ?? "") + line(q.map(at), true));
  }
  out += `<g stroke="none">${[...groups].map(([colour, d]) => `<path d="${d}" fill="${colour}"/>`).join("")}</g>`;
  const rim = (inset: number, y: number): (readonly [number, number])[] => Array.from({ length: SIDES }, (_, k) => at(ring(k, inset, y)));
  out += `<path d="${line(rim(1.4, TOP), true)}" fill="${c.line ? "none" : c.flat ? mix(main.rgb, 0.45) : mix(main.rgb, 0.7)}"/>`;
  const foot = rim(0, WALL);
  out += `<path d="${line(foot, true)}"${c.line ? "" : ' stroke-opacity=".6"'}/>`;
  if (c.line) {
    const side = rim(0, RIM);
    const lo = foot.reduce((m, p, i) => (p[0] < (foot[m] as readonly [number, number])[0] ? i : m), 0);
    const hi = foot.reduce((m, p, i) => (p[0] > (foot[m] as readonly [number, number])[0] ? i : m), 0);
    out += `<path d="${line([foot[lo] as readonly [number, number], side[lo] as readonly [number, number]], false)}${line([foot[hi] as readonly [number, number], side[hi] as readonly [number, number]], false)}"/>`;
  }
  if (c.engrave !== "") {
    const p0 = at(ring(50, 0, (WALL + RIM) / 2));
    const p1 = at(ring(0, 0, (WALL + RIM) / 2));
    out += sideText(c.engrave, 11, 1.9, c.ink, p0, p1, Math.cos((c.yaw * Math.PI) / 180));
  }

  // The rods and the ball, back to front: a rod that meets the ball on the near side is drawn after it.
  const ball = at(CENTRE);
  const ballDepth = v.depth(v.rot(CENTRE));
  const items: { depth: number; svg: string }[] = [];
  const tube = (a: V3, b: V3, w: number): string => {
    const [x0, y0] = at(a);
    const [x1, y1] = at(b);
    const d = `M${Math.round(x0 * 10) / 10} ${Math.round(y0 * 10) / 10}L${Math.round(x1 * 10) / 10} ${Math.round(y1 * 10) / 10}`;
    if (c.line) return w > 2.8 ? "" : `<path d="${d}"/>`;
    return `<path d="${d}" stroke-width="${w + 0.9}"/><path d="${d}" stroke="${c.flat ? main.fill : mix(main.rgb, 0.3)}" stroke-width="${w}"/>${c.flat ? "" : `<path d="${d}" transform="translate(-.45 -.35)" stroke="#fff" stroke-opacity=".7" stroke-width=".5"/>`}`;
  };
  for (const { from, to } of rods) {
    const collar = tube(from, add(from, AXIS, 0.8), 2.8);
    const body = tube(add(from, AXIS, 0.8), to, 1.9);
    items.push({ depth: ballDepth + (v.depth(v.rot(to)) > ballDepth ? 0.5 : -0.5) + v.depth(v.rot(from)) * 1e-4, svg: body + collar });
  }
  const R = BALL;
  const fill = c.paint(sphereGradient(main.rgb), main.rgb);
  let ballSvg = `<circle cx="${Math.round(ball[0] * 10) / 10}" cy="${Math.round(ball[1] * 10) / 10}" r="${R}" fill="${fill}"/>`;
  if (!c.line && !c.flat) {
    const band = (h: number): number => Math.sqrt(R * R - h * h);
    const [h1, h2] = [0.05 * R, 0.34 * R];
    const f = (n: number): number => Math.round(n * 10) / 10;
    ballSvg += `<path d="M${f(ball[0] - band(h1))} ${f(ball[1] + h1)}Q${f(ball[0])} ${f(ball[1] + h1 - 0.16 * R)} ${f(ball[0] + band(h1))} ${f(ball[1] + h1)}A${R} ${R} 0 0 1 ${f(ball[0] + band(h2))} ${f(ball[1] + h2)}Q${f(ball[0])} ${f(ball[1] + h2 + 0.1 * R)} ${f(ball[0] - band(h2))} ${f(ball[1] + h2)}A${R} ${R} 0 0 1 ${f(ball[0] - band(h1))} ${f(ball[1] + h1)}z" fill="${mix(main.rgb, -0.5)}" fill-opacity=".5" stroke="none"/>`;
    ballSvg += `<ellipse cx="${f(ball[0] - 0.38 * R)}" cy="${f(ball[1] - 0.42 * R)}" rx="${f(0.28 * R)}" ry="${f(0.15 * R)}" fill="#fff" fill-opacity=".6" stroke="none" transform="rotate(-32 ${f(ball[0] - 0.38 * R)} ${f(ball[1] - 0.42 * R)})"/>`;
  }
  // The seams, cut as grooves: the halves that face the eye.
  let seams = "";
  for (const ringPts of SEAMS) {
    let pen = false;
    for (const p of ringPts) {
      const visible = v.facing(v.rot(sub(p, CENTRE))) > 0.04;
      if (!visible) {
        pen = false;
        continue;
      }
      const [x, y] = at(p);
      seams += `${pen ? "L" : "M"}${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`;
      pen = true;
    }
  }
  ballSvg += `<path d="${seams}" stroke="${c.line ? "currentColor" : mix(main.rgb, -0.62)}" stroke-width="${c.line ? 1.1 : 0.7}"/>`;
  items.push({ depth: ballDepth, svg: ballSvg });
  items.sort((p, q) => p.depth - q.depth);
  return out + items.map((i) => i.svg).join("");
}

export const BALL_ON_RODS: LatheModel = {
  metal: "silver",
  box: "0 0 64 64",
  turnBox: "-7.8 -6.8 79.7 79.7",
  tilt: 12,
  edgeWidth: 0.4,
  lineWidth: 1.1,
  solids: [],
  framed,
};
