// Judo and karate gear, drawn for this package from the rules the sports publish (docs/references.md, "Judo and karate suits and belts"):
//
// - The judogi (IJF Sport and Organisation Rules, 8 July 2020, section C1 "IJF Judogi Rules": C1.9 colour, C1.10 size, C1.8 backnumber): a jacket (uwagi) and trousers (zubon) worn with a belt (obi). The jacket
//   is white ("snow white") or blue (Pantone 285M to 286M), of one colour with the trousers (C1.9). Its sleeves cover the whole arm including the wrist bone and its skirt covers the buttocks (C1.10); the lapels
//   cross left over right with their crossing point under 10 cm below the top of the sternum, a lapel 4 cm wide and at most 1 cm thick (C1.10). The trousers end within 5 cm of the ankle bone (C1.10). The belt's
//   tips run 20 to 30 cm from the knot, and the knot is "correctly and tightly made" (C1.10). The backnumber is sewn on the back, its top 3 cm below the collar (C1.8): this is a front view, so it is not drawn.
// - The belt: wrapped twice round the waist, crossed at the back, both ends brought to the front and tied in a flat square (reef) knot, left over right and then right over left, the two ends hanging slightly
//   apart and of one length. Its colour shows the grade: the kyu belts (white, yellow, orange, green, blue, brown), black for 1st to 5th dan, red and white panels for 6th to 8th dan (kohaku-obi) and solid red
//   for 9th and 10th dan.
// - The karate-gi (WKF Kumite and Kata Competition Rules, valid from 1.1.2023, article 2.2.1): white, without stripes or piping; the jacket, tightened with the belt, covers the hips and reaches at most
//   three-quarters of the thigh (g); the sleeves reach at most the bend of the wrist and at least halfway down the forearm (j); the trousers cover at least two thirds of the shin and stop above the ankle bone (l);
//   the jacket has ties (i); the belt is red (AKA) or blue (AO), about 5 cm wide, with 15 cm free on each side of the knot (e, f).
import type { Backnumber, PieceOptions } from "../ball/ball.core.ts";
import { fitSize, linePath } from "../ball/ball.letters.ts";
import { defineGear, drawGear, drawn, rect, type Part } from "./gear.core.ts";

/**
 * The colours of the judo belts, which `tint` takes: the six kyu colours in order, black (1st to 5th dan), `kohaku` (the red of the red-and-white belt of the 6th to 8th dan, whose white panels are the accent) and
 * `red` (9th and 10th dan). The Kodokan's own kyu belts are white and brown only; the colours between are a later, national addition, so a country's order may differ.
 */
export const OBI_RANKS = {
  white: "#f2efe8",
  yellow: "#f2c21b",
  orange: "#ee8a1c",
  green: "#2f9a52",
  blue: "#2b64c8",
  brown: "#7a4a24",
  black: "#1f2228",
  kohaku: "#c4202e",
  red: "#c4202e",
} as const;
export type ObiRank = keyof typeof OBI_RANKS;

type Pt = readonly [number, number];

/** Judogi colours: the IJF white ("snow white") and blue (between Pantone 285M and 286M). */
export const JUDOGI_WHITE = "#f6f4ee";
export const JUDOGI_BLUE = "#1456b6";

const f = (n: number): string => String(Math.round(n * 10) / 10);
const path = (pts: readonly Pt[], close = true): string => `M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join("L")}${close ? "z" : ""}`;
const mirror = (pts: readonly Pt[]): Pt[] => pts.map((p): Pt => [64 - p[0], p[1]]);
/** A rectangle of width `w` along the segment from `a` to `b`, as a polygon. */
const strip = (a: Pt, b: Pt, w: number): Pt[] => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2);
  return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]];
};
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
/** A line parallel to the segment from `a` to `b`, `off` to its side, between the fractions `t0` and `t1` of its length. */
const along = (a: Pt, b: Pt, off: number, t0: number, t1: number): string => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = (-dy / l) * off, ny = (dx / l) * off;
  const p0 = lerp(a, b, t0), p1 = lerp(a, b, t1);
  return `M${f(p0[0] + nx)} ${f(p0[1] + ny)}L${f(p1[0] + nx)} ${f(p1[1] + ny)}`;
};
/**
 * A sleeve of the jacket's left side, hanging out and down from the armhole: its axis `deg` below the horizontal, `len` long from the middle of the armhole to the middle of the cuff, and the cuff `cuff` wide. The
 * corners, in order: the top of the shoulder, the outer corner of the cuff, its inner corner and the underarm. Everything is measured from this shape (test/judo.test.ts).
 */
function hangingSleeve(top: Pt, under: Pt, deg: number, len: number, cuff: number): Pt[] {
  const a = (deg * Math.PI) / 180;
  const mid = lerp(top, under, 0.5);
  const tip: Pt = [mid[0] - Math.cos(a) * len, mid[1] + Math.sin(a) * len];
  const hx = (Math.sin(a) * cuff) / 2, hy = (Math.cos(a) * cuff) / 2;
  return [top, [tip[0] - hx, tip[1] - hy], [tip[0] + hx, tip[1] + hy], under];
}
/** The judogi's sleeve (IJF C1.10): to the wrist bone, about four fifths as long as the jacket, and wide at the cuff so that the forearm has room all the way. */
const JUDOGI_SLEEVE = hangingSleeve([19.8, 6.4], [18.6, 22.4], 60, 26, 8.8);
/** The karate-gi's sleeve (WKF 2.2.1 j): three-quarter length, between half the forearm and the bend of the wrist. */
const KARATE_SLEEVE = hangingSleeve([20.6, 8], [19.4, 22], 56, 23.6, 8.8);
/** Rows of quilting across a sleeve, from its top edge to its underside, leaving the ends of each row a little short of the seams. */
function sleeveRows(pts: readonly Pt[]): string {
  let d = "";
  for (let t = 0.1; t <= 0.9; t += 0.08) {
    const a = lerp(pts[0]!, pts[1]!, t), b = lerp(pts[3]!, pts[2]!, t);
    const a2 = lerp(a, b, 0.07), b2 = lerp(a, b, 0.93);
    d += `M${f(a2[0])} ${f(a2[1])}L${f(b2[0])} ${f(b2[1])}`;
  }
  return d;
}
/** The hem of a sleeve's cuff, stitched across at the fraction `t` of the way from the shoulder. */
const cuffHem = (sleeve: readonly Pt[], t = 0.9): string => {
  const a = lerp(sleeve[0]!, sleeve[1]!, t), b = lerp(sleeve[3]!, sleeve[2]!, t);
  return `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`;
};
/** Horizontal rows (every `step`, from `y0` to `y1`) clipped to a convex polygon, as one path. */
function rows(poly: readonly Pt[], y0: number, y1: number, step: number, inset = 0): string {
  let d = "";
  for (let y = y0; y <= y1 + 1e-6; y += step) {
    const xs: number[] = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i]!, b = poly[(i + 1) % poly.length]!;
      if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + ((y - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
    }
    if (xs.length >= 2) {
      const xa = Math.min(...xs) + inset, xb = Math.max(...xs) - inset;
      if (xb > xa) d += `M${f(xa)} ${f(y)}H${f(xb)}`;
    }
  }
  return d;
}

