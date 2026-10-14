// Vector lettering for the printed pucks: every letter and numeral is a centre line in a box 90 units tall, and the stroke width makes it bold. No font file and no system font is used, so the print
// looks the same everywhere and is a few hundred bytes of path. The strokes are adapted from the block letters of senshu-jerseys (the same author, the same MIT licence); here they are drawn wide, heavy and
// leaning a little forward, so a puck's CANADA is a sports print of its own. A line of text comes out as one path in the face's own units (the stroke width is the caller's), straight or set on an arc.
// A character with no glyph is left out. Imports only the core's number writer.
import { num } from "./ball.core.ts";

interface Glyph {
  /** The width of the box, 0 for a letter that is a single stroke. */
  w: number;
  /** The centre line: absolute `M L C Z` commands. */
  d: string;
}

const GLYPHS: Readonly<Record<string, Glyph>> = {
  "0": { w: 48, d: "M24 0C8 0 0 14 0 45C0 76 8 90 24 90C40 90 48 76 48 45C48 14 40 0 24 0Z" },
  "1": { w: 28, d: "M0 24L28 0L28 90" },
  "2": { w: 48, d: "M0 22C0 8 10 0 24 0C38 0 48 8 48 24C48 38 40 46 28 56L0 90L48 90" },
  "3": { w: 48, d: "M2 0L46 0L24 34C40 34 48 46 48 62C48 80 38 90 24 90C10 90 2 82 0 68" },
  "4": { w: 50, d: "M36 90L36 0L0 62L50 62" },
  "5": { w: 48, d: "M46 0L6 0L2 40C10 34 18 32 26 32C40 32 48 46 48 62C48 80 38 90 24 90C10 90 2 82 0 70" },
  "6": { w: 48, d: "M44 6C38 2 32 0 24 0C8 0 0 16 0 46C0 76 8 90 24 90C40 90 48 78 48 62C48 46 40 36 24 36C12 36 2 44 0 56" },
  "7": { w: 48, d: "M0 0L48 0L16 90" },
  "8": { w: 46, d: "M23 0C10 0 4 8 4 20C4 32 12 40 23 43C36 46 46 52 46 66C46 82 38 90 23 90C8 90 0 82 0 66C0 52 10 46 23 43C34 40 42 32 42 20C42 8 36 0 23 0Z" },
  "9": { w: 48, d: "M4 84C10 88 16 90 24 90C40 90 48 74 48 44C48 14 40 0 24 0C8 0 0 12 0 28C0 44 8 54 24 54C36 54 46 46 48 34" },
  A: { w: 50, d: "M0 90L25 0L50 90M10 60L40 60" },
  B: { w: 46, d: "M0 90L0 0L26 0C40 0 44 10 44 21C44 34 36 42 26 43L0 43M26 43C40 44 46 52 46 66C46 82 40 90 26 90L0 90" },
  C: { w: 46, d: "M46 24C44 8 36 0 24 0C8 0 0 14 0 45C0 76 8 90 24 90C36 90 44 82 46 66" },
  D: { w: 46, d: "M0 0L0 90L20 90C40 90 46 76 46 45C46 14 40 0 20 0Z" },
  E: { w: 42, d: "M42 0L0 0L0 90L42 90M0 44L34 44" },
  F: { w: 40, d: "M40 0L0 0L0 90M0 44L32 44" },
  G: { w: 46, d: "M46 24C44 8 36 0 24 0C8 0 0 14 0 45C0 76 8 90 24 90C40 90 46 78 46 58L46 50L26 50" },
  H: { w: 46, d: "M0 0L0 90M46 0L46 90M0 44L46 44" },
  I: { w: 0, d: "M0 0L0 90" },
  J: { w: 38, d: "M38 0L38 64C38 82 30 90 20 90C8 90 0 82 0 66" },
  K: { w: 46, d: "M0 0L0 90M46 0L2 50M14 36L46 90" },
  L: { w: 38, d: "M0 0L0 90L38 90" },
  M: { w: 58, d: "M0 90L0 0L29 62L58 0L58 90" },
  N: { w: 46, d: "M0 90L0 0L46 90L46 0" },
  O: { w: 48, d: "M24 0C8 0 0 14 0 45C0 76 8 90 24 90C40 90 48 76 48 45C48 14 40 0 24 0Z" },
  P: { w: 46, d: "M0 90L0 0L28 0C42 0 46 10 46 24C46 38 40 48 26 48L0 48" },
  Q: { w: 48, d: "M24 0C8 0 0 14 0 45C0 76 8 90 24 90C40 90 48 76 48 45C48 14 40 0 24 0ZM30 68L50 94" },
  R: { w: 46, d: "M0 90L0 0L28 0C42 0 46 10 46 22C46 36 40 46 26 47L0 47M24 47L46 90" },
  S: { w: 46, d: "M44 22C42 8 34 0 22 0C8 0 2 10 2 22C2 36 12 40 24 45C36 50 46 56 46 68C46 82 38 90 24 90C10 90 2 82 0 66" },
  T: { w: 46, d: "M0 0L46 0M23 0L23 90" },
  U: { w: 46, d: "M0 0L0 62C0 82 8 90 23 90C38 90 46 82 46 62L46 0" },
  V: { w: 48, d: "M0 0L24 90L48 0" },
  W: { w: 60, d: "M0 0L15 90L30 28L45 90L60 0" },
  X: { w: 48, d: "M0 0L48 90M48 0L0 90" },
  Y: { w: 48, d: "M0 0L24 46L48 0M24 46L24 90" },
  Z: { w: 46, d: "M0 0L46 0L0 90L46 90" },
  "-": { w: 24, d: "M0 45L24 45" },
  ".": { w: 0, d: "M0 80L0 90" },
  ",": { w: 0, d: "M0 80L0 92" },
  "'": { w: 0, d: "M0 0L0 22" },
  "/": { w: 26, d: "M0 90L26 0" },
  ":": { w: 0, d: "M0 22L0 32M0 70L0 80" },
  "&": { w: 52, d: "M52 90L10 34C2 22 6 0 24 0C42 0 44 20 36 30L8 60C-2 76 6 90 24 90C34 90 44 80 50 60" },
  "·": { w: 0, d: "M0 42L0 48" },
  " ": { w: 22, d: "" },
};

