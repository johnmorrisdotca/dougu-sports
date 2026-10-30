// The drawing the George Halas Trophy and the Lamar Hunt Trophy share: an open football of polished silver standing on its tip on a round flared base with a black foot. The football is three parts of one football-shaped
// surface turned about the upright axis: a front plate (the ribbon) that follows the ball's front, with seven slots cut through where the laces are, a narrower neck below them and a satin point on its face; and two
// curved bands, the left and right sides of the ball's outline, that meet the plate at the tip and the top. Drawn for this package from John's photographs of the trophy (docs/likeness.md): the heights, the half
// widths of the ring and of the plate, the slots and the base were read off the front photograph, the depth and the way the bands come round off the three-quarter ones. The marks on the plate and on the base
// (the shield, the conference letters, the engraving) are left out.
import { type Gradient, type Rgb, hexOf, mix, readColour } from "./emblem.core.ts";
import type { LatheModel, FramedCtx } from "./emblem.lathe.ts";
import { type V3, chrome, cross, curve, line, lin, normalOf, shadeOf, sub, unit, viewOf } from "./lathe.framed.ts";

const RAD = Math.PI / 180;
/** The eye at rest looks down by this much (sin 7 degrees); the measurements were read off the photograph's page, so a point near the eye is set up by what that tilt will push down. */
const S0 = Math.sin(7 * RAD);
/** The football leans back from the upright by this much, so that from the front it looks shorter than it is long, and from the side it leans away; read off the three-quarter photographs. */
const LEAN = 45;
const CT = Math.cos(LEAN * RAD);
const ST = Math.sin(LEAN * RAD);
/** Where the ball's lower pole is, in the lathe's heights: a little under the top of the base, which hides it. A point of the ball is placed by its distance `t` along the leaning axis, how far `x` it is across and how far `w` it stands forward. */
const POLE = 49.3;
const lean = (x: number, t: number, w: number): V3 => [x, POLE - t * CT - w * ST, w * CT - t * ST];
/** How far the ring seen from the front climbs on the page for each unit along the axis. */
const CLIMB = CT + S0 * ST;
/** Half the ball's width at each height of the front photograph, from the lower pole to the upper one (a pointed oval, a football); the heights are what the page shows, and become distances along the axis. */
const RING_READ: readonly (readonly [number, number])[] = [[2.5, 0], [6.4, 6.4], [8.3, 9.9], [10.3, 12.8], [12.8, 15.3], [16, 17.3], [19.2, 18.5], [22.4, 19], [25.6, 19.2], [28.8, 19], [35.3, 17.2], [38.5, 15.3], [41.7, 12.2], [44.9, 8], [47.3, 3], [49.3, 0]];
/** The upper pole, as a distance along the axis. */
const TOP_T = (POLE - 2.5) / CLIMB;
const rho = curve(RING_READ.map(([y, r]) => [(POLE - y) / CLIMB, r] as const).reverse());
/** Half the plate's width at a height: it is as wide as the laces, then steps in to a neck that narrows to the tip. */
const WIDTH = lin([[1, 3.3], [2, 4.5], [3.2, 5], [26.3, 5], [27.6, 3], [28, 3], [39, 2.2], [47, 1.7]]);
const ROWS = [1, 1.6, 2.2, 3.2, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 26.3, 27.6, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 47];
/** Where the laces are: the heights of the slots, and the half length of each. */
const SLOTS = [4.2, 6, 8.2, 10.4, 12.9, 15.7, 19];
const SLOT_HEIGHT = 0.7;
/** The plate is as thick as this, and the ring is a sheet drawn with its edge lines. */
const THICK = 1.1;
const TIP = 47;