// Cloth lines are laid over the cloth as ink at low opacity (dark rows) or as light rows, so they follow any tint.
const INK = "#0d1522";
/** The edge of a black belt: light enough to show on a dark page. */
const BELT_EDGE = "#5d6672";
const dark = (d: string, w = 0.3, op = 0.2): Part => ({ d, fill: "none", stroke: INK, w, op, line: "none" });
const light = (d: string, w = 0.3, op = 0.3): Part => ({ d, fill: "none", stroke: "#ffffff", w, op, line: "none" });

// ───────────────────────────── the belt ─────────────────────────────

interface BeltSpec {
  /** The colour of the belt, and of its second colour (the other half of a split belt, or the white of the kohaku panels). */
  main: string;
  alt?: string;
  /** Centre and ends of the two wraps, the top of the first one, the width of the belt and how far its wraps sag at the middle (the belt is round). */
  cx: number;
  x0: number;
  x1: number;
  y: number;
  w: number;
  sag: number;
  /** The knot's width, the length of the ends and how far they hang apart (degrees). */
  knot: number;
  tail: number;
  splay: number;
  /** Panels of the red-and-white belt: the x where the panel colour changes along the first and the second wrap, and the colour of the ends. */
  panels?: { upper: readonly number[]; lower: readonly number[]; tail: string };
  /** A split belt: the second colour fills the lower half of the belt's width, lengthwise. */
  half?: boolean;
  /** The white stripe of a women's black belt, down the middle of the belt. */
  stripe?: boolean;
  /** A bar across each end. */
  bars?: boolean;
  /** The edge of the belt, where a darker tone of the belt itself would vanish (a black belt on a dark page). */
  edge?: string;
}