/** The glyph of a character (a lower-case letter is its capital, an accented one its plain one; the bullet and the middle dot are one dot), or `undefined`. */
export function glyphOf(char: string): Glyph | undefined {
  const plain = (char === "•" || char === "·" ? "·" : char.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase());
  return Object.hasOwn(GLYPHS, plain) ? GLYPHS[plain] : undefined;
}

/** How a line is set. `size` is the height of a capital in the face's units; the stroke is `weight` of it. */
export interface Lettering {
  size: number;
  /** The stroke as a fraction of the height: 0.12 is regular, 0.2 bold, 0.27 black. */
  weight: number;
  /** 1 is the glyphs' own width; the wide print of CANADA is 1.3 or more. */
  wide?: number;
  /** The lean: how far the top of a letter is pushed to the right, as a fraction of the height (0.12 is a sports slant). */
  slant?: number;
  /** Extra space between letters, as a fraction of the height. */
  track?: number;
}

const GLYPH_H = 90;

/** The characters of a text that have a glyph, as glyphs (an unknown character is left out). */
const glyphsOf = (text: string): Glyph[] => [...text].map(glyphOf).filter((g): g is Glyph => g !== undefined);

/** The pen positions of a text in glyph units: the left edge of each glyph's box and the total width, from the first glyph's left edge to the last one's right edge. */
function setting(glyphs: readonly Glyph[], o: Lettering): { at: number[]; total: number; stroke: number } {
  const wide = o.wide ?? 1;
  const stroke = o.weight * GLYPH_H;
  const gap = Math.max(5, stroke * 0.5) + (o.track ?? 0) * GLYPH_H;
  const at: number[] = [];
  let x = 0;
  for (const g of glyphs) {
    at.push(x);
    x += g.w * wide + stroke + gap;
  }
  const total = Math.max(0, x - stroke - gap);
  return { at, total, stroke };
}