/** The distance along the axis of the plate's centre line at a height of the page: the first place up the ball where its face reaches that height. */
const reach = new Map<number, number>();
function along(y: number): number {
  const known = reach.get(y);
  if (known !== undefined) return known;
  let found = TOP_T + 4;
  for (let t = 0; t < TOP_T + 4; t += 0.1) {
    const w = Math.sqrt(Math.max(0.09, rho(t) ** 2));
    const p = lean(0, t, w);
    if (p[1] + S0 * p[2] <= y) {
      found = t;
      break;
    }
  }
  reach.set(y, found);
  return found;
}
/** A point of the plate's face at a height of the page: x across, and the plate lying on the ball. */
const front = (x: number, y: number): V3 => {
  const t = along(y);
  return lean(x, t, Math.sqrt(Math.max(0.09, rho(t) ** 2 - x * x)));
};
const normal = (x: number, y: number): V3 => {
  const n = unit(cross(sub(front(x + 0.05, y), front(x - 0.05, y)), sub(front(x, y + 0.05), front(x, y - 0.05))));
  return n[2] < 0 ? [-n[0], -n[1], -n[2]] : n;
};
const back = (x: number, y: number): V3 => {
  const p = front(x, y);
  const n = normal(x, y);
  return [p[0] - THICK * n[0], p[1] - THICK * n[1], p[2] - THICK * n[2]];
};
const half = (i: number): number => 3.2 + (0.4 * i) / 6;

/** The plate's outline as points of its face (`face` is front or back), with the slots as holes, and its two side walls. */
const outline = (face: (x: number, y: number) => V3): V3[] => {
  const pts: V3[] = [];
  for (const k of [-1, -0.5, 0, 0.5, 1]) pts.push(face(k * (WIDTH(ROWS[0] as number)), ROWS[0] as number));
  for (const y of ROWS.slice(1)) pts.push(face(WIDTH(y), y));
  pts.push(face(0, TIP));
  for (const y of [...ROWS].reverse().slice(1)) pts.push(face(-WIDTH(y), y));
  return pts;
};
const slotOf = (face: (x: number, y: number) => V3, i: number): V3[] => {
  const c = SLOTS[i] as number;
  const w = half(i);
  return [face(-w, c - SLOT_HEIGHT / 2), face(w, c - SLOT_HEIGHT / 2), face(w, c + SLOT_HEIGHT / 2), face(-w, c + SLOT_HEIGHT / 2)];
};
const wall = (side: -1 | 1): V3[] => {
  const down = ROWS.map((y) => front(side * WIDTH(y), y));
  const up = [...ROWS].reverse().map((y) => back(side * WIDTH(y), y));
  return [...down, ...up];
};
/** The satin point below the laces: a long triangle on the plate's face. */
const point = (): V3[] => [[-1.5, 27.8], [0, 27.8], [1.5, 27.8], [0.75, 34.1], [0, 40.4], [-0.75, 34.1]].map(([x, y]) => {
  const p = front(x as number, y as number);
  const n = normal(x as number, y as number);
  return [p[0] + 0.06 * n[0], p[1] + 0.06 * n[1], p[2] + 0.06 * n[2]] as V3;
});

/** The band of one side of the ball between two parameters of its length: the points of its two edges. */
const SEGMENTS = 32;
const BAND_WIDTH = 7.2;
function band(side: -1 | 1, from: number, to: number): { a: V3[]; b: V3[] } {
  const a: V3[] = [];
  const b: V3[] = [];
  const low = (POLE - 47) / CT;
  const high = TOP_T - 0.6;
  for (let i = from; i <= to; i++) {
    const u = i / SEGMENTS;
    const t = low + (high - low) * (0.5 - 0.5 * Math.cos(Math.PI * u));
    const r = Math.max(0.4, rho(t));
    const d = Math.min(0.46, Math.max(0.14, BAND_WIDTH / (2 * r)));
    const rb = (r / Math.cos(d)) * 0.99;
    a.push(lean(side * rb * Math.cos(d), t, rb * Math.sin(d)));
    b.push(lean(side * rb * Math.cos(d), t, -rb * Math.sin(d)));
  }
  return { a, b };
}
const CHUNKS: readonly (readonly [number, number])[] = [[0, 6], [6, 26], [26, SEGMENTS]];