/** A belt tied at the front: two wraps, a flat square knot and two equal ends hanging a little apart. Parts, back to front. */
function belt(s: BeltSpec): Part[] {
  const parts: Part[] = [];
  const hw = (s.x1 - s.x0) / 2;
  const w = s.w;
  const alt = s.alt ?? s.main;
  const edge = (x: number, y: number): number => y + s.sag * (1 - ((x - s.cx) / hw) ** 2);
  const sample = (xa: number, xb: number): number[] => {
    const n = Math.max(2, Math.ceil((xb - xa) / 9));
    return Array.from({ length: n + 1 }, (_, i) => xa + ((xb - xa) * i) / n);
  };
  /** The wrap between `xa` and `xb`, from the fraction `f0` to `f1` of its width, whose top is at `y`, as a polygon that follows the sag. */
  const band = (xa: number, xb: number, y: number, f0 = 0, f1 = 1): Pt[] => {
    const xs = sample(xa, xb);
    return [...xs.map((x): Pt => [x, edge(x, y + w * f0)]), ...xs.map((x): Pt => [x, edge(x, y + w * f1)]).reverse()];
  };
  const line = (y: number, xa: number, xb: number): string => path(sample(xa, xb).map((x): Pt => [x, edge(x, y)]), false);
  const colourAt = (cuts: readonly number[], start: string, other: string): Array<[number, number, string]> => {
    const xs = [s.x0, ...cuts, s.x1];
    return xs.slice(0, -1).map((x, i): [number, number, string] => [x, xs[i + 1]!, i % 2 === 0 ? start : other]);
  };
  const yU = s.y, yL = s.y + w - 0.3;
  const wraps: Array<[number, Array<[number, number, string]>]> = [
    [yL, s.panels === undefined ? [[s.x0, s.x1, s.main]] : colourAt(s.panels.lower, alt, s.main)],
    [yU, s.panels === undefined ? [[s.x0, s.x1, s.main]] : colourAt(s.panels.upper, s.main, alt)],
  ];
  const stitches = (y: number, xa: number, xb: number): void => {
    parts.push(dark(line(y + w * 0.3, xa, xb) + line(y + w * 0.7, xa, xb), 0.28, 0.3));
    parts.push(light(line(y + w * 0.3 + 0.35, xa, xb) + line(y + w * 0.7 + 0.35, xa, xb), 0.25, 0.2));
  };
  for (const [y, segments] of wraps) {
    for (const [xa, xb, fill] of segments) parts.push({ d: path(band(xa, xb, y)), fill, stroke: s.edge, cyl: 0.5, shade: 0.25 });
    if (s.half === true) parts.push({ d: path(band(s.x0, s.x1, y, 0.5, 1)), fill: alt, stroke: "none", cyl: 0.5, shade: 0.25, line: "none" });
    stitches(y, s.x0 + 0.8, s.x1 - 0.8);
    if (s.stripe === true) parts.push({ d: path(band(s.x0, s.x1, y, 0.425, 0.575)), fill: "#f6f4ee", stroke: "none", line: "none" });
  }
  // The knot sits over both wraps. The two ends come out from under it, a little apart and of one length; the knot is a flat blob closed across the middle by the turn of the second end.
  const yc = (yU + yL + w) / 2 + s.sag;
  const hh = w * 1.2;
  const kw = s.knot;
  const yt = yc - hh, yb = yc + hh;
  const rad = (s.splay * Math.PI) / 180;
  const tw = w * 1.02;
  const tailFill = s.panels?.tail ?? s.main;
  for (const side of [-1, 1]) {
    const a: Pt = [s.cx + side * kw * 0.2, yc + hh * 0.2];
    const b: Pt = [a[0] + side * Math.sin(rad) * s.tail, a[1] + Math.cos(rad) * s.tail];
    parts.push({ d: path(strip(a, b, tw)), fill: tailFill, stroke: s.edge, cyl: 0.55, shade: 0.25 });
    if (s.half === true) {
      const q = strip(a, b, tw);
      parts.push({ d: path([lerp(q[0]!, q[3]!, 0.5), lerp(q[1]!, q[2]!, 0.5), q[2]!, q[3]!]), fill: alt, stroke: "none", cyl: 0.55, shade: 0.25, line: "none" });
    }
    parts.push(dark(along(a, b, -tw * 0.18, 0.3, 0.98) + along(a, b, tw * 0.18, 0.3, 0.98), 0.28, 0.3));
    parts.push(light(along(a, b, -tw * 0.18 + 0.35, 0.3, 0.98) + along(a, b, tw * 0.18 + 0.35, 0.3, 0.98), 0.25, 0.2));
    if (s.stripe === true) parts.push({ d: path(strip(lerp(a, b, 0.25), lerp(a, b, 1), tw * 0.15)), fill: "#f6f4ee", stroke: "none", line: "none" });
    if (s.bars === true) parts.push({ d: path(strip(lerp(a, b, 1 - 3.4 / s.tail), lerp(a, b, 1 - 2.2 / s.tail), tw)), fill: "$accent", stroke: "none", op: 0.9, line: "none" });
  }
  const kfill = s.panels === undefined ? s.main : alt;
  const blob = rect(s.cx - kw / 2, yt, kw, hh * 2, Math.min(2.4, kw * 0.22));
  parts.push({ d: blob, fill: kfill, stroke: s.edge, cyl: 0.6, shade: 0.3 });
  if (s.half === true) parts.push({ d: rect(s.cx - kw / 2, yc, kw, hh, Math.min(2.4, kw * 0.22)), fill: alt, stroke: "none", cyl: 0.6, shade: 0.3, line: "none" });
  // the folds of the knot: two diagonals that cross, from the top corners to the foot of the knot
  const fx0 = s.cx - kw / 2, fx1 = s.cx + kw / 2;
  parts.push(dark(`M${f(fx0 + 0.9)} ${f(yt + 0.9)}L${f(fx1 - 1.6)} ${f(yb - 0.9)}M${f(fx1 - 0.9)} ${f(yt + 0.9)}L${f(fx0 + 1.6)} ${f(yb - 0.9)}`, 0.34, 0.42));
  parts.push(light(`M${f(fx0 + 1.5)} ${f(yt + 0.9)}L${f(fx1 - 1)} ${f(yb - 0.9)}M${f(fx1 - 1.5)} ${f(yt + 0.9)}L${f(fx0 + 1)} ${f(yb - 0.9)}`, 0.3, 0.3));
  const wt = yc - w * 0.46, wh = w * 0.92;
  parts.push({ d: rect(fx0 - 0.5, wt, kw + 1, wh, 0.9), fill: s.main, stroke: s.edge, cyl: 0.9, shade: 0.3 });
  if (s.half === true) parts.push({ d: rect(fx0 - 0.5, yc, kw + 1, wh / 2, 0.5), fill: alt, stroke: "none", cyl: 0.9, shade: 0.3, line: "none" });
  parts.push(dark(`M${f(fx0)} ${f(yc)}H${f(fx1)}`, 0.28, 0.3));
  if (s.stripe === true) parts.push({ d: rect(fx0 - 0.3, yc - w * 0.075, kw + 0.6, w * 0.15), fill: "#f6f4ee", stroke: "none", line: "none" });
  return parts;
}

// ───────────────────────────── the judogi ─────────────────────────────

/**
 * The judogi laid flat: jacket (sleeves out to the sides, lapels crossed left over right, thick stitched collar, quilted upper body, vented skirt), the belt tied over it and the trousers below with a drawstring
 * waist and reinforced knees. `$main` is the cloth, `$accent` the belt.
 */
