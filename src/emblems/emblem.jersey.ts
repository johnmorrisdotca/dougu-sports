// Jerseys: a generic shirt in a team's colours, with a number, in five cuts (hockey, basketball, soccer, baseball, football), seen from the front and from the back. A cut is a silhouette (the left half,
// mirrored), the neck, the seams, the stripes the cut can carry and where the number and the name go. Drawn flat-shaded in the `metal` and `color` styles and as one outline in `line`. No cut is a real
// team's design: the shapes are what each sport's shirt is known to look like, and the colours are the caller's. Turned, a jersey flips like a coin and shows its back. Imports the core, the engraving
// helpers (for the text) and the coin-flip turn.
import { type Emblem, type EmblemOptions, type FrameOptions, type Rgb, clean, degrees, escape, hexOf, mix, n2, readColour, resolve, wrap } from "./emblem.core.ts";
import { widthOf } from "./emblem.engrave.ts";
import { flipSvg } from "./emblem.flip.ts";

type Seg = readonly ["L", number, number] | readonly ["Q", number, number, number, number] | readonly ["C", number, number, number, number, number, number];
type Stripes = "none" | "chest" | "hoops" | "sleeves" | "pin";
/** A place for text: the centre's x and y, the size for one or two characters, and the widest it may be. */
type Spot = readonly [x: number, y: number, size: number, widest: number];

/** One cut of shirt. Paths marked "left" are drawn for the left half and mirrored to the right. */
export interface Cut {
  name: string;
  start: readonly [number, number];
  /** The left half of the outline, from the neck to the hem. */
  segs: readonly Seg[];
  /** The neck opening and the collar's line, at the front and at the back (whole paths). */
  neck: { front: string; back: string };
  /** Thin seams (left). */
  seams: readonly string[];
  /** The sleeve, for a shade (left). */
  sleeve?: string;
  /** Bands of the `sleeves` stripes: quads on the left sleeve (left), and whole-width bands (the hem). */
  bands?: readonly string[];
  across?: readonly string[];
  /** The band of the `chest` stripes. */
  chest: string;
  stripes: Stripes;
  front: Spot;
  back: Spot;
  name_: Spot;
  /** Details of the front only: buttons, laces (in the trim colour). */
  detail?: string;
  /** A line of the front only (a placket). */
  placket?: string;
}

const mirror = (x: number): number => 64 - x;

/** A path of absolute commands (M, L, Q, C, Z) mirrored about the middle. */
function mirrored(d: string): string {
  let k = 0;
  return d.replace(/([MLQCZ])|(-?\d*\.?\d+)/g, (_m, cmd: string | undefined, num: string | undefined) => {
    if (cmd !== undefined) {
      k = 0;
      return cmd;
    }
    return k++ % 2 === 0 ? n2(mirror(Number(num))) : (num as string);
  });
}

/** The whole outline from the left half: down the left, across the hem, and back up the right by the same points. */
function silhouette(cut: Cut): string {
  const pts: (readonly [number, number])[] = [cut.start];
  let d = `M${n2(cut.start[0])} ${n2(cut.start[1])}`;
  for (const s of cut.segs) {
    d += s[0] + s.slice(1).map((v) => n2(v as number)).join(" ");
    pts.push([s[s.length - 2] as number, s[s.length - 1] as number]);
  }
  const last = pts[pts.length - 1] as readonly [number, number];
  d += `L${n2(mirror(last[0]))} ${n2(last[1])}`;
  for (let i = cut.segs.length - 1; i >= 0; i--) {
    const s = cut.segs[i] as Seg;
    const from = pts[i] as readonly [number, number];
    if (s[0] === "L") d += `L${n2(mirror(from[0]))} ${n2(from[1])}`;
    else if (s[0] === "Q") d += `Q${n2(mirror(s[1]))} ${n2(s[2])} ${n2(mirror(from[0]))} ${n2(from[1])}`;
    else d += `C${n2(mirror(s[3]))} ${n2(s[4])} ${n2(mirror(s[1]))} ${n2(s[2])} ${n2(mirror(from[0]))} ${n2(from[1])}`;
  }
  return `${d}Z`;
}

const both = (list: readonly string[] | undefined): string => (list ?? []).map((d) => d + mirrored(d)).join("");

const HOOPS = "M0 14H64V20H0ZM0 30H64V36H0ZM0 46H64V52H0Z";
const pinstripes = (): string => Array.from({ length: 14 }, (_, i) => `M${14 + i * 3} 6V58`).join("");

/** The text of a spot, fitted to its widest, as a `<text>`. */
function textAt(text: string, spot: Spot, fill: string, edge: string): string {
  const em = Math.max(widthOf(text), 0.4);
  const size = Math.min(spot[2], spot[3] / em);
  return `<text x="${n2(spot[0])}" y="${n2(spot[1] + size * 0.36)}" font-size="${n2(size)}" textLength="${n2(em * size)}" lengthAdjust="spacingAndGlyphs" fill="${fill}" stroke="${edge}"${edge === "none" ? "" : ' stroke-width="1.1" paint-order="stroke"'}>${escape(text)}</text>`;
}

