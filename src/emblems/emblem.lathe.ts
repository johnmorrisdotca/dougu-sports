// A body of revolution: the shape of a cup, a bowl, an urn, a column or a globe on a stand. A profile says the radius at each height; the parts that stand on it (handles, balls, flags, rings and
// grooves round the body, a pattern on a dish) are placed by the angle they are turned to. One model draws the still emblem (yaw 0) and the emblem turned (`frame`), so the 2D and the turning view
// come from the same data. The silhouette is the profile at every yaw; the light, the handles, the grooves and the seams move to where `sin(yaw)` puts them, and are drawn back to front. Plain SVG.
// Imports only the core.
import {
  type Emblem, type EmblemOptions, type EmblemSource, type FrameOptions, type Gradient, type Metal, type Resolved, type Rgb,
  cylinderGradient, defsOf, hexOf, mainOf, mix, orbGradient, readColour, resolve, wrap,
} from "./emblem.core.ts";
import { type Band, cylinderText, engravingInk, engravingOf, flatText, sideText } from "./emblem.engrave.ts";

/** A point of the profile: the height `y` (0 at the top of the 64 unit box), the radius `r` from the axis (x = 32), 1 for a sharp corner (a smooth run of points ends at one), and the tone of the piece that starts here. */
export type Pt = readonly [y: number, r: number, corner?: 0 | 1, tone?: string];

/** Something drawn on the surface, by height and angle (90 degrees is the right side, 0 faces the eye): a `ring` round the body at a height; `mer`idians from one height to another; `helix` strands that wind `turns` times; a diamond `net`; `dots` (beads) round at a height with a size; on an open top, a `disc` of a tone out to a radius and `pills`, short rounded marks, round a radius. */
export type Decor =
  | readonly ["ring", y: number]
  | readonly ["mer", y0: number, y1: number, n: number, off?: number]
  | readonly ["helix", y0: number, y1: number, n: number, turns: number]
  | readonly ["net", y0: number, y1: number, n: number]
  | readonly ["dots", y: number, n: number, size: number, off?: number]
  | readonly ["disc", rho: number, tone: string]
  | readonly ["pills", rho: number, n: number, length: number, width: number, tone: string];

/** One solid of revolution: a profile from the top down, whether its top is an open rim, how many flat sides it has (none: round) and what is drawn on it. */
export interface Solid {
  p: readonly Pt[];
  open?: boolean;
  sides?: number;
  tone?: string;
  decor?: readonly Decor[];
}

/** A handle: a curve through points `[r, y]` (the distance from the axis and the height) in the plane of the azimuth `a`, drawn as a tube `w` thick. The handle of the other side is `a + 180`. */
export interface Handle {
  a: number;
  pts: readonly (readonly [r: number, y: number])[];
  w?: number;
  tone?: string;
}

export type BallKind = "plain" | "basket" | "soccer" | "base" | "globe" | "football" | "pine";
/** A ball on the body: `cy` its centre, `r` its radius (and `ry` when it is longer than it is wide), `rot` the lean of a football in degrees. */
export interface Ball {
  kind: BallKind;
  cx?: number;
  cy: number;
  r: number;
  ry?: number;
  rot?: number;
  tone?: string;
}

/** A ring of `n` poles that stand from a ring of radius `r0` at `y0` up to a ring of radius `r1`, their tops stepping from the height `top1` down to `top2` once round, each with a pennant `size` tall. */
export interface Poles {
  n: number;
  y0: number;
  r0: number;
  r1: number;
  top1: number;
  top2: number;
  size: number;
}

/** What a body of revolution is made of. All of it is in the 64 by 64 box with the axis at x = 32. */
export interface LatheModel {
  metal: Metal;
  /** The main colour when the caller gives no tint and the metal is `flat` (the clay of an urn). */
  color?: string;
  /** The colours of the other tones the profile names (`gilt`, `dark`, `green`...). The `accent` option replaces the tone named `accent`. */
  tones?: Readonly<Record<string, string>>;
  /** The elevation of the eye in degrees at rest: how much of the top of a rim shows. */
  tilt?: number;
  solids: readonly Solid[];
  handles?: readonly Handle[];
  balls?: readonly Ball[];
  poles?: Poles;
  /** The plinth: the band of the body (heights, the tone it is cut into, and for a body with flat sides which side) that holds an engraving, which turns with the body. */
  plate?: Band;
}