function judogiFlat(): Part[] {
  const parts: Part[] = [];
  // Trousers, behind everything: straight legs, a waistband with its drawstring, reinforced knees.
  const trousers: Pt[] = [[18.4, 37], [45.6, 37], [46.6, 62], [34.6, 62], [32, 43.6], [29.4, 62], [17.4, 62]];
  parts.push({ d: path(trousers), fill: "$main", shade: 0.3, cyl: 0.25 });
  parts.push({ d: path([[18.4, 37], [45.6, 37], [45.7, 39.8], [18.3, 39.8]]), fill: "$main", shade: 0.2 });
  parts.push(dark("M18.6 38.9H45.4", 0.3, 0.35));
  parts.push({ d: "M40.6 39.8Q39.4 42.8 40.4 45.2M42 39.8Q43 42.6 42.2 45", fill: "none", stroke: INK, w: 0.4, op: 0.5, line: "none" });
  const knees: Pt[][] = [[[19.2, 49.8], [30.8, 49.8], [30, 57.6], [18.8, 57.6]], [[33.2, 49.8], [44.8, 49.8], [45.2, 57.6], [34, 57.6]]];
  for (const k of knees) {
    parts.push({ d: path(k), fill: "$main", stroke: "none", shade: 0, line: "none" });
    parts.push(dark(path(k) + rows(k, 51.4, 56.4, 1.6, 0.3), 0.28, 0.35));
  }
  parts.push(dark("M17.6 60.2H29.6M34.4 60.2H46.4", 0.3, 0.3));
  // Sleeves: to the wrist, the arms hanging out and down (IJF C1.10: the sleeve covers the wrist bone, at most 5 cm short of it, and is loose all along the forearm).
  const sleeve = JUDOGI_SLEEVE;
  for (const pts of [sleeve, mirror(sleeve)]) parts.push({ d: path(pts), fill: "$main", cyl: 0.15, shade: 0.35 });
  const jacket: Pt[] = [[19.4, 6.6], [26.2, 4], [32, 3.2], [37.8, 4], [44.6, 6.6], [45.6, 8], [45.6, 36], [18.4, 36], [18.4, 8]];
  parts.push({ d: path(jacket), fill: "$main", shade: 0.35, cyl: 0.18 });
  // Quilting: rows over the shoulders, chest and sleeves (the cloth of a judogi is heavy and woven double).
  const body: Pt[] = [[19, 7], [45, 7], [45.6, 26], [18.4, 26]];
  parts.push(dark(rows(body, 8, 25, 1.4, 0.5), 0.28, 0.1));
  parts.push(light(rows(body, 8.5, 25.5, 1.4, 0.5), 0.24, 0.2));
  for (const pts of [sleeve, mirror(sleeve)]) parts.push(dark(sleeveRows(pts), 0.28, 0.1));
  // The loose cuff: a hem stitched a little in from the open end, on both sleeves.
  for (const pts of [sleeve, mirror(sleeve)]) parts.push(dark(cuffHem(pts), 0.3, 0.38));
  // The neck: the collar goes round the back of the neck, and the opening is a V that ends under 10 cm below the sternum.
  parts.push({ d: path([[26.4, 4.2], [37.6, 4.2], [33.4, 14]]), fill: INK, stroke: INK, w: 0.3, op: 0.62, line: "none" });
  parts.push({ d: "M25.4 5.4Q32 2 38.6 5.4L37.6 8.2Q32 5.4 26.4 8.2Z", fill: "$main", cyl: 0.4, shade: 0.3 });
  // Under lapel (the right front, worn under), its band running down to where the left front covers it.
  parts.push({ d: path(strip([26.8, 5.4], [33.8, 14.4], 2.9)), fill: "$main", cyl: 0.5, shade: 0.3 });
  // The left front, laid over: its panel and its thick, stitched lapel from the right of the neck to the hem.
  const over: Pt[] = [[36.4, 4.4], [44.6, 6.6], [45.6, 8], [45.6, 36], [22.8, 36]];
  parts.push({ d: path(over), fill: "$main", shade: 0.35, cyl: 0.1 });
  const overBody: Pt[] = [[36, 5], [45.6, 8], [45.6, 26], [28.8, 26]];
  parts.push(dark(rows(overBody, 8, 25, 1.4, 0.5), 0.3, 0.14));
  parts.push(light(rows(overBody, 8.5, 25.5, 1.4, 0.5), 0.26, 0.22));
  parts.push({ d: path(strip([37, 4.8], [24.4, 35], 3.9)), fill: "$main", cyl: 0.55, shade: 0.35 });
  parts.push({ d: path(strip([37, 4.8], [24.4, 35], 3.9)), fill: "none", stroke: INK, w: 0.3, op: 0.5, line: "none" });
  // Rows of stitching down both lapels.
  const lapelRows = (a: Pt, b: Pt, shift = 0): string => [-1.3, -0.45, 0.45, 1.3].map((o) => along([a[0] + shift, a[1]], [b[0] + shift, b[1]], o, 0, 1)).join("");
  parts.push(dark(lapelRows([36.6, 7.4], [24.8, 34.4]), 0.28, 0.45));
  parts.push(light(lapelRows([36.6, 7.4], [24.8, 34.4], 0.35), 0.25, 0.3));
  parts.push(dark(lapelRows([27.2, 6.4], [33.4, 14]), 0.28, 0.45));
  // Shadow of the lapel on the cloth under it.
  parts.push({ d: path(strip([34.6, 5.4], [22.6, 36], 1.2)), fill: INK, stroke: "none", op: 0.14, fx: true });
  // Hem: the skirt reaches past the belt, with short vents at the sides and a stitched edge.
  parts.push(dark("M18.8 34.4H44.8", 0.3, 0.32));
  parts.push(dark("M20.2 31.4V36M43.8 31.4V36", 0.4, 0.45));
  // The belt, over the jacket, wrapped twice.
  parts.push(...belt({ edge: BELT_EDGE, main: "$accent", cx: 32, x0: 18.2, x1: 45.8, y: 25.2, w: 2.5, sag: 0, knot: 6.4, tail: 11.4, splay: 6 }));
  return parts;
}