const FONT = "system-ui,-apple-system,'Segoe UI','Hiragino Sans','Noto Sans JP','Yu Gothic',sans-serif";
const DEFAULTS = { main: "#1f4e8c", trim: "#f4f0e4" };

/** One view of a jersey as a document. */
function draw(cut: Cut, title: string, o: EmblemOptions | undefined, view: "front" | "back"): string {
  const r = resolve(o);
  const line = r.style === "line";
  const main = r.tint ?? (readColour(DEFAULTS.main) as Rgb);
  const trim = r.accent ?? DEFAULTS.trim;
  const ink = hexOf(readColour(o?.numberColor) ?? (readColour(trim) as Rgb));
  const number = clean(o?.number);
  const name = clean(o?.name)?.toUpperCase();
  const mode: Stripes = o?.stripes === false ? "none" : o?.stripes === undefined || o.stripes === true ? (o?.stripes === true && cut.stripes === "none" ? "chest" : cut.stripes) : o.stripes;
  const stripes = mode === "chest" || mode === "hoops" || mode === "sleeves" || mode === "pin" ? mode : "none";
  const outline = silhouette(cut);
  const id = `dgj${cut.name}${view === "back" ? "b" : "f"}`;
  const flat = hexOf(main);
  const dark = mix(main, -0.55);
  const attrs = (fill: string): string => `fill="${line ? "none" : fill}"`;
  let body = `<path d="${outline}" ${attrs(flat)}/>`;
  if (!line && cut.sleeve !== undefined) body += `<path d="${both([cut.sleeve])}" fill="#000" fill-opacity=".1" stroke="none"/>`;
  // Stripes, clipped to the shirt.
  // The bands are separate paths: a mirrored quad winds the other way, and where it meets another band under the non-zero rule the two would cancel.
  const fillOf = (d: string): string => (d === "" ? "" : `<path d="${d}" ${line ? 'fill="none" stroke-width="1.2"' : `fill="${trim}" stroke="none"`}/>`);
  let bands = "";
  if (stripes === "chest") bands = fillOf(cut.chest);
  else if (stripes === "hoops") bands = fillOf(HOOPS);
  else if (stripes === "sleeves") bands = fillOf(both(cut.bands)) + fillOf((cut.across ?? []).join(""));
  if (stripes === "pin") body += `<g clip-path="url(#${id})"><path d="${pinstripes()}" stroke="${line ? "currentColor" : trim}" stroke-width="${line ? 1 : 0.6}" stroke-opacity="${line ? 0.6 : 0.8}" fill="none"/></g>`;
  else if (bands !== "") body += `<g clip-path="url(#${id})">${bands}</g>`;
  const neck = view === "front" ? cut.neck.front : cut.neck.back;
  const [hole, collar] = neck.split("|") as [string, string];
  body += `<path d="${hole}" fill="${line ? "none" : dark}" stroke="none"/>`;
  body += `<path d="${collar}" fill="none" stroke="${line ? "currentColor" : trim}" stroke-width="${line ? 1.8 : 2}"/>`;
  const seams = both(cut.seams) + (view === "front" ? (cut.placket ?? "") : "");
  if (seams !== "") body += `<path d="${seams}" fill="none" stroke="${line ? "currentColor" : mix(main, -0.42)}" stroke-width="${line ? 1.4 : 0.7}"/>`;
  if (view === "front" && cut.detail !== undefined && !line) body += `<path d="${cut.detail}" fill="${trim}" stroke="none"/>`;
  const edge = line ? "none" : mix(main, -0.5);
  const fill = line ? "currentColor" : ink;
  const type = `font-family="${FONT}" font-weight="800" text-anchor="middle"`;
  const texts = (view === "front" ? (number === undefined ? "" : textAt(number, cut.front, fill, edge)) : (name === undefined ? "" : textAt(name, cut.name_, fill, edge)) + (number === undefined ? "" : textAt(number, cut.back, fill, edge)));
  if (texts !== "") body += `<g ${type}>${texts}</g>`;
  if (!line && r.style === "metal") body += `<path d="${outline}" fill="url(#dgsj)" stroke="none"/>`;
  const defs = `<clipPath id="${id}"><path d="${outline}"/></clipPath>` + (r.style === "metal" ? '<linearGradient id="dgsj" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>' : "");
  return wrap({ title, size: r.size, style: r.style, theme: r.theme, defs: `<defs>${defs}</defs>`, body, edge: mix(main, -0.5), width: 0.8 });
}

/** A jersey: its front, turned like a coin to its back. `view: "back"` draws the back at rest. */
export function defineJersey(id: string, en: string, ja: string, cut: Cut): Emblem<Cut> {
  const svg = (o?: EmblemOptions): string => draw(cut, en, o, o?.view === "back" ? "back" : "front");
  const frame = (o?: FrameOptions): string => {
    const back = o?.view === "back";
    return flipSvg(draw(cut, en, o, back ? "back" : "front"), { yaw: degrees(o?.yaw), pitch: degrees(o?.pitch), line: o?.style === "line", back: draw(cut, en, o, back ? "front" : "back"), thick: 0.02 });
  };
  return { id, en, ja, source: "ours", kind: "flat", model: cut, svg, frame };
}