const CX = 32;
const RAD = Math.PI / 180;
const f = (n: number): string => String(Math.round(n * 10) / 10 + 0);
const pt = (x: number, y: number): string => `${f(x)} ${f(y)}`;

/** The radius of the body at a height. */
export function radiusAt(profile: readonly Pt[], y: number): number {
  if (y <= profile[0][0]) return profile[0][1];
  for (let i = 1; i < profile.length; i++) {
    const [y1, r1] = profile[i];
    const [y0, r0] = profile[i - 1];
    if (y <= y1) return y1 === y0 ? r1 : r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
  }
  return profile[profile.length - 1][1];
}

/** The edge of the body on one side, smoothed through its vertices, as path segments that continue from the first point. */
function edge(points: readonly (readonly [number, number])[]): string {
  let d = "";
  let cur = points[0];
  const last = points.length - 1;
  for (let i = 1; i <= last; i++) {
    const p = points[i];
    if (i === last) {
      d += `L${pt(p[0], p[1])}`;
      break;
    }
    const before = points[i - 1];
    const after = points[i + 1];
    const m0 = [(before[0] + p[0]) / 2, (before[1] + p[1]) / 2] as const;
    const m1 = [(p[0] + after[0]) / 2, (p[1] + after[1]) / 2] as const;
    if (Math.abs(cur[0] - m0[0]) > 0.05 || Math.abs(cur[1] - m0[1]) > 0.05) d += `L${pt(m0[0], m0[1])}`;
    d += `Q${pt(p[0], p[1])} ${pt(m1[0], m1[1])}`;
    cur = m1;
  }
  return d;
}

/** The pieces of a profile, as lists of vertex indexes: a new piece starts at a sharp corner and after a step (two points at one height). */
function piecesOf(p: readonly Pt[]): number[][] {
  const out: number[][] = [];
  let cur = [0];
  for (let i = 1; i < p.length; i++) {
    if (p[i][0] === p[i - 1][0]) {
      out.push(cur);
      cur = [i];
      continue;
    }
    cur.push(i);
    if (p[i][2] === 1 && i < p.length - 1 && p[i + 1][0] !== p[i][0]) {
      out.push(cur);
      cur = [i];
    }
  }
  out.push(cur);
  return out.filter((c) => c.length > 1);
}

/** A front arc of the rim of radius `r` at height `y`, from the right to the left, sagging toward the eye by `r * s`. */
const arc = (y: number, r: number, s: number, toLeft: boolean): string => `Q${pt(CX, y + 2 * r * s)} ${pt(CX + (toLeft ? -r : r), y)}`;
const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string, extra = ""): string => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(Math.max(ry, 0.25))}" fill="${fill}"${extra}/>`;

/** One tone: its colour, its fill in the style, and the colours it makes. */
interface Tone {
  rgb: Rgb;
  fill: string;
  light: string;
  deep: string;
  edge: string;
}