/** The judogi folded into a neat rectangle: collar and lapel stitching on top, the belt tied round it. */
function judogiFolded(): Part[] {
  const parts: Part[] = [];
  // The front of the pile (its thickness) under the top.
  const front: Pt[] = [[8.4, 41], [55.6, 41], [55.2, 52], [8.8, 52]];
  parts.push({ d: path(front), fill: "$main", shade: 0.25, cyl: 0.4 });
  parts.push({ d: path(front), fill: INK, stroke: "none", op: 0.12, fx: true });
  parts.push(dark("M9 44.6H55M8.9 48.2H55.1", 0.3, 0.3));
  parts.push(light("M9 45.2H55M8.9 48.8H55.1", 0.26, 0.25));
  // The top: sleeves folded back at the sides, the body folded over in thirds.
  const top: Pt[] = [[9, 9.4], [55, 9.4], [55.6, 41], [8.4, 41]];
  parts.push({ d: path(top), fill: "$main", shade: 0.35, cyl: 0.18 });
  parts.push(dark(rows(top, 10.4, 40, 1.4, 0.8), 0.3, 0.14));
  parts.push(light(rows(top, 10.9, 40.5, 1.4, 0.8), 0.26, 0.22));
  parts.push(dark("M14.6 10.4L14.2 40.4M49.4 10.4L49.8 40.4", 0.35, 0.28));
  // The collar, lapels crossed left over right, with rows of stitching.
  parts.push({ d: path([[27.2, 9.4], [36.8, 9.4], [32.8, 18]]), fill: INK, stroke: INK, w: 0.3, op: 0.34, line: "none" });
  parts.push({ d: "M23.6 10.6Q32 5.6 40.4 10.6L39.2 14Q32 10.2 24.8 14Z", fill: "$main", cyl: 0.4, shade: 0.3 });
  parts.push({ d: path(strip([27.2, 10.8], [33.4, 18.6], 3.1)), fill: "$main", cyl: 0.5, shade: 0.3 });
  const over: Pt[] = [[36.4, 9.8], [55, 9.4], [55.6, 41], [22.4, 41]];
  parts.push({ d: path(over), fill: "$main", shade: 0.35, cyl: 0.1 });
  parts.push(dark(rows([[36.4, 10], [55, 10], [55, 26], [29, 26]], 10.4, 25.6, 1.4, 0.8), 0.3, 0.14));
  parts.push({ d: path(strip([37.2, 10], [23.2, 40], 3.8)), fill: "$main", cyl: 0.55, shade: 0.35 });
  parts.push({ d: path(strip([37.2, 10], [23.2, 40], 3.8)), fill: "none", stroke: INK, w: 0.3, op: 0.5, line: "none" });
  const rowsAlong = (a: Pt, b: Pt): string => [-1.3, -0.45, 0.45, 1.3].map((o) => along(a, b, o, 0, 1)).join("");
  parts.push(dark(rowsAlong([37, 12], [24, 39]), 0.28, 0.45));
  parts.push(dark(rowsAlong([28, 11.4], [33.2, 18]), 0.28, 0.45));
  parts.push({ d: path(strip([36, 10.6], [22.6, 41], 1.4)), fill: INK, stroke: "none", op: 0.12, fx: true });
  // The belt wrapped round it and tied on top.
  parts.push(...belt({ edge: BELT_EDGE, main: "$accent", cx: 32, x0: 7.6, x1: 56.4, y: 26.4, w: 3, sag: 0, knot: 7.4, tail: 12.6, splay: 6 }));
  return parts;
}

export const GEAR_JUDOGI = /* @__PURE__ */ drawn("gear:judogi", "Judo suit", "柔道衣", { main: JUDOGI_WHITE, accent: OBI_RANKS.black, parts: judogiFlat() });
export const GEAR_JUDOGI_BLUE = /* @__PURE__ */ drawn("gear:judogi-blue", "Blue judo suit", "青い柔道衣", { main: JUDOGI_BLUE, accent: OBI_RANKS.black, parts: judogiFlat() });
export const GEAR_JUDOGI_FOLDED = /* @__PURE__ */ drawn("gear:judogi-folded", "Folded judo suit", "畳んだ柔道衣", { main: JUDOGI_WHITE, accent: OBI_RANKS.black, parts: judogiFolded() });
export const GEAR_JUDOGI_BLUE_FOLDED = /* @__PURE__ */ drawn("gear:judogi-blue-folded", "Folded blue judo suit", "畳んだ青い柔道衣", { main: JUDOGI_BLUE, accent: OBI_RANKS.black, parts: judogiFolded() });

// ───────────────────────────── the judogi from behind, with its back number ─────────────────────────────

/** The bands of the back number (IJF C1.8): blue for everyone, gold for an Olympic champion and red for a world champion while the title is held. Each with the ink of the family name and the ink of the country code. */
const BAND = {
  blue: { band: "#26318f", name: "#fefefe", code: "#26318f" },
  gold: { band: "#d8a31a", name: "#1b2430", code: "#1b2430" },
  red: { band: "#c4202e", name: "#fefefe", code: "#c4202e" },
} as const;
/** The white of the patch. */
const PATCH_WHITE = "#fcfcf9";
/** The back number's size and place, in this drawing's units: the large one is 38 cm wide and 39 cm high (the manual of the IJF's partner, docs/references.md), and the jacket's 27.2 units across stand for about 60 cm. */
const BACKNUMBER = { x0: 23.4, x1: 40.6, y0: 8.4, y1: 26.1 } as const;

const cleanName = (value: unknown): string =>
  typeof value === "string" ? value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9 '-]/g, "").replace(/\s+/g, " ").trim().slice(0, 16) : "";
const cleanCode = (value: unknown): string => (typeof value === "string" ? value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3) : "");
/** A dashed line round the edge of a rectangle, `inset` in from it: the stitching that holds the patch on. */
function stitches(x0: number, y0: number, x1: number, y1: number, inset: number, dash = 0.9, gap = 0.75): string {
  let d = "";
  const run = (xa: number, ya: number, xb: number, yb: number): void => {
    const len = Math.hypot(xb - xa, yb - ya);
    for (let t = 0; t < len - 0.2; t += dash + gap) {
      const e = Math.min(t + dash, len);
      d += `M${f(xa + ((xb - xa) * t) / len)} ${f(ya + ((yb - ya) * t) / len)}L${f(xa + ((xb - xa) * e) / len)} ${f(ya + ((yb - ya) * e) / len)}`;
    }
  };
  const a = x0 + inset, b = x1 - inset, c = y0 + inset, e = y1 - inset;
  run(a, c, b, c);
  run(b, c, b, e);
  run(b, e, a, e);
  run(a, e, a, c);
  return d;
}

/**
 * The back number as parts: a white patch with the family name in white capitals on a band across the top (the band arched), the three letters of the National Olympic Committee in capitals under it, and the rest
 * of the patch blank, where the event's sponsor goes. A small square at the left edge stands for the label that makes it authentic. No flag (the IJF's patch has none), no logo, no mark of the IJF or of the maker.
 */
