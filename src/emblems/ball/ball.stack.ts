// A stack of round slices on one axis, drawn in true 3D by the rules of an orthographic view: each end of a slice is an ellipse (its minor axis along the projected axis), the side between them
// is a band as wide as the slice, and what is nearer is painted last. A puck is one slice; a curling stone is six and a handle.
import { type ObjectContext } from "./ball.object.ts";
import { type V3, apply } from "./ball.math.ts";
import { blend, grainDef, mix, num } from "./ball.core.ts";

export interface Slice {
  y0: number;
  y1: number;
  /** The radius at the lower end and at the upper end (one number for a plain cylinder). */
  r: number | readonly [number, number];
  colour: string;
  /** Drawn in the line style (the others are left out so a line drawing keeps to the outline). */
  outline?: boolean;
}

export interface StackSpec {
  slices: readonly Slice[];
  top: string;
  bottom: string;
  gloss: number;
  shade: string;
  grain?: { f: number; a: number };
  /** Lines down the side: how many round the whole slice, on the slices that have `grooved`. */
  grooves?: { count: number; slices: readonly number[]; colour: string; opacity: number };
  /** A ring on the top face: radius as a fraction, colour. */
  topRing?: { r: number; colour: string };
  /** What lies in the bottom face when it faces you: a dish. */
  dish?: { r: number; colour: string };
  /** Drawn on top of the stack, in the stack's own space (a handle). `up` is the screen position of the top face's centre. */
  extra?: (c: ObjectContext, top: { cx: number; cy: number; nz: number }) => string;
}

const LIGHT: V3 = [-0.55, -0.72, 0];

const ellipsePath = (cx: number, cy: number, major: number, minor: number, deg: number): string => {
  const rad = (deg * Math.PI) / 180;
  const ax = Math.cos(rad) * major, ay = Math.sin(rad) * major;
  const arcs = `${num(major, 2)} ${num(Math.max(minor, 0.02), 2)} ${num(deg, 1)} 1 0`;
  return `M${num(cx + ax, 2)} ${num(cy + ay, 2)}A${arcs} ${num(cx - ax, 2)} ${num(cy - ay, 2)}A${arcs} ${num(cx + ax, 2)} ${num(cy + ay, 2)}Z`;
};

/** The half of an ellipse on one side: through the point `side` (-1 or 1) of the way along `d` from the centre. */
const halfEllipse = (cx: number, cy: number, major: number, minor: number, deg: number, side: 1 | -1): string => {
  const rad = (deg * Math.PI) / 180;
  const ax = Math.cos(rad) * major, ay = Math.sin(rad) * major;
  const sweep = side < 0 ? 1 : 0;
  return `M${num(cx + ax, 2)} ${num(cy + ay, 2)}A${num(major, 2)} ${num(Math.max(minor, 0.02), 2)} ${num(deg, 1)} 0 ${sweep} ${num(cx - ax, 2)} ${num(cy - ay, 2)}`;
};