const lighter = (rgb: Rgb, k: number): Rgb => readColour(mix(rgb, k)) as Rgb;
const f1 = (n: number): string => String(Math.round(n * 10) / 10);
const mean = (pts: readonly V3[]): V3 => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length, pts.reduce((s, p) => s + p[2], 0) / pts.length];

/** The shading of the bright plate: a dark edge, a white band left of the middle, and a soft grey side, as a flat mirror of silver shows a room. `shift` slides the white band (a turn). */
function brightGradient(rgb: Rgb, shift: number): Gradient {
  const h = Math.max(0.1, Math.min(0.5, 0.3 + shift));
  const id = `dgsn${hexOf(rgb).slice(1)}${Math.round(shift * 100) + 100}`;
  const list: [number, number][] = [[0, -0.45], [0.07, 0.4], [h, 0.88], [h + 0.3, 0.6], [0.9, 0.18], [1, -0.32]];
  const stops = list.map(([at, k]) => `<stop offset="${Math.round(at * 100) / 100}" stop-color="${mix(rgb, k)}"/>`).join("");
  return { id, def: `<linearGradient id="${id}">${stops}</linearGradient>`, fill: `url(#${id})` };
}

/** The flat cut on the front of the base: a bright facet wide at the rim and running down to a point, where a plane that leans out more steeply than the cone meets the cone's surface. */
const BASE_TOP = 47.4;
const BASE_FOOT = 56.2;
const coneR = (y: number): number => 14.5 + ((18.3 - 14.5) * (y - BASE_TOP)) / (BASE_FOOT - BASE_TOP);
function facet(): V3[] {
  return [[-11.6, BASE_TOP, 8.7], [0, BASE_TOP, 8.4], [11.6, BASE_TOP, 8.7], [0, 55.8, coneR(55.8) + 0.1]];
}

