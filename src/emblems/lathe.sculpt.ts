// The parts a body of revolution cannot be: a flat cut-out with thickness (a player, a jersey, a plate of glass) and a ribbon that twists as it rises. A cut-out is a silhouette drawn as original paths
// and extruded; it stands in a plane that turns with the body, so it squeezes by the cosine of the turn, shows its back past a quarter turn (the front mirrored and a little darker) and shows its thickness
// as a solid edge, widest when it is edge on. A ribbon is a centre line with a width that turns about it, drawn as a strip of shaded quadrilaterals. A model that wants them sets `sculptor: LATHE_SCULPT`;
// one that does not never imports this file, so its bundle carries none of the code. Plain SVG.
import { mix } from "./emblem.core.ts";
import type { Cut, Layer, Part, Ribbon, SculptCtx } from "./emblem.lathe.ts";

const CX = 32;
const RAD = Math.PI / 180;
const f = (n: number): string => String(Math.round(n * 10) / 10 + 0);

type P = [number, number];

const CACHE = new Map<string, P[][]>();

/** The polygons of a path of absolute `M L H V C Q Z` commands, curves cut into short straight pieces. */
function polys(d: string): P[][] {
  const known = CACHE.get(d);
  if (known !== undefined) return known;
  const tok = d.match(/[MLHVCQZ]|-?\d*\.?\d+/g) ?? [];
  const out: P[][] = [];
  let cur: P[] = [];
  let cmd = "";
  let x = 0;
  let y = 0;
  let i = 0;
  const num = (): number => Number(tok[i++]);
  while (i < tok.length) {
    const t = tok[i] as string;
    if (/[A-Z]/.test(t)) {
      cmd = t;
      i++;
      if (cmd === "Z") {
        if (cur.length > 0) out.push(cur);
        cur = [];
      }
      continue;
    }
    if (cmd === "M") {
      x = num();
      y = num();
      if (cur.length > 0) out.push(cur);
      cur = [[x, y]];
      cmd = "L";
    } else if (cmd === "L") {
      x = num();
      y = num();
      cur.push([x, y]);
    } else if (cmd === "H") {
      x = num();
      cur.push([x, y]);
    } else if (cmd === "V") {
      y = num();
      cur.push([x, y]);
    } else if (cmd === "Q") {
      const [x1, y1, x2, y2] = [num(), num(), num(), num()];
      for (let k = 1; k <= 4; k++) {
        const u = k / 4;
        cur.push([(1 - u) ** 2 * x + 2 * (1 - u) * u * x1 + u * u * x2, (1 - u) ** 2 * y + 2 * (1 - u) * u * y1 + u * u * y2]);
      }
      x = x2;
      y = y2;
    } else if (cmd === "C") {
      const [x1, y1, x2, y2, x3, y3] = [num(), num(), num(), num(), num(), num()];
      for (let k = 1; k <= 5; k++) {
        const u = k / 5;
        const a = (1 - u) ** 3;
        const b = 3 * (1 - u) ** 2 * u;
        const c = 3 * (1 - u) * u * u;
        const e = u ** 3;
        cur.push([a * x + b * x1 + c * x2 + e * x3, a * y + b * y1 + c * y2 + e * y3]);
      }
      x = x3;
      y = y3;
    } else {
      i++;
    }
  }
  if (cur.length > 0) out.push(cur);
  CACHE.set(d, out);
  return out;
}

/** One cut-out standing at a place: where its plane is, how it faces and how far it is moved down. */
interface Stand {
  cut: Cut;
  ax: number;
  az: number;
  dy: number;
}