/** The width a text takes, in the face's units, with the stroke's own thickness included. */
export function textWidth(text: string, o: Lettering): number {
  const glyphs = glyphsOf(text);
  const s = setting(glyphs, o);
  return ((s.total + s.stroke) * o.size) / GLYPH_H;
}

/** The size at which a text is as wide as `width` at most and as tall as `height` at most. */
export function fitSize(text: string, o: Omit<Lettering, "size">, width: number, height: number): number {
  const w = textWidth(text, { ...o, size: 1 });
  return Math.min(height, w === 0 ? height : width / w);
}

type Pt = readonly [number, number];

/** A glyph's path with every point run through `map`. The glyph tables use absolute `M L C Z` only, so each pair of numbers is a point. */
function mapPath(d: string, map: (p: Pt) => Pt): string {
  let out = "";
  for (const part of d.match(/[MLCZ][^MLCZ]*/g) ?? []) {
    const nums = (part.slice(1).match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const points: string[] = [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const q = map([nums[i] as number, nums[i + 1] as number]);
      points.push(`${num(q[0], 3)} ${num(q[1], 3)}`);
    }
    out += part[0] + points.join(" ");
  }
  return out;
}

/** A point of a glyph made wide and leaning, in glyph units with the origin at the top left of its box. */
const shaped = (o: Lettering) => (p: Pt): Pt => [p[0] * (o.wide ?? 1) + (o.slant ?? 0) * (GLYPH_H - p[1]), p[1]];

/** A line of text on a straight line, centred on (`x`, `y`), as one path: draw it with a stroke of `weight * size`. */
export function linePath(text: string, o: Lettering, x: number, y: number): string {
  const glyphs = glyphsOf(text);
  const s = setting(glyphs, o);
  const k = o.size / GLYPH_H;
  const left = x - (s.total * k) / 2;
  const top = y - o.size / 2;
  const shape = shaped(o);
  return glyphs.map((g, i) => mapPath(g.d, (p) => {
    const q = shape(p);
    return [left + ((s.at[i] as number) + q[0]) * k, top + q[1] * k];
  })).join("");
}

/**
 * A line of text set on an arc of the circle of radius `r` (the middle of the letters), centred on the angle `centre` in degrees clockwise from the top. With `inside` false the letters stand outward and read
 * clockwise (the top of the ring); with `inside` true they stand inward and read left to right (the bottom of the ring, `centre` 180). One path.
 */
export function arcPath(text: string, o: Lettering, r: number, centre: number, inside = false): string {
  const glyphs = glyphsOf(text);
  const s = setting(glyphs, o);
  const k = o.size / GLYPH_H;
  const shape = shaped(o);
  const base = inside ? r + o.size / 2 : r - o.size / 2;
  const mid = (centre * Math.PI) / 180;
  return glyphs.map((g, i) => {
    const half = (g.w * (o.wide ?? 1)) / 2;
    const along = ((s.at[i] as number) + half - s.total / 2) * k;
    const a = inside ? mid - along / r : mid + along / r;
    const sin = Math.sin(a), cos = Math.cos(a);
    const ox = base * sin, oy = -base * cos;
    // The glyph's own axes: along the line of reading, and down the glyph (toward the centre on the top, outward on the bottom).
    const [ax, ay] = inside ? [-cos, -sin] : [cos, sin];
    const [dx, dy] = inside ? [sin, -cos] : [-sin, cos];
    return mapPath(g.d, (p) => {
      const q = shape(p);
      const lx = (q[0] - half * 1) * k;
      const ly = (q[1] - GLYPH_H) * k;
      return [ox + lx * ax + ly * dx, oy + lx * ay + ly * dy];
    });
  }).join("");
}
