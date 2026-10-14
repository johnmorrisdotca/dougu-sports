// A championship pennant: a long triangle of felt on a dowel, with an edge sewn in a second colour and the words and the year in felt letters. Drawn felt-flat in `metal` and `color` (the fibres are a
// faint speckle, the `metal` style adds a soft light), and as one outline in `line`. Turned, it flips like a coin and shows its back, which is plain felt and the stitching, with the dowel on the other
// side. Imports the core, the text widths of the engraving helpers and the coin-flip turn.
import { type Emblem, type EmblemOptions, type FrameOptions, type Rgb, clean, degrees, escape, hexOf, mix, n2, readColour, resolve, wrap } from "./emblem.core.ts";
import { widthOf } from "./emblem.engrave.ts";
import { flipSvg } from "./emblem.flip.ts";

const FELT = "#8f1d2c";
const CREAM = "#f4f0e4";
const FONT = "system-ui,-apple-system,'Segoe UI','Hiragino Sans','Noto Sans JP','Yu Gothic',sans-serif";
/** The felt: a wide left edge on the dowel, a point at the right, edges that sag a little. */
const SHAPE = "M8 15Q34 22 60 32Q34 42 8 49Z";
const STITCH = "M10.2 18Q34 24.6 55.6 32Q34 39.4 10.2 46Z";
const ROD = "M4.6 11.5h3.4v41h-3.4z";

/** The half height of the felt at x. */
const half = (x: number): number => 17 - ((x - 8) * 17) / 52;

/** The lines of lettering, each as large as fits inside the triangle from the left edge: the main words, then the year. */
function lettering(text: string, year: string | undefined): { text: string; x: number; y: number; size: number; width: number }[] {
  const rows = [text, ...(year === undefined ? [] : [year])].filter((t) => t !== "");
  if (rows.length === 0) return [];
  const x0 = 12.5;
  for (let f = 11; f >= 2.2; f -= 0.2) {
    const sizes = rows.map((_, i) => (i === 0 ? f : f * 0.55));
    const total = sizes.reduce((sum, s) => sum + s * 1.12, 0);
    let top = 32 - total / 2;
    const placed = rows.map((t, i) => {
      const size = sizes[i] as number;
      const y = top + size * 0.86;
      top += size * 1.12;
      return { text: t, x: x0, y, size, width: widthOf(t) * size };
    });
    const fits = placed.every((p) => {
      const end = p.x + p.width;
      const reach = half(end) - 4.2;
      return end <= 56 && p.y - p.size * 0.8 >= 32 - reach && p.y + p.size * 0.04 <= 32 + reach;
    });
    if (fits) return placed;
  }
  return rows.map((t, i) => ({ text: t, x: x0, y: 32 + i * 5, size: 2.2, width: widthOf(t) * 2.2 }));
}

/** One side of the pennant as a document. */
function draw(title: string, o: EmblemOptions | undefined, back: boolean): string {
  const r = resolve(o);
  const line = r.style === "line";
  const felt = r.tint ?? (readColour(FELT) as Rgb);
  const trim = r.accent ?? CREAM;
  const ink = hexOf(readColour(o?.numberColor) ?? (readColour(trim) as Rgb));
  const words = clean(o?.engrave ?? o?.label)?.toUpperCase();
  const year = clean(o?.year);
  const flatFelt = hexOf(felt);
  const pid = `dgpf${flatFelt.slice(1)}`;
  let body = `<g${back ? ' transform="translate(64 0) scale(-1 1)"' : ""}>`;
  body += `<path d="${ROD}" fill="${line ? "none" : "#a8743c"}"/>`;
  body += `<path d="${SHAPE}" fill="${line ? "none" : r.style === "metal" ? `url(#${pid})` : flatFelt}"/>`;
  if (!line && r.style === "metal") body += `<path d="${SHAPE}" fill="url(#dgsp)" stroke="none"/>`;
  body += `<path d="${STITCH}" fill="none" stroke="${line ? "currentColor" : trim}" stroke-width="${line ? 1.2 : 0.7}" stroke-dasharray="1.9 1.5" stroke-linecap="butt"/>`;
  const text = back ? [] : lettering(words ?? "", year);
  if (text.length > 0) {
    body += `<g font-family="${FONT}" font-weight="800" fill="${line ? "currentColor" : ink}" stroke="none">${text
      .map((t) => `<text x="${n2(t.x)}" y="${n2(t.y)}" font-size="${n2(t.size)}" textLength="${n2(t.width)}" lengthAdjust="spacingAndGlyphs">${escape(t.text)}</text>`)
      .join("")}</g>`;
  }
  body += "</g>";
  const defs = r.style !== "metal"
    ? ""
    : `<defs><pattern id="${pid}" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><rect width="2.4" height="2.4" fill="${flatFelt}" stroke="none"/><circle cx=".6" cy=".7" r=".32" fill="#fff" fill-opacity=".14" stroke="none"/><circle cx="1.8" cy="1.6" r=".3" fill="#000" fill-opacity=".14" stroke="none"/></pattern><linearGradient id="dgsp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>`;
  return wrap({ title, size: r.size, style: r.style, theme: r.theme, defs, body, edge: mix(felt, -0.5), width: 0.8 });
}

/** A pennant: its front with the lettering, turned like a coin to its plain back. */
export function definePennant(id: string, en: string, ja: string): Emblem<null> {
  const svg = (o?: EmblemOptions): string => draw(en, o, o?.view === "back");
  const frame = (o?: FrameOptions): string => {
    const back = o?.view === "back";
    return flipSvg(draw(en, o, back), { yaw: degrees(o?.yaw), pitch: degrees(o?.pitch), line: o?.style === "line", back: draw(en, o, !back), thick: 0.016 });
  };
  return { id, en, ja, source: "ours", kind: "flat", model: null, svg, frame };
}