export function drawStack(c: ObjectContext, spec: StackSpec): { defs: string; body: string } {
  const line = c.opts.style === "line";
  const n = apply(c.rot, [0, 1, 0]);
  const nz = n[2];
  const ax = 46 * n[0], ay = -46 * n[1];
  const dl = Math.hypot(ax, ay);
  const d: [number, number] = dl < 1e-3 ? [1, 0] : [ax / dl, ay / dl];
  const perp: [number, number] = [-d[1], d[0]];
  const perpDeg = (Math.atan2(perp[1], perp[0]) * 180) / Math.PI;
  const at = (y: number): [number, number] => [50 + y * ax, 50 + y * ay];
  const topVisible = nz >= 0;
  const shadeEnd = (col: string): string => mix(col, -0.55);
  const pl = perp[0] * LIGHT[0] + perp[1] * LIGHT[1];
  const u = Math.min(0.78, Math.max(0.22, 0.5 + 0.34 * pl));
  const radius = (s: Slice, end: 0 | 1): number => (typeof s.r === "number" ? s.r : s.r[end]);
  let defs = "";
  const slices = spec.slices;
  const maxR = Math.max(...slices.map((s) => Math.max(radius(s, 0), radius(s, 1))));
  const mid = at((slices[0].y0 + slices.at(-1)!.y1) / 2);
  const g0: [number, number] = [mid[0] - perp[0] * 46 * maxR, mid[1] - perp[1] * 46 * maxR];
  const g1: [number, number] = [mid[0] + perp[0] * 46 * maxR, mid[1] + perp[1] * 46 * maxR];
  const side = (s: Slice, i: number): string => {
    const gid = `${c.id}s${i}`;
    const base = s.colour;
    defs += `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${num(g0[0], 2)}" y1="${num(g0[1], 2)}" x2="${num(g1[0], 2)}" y2="${num(g1[1], 2)}"><stop offset="0" stop-color="${shadeEnd(base)}"/><stop offset="${num(Math.max(0.03, u - 0.26), 2)}" stop-color="${base}"/><stop offset="${num(u, 2)}" stop-color="${blend(base, "#ffffff", 0.18 + spec.gloss * 0.3)}"/><stop offset="${num(Math.min(0.97, u + 0.28), 2)}" stop-color="${base}"/><stop offset="1" stop-color="${shadeEnd(base)}"/></linearGradient>`;
    const [x0, y0] = at(s.y0), [x1, y1] = at(s.y1);
    const rb = 46 * radius(s, 0), rt = 46 * radius(s, 1);
    const pts = [[x0 + perp[0] * rb, y0 + perp[1] * rb], [x1 + perp[0] * rt, y1 + perp[1] * rt], [x1 - perp[0] * rt, y1 - perp[1] * rt], [x0 - perp[0] * rb, y0 - perp[1] * rb]];
    const d4 = `M${pts.map((p) => `${num(p[0], 2)} ${num(p[1], 2)}`).join("L")}Z`;
    if (line) {
      if (s.outline !== true) return "";
      const lines = `M${num(pts[0][0], 2)} ${num(pts[0][1], 2)}L${num(pts[1][0], 2)} ${num(pts[1][1], 2)}M${num(pts[2][0], 2)} ${num(pts[2][1], 2)}L${num(pts[3][0], 2)} ${num(pts[3][1], 2)}`;
      const rim = (y: number, r: number, side: 1 | -1): string => {
        const [cx, cy] = at(y);
        return halfEllipse(cx, cy, 46 * r, 46 * r * Math.abs(nz), perpDeg, side);
      };
      const near: 1 | -1 = topVisible ? -1 : 1;
      return `<path d="${lines}${rim(s.y0, radius(s, 0), near)}${i === slices.length - 1 ? "" : rim(s.y1, radius(s, 1), near)}" fill="none"/>`;
    }
    let out = `<path d="${d4}" fill="url(#${gid})"/>`;
    const gr = spec.grooves;
    if (!line && gr !== undefined && gr.slices.includes(i)) {
      let marks = "";
      for (let k = 0; k < gr.count; k++) {
        const t = ((k + 0.5) / gr.count) * Math.PI;
        const uu = Math.cos(t);
        const facing = Math.sin(t);
        if (facing < 0.15) continue;
        marks += `M${num(x0 + perp[0] * rb * uu, 2)} ${num(y0 + perp[1] * rb * uu, 2)}L${num(x1 + perp[0] * rt * uu, 2)} ${num(y1 + perp[1] * rt * uu, 2)}`;
      }
      out += `<path d="${marks}" stroke="${gr.colour}" stroke-width="${num(Math.max(0.5, c.minWidth * 0.5), 2)}" opacity="${gr.opacity}" fill="none"/>`;
    }
    return out;
  };
  const cap = (y: number, r: number, colour: string, i: string, topFace: boolean): string => {
    const [cx, cy] = at(y);
    const major = 46 * r;
    const minor = Math.max(major * Math.abs(nz), 0.02);
    const dpath = ellipsePath(cx, cy, major, minor, perpDeg);
    if (line) return (topFace && (i === `t${slices.length - 1}` || i === `d0`)) || i === "dish" ? `<path d="${dpath}" fill="none"/>` : "";
    const gid = `${c.id}c${i}`;
    defs += `<radialGradient id="${gid}" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="${blend(colour, "#ffffff", 0.2 + spec.gloss * 0.34)}"/><stop offset=".45" stop-color="${colour}"/><stop offset="1" stop-color="${mix(colour, topFace ? -0.34 : -0.5)}"/></radialGradient>`;
    return `<path d="${dpath}" fill="url(#${gid})"/>`;
  };
  const ordered = topVisible ? slices.map((s, i) => [s, i] as const) : slices.map((s, i) => [s, i] as const).reverse();
  let body = "";
  if (topVisible) {
    const s0 = slices[0];
    body += cap(s0.y0, radius(s0, 0), mix(s0.colour, -0.25), "b", false);
    for (const [s, i] of ordered) {
      body += side(s, i);
      body += cap(s.y1, radius(s, 1), i === slices.length - 1 ? spec.top : s.colour, `t${i}`, true);
    }
    if (spec.topRing !== undefined) {
      const [cx, cy] = at(slices.at(-1)!.y1);
      const r = 46 * radius(slices.at(-1)!, 1) * spec.topRing.r;
      body += `<path d="${ellipsePath(cx, cy, r, r * Math.abs(nz), perpDeg)}" fill="none" stroke="${line ? "currentColor" : spec.topRing.colour}" stroke-width="${num(Math.max(0.6, c.minWidth * 0.6), 2)}" opacity=".7"/>`;
    }
  } else {
    const sT = slices.at(-1)!;
    body += cap(sT.y1, radius(sT, 1), mix(sT.colour, -0.25), "u", false);
    for (const [s, i] of ordered) {
      body += side(s, i);
      body += cap(s.y0, radius(s, 0), i === 0 ? spec.bottom : s.colour, `d${i}`, true);
    }
    if (spec.dish !== undefined) {
      const [cx, cy] = at(slices[0].y0);
      const r = 46 * radius(slices[0], 0) * spec.dish.r;
      const gid = `${c.id}dish`;
      defs += `<radialGradient id="${gid}" cx=".64" cy=".7" r=".9"><stop offset="0" stop-color="${blend(spec.dish.colour, "#ffffff", 0.3)}"/><stop offset=".5" stop-color="${spec.dish.colour}"/><stop offset="1" stop-color="${mix(spec.dish.colour, -0.6)}"/></radialGradient>`;
      body += `<path d="${ellipsePath(cx, cy, r, r * Math.abs(nz), perpDeg)}" fill="${line ? "none" : `url(#${gid})`}"/>`;
    }
  }
  const [tx, ty] = at(slices.at(-1)!.y1);
  if (spec.extra !== undefined) body += spec.extra(c, { cx: tx, cy: ty, nz });
  const gr = c.opts.grain ?? (c.opts.size >= 48 && !c.turning);
  const grain = !line && gr && spec.grain !== undefined;
  if (grain) defs += grainDef(c.id, spec.grain!.f, spec.grain!.a);
  if (line) return { defs: "", body: `<g fill="none" stroke="currentColor" stroke-width="${num(Math.max(2.4, c.minWidth * 1.4), 2)}" stroke-linejoin="round" stroke-linecap="round">${body}</g>` };
  return { defs, body: grain ? `<g filter="url(#${c.id}n)">${body}</g>` : body };
}