/** The geometry and paint of one drawing of the model at a yaw and a pitch. */
function draw(model: LatheModel, r: Resolved, o: EmblemOptions | undefined, yaw: number, pitch: number): { body: string; defs: string; edge: string } {
  const line = r.style === "line";
  const flat = r.style === "color";
  const elevation = Math.max(0, Math.min(75, (model.tilt ?? 12) + pitch));
  const s = Math.sin(elevation * RAD);
  const spin = Math.sin(yaw * RAD);
  const shift = 0.2 * spin;
  const grads: Gradient[] = [];
  const tones = new Map<string, Tone>();
  const tone = (name = "main"): Tone => {
    const known = tones.get(name);
    if (known !== undefined) return known;
    const rgb = name === "main" ? (r.tint ?? readColour(model.color) ?? mainOf(model.metal, undefined)) : name === "accent" && r.accent !== undefined ? (readColour(r.accent) as Rgb) : (readColour(model.tones?.[name]) ?? mainOf(model.metal, undefined));
    const g = cylinderGradient(rgb, shift);
    if (!line && !flat) grads.push(g);
    const made = { rgb, fill: line ? "none" : flat ? hexOf(rgb) : g.fill, light: line ? "none" : mix(rgb, 0.4), deep: line ? "none" : mix(rgb, -0.55), edge: mix(rgb, -0.55) };
    tones.set(name, made);
    return made;
  };
  const main = tone("main");
  const back: string[] = [];
  const mid: string[] = [];
  const front: string[] = [];
  const own = (t: Tone): string => (t === main || line ? "" : ` stroke="${t.edge}"`);

  // The point of the surface of a body of revolution at a radius, a height and an angle.
  const at = (R: number, y: number, deg: number): readonly [number, number, number] => [CX + R * Math.sin(deg * RAD), y + s * R * Math.cos(deg * RAD), Math.cos(deg * RAD)];
  const where = (R: number, y: number, deg: number): string => pt(...(at(R, y, deg).slice(0, 2) as [number, number]));

  for (const solid of model.solids) {
    const p = solid.p;
    const list = piecesOf(p);
    const base = tone(solid.tone);
    const top = p[0];
    for (let k = list.length - 1; k >= 0; k--) {
      const idx = list[k];
      const a = p[idx[0]];
      const b = p[idx[idx.length - 1]];
      const t = tone(a[3] ?? solid.tone);
      const rows = idx.map((i) => p[i]);
      const right = rows.map((q) => [CX + q[1], q[0]] as const);
      const left = rows.map((q) => [CX - q[1], q[0]] as const).reverse();
      const height = b[0] - a[0];
      if (solid.sides === undefined) {
        // In the line style a piece is open at the top (the piece above, or the rim, draws that edge), and a small step between pieces is a short line, not a ring, so that a tall stack stays a clean outline.
        const below = list[k + 1] === undefined ? undefined : p[list[k + 1][0]];
        const small = below !== undefined && Math.abs(below[1] - b[1]) < 1.4 && height < 8;
        const d = line
          ? `M${pt(right[0][0], right[0][1])}${edge(right)}${small ? `M${pt(CX - b[1], b[0])}` : arc(b[0], b[1], s, true)}${edge(left)}${k === 0 ? arc(a[0], a[1], s, false) : ""}${below !== undefined && below[1] !== b[1] ? `M${pt(CX + b[1], b[0])}H${f(CX + below[1])}M${pt(CX - b[1], b[0])}H${f(CX - below[1])}` : ""}`
          : `M${pt(right[0][0], right[0][1])}${edge(right)}${arc(b[0], b[1], s, true)}${edge(left)}${arc(a[0], a[1], s, false)}z`;
        mid.push(`<path d="${d}" fill="${t.fill}"${own(t)}/>`);
        if (!line && height >= 6 && Math.min(a[1], b[1]) >= 2.2) {
          const c = 0.4 - 2 * shift;
          const l1 = rows.map((q) => pt(CX - (c + 0.09) * q[1], q[0] + 0.6));
          const l2 = rows.map((q) => pt(CX - (c - 0.09) * q[1], q[0] + 0.6)).reverse();
          if (!flat) mid.push(`<path d="M${l1.join("L")}L${l2.join("L")}z" fill="#fff" fill-opacity=".34" stroke="none"/>`);
          else {
            const e1 = rows.map((q) => pt(CX + 0.3 * q[1], q[0]));
            const e2 = rows.map((q) => pt(CX + 0.96 * q[1], q[0])).reverse();
            mid.push(`<path d="M${e1.join("L")}L${e2.join("L")}z" fill="${mix(t.rgb, -0.22)}" stroke="none"/>`);
          }
        }
      } else {
        // A body with flat faces: each face that looks toward the eye is a quadrilateral, lit by which way it faces.
        const n = solid.sides;
        for (let face = 0; face < n; face++) {
          const a0 = (360 * face) / n + yaw;
          const a1 = (360 * (face + 1)) / n + yaw;
          const m = (a0 + a1) / 2;
          if (Math.cos(m * RAD) <= 0) continue;
          const lit = -Math.sin(m * RAD);
          const colour = line ? "none" : mix(t.rgb, 0.18 + 0.36 * lit);
          mid.push(`<path d="M${where(a[1], a[0], a0)}L${where(a[1], a[0], a1)}L${where(b[1], b[0], a1)}L${where(b[1], b[0], a0)}z" fill="${colour}"${own(t)}/>`);
        }
      }
      // The top of a piece that steps out beyond the one above it, or the cap of the body, shows as a lighter ring.
      const above = k > 0 ? p[list[k - 1][list[k - 1].length - 1]] : undefined;
      if (!line && ((above === undefined && solid.open !== true && a[1] > 1) || (above !== undefined && a[1] > above[1] + 0.3))) {
        const sides = solid.sides;
        mid.push(sides === undefined ? ellipse(CX, a[0], a[1], a[1] * s, t.light) : `<path d="M${Array.from({ length: sides }, (_, i) => where(a[1], a[0], (360 * i) / sides + yaw)).join("L")}z" fill="${t.light}"${own(t)}/>`);
      }
    }
    if (solid.open === true) {
      const lip = top[1];
      const inner = Math.max(lip - 1.3, lip * 0.7);
      mid.push(ellipse(CX, top[0], lip, lip * s, base.light));
      mid.push(ellipse(CX, top[0] + 0.1, inner, inner * s, base.deep, ' stroke="none"'));
      if (!line && s > 0.12) mid.push(ellipse(CX, top[0] + inner * s * 0.35, inner * 0.8, inner * s * 0.55, mix(base.rgb, -0.3), ' stroke="none"'));
    }
    // What is drawn on the surface.
    for (const d of solid.decor ?? []) {
      const kind = d[0];
      if (kind === "ring") {
        const R = radiusAt(p, d[1]);
        mid.push(`<path d="M${pt(CX - R, d[1])}${arc(d[1], R, s, false)}" stroke-width="${line ? 2 : 0.8}"/>`);
        if (!line) mid.push(`<path d="M${pt(CX - R, d[1] + 0.9)}${arc(d[1] + 0.9, R, s, false)}" stroke="${mix(base.rgb, 0.5)}" stroke-width=".6" stroke-opacity=".7"/>`);
      } else if (line) {
        continue;
      } else if (kind === "mer") {
        const [, y0, y1, n, off = 0] = d;
        let m = "";
        for (let i = 0; i < n; i++) {
          const deg = yaw + off + (360 * i) / n;
          if (Math.cos(deg * RAD) <= 0.08) continue;
          m += `M${where(radiusAt(p, y0), y0, deg)}L${where(radiusAt(p, y1), y1, deg)}`;
        }
        if (m !== "") mid.push(`<path d="${m}" stroke-width=".7"/>`);
      } else if (kind === "helix") {
        const [, y0, y1, n, turns] = d;
        let m = "";
        for (let i = 0; i < n; i++) {
          let pen = false;
          for (let j = 0; j <= 16; j++) {
            const u = j / 16;
            const y = y0 + (y1 - y0) * u;
            const deg = yaw + (360 * i) / n + 360 * turns * u;
            if (Math.cos(deg * RAD) <= 0.05) {
              pen = false;
              continue;
            }
            m += `${pen ? "L" : "M"}${where(radiusAt(p, y), y, deg)}`;
            pen = true;
          }
        }
        if (m !== "") {
          mid.push(`<path d="${m}" stroke-width="1.3" stroke-opacity=".75"/>`);
          mid.push(`<path d="${m}" transform="translate(.9 -.5)" stroke="${mix(base.rgb, 0.6)}" stroke-width=".8" stroke-opacity=".7"/>`);
        }
      } else if (kind === "net") {
        const [, y0, y1, n] = d;
        let m = "";
        for (let i = 0; i < n; i++) {
          const deg = yaw + (360 * i) / n;
          for (const to of [deg + 360 / n, deg - 360 / n]) if (Math.cos(((deg + to) / 2) * RAD) > 0.05) m += `M${where(radiusAt(p, y0), y0, deg)}L${where(radiusAt(p, y1), y1, to)}`;
        }
        if (m !== "") mid.push(`<path d="${m}" stroke-width=".7"/>`);
      } else if (kind === "dots") {
        const [, y, n, size, off = 0] = d;
        let m = "";
        for (let i = 0; i < n; i++) {
          const deg = yaw + off + (360 * i) / n;
          if (Math.cos(deg * RAD) > 0.1) m += `M${where(radiusAt(p, y), y, deg)}h0`;
        }
        if (m !== "") mid.push(`<path d="${m}" stroke-width="${size}" stroke="${mix(base.rgb, 0.45)}"/>`);
      } else if (kind === "disc") {
        const t = tone(d[2]);
        mid.push(ellipse(CX, top[0], d[1], d[1] * s, t.fill, ` stroke="${t.edge}"`));
      } else if (kind === "pills") {
        const [, rho, n, length, width, name] = d;
        const t = tone(name);
        let m = "";
        for (let i = 0; i < n; i++) {
          const deg = yaw + (360 * i) / n;
          m += `M${where(rho, top[0], deg - length / 2)}L${where(rho, top[0], deg + length / 2)}`;
        }
        mid.push(`<path d="${m}" stroke-width="${width}" stroke="${t.edge}"/><path d="${m}" stroke-width="${width - 0.9}" stroke="${t.light}"/>`);
      }
    }
  }

  // Handles: a tube through the points of its plane, behind the body when it is on the far side.
  for (const h of model.handles ?? []) {
    const deg = h.a + yaw;
    const t = tone(h.tone);
    const sin = Math.sin(deg * RAD);
    const cos = Math.cos(deg * RAD);
    if (Math.abs(cos) < 0.02 && Math.abs(sin) < 0.1) continue;
    const pts = h.pts.map(([R, y]) => [CX + R * sin, y + s * R * cos] as const);
    let d = `M${pt(pts[0][0], pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += `C${pt(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)} ${pt(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)} ${pt(p2[0], p2[1])}`;
    }
    const w = h.w ?? 2.6;
    const piece = line ? `<path d="${d}" stroke-width="${f(w + 0.6)}"/>` : `<path d="${d}" stroke-width="${f(w + 1.1)}"${own(t)}/><path d="${d}" stroke="${flat ? t.fill : mix(t.rgb, 0.05)}" stroke-width="${f(w)}"/>`;
    (cos >= 0 ? front : back).push(piece);
  }

  // Poles standing round a ring, each with a pennant at its top: those on the far side behind, those on the near side in front.
  if (model.poles !== undefined) {
    const o = model.poles;
    const pole = tone("pole");
    const flag = tone("accent");
    const lines = { back: "", front: "" };
    const flags = { back: "", front: "" };
    for (let i = 0; i < o.n; i++) {
      const deg = yaw + (360 * i) / o.n;
      const near = Math.cos(deg * RAD) >= 0 ? "front" : "back";
      const topY = o.top1 + ((o.top2 - o.top1) * i) / o.n;
      const [x0, y0] = at(o.r0, o.y0, deg);
      const [x1, y1] = at(o.r1, topY, deg);
      lines[near] += `M${pt(x0, y0)}L${pt(x1, y1)}`;
      const dir = Math.cos(deg * RAD) >= 0 ? 1 : -1;
      const len = o.size * (0.5 + 0.9 * Math.abs(Math.cos(deg * RAD)));
      flags[near] += `M${pt(x1, y1 + 0.2)}l${f(dir * len)} ${f(o.size * 0.28)} ${f(-dir * len)} ${f(o.size * 0.28)}z`;
    }
    const stick = line ? 1.2 : 1;
    for (const near of ["back", "front"] as const) {
      const out = near === "back" ? back : front;
      out.push(`<path d="${lines[near]}" stroke="${line ? "currentColor" : mix(pole.rgb, -0.12)}" stroke-width="${stick}"/>`);
      out.push(`<path d="${flags[near]}" fill="${line ? "none" : flat ? flag.fill : flag.fill}" stroke-width="${line ? 1.2 : 0.5}"${line ? "" : ` stroke="${flag.edge}"`}/>`);
    }
  }

  // Balls (and the pineapple): a sphere with its seams, which turn with the yaw.
  for (const ball of model.balls ?? []) {
    const t = tone(ball.tone);
    const rx = ball.r;
    const ry = ball.ry ?? ball.r;
    const cx = ball.cx ?? CX;
    const cy = ball.cy;
    const spherical = line || flat || ball.kind === "pine" ? t.fill : (() => {
      const g = orbGradient(t.rgb);
      grads.push(g);
      return g.fill;
    })();
    const parts: string[] = [];
    if (ball.kind === "football") {
      const k = 1.36;
      const shape = `M0 ${f(-ry)}C${f(k * rx)} ${f(-0.25 * ry)} ${f(k * rx)} ${f(0.25 * ry)} 0 ${f(ry)}C${f(-k * rx)} ${f(0.25 * ry)} ${f(-k * rx)} ${f(-0.25 * ry)} 0 ${f(-ry)}z`;
      const sx = Math.sin(yaw * RAD) * rx * 0.55;
      const lit = Math.cos(yaw * RAD) > 0.1;
      const laces = lit ? `M${f(sx)} ${f(-ry * 0.5)}V${f(ry * 0.5)}${[-2, -1, 0, 1, 2].map((i) => `M${f(sx - 1.3)} ${f(i * ry * 0.19)}h2.6`).join("")}` : "";
      parts.push(`<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(ball.rot ?? 0)})"><path d="${shape}" fill="${spherical}"/>${line || flat ? "" : `<path d="M${f(-rx * 0.62)} ${f(-ry * 0.42)}Q${f(-rx * 0.5)} ${f(-ry * 0.1)} ${f(-rx * 0.54)} ${f(ry * 0.3)}" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" fill="none"/>`}<path d="${laces}" stroke-width="1.1"/></g>`);
    } else {
      parts.push(ellipse(cx, cy, rx, ry, spherical));
      let seams = "";
      const meridian = (lon: number): string => {
        const l = ((((lon + 90) % 360) + 360) % 360) - 90;
        if (l >= 90 && l <= 270) return "";
        const a = l > 90 ? l - 360 : l;
        const sin = Math.sin(a * RAD);
        return `M${pt(cx, cy - ry)}A${f(Math.abs(rx * sin))} ${f(ry)} 0 0 ${sin >= 0 ? 1 : 0} ${pt(cx, cy + ry)}`;
      };
      const equator = (k: number, dy = 0): string => `M${pt(cx - rx * Math.sqrt(Math.max(0, 1 - (dy / ry) ** 2)), cy + dy)}Q${pt(cx, cy + dy + 2 * rx * s * Math.sqrt(Math.max(0, 1 - (dy / ry) ** 2)) * k)} ${pt(cx + rx * Math.sqrt(Math.max(0, 1 - (dy / ry) ** 2)), cy + dy)}`;
      let patches = "";
      switch (ball.kind) {
        case "basket":
          seams += equator(1);
          for (let i = 0; i < 4; i++) seams += meridian(yaw + i * 90);
          break;
        case "globe":
          seams += equator(1) + equator(1, -ry * 0.5) + equator(1, ry * 0.5);
          for (let i = 0; i < 6; i++) seams += meridian(yaw + i * 30);
          break;
        case "base":
          seams += meridian(yaw + 62) + meridian(yaw - 62);
          break;
        case "pine":
          for (let i = 0; i < 6; i++) seams += meridian(yaw + i * 30);
          seams += equator(1, -ry * 0.45) + equator(1, 0) + equator(1, ry * 0.45);
          break;
        case "soccer":
          for (const [lat, lon] of PENTAGONS) {
            const la = lat * RAD;
            const lo = (lon + yaw) * RAD;
            const z = Math.cos(la) * Math.cos(lo);
            if (z < 0.12) continue;
            const px = cx + rx * Math.cos(la) * Math.sin(lo);
            const py = cy - rx * Math.sin(la) + s * rx * 0.0;
            const dx = px - cx;
            const dy = py - cy;
            const dist = Math.hypot(dx, dy);
            const ux = dist < 0.01 ? 1 : dx / dist;
            const uy = dist < 0.01 ? 0 : dy / dist;
            const squash = Math.max(0.28, z);
            let d = "";
            for (let i = 0; i < 5; i++) {
              const ang = (i * 72 - 90) * RAD;
              const lx = rx * 0.36 * Math.cos(ang);
              const ly = rx * 0.36 * Math.sin(ang);
              const along = lx * ux + ly * uy;
              const across = -lx * uy + ly * ux;
              d += `${i === 0 ? "M" : "L"}${pt(px + along * squash * ux - across * uy, py + along * squash * uy + across * ux)}`;
            }
            patches += `${d}z`;
          }
          break;
        default:
          break;
      }
      if (patches !== "") parts.push(`<path d="${patches}" fill="${line ? "none" : t.deep}" stroke-width="1"/>`);
      if (seams !== "") {
        if (ball.kind === "base") parts.push(`<path d="${seams}" stroke="${line ? "currentColor" : "#c0392b"}" stroke-width="${line ? 1.6 : 1.1}" stroke-dasharray="${line ? "none" : "1.4 1"}"/>`);
        else parts.push(`<path d="${seams}" stroke-width="${line ? 1.5 : ball.kind === "pine" ? 0.7 : 1}"${ball.kind === "basket" && !line ? ` stroke="${mix(t.rgb, -0.55)}"` : ""}/>`);
      }
      if (!line && !flat && ball.kind !== "pine") parts.push(`<ellipse cx="${f(cx - rx * 0.36)}" cy="${f(cy - ry * 0.4)}" rx="${f(rx * 0.3)}" ry="${f(ry * 0.2)}" fill="#fff" fill-opacity=".38" stroke="none" transform="rotate(-30 ${f(cx - rx * 0.36)} ${f(cy - ry * 0.4)})"/>`);
    }
    mid.push(...parts);
  }

  // The engraving on the plinth: letters set round the body (or along one flat side), foreshortened and hidden as they turn away.
  const plate = model.plate;
  const words = plate === undefined ? "" : flatText(engravingOf(o));
  if (plate !== undefined && words !== "") {
    const y = (plate.y0 + plate.y1) / 2;
    const solid = model.solids.find((q) => (q.p[0] as Pt)[0] <= y && y <= (q.p[q.p.length - 1] as Pt)[0]) ?? (model.solids[0] as Solid);
    const radius = radiusAt(solid.p, y);
    const ink = engravingInk(r.style, tone(plate.tone ?? solid.tone).rgb);
    if (solid.sides === undefined) mid.push(cylinderText(words, radius, plate.y1 - plate.y0, ink, yaw, plate.at ?? 0, (deg) => at(radius, y, deg)));
    else {
      const n = solid.sides;
      const k = plate.face ?? 0;
      const a0 = (360 * k) / n + yaw;
      const a1 = (360 * (k + 1)) / n + yaw;
      const [ax, ay] = at(radius, y, a0);
      const [bx, by] = at(radius, y, a1);
      mid.push(sideText(words, 2 * radius * Math.sin(Math.PI / n), plate.y1 - plate.y0, ink, [ax, ay], [bx, by], Math.cos(((a0 + a1) / 2) * RAD)));
    }
  }

  return { body: back.join("") + mid.join("") + front.join(""), defs: line || flat ? "" : defsOf(grads), edge: main.edge };
}