function backnumberParts(back: Backnumber | undefined): Part[] {
  const parts: Part[] = [];
  const { x0, x1, y0, y1 } = BACKNUMBER;
  const w = x1 - x0, cx = (x0 + x1) / 2;
  const colours = BAND[back?.band === "gold" || back?.band === "red" ? back.band : "blue"];
  const name = back?.name === undefined ? "TANAKA" : cleanName(back.name);
  const code = back?.code === undefined ? "JPN" : cleanCode(back.code);
  parts.push({ d: rect(x0, y0, w, y1 - y0, 0.3), fill: PATCH_WHITE, stroke: "#7d8594", w: 0.45, shade: 0.12 });
  parts.push(dark(stitches(x0, y0, x1, y1, 0.5), 0.26, 0.45));
  parts.push({ d: `M${x0} ${f(y0 + 0.9)}Q${f(cx)} ${f(y0 - 0.5)} ${x1} ${f(y0 + 0.9)}L${x1} ${f(y0 + 4.6)}Q${f(cx)} ${f(y0 + 3.4)} ${x0} ${f(y0 + 4.6)}Z`, fill: colours.band, stroke: colours.band, w: 0.3, shade: 0 });
  const letters = { weight: 0.2, wide: 0.78 } as const;
  const nameSize = fitSize(name, letters, w - 3, 2.8);
  if (name !== "") parts.push({ d: linePath(name, { ...letters, size: nameSize }, cx, y0 + 2.4), fill: "none", stroke: colours.name, w: letters.weight * nameSize });
  const codeLetters = { weight: 0.24, wide: 1.05 } as const;
  const codeSize = fitSize(code, codeLetters, 10, 3.2);
  if (code !== "") parts.push({ d: linePath(code, { ...codeLetters, size: codeSize }, cx, y0 + 8.4), fill: "none", stroke: colours.code, w: codeLetters.weight * codeSize });
  parts.push({ d: rect(x0 + 0.9, y0 + 7.6, 1.3, 1.3), fill: "#1b2430", stroke: "none", shade: 0, line: "ink" });
  return parts;
}

/** The judogi laid flat and seen from behind: collar, the back of the jacket with the back number sewn on it (its top 3 cm under the collar), the belt crossed behind the waist and the trousers. `$main` is the cloth, `$accent` the belt. */
function judogiBack(back: Backnumber | undefined): Part[] {
  const parts: Part[] = [];
  const trousers: Pt[] = [[18.4, 37], [45.6, 37], [46.6, 62], [34.6, 62], [32, 43.6], [29.4, 62], [17.4, 62]];
  parts.push({ d: path(trousers), fill: "$main", shade: 0.3, cyl: 0.25 });
  parts.push({ d: path([[18.4, 37], [45.6, 37], [45.7, 39.8], [18.3, 39.8]]), fill: "$main", shade: 0.2 });
  parts.push(dark("M18.6 38.9H45.4", 0.3, 0.35));
  parts.push(dark("M17.6 60.2H29.6M34.4 60.2H46.4M32 39.8V43.4", 0.3, 0.3));
  const sleeve = JUDOGI_SLEEVE;
  for (const pts of [sleeve, mirror(sleeve)]) parts.push({ d: path(pts), fill: "$main", cyl: 0.15, shade: 0.35 });
  const jacket: Pt[] = [[19.4, 6.6], [26.2, 4], [32, 3.2], [37.8, 4], [44.6, 6.6], [45.6, 8], [45.6, 36], [18.4, 36], [18.4, 8]];
  parts.push({ d: path(jacket), fill: "$main", shade: 0.35, cyl: 0.18 });
  parts.push(dark(rows([[19, 7], [45, 7], [45.6, 35], [18.4, 35]], 9, 34, 1.4, 0.5), 0.28, 0.1));
  parts.push(light(rows([[19, 7], [45, 7], [45.6, 35], [18.4, 35]], 9.5, 34.5, 1.4, 0.5), 0.24, 0.2));
  for (const pts of [sleeve, mirror(sleeve)]) parts.push(dark(sleeveRows(pts), 0.28, 0.1));
  for (const pts of [sleeve, mirror(sleeve)]) parts.push(dark(cuffHem(pts), 0.3, 0.38));
  parts.push(dark("M18.8 34.4H44.8", 0.3, 0.32));
  parts.push(dark("M20.2 31.4V36M43.8 31.4V36", 0.4, 0.45));
  parts.push(...backnumberParts(back));
  // The collar goes round the back of the neck: a thick, stitched band.
  parts.push({ d: "M24.6 5.4Q32 2 39.4 5.4L38.8 8.2Q32 5.6 25.2 8.2Z", fill: "$main", cyl: 0.4, shade: 0.3 });
  parts.push(dark("M25.2 6.9Q32 4.2 38.8 6.9", 0.28, 0.4));
  // The belt, crossed behind the waist: two wraps, and the two turns that cross in the middle of the back.
  const edge = { stroke: BELT_EDGE, cyl: 0.5, shade: 0.25 } as const;
  parts.push({ d: path([[18.2, 27.2], [45.8, 27.2], [45.8, 29.7], [18.2, 29.7]]), fill: "$accent", ...edge });
  parts.push({ d: path([[18.2, 29.4], [45.8, 29.4], [45.8, 31.9], [18.2, 31.9]]), fill: "$accent", ...edge });
  parts.push({ d: path(strip([28.4, 27.2], [35.6, 31.9], 2.5)), fill: "$accent", ...edge });
  parts.push({ d: path(strip([35.6, 27.2], [28.4, 31.9], 2.5)), fill: "$accent", ...edge });
  parts.push(dark("M18.6 28.4H27M37 28.4H45.4M18.6 30.6H27M37 30.6H45.4", 0.26, 0.3));
  return parts;
}