function drawCut(c: SculptCtx, stand: Stand): { z: number; svg: string } | undefined {
  const { cut, ax, az, dy } = stand;
  const { yaw, s, tone, line, flat } = c;
  const th = yaw * RAD;
  const phi = ((cut.rot ?? 0) + yaw) * RAD;
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const A = ax * Math.cos(th) + az * Math.sin(th);
  const B = az * Math.cos(th) - ax * Math.sin(th);
  if (cut.decal === true && cosP <= 0.03) return undefined;
  const t = cut.t ?? 1;
  const sign = cosP >= 0 ? 1 : -1;
  const at = (px: number, py: number, d: number): string => `${f(CX + A + (px - CX) * cosP + d * sinP)} ${f(py + dy + s * (B - (px - CX) * sinP + d * cosP))}`;
  const path = (d: string, depth: number): string => {
    let out = "";
    for (const poly of polys(d)) out += `M${poly.map(([px, py]) => at(px, py, depth)).join("L")}Z`;
    return out;
  };
  const near = (sign * t) / 2;
  const first = cut.layers[0] as Layer;
  const base = tone(first[0]);
  let svg = "";
  const reach = t * Math.hypot(sinP, s * cosP);
  const glass = first[2] === "gl";
  if (line) {
    if (reach > 1.3 && Math.abs(sinP) > 0.3) svg += `<path d="${path(first[1], -near)}" stroke-opacity=".6"/>`;
  } else if (glass) {
    // Clear glass: its sides are the hull of the front and the back (a block of glass is convex), with the far edges faint inside it.
    const hull = convexHull(polys(first[1]).flat().flatMap(([px, py]) => [[CX + A + (px - CX) * cosP + near * sinP, py + dy + s * (B - (px - CX) * sinP + near * cosP)] as P, [CX + A + (px - CX) * cosP - near * sinP, py + dy + s * (B - (px - CX) * sinP - near * cosP)] as P]));
    svg += `<path d="M${hull.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z" fill="${mix(base.rgb, 0.2)}" fill-opacity=".2" stroke="${base.edge}" stroke-opacity=".5" stroke-width=".4"/>`;
    if (reach > 0.6) svg += `<path d="${path(first[1], -near)}" stroke="${base.edge}" stroke-opacity=".4" stroke-width=".4"/>`;
  } else {
    // The edge: the silhouette moved a little further along the thickness, back to front, so that together they are a solid band.
    const steps = reach < 0.3 ? 0 : Math.min(cut.n ?? 8, Math.ceil(reach / 0.8));
    const side = flat ? mix(base.rgb, -0.3) : mix(base.rgb, -0.42);
    for (let k = 0; k < steps; k++) svg += `<path d="${path(first[1], -near + (2 * near * k) / steps)}" fill="${side}" stroke="${side}" stroke-width="${f(Math.max(0.6, (reach / steps) * 1.3))}"/>`;
  }
  for (const [name, d, mode] of cut.layers) {
    const q = tone(name);
    if (line) {
      if (mode === undefined || mode === "gl" || mode === "rf") svg += `<path d="${path(d, near)}"/>`;
      else if (mode === "ln") svg += `<path d="${path(d, near)}" stroke-width="1.1"/>`;
      continue;
    }
    const p = path(d, near);
    if (mode === undefined) svg += `<path d="${p}" fill="${q.fill}" stroke="${q.edge}"/>`;
    else if (mode === "dk") svg += `<path d="${p}" fill="${mix(q.rgb, -0.55)}" fill-opacity=".5" stroke="none"/>`;
    else if (mode === "lt") svg += `<path d="${p}" fill="${mix(q.rgb, 0.55)}" fill-opacity=".55" stroke="none"/>`;
    else if (mode === "ln") svg += `<path d="${p}" stroke="${q.edge}" stroke-width=".5"/>`;
    else if (mode === "gl") svg += `<path d="${p}" fill="${mix(q.rgb, 0.35)}" fill-opacity=".3" stroke="${q.edge}" stroke-width=".45"/>`;
    else if (mode === "rf") svg += `<path d="${p}" fill="${q.fill}" fill-opacity=".8" stroke="${q.edge}" stroke-width=".4"/>`;
    else svg += `<path d="${p}" fill="#fff" fill-opacity=".6" stroke="none"/>`;
  }
  if (sign < 0 && !line) svg += `<path d="${path(first[1], near)}" fill="#000" fill-opacity=".22" stroke="none"/>`;
  return { z: B, svg };
}

/** The convex hull of some points (Andrew's monotone chain), counter-clockwise. */
function convexHull(points: readonly P[]): P[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P, a: P, b: P): number => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const build = (list: readonly P[]): P[] => {
    const out: P[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2] as P, out[out.length - 1] as P, p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...build(sorted), ...build([...sorted].reverse())];
}

const cr = (a: number, b: number, c: number, d: number, t: number): number => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);