/** The twelve pentagons of a ball, as the centres of a sphere's faces: the poles and two rings of five. */
const PENTAGONS: readonly (readonly [lat: number, lon: number])[] = [
  [90, 0], [26.57, 0], [26.57, 72], [26.57, 144], [26.57, 216], [26.57, 288],
  [-26.57, 36], [-26.57, 108], [-26.57, 180], [-26.57, 252], [-26.57, 324], [-90, 0],
];

/** A lathe emblem: the object with its names and its model, the still drawing and the turned one. */
export function defineLathe(id: string, en: string, ja: string, source: EmblemSource, model: LatheModel): Emblem<LatheModel> {
  const frame = (o?: FrameOptions): string => {
    const r = resolve(o);
    const yaw = typeof o?.yaw === "number" && Number.isFinite(o.yaw) ? o.yaw % 360 : 0;
    const pitch = typeof o?.pitch === "number" && Number.isFinite(o.pitch) ? Math.max(-40, Math.min(60, o.pitch)) : 0;
    const d = draw(model, r, o, yaw, pitch);
    return wrap({ title: en, size: r.size, style: r.style, theme: r.theme, defs: d.defs, body: d.body, edge: d.edge, width: r.style === "line" ? 2.3 : 0.6 });
  };
  return { id, en, ja, source, kind: "lathe", model, svg: (o?: EmblemOptions) => frame(o), frame };
}