/** The title of a back view: its name, then (when the call gave a back number) the family name and the country code that are on it. */
const backTitle = (en: string, back: Backnumber | undefined): string => {
  if (back === undefined) return en;
  const name = back.name === undefined ? "TANAKA" : cleanName(back.name);
  const code = back.code === undefined ? "JPN" : cleanCode(back.code);
  return [en, `${name} ${code}`.trim()].filter((t) => t !== "").join(", ");
};
const backPiece = (id: string, en: string, ja: string, main: string) => {
  const spec = { main, accent: OBI_RANKS.black, parts: judogiBack(undefined) };
  return defineGear({ id, en, ja, source: "drawn", model: spec, draw: (o) => drawGear(id, backTitle(en, o?.backnumber), { ...spec, parts: o?.backnumber === undefined ? spec.parts : judogiBack(o.backnumber) }, o) });
};
export const GEAR_JUDOGI_BACK = /* @__PURE__ */ backPiece("gear:judogi-back", "Judo suit, back view", "柔道衣の背面", JUDOGI_WHITE);
export const GEAR_JUDOGI_BLUE_BACK = /* @__PURE__ */ backPiece("gear:judogi-blue-back", "Blue judo suit, back view", "青い柔道衣の背面", JUDOGI_BLUE);

// ───────────────────────────── the karate-gi ─────────────────────────────

/** The karate-gi laid flat: lighter cloth (no quilting), a plain narrow collar, shorter jacket and sleeves than the judogi, tie strings, ankle-length trousers and the belt. `$main` is the cloth, `$accent` the belt. */
function karateFlat(): Part[] {
  const parts: Part[] = [];
  const trousers: Pt[] = [[19.4, 40], [44.6, 40], [45.4, 61.4], [34.4, 61.4], [32, 49], [29.6, 61.4], [18.6, 61.4]];
  parts.push({ d: path(trousers), fill: "$main", shade: 0.3, cyl: 0.15 });
  parts.push({ d: path([[19.4, 40], [44.6, 40], [44.6, 41.8], [19.4, 41.8]]), fill: "$main", shade: 0.15 });
  parts.push(dark("M19.6 41.4H44.4", 0.3, 0.3));
  parts.push({ d: "M26 41.8Q24.4 44.6 25.4 47M27.6 41.8Q28.4 44.4 27.4 46.8", fill: "none", stroke: INK, w: 0.35, op: 0.45, line: "none" });
  parts.push(dark("M18.8 60H29.6M34.4 60H45.2", 0.3, 0.25));
  // Sleeves reach the bend of the wrist at most and halfway down the forearm at least (WKF 2.2.1 j): three-quarter length, a little shorter than a judogi's, with a wide cuff.
  const sleeve = KARATE_SLEEVE;
  for (const pts of [sleeve, mirror(sleeve)]) parts.push({ d: path(pts), fill: "$main", shade: 0.3, cyl: 0.12 });
  for (const pts of [sleeve, mirror(sleeve)]) parts.push(dark(cuffHem(pts, 0.88), 0.3, 0.3));
  const jacket: Pt[] = [[20.2, 8], [26.6, 5.2], [32, 4.4], [37.4, 5.2], [43.8, 8], [44.8, 38.6], [19.2, 38.6]];
  parts.push({ d: path(jacket), fill: "$main", shade: 0.3, cyl: 0.15 });
  // Neck: a wide V that ends lower than the judogi's, a plain thin collar.
  parts.push({ d: path([[27.4, 5.4], [36.6, 5.4], [32, 19.6]]), fill: INK, stroke: INK, w: 0.3, op: 0.3, line: "none" });
  parts.push({ d: "M26.4 6.2Q32 3.4 37.6 6.2L37 8Q32 5.6 27 8Z", fill: "$main", cyl: 0.3, shade: 0.2 });
  parts.push({ d: path(strip([26.6, 6.6], [32.6, 19.8], 1.8)), fill: "$main", cyl: 0.3, shade: 0.2 });
  const over: Pt[] = [[36.4, 6.2], [43.8, 8], [44.8, 38.6], [24.6, 38.6]];
  parts.push({ d: path(over), fill: "$main", shade: 0.3, cyl: 0.08 });
  parts.push({ d: path(strip([36.8, 6.4], [23.4, 38], 2)), fill: "$main", cyl: 0.35, shade: 0.25 });
  parts.push({ d: path(strip([36.8, 6.4], [23.4, 38], 2)), fill: "none", stroke: INK, w: 0.3, op: 0.5, line: "none" });
  parts.push({ d: path(strip([35.6, 7.2], [23, 38.6], 1)), fill: INK, stroke: "none", op: 0.1, fx: true });
  // The ties of the jacket (WKF 2.2.1 i): two short strings at the chest.
  parts.push({ d: "M29.6 21.6Q28 23.6 28.6 26M27.4 22.4Q26.2 24.4 26.4 26.4", fill: "none", stroke: INK, w: 0.4, op: 0.5, line: "none" });
  parts.push(dark("M19.8 36.6H44.2", 0.3, 0.3));
  // The belt: 5 cm wide, with 15 cm free on each side of the knot, tied low on the hips; red (AKA) by default.
  parts.push(...belt({ main: "$accent", cx: 32, x0: 19, x1: 45, y: 27.4, w: 2.6, sag: 0, knot: 6.2, tail: 8.8, splay: 7 }));
  return parts;
}

export const GEAR_KARATE_GI = /* @__PURE__ */ drawn("gear:karate-gi", "Karate suit", "空手衣", { main: "#fbfaf6", accent: "#c4202e", parts: karateFlat() });

// ───────────────────────────── the belts ─────────────────────────────

const obiSpec = (extra?: Partial<BeltSpec>): readonly Part[] =>
  belt({ main: "$main", cx: 32, x0: 2.4, x1: 61.6, y: 13, w: 5, sag: 1.6, knot: 11.2, tail: 23, splay: 7, bars: true, ...extra });

const obiPiece = (id: string, en: string, ja: string, main: string, parts: readonly Part[], accent?: string) => drawn(id, en, ja, { main, accent, parts });