/** The parts of the trophy that are not bodies of revolution, turned and drawn from the back to the front. */
function framed(c: FramedCtx): string {
  const v = viewOf(c);
  const main = c.tone();
  const place = (p: readonly V3[]): (readonly [number, number])[] => p.map((q) => v.at(v.rot(q)));
  const items: { depth: number; svg: string }[] = [];
  const faceFront = Math.cos((c.yaw * Math.PI) / 180) >= 0;
  const face = faceFront ? front : back;

  if (c.line) {
    const bands = ([-1, 1] as const).map((side) => band(side, 0, SEGMENTS));
    let out = "";
    for (const { a, b } of bands) out += line(place([...a, ...[...b].reverse()]), true, 2);
    const plate = outline(face);
    out += line(place(plate), true, 2);
    SLOTS.forEach((y, i) => {
      out += line(place([face(-half(i), y), face(half(i), y)]), false);
    });
    if (faceFront) out += line(place(point()), true, 2);
    return `<path d="${out}"/>`;
  }

  // The plate: its face with the slots cut through, one shape filled across its width like the round parts.
  const slots = SLOTS.map((_, i) => line(place(slotOf(face, i)), true)).join("");
  const plate = line(place(outline(face)), true);
  const dim = SLOTS.map((_, i) => {
    const q = slotOf(face, i);
    const mid = (a: V3, b: V3): V3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    return line(place([mid(q[0] as V3, q[3] as V3), mid(q[1] as V3, q[2] as V3)]), false);
  }).join("");
  const centre = v.rot(face(0, 25));
  items.push({ depth: v.depth(centre), svg: `<path d="${plate}${slots}" fill="${c.paint(brightGradient(main.rgb, 0.2 * Math.sin((c.yaw * Math.PI) / 180)), lighter(main.rgb, 0.2))}" fill-rule="evenodd"/>` });
  if (v.facing(v.rot([0, 0, 1])) > 0) items.push({ depth: -999, svg: `<path d="${line(place(facet()), true)}" fill="${c.paint(brightGradient(main.rgb, 0.2 * Math.sin((c.yaw * Math.PI) / 180)), lighter(main.rgb, 0.25))}" stroke="none"/>` });
  items.push({ depth: v.depth(centre) + 0.005, svg: `<path d="${dim}" stroke="${mix(main.rgb, -0.5)}" stroke-width=".55"/>` });
  if (faceFront) items.push({ depth: v.depth(centre) + 0.01, svg: `<path d="${line(place(point()), true)}" fill="${mix(main.rgb, -0.22)}" stroke="none"/>` });
  // The two side walls of the plate: visible when it turns.
  for (const side of [-1, 1] as const) {
    const w = wall(side);
    const n = v.rot([side, 0, 0.2]);
    if (v.facing(n) <= 0) continue;
    items.push({ depth: v.depth(v.rot(mean(w))), svg: `<path d="${line(place(w), true)}" fill="${c.flat ? mix(main.rgb, -0.3) : shadeOf(main.rgb, chrome(unit(n), c.s), 12)}"/>` });
  }

  // The bands, in three runs each so that the ends can pass in front of or behind the plate as the trophy turns.
  for (const side of [-1, 1] as const) {
    for (const [from, to] of CHUNKS) {
      const { a, b } = band(side, from, to);
      const pa = place(a);
      const pb = place(b);
      let fills = "";
      for (let i = 0; i < a.length - 1; i++) {
        const quad = [a[i], a[i + 1], b[i + 1], b[i]] as V3[];
        const n = unit(normalOf(quad.map((q) => v.rot(q))));
        const shade = chrome(n, c.s);
        const colour = c.flat ? mix(main.rgb, Math.round(shade * 3) / 6) : shadeOf(main.rgb, shade);
        const grow = (p: readonly [number, number], q: readonly [number, number]): readonly [number, number] => [q[0] + 0.1 * (q[0] - p[0]), q[1] + 0.1 * (q[1] - p[1])];
        const pts = [pa[i], grow(pa[i] as readonly [number, number], pa[i + 1] as readonly [number, number]), grow(pb[i] as readonly [number, number], pb[i + 1] as readonly [number, number]), pb[i]] as readonly (readonly [number, number])[];
        fills += `<path d="${line(pts, true)}" fill="${colour}"/>`;
      }
      const edges = line(pa, false, 2) + line(pb, false, 2);
      // A band seen edge on is a thin bright edge; seen face on, its two edges are fine lines round the face.
      const across = pa.reduce((m, p, i) => m + Math.hypot(p[0] - (pb[i] as readonly [number, number])[0], p[1] - (pb[i] as readonly [number, number])[1]), 0) / pa.length;
      const edge = Math.max(1, 2.4 - 0.45 * across);
      const tube = `<path d="${edges}" stroke-width="${f1(edge)}"/><path d="${edges}" stroke="${c.flat ? main.fill : mix(main.rgb, 0.5)}" stroke-width="${f1(edge - 0.7)}"/>`;
      items.push({ depth: v.depth(v.rot(mean([...a, ...b]))), svg: `<g stroke="none">${fills}</g>${tube}` });
    }
  }
  items.sort((p, q) => p.depth - q.depth);
  return items.map((i) => i.svg).join("");
}

export const NFL_CONFERENCE: LatheModel = {
  metal: "silver",
  box: "0 0 64 64",
  turnBox: "-12.5 -18.9 89 89",
  tones: { dark: "#17181c" },
  tilt: 7,
  lineWidth: 1.1,
  edgeWidth: 0.35,
  maxElevation: 34,
  solids: [
    { p: [[46.4, 13.6, 1], [47.4, 14.5], [56.2, 18.3, 1], [56.2, 18.3, 1, "dark"], [59.2, 17.7, 1]] },
  ],
  plate: { y0: 50, y1: 54.5, at: 62 },
  framed,
};