function drawRibbon(c: SculptCtx, r: Ribbon): { z: number; svg: string } {
  const { yaw, s, tone, line } = c;
  const th = yaw * RAD;
  const base = tone(r.tone);
  const n = r.steps ?? 14;
  const k = r.pts.length;
  const samples: { x: number; y: number; z: number; ph: number; w: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n) * (k - 1);
    const j = Math.min(k - 2, Math.floor(u));
    const t = u - j;
    const g = (q: number, m: 0 | 1 | 2 | 3 | 4): number => (r.pts[Math.max(0, Math.min(k - 1, q))] as readonly number[])[m] as number;
    const mixed = (m: 0 | 1 | 2 | 3 | 4): number => cr(g(j - 1, m), g(j, m), g(j + 1, m), g(j + 2, m), t);
    samples.push({ x: mixed(0), y: mixed(1), z: mixed(2), ph: g(j, 3) + (g(j + 1, 3) - g(j, 3)) * t, w: g(j, 4) + (g(j + 1, 4) - g(j, 4)) * t });
  }
  const turned = samples.map((p) => {
    const phi = (p.ph + yaw) * RAD;
    const px = p.x * Math.cos(th) + p.z * Math.sin(th);
    const pz = p.z * Math.cos(th) - p.x * Math.sin(th);
    return { px, py: p.y, pz, wx: p.w * Math.cos(phi), wz: -p.w * Math.sin(phi) };
  });
  const pt = (px: number, py: number, pz: number): string => `${f(CX + px)} ${f(py + s * pz)}`;
  if (line) {
    let left = "";
    let right = "";
    turned.forEach((p, i) => {
      left += `${i === 0 ? "M" : "L"}${pt(p.px - p.wx, p.py, p.pz - p.wz)}`;
      right += `${i === 0 ? "M" : "L"}${pt(p.px + p.wx, p.py, p.pz + p.wz)}`;
    });
    const a = turned[0] as (typeof turned)[number];
    const b = turned[n] as (typeof turned)[number];
    const ends = `M${pt(a.px - a.wx, a.py, a.pz - a.wz)}L${pt(a.px + a.wx, a.py, a.pz + a.wz)}M${pt(b.px - b.wx, b.py, b.pz - b.wz)}L${pt(b.px + b.wx, b.py, b.pz + b.wz)}`;
    return { z: turned.reduce((m, p) => m + p.pz, 0) / turned.length, svg: `<path d="${left}${right}${ends}"/>` };
  }
  const L = [-0.5, -0.6, 0.65];
  const len = Math.hypot(L[0] as number, L[1] as number, L[2] as number);
  const quads: { z: number; d: string; colour: string }[] = [];
  for (let i = 0; i < n; i++) {
    const p = turned[i] as (typeof turned)[number];
    const q = turned[i + 1] as (typeof turned)[number];
    const tx = q.px - p.px;
    const ty = q.py - p.py;
    const tz = q.pz - p.pz;
    const wx = p.wx + q.wx;
    const wz = p.wz + q.wz;
    // The normal of the strip: the tangent crossed with the width (which lies flat).
    const nx = ty * wz;
    const ny = tz * wx - tx * wz;
    const nz = -ty * wx;
    const nl = Math.hypot(nx, ny, nz) || 1;
    const lambert = Math.abs((nx * (L[0] as number) + ny * (L[1] as number) + nz * (L[2] as number)) / (nl * len));
    const bucket = Math.round(Math.max(-0.5, Math.min(0.6, (lambert - 0.42) * 1.5)) * 8) / 8;
    const colour = mix(base.rgb, bucket);
    quads.push({ z: (p.pz + q.pz) / 2, d: `M${pt(p.px - p.wx, p.py, p.pz - p.wz)}L${pt(p.px + p.wx, p.py, p.pz + p.wz)}L${pt(q.px + q.wx, q.py, q.pz + q.wz)}L${pt(q.px - q.wx, q.py, q.pz - q.wz)}Z`, colour });
  }
  quads.sort((a, b) => a.z - b.z);
  let svg = "";
  let run = "";
  let colour = "";
  for (const q of quads) {
    if (q.colour !== colour && run !== "") {
      svg += `<path d="${run}" fill="${colour}" stroke="${colour}" stroke-width=".3"/>`;
      run = "";
    }
    colour = q.colour;
    run += q.d;
  }
  if (run !== "") svg += `<path d="${run}" fill="${colour}" stroke="${colour}" stroke-width=".3"/>`;
  return { z: turned.reduce((m, p) => m + p.pz, 0) / turned.length, svg };
}

/** Draws the parts of a model: the ones that are `under` the bodies, and the rest, each group from far to near. */
export function LATHE_SCULPT(c: SculptCtx, parts: readonly Part[]): { under: string; over: string } {
  const under: { z: number; svg: string }[] = [];
  const over: { z: number; svg: string }[] = [];
  for (const part of parts) {
    if (part.kind === "ribbon") {
      (part.under === true ? under : over).push(drawRibbon(c, part));
      continue;
    }
    const [x, z] = part.at ?? [0, 0];
    const stands: Stand[] = [{ cut: part, ax: x, az: z, dy: part.y ?? 0 }, ...(part.copies ?? []).map(([cx, cz, cy]) => ({ cut: part, ax: x + cx, az: z + cz, dy: (part.y ?? 0) + (cy ?? 0) }))];
    for (const stand of stands) {
      const made = drawCut(c, stand);
      if (made !== undefined) (part.under === true ? under : over).push(made);
    }
  }
  const join = (list: { z: number; svg: string }[]): string => list.sort((a, b) => a.z - b.z).map((p) => p.svg).join("");
  return { under: join(under), over: join(over) };
}