export const GEAR_OBI = /* @__PURE__ */ obiPiece("gear:obi", "Belt", "武道の帯", OBI_RANKS.black, obiSpec({ edge: BELT_EDGE }));
export const GEAR_OBI_WHITE = /* @__PURE__ */ obiPiece("gear:obi-white", "White belt", "白帯", OBI_RANKS.white, obiSpec());
export const GEAR_OBI_YELLOW = /* @__PURE__ */ obiPiece("gear:obi-yellow", "Yellow belt", "黄帯", OBI_RANKS.yellow, obiSpec());
export const GEAR_OBI_ORANGE = /* @__PURE__ */ obiPiece("gear:obi-orange", "Orange belt", "橙帯", OBI_RANKS.orange, obiSpec());
export const GEAR_OBI_GREEN = /* @__PURE__ */ obiPiece("gear:obi-green", "Green belt", "緑帯", OBI_RANKS.green, obiSpec());
export const GEAR_OBI_BLUE = /* @__PURE__ */ obiPiece("gear:obi-blue", "Blue belt", "青帯", OBI_RANKS.blue, obiSpec());
export const GEAR_OBI_BROWN = /* @__PURE__ */ obiPiece("gear:obi-brown", "Brown belt", "茶帯", OBI_RANKS.brown, obiSpec());
export const GEAR_OBI_RED = /* @__PURE__ */ obiPiece("gear:obi-red", "Red belt", "紅帯", OBI_RANKS.red, obiSpec());
/** The red-and-white belt of the 6th to 8th dan: panels of red and white (about 21 cm long), red at both ends. */
export const GEAR_OBI_KOHAKU = /* @__PURE__ */ obiPiece("gear:obi-kohaku", "Red and white belt", "紅白帯", OBI_RANKS.kohaku, obiSpec({ alt: "$accent", panels: { upper: [19, 45], lower: [11, 53], tail: "$main" }, bars: false }), "#f6f4ee");
/** The black belt of a woman in Japan: a white stripe down the middle of the belt along its whole length. */
export const GEAR_OBI_WOMEN = /* @__PURE__ */ obiPiece("gear:obi-women", "Women's black belt", "女子用の黒帯", OBI_RANKS.black, obiSpec({ stripe: true, edge: BELT_EDGE }));

const OBI_BY_RANK = { white: GEAR_OBI_WHITE, yellow: GEAR_OBI_YELLOW, orange: GEAR_OBI_ORANGE, green: GEAR_OBI_GREEN, blue: GEAR_OBI_BLUE, brown: GEAR_OBI_BROWN, black: GEAR_OBI, kohaku: GEAR_OBI_KOHAKU, red: GEAR_OBI_RED } as const;

// Two-colour belts: the intermediate belts several countries give between two kyu (the IJF names white-yellow, yellow-orange, orange-green and green-blue; France has had them since 1990), drawn as two halves of the
// belt's width, running the whole length. `tint` is the colour of the upper half and `accent` the colour of the lower.
const SPLIT = obiSpec({ half: true, alt: "$accent", bars: false });
const split = (id: string, en: string, ja: string, a: ObiRank, b: ObiRank) => obiPiece(id, en, ja, OBI_RANKS[a], SPLIT, OBI_RANKS[b]);
export const GEAR_OBI_WHITE_YELLOW = /* @__PURE__ */ split("gear:obi-white-yellow", "White and yellow belt", "白と黄の二色帯", "white", "yellow");
export const GEAR_OBI_YELLOW_ORANGE = /* @__PURE__ */ split("gear:obi-yellow-orange", "Yellow and orange belt", "黄と橙の二色帯", "yellow", "orange");
export const GEAR_OBI_ORANGE_GREEN = /* @__PURE__ */ split("gear:obi-orange-green", "Orange and green belt", "橙と緑の二色帯", "orange", "green");
export const GEAR_OBI_GREEN_BLUE = /* @__PURE__ */ split("gear:obi-green-blue", "Green and blue belt", "緑と青の二色帯", "green", "blue");
export const GEAR_OBI_BLUE_BROWN = /* @__PURE__ */ split("gear:obi-blue-brown", "Blue and brown belt", "青と茶の二色帯", "blue", "brown");
/** Any two colours: the belt `obi` draws for a pair. */
const OBI_SPLIT = /* @__PURE__ */ split("gear:obi-split", "Two-colour belt", "二色の帯", "white", "yellow");

/** What `obi` takes beside the usual options. `tint` may be one colour or a pair (a two-colour belt, the first colour above and the second below); `women` draws the white stripe of the women's black belt (only the black belt has one; every other belt ignores it). */
export interface ObiOptions extends Omit<PieceOptions, "tint"> {
  tint?: string | readonly [string, string];
  women?: boolean;
}

/**
 * The belt of a rank: `"white"`, `"yellow"`, `"orange"`, `"green"`, `"blue"`, `"brown"` (the kyu), `"black"` (1st to 5th dan), `"kohaku"` (red and white panels, 6th to 8th dan) or `"red"` (9th and 10th dan), or
 * a pair of ranks (`["white", "yellow"]`) for a two-colour belt. An unknown rank is the black belt. `tint` takes one colour, or a pair for a two-colour belt. `women: true` adds the white stripe that women wear on a
 * black belt in Japan.
 */
export const obi = (rank: ObiRank | readonly [ObiRank, ObiRank], options?: ObiOptions): string => {
  const { women, tint, ...rest } = options ?? {};
  const colour = (r: ObiRank): string => (Object.hasOwn(OBI_RANKS, r) ? OBI_RANKS[r] : OBI_RANKS.black);
  if (Array.isArray(tint) && tint.length === 2) return OBI_SPLIT.svg({ ...rest, tint: tint[0], accent: tint[1] });
  if (Array.isArray(rank)) return OBI_SPLIT.svg({ ...rest, tint: colour(rank[0] as ObiRank), accent: colour(rank[1] as ObiRank) });
  const known: ObiRank = typeof rank === "string" && Object.hasOwn(OBI_RANKS, rank) ? rank : "black";
  const one = typeof tint === "string" ? { ...rest, tint } : rest;
  if (women === true && known === "black") return GEAR_OBI_WOMEN.svg(one);
  return OBI_BY_RANK[known].svg(one);
};
