// Engraving: text cut into a face. A plate is a box on a flat face; its lines are fitted to it (the biggest size at which the longest line and the stack of lines both fit), and the ink is chosen
// to read at 4.5 to 1 on the metal under it, the same way a crest's letters are. A plinth is a band round a body of revolution: its letters are set one by one at their angle round it, so the
// text foreshortens, goes behind the edge and comes round as the body turns. Imports only the core.
import { type EmblemOptions, type Engraving, type Rgb, clean, escape, lum, mix, n2, readColour } from "./emblem.core.ts";

/** A box on a flat face: its centre and its size. */
export interface Plate {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A line of text and how big it is next to the others (1 is the biggest). */
export interface Line {
  text: string;
  weight: number;
}

const FONT = "system-ui,-apple-system,'Segoe UI','Hiragino Sans','Noto Sans JP','Yu Gothic',sans-serif";

/** The width of one character in em: a guess that holds for the usual sans-serif fonts, whole for Japanese and the wide forms. */
export function advance(ch: string): number {
  const c = ch.codePointAt(0) as number;
  if (c >= 0x2e80 && c <= 0xffef && !(c >= 0xff61 && c <= 0xff9f)) return 1.02;
  if (ch === " ") return 0.3;
  if (/[iljI.,:;'!|]/.test(ch)) return 0.34;
  if (/[mwMW]/.test(ch)) return 0.92;
  if (/[A-Z]/.test(ch)) return 0.72;
  if (/[0-9]/.test(ch)) return 0.62;
  return 0.58;
}

/** The width of a text in em. */
export const widthOf = (text: string): number => [...text].reduce((sum, ch) => sum + advance(ch), 0);

/** Black or white, or a deep or pale tone of the colour itself, whichever reads at 4.5 to 1 on the colour (the best of them when none does). */
export function inkFor(main: Rgb): string {
  const ratio = (a: Rgb, b: Rgb): number => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const dark = lum(main) > 0.18;
  const list = dark ? [mix(main, -0.72), "#000000", mix(main, 0.9), "#ffffff"] : [mix(main, 0.9), "#ffffff", mix(main, -0.72), "#000000"];
  const scored = list.map((c) => [c, ratio(readColour(c) as Rgb, main)] as const);
  return (scored.find((s) => s[1] >= 4.5) ?? scored.reduce((a, b) => (b[1] > a[1] ? b : a)))[0];
}

/** The lines to cut, as candidates (the layout takes the one that gives the biggest letters), and the year when a plate of its own holds it. */
export function linesOf(e: Engraving, place?: { rank?: string; yearApart?: boolean }): { main: Line[][]; year: string | undefined } {
  const yearApart = place?.yearApart === true;
  if (e.free !== undefined) {
    const rows = e.free.split("\n");
    if (rows.length > 1) return { main: [rows.map((text, i) => ({ text, weight: i === 0 ? 1 : i === 1 ? 0.62 : 0.5 }))], year: undefined };
    const words = (e.free.match(/\S+/g) ?? [e.free]) as string[];
    const cut = words.slice(1).map((_, i) => [words.slice(0, i + 1).join(" "), words.slice(i + 1).join(" ")]);
    const one: Line[] = [{ text: e.free, weight: 1 }];
    return { main: [one, ...cut.map((pair) => pair.map((text, i) => ({ text, weight: i === 0 ? 1 : 0.62 })))], year: undefined };
  }
  const rank = e.rank ?? place?.rank;
  const lines: Line[] = [];
  const big = rank !== undefined;
  if (rank !== undefined) lines.push({ text: rank, weight: 1 });
  if (e.label !== undefined) lines.push({ text: e.label, weight: big ? 0.5 : 1 });
  if (e.year !== undefined && !yearApart) lines.push({ text: e.year, weight: big ? 0.42 : 0.6 });
  return { main: lines.length === 0 ? [] : [lines], year: yearApart ? e.year : undefined };
}

/** Lines fitted to a plate: each line's size and baseline, and the smallest size (the score of the fit). */
function fit(lines: readonly Line[], p: Plate): { rows: { text: string; size: number; y: number; width: number }[]; score: number } {
  const lh = 1.14;
  const unit = p.h / lines.reduce((sum, l) => sum + l.weight * lh, 0);
  const sizes = lines.map((l) => Math.min(unit * l.weight, (p.w * 0.96) / Math.max(widthOf(l.text), 0.4)));
  const total = sizes.reduce((sum, s) => sum + s * lh, 0);
  let top = p.y - total / 2;
  const rows = lines.map((l, i) => {
    const size = sizes[i] as number;
    const y = top + (size * lh) / 2 + size * 0.36;
    top += size * lh;
    return { text: l.text, size, y, width: widthOf(l.text) * size };
  });
  return { rows, score: Math.min(...sizes) };
}

/** The ink of an engraving: the page's ink in the line style, else the colour that reads on the metal. */
export const engravingInk = (style: string, main: Rgb): string => (style === "line" ? "currentColor" : inkFor(main));

/** Lines cut into a plate, as markup: the ink, and in the metal style a faint light under each line where the cut catches it. `candidates` are alternative line breaks, and the best fit is used. */
export function plateMarkup(candidates: readonly (readonly Line[])[], plate: Plate, main: Rgb, style: string): string {
  const fits = candidates.filter((c) => c.length > 0).map((c) => fit(c, plate));
  if (fits.length === 0) return "";
  const best = fits.reduce((a, b) => (b.score > a.score + 0.01 ? b : a));
  const text = (dx: number): string =>
    best.rows
      .map((r) => `<text x="${n2(plate.x + dx)}" y="${n2(r.y + dx)}" font-size="${n2(r.size)}" textLength="${n2(r.width)}" lengthAdjust="spacingAndGlyphs">${escape(r.text)}</text>`)
      .join("");
  const head = `font-family="${FONT}" font-weight="800" text-anchor="middle" stroke="none"`;
  const glint = style === "metal" ? `<g ${head} fill="${mix(main, 0.7)}" fill-opacity=".7">${text(0.3)}</g>` : "";
  return `${glint}<g ${head} fill="${engravingInk(style, main)}">${text(0)}</g>`;
}

/** A band round a body of revolution that holds text: the heights it spans, the tone it is cut into, the angle it is centred on and, for a body with flat sides, the side. */
export interface Band {
  y0: number;
  y1: number;
  tone?: string;
  at?: number;
  face?: number;
}

/** The letters of a text set round a body at a radius: `angle` is the turn of the body now, `place` puts a point of the surface on the screen. A letter on the far side is left out. */
export function cylinderText(text: string, radius: number, height: number, ink: string, angle: number, centre: number, place: (deg: number) => readonly [x: number, y: number, depth: number]): string {
  const em = Math.max(widthOf(text), 0.4);
  const size = Math.min(height * 0.8, (radius * 1.9) / em);
  const letters = [...text];
  let run = -(em * size) / 2;
  let out = "";
  for (const ch of letters) {
    const w = advance(ch) * size;
    const deg = centre + angle + ((run + w / 2) / radius) * (180 / Math.PI);
    run += w;
    if (ch === " ") continue;
    const [x, y, depth] = place(deg);
    if (depth < 0.14) continue;
    out += `<text transform="translate(${n2(x)} ${n2(y + size * 0.36)}) scale(${n2(depth)} 1)">${escape(ch)}</text>`;
  }
  return out === "" ? "" : `<g font-family="${FONT}" font-weight="800" text-anchor="middle" font-size="${n2(size)}" fill="${ink}" fill-opacity=".92" stroke="none">${out}</g>`;
}

/** The letters of a text set on one flat side of a body, from one edge of the side to the other, as that side faces the eye. `a` and `b` are the two edges on the screen, `depth` how squarely the side faces. */
export function sideText(text: string, chord: number, height: number, ink: string, a: readonly [number, number], b: readonly [number, number], depth: number): string {
  if (depth < 0.14) return "";
  const em = Math.max(widthOf(text), 0.4);
  const size = Math.min(height * 0.8, (chord * 0.8) / em);
  const slope = (b[1] - a[1]) / (b[0] - a[0] || 1);
  let run = -(em * size) / 2;
  let out = "";
  for (const ch of text) {
    const w = advance(ch) * size;
    const u = 0.5 + (run + w / 2) / chord;
    run += w;
    if (ch === " ") continue;
    out += `<text transform="matrix(${n2(depth)} ${n2(slope * depth)} 0 1 ${n2(a[0] + (b[0] - a[0]) * u)} ${n2(a[1] + (b[1] - a[1]) * u + size * 0.36)})">${escape(ch)}</text>`;
  }
  return `<g font-family="${FONT}" font-weight="800" text-anchor="middle" font-size="${n2(size)}" fill="${ink}" fill-opacity=".92" stroke="none">${out}</g>`;
}

/** The text of an engraving as one line, for a band that holds one: the free text with its lines joined, or the rank, label and year. */
export const flatText = (e: Engraving): string => (e.free ?? [e.rank, e.label, e.year].filter((part) => part !== undefined).join(" ")).replace(/\n/g, " ");

/** What is to be cut into a face, from the options: the free text, or the label, year and rank, and the text of the back. */
export function engravingOf(o: EmblemOptions | undefined): Engraving {
  const e: Engraving = {};
  const free = clean(o?.engrave, 3);
  const [label, year, rank, back] = [clean(o?.label), clean(o?.year), clean(o?.rank), clean(o?.engraveBack, 3)];
  if (free !== undefined) e.free = free;
  if (label !== undefined) e.label = label;
  if (year !== undefined) e.year = year;
  if (rank !== undefined) e.rank = rank;
  if (back !== undefined) e.back = back;
  return e;
}
