// Gear: pieces of equipment drawn flat, in a colour style and a line style (`currentColor`), to match the trophies. A piece is either drawn by us from a list of parts (a path, a colour, how it
// reads as a line) or copied from an open icon set (Noto Emoji, Wikimedia Commons, game-icons.net) with the source named in the module's header, the colour version from one artwork and the line
// version from another (Pictogrammers MDI) or worked out from the colour one. Self-contained: it imports only the shared option and colour helpers of the ball folder and the coin-flip turn.
import { flipSvg } from "../emblem.flip.ts";
import { type BallFrameOptions, type Piece, type PieceOptions, type PieceSize, type PieceSource, escape, hashOf, mix, num, readColour, resolveOptions, wrapPiece } from "../ball/ball.core.ts";

/** One part of a drawn piece. */
export interface Part {
  /** The path (in the piece's box). */
  d: string;
  /** The fill, a colour, `none`, or `$main` or `$accent` (the colours `tint` and `accent` replace). */
  fill?: string;
  /** The stroke colour; by default a darker fill. */
  stroke?: string;
  /** The stroke width (0.9 by default for an outline in colour, and a part with no fill is drawn as a line this wide in both styles). */
  w?: number;
  /** How the part reads in the line style: `stroke` (its outline, the default), `ink` (filled solid) or `none` (left out). */
  line?: "stroke" | "ink" | "none";
  /** A transform for the part. */
  t?: string;
  /** How much light and shade the part takes, 0 (flat) to 1 (the default). */
  shade?: number;
  /** Opacity of the part in colour. */
  op?: number;
}

export interface GearSpec {
  /** The box, `0 0 64 64` by default. */
  box?: string;
  /** What `tint` replaces. */
  main: string;
  /** What `accent` replaces. */
  accent?: string;
  parts: readonly Part[];
}

export interface GearDef<Model = unknown> {
  id: string;
  en: string;
  ja: string;
  source: PieceSource;
  size?: PieceSize;
  model: Model;
  draw: (options: PieceOptions | undefined) => string;
}

/** A turn in degrees, as a finite number (0 for anything else). */
const turn = (value: number | undefined): number => (typeof value === "number" && Number.isFinite(value) ? value % 360 : 0);

/** A piece of gear turned like a coin: a flat cut-out with a front, a mirrored back and a thin rim. */
const flip = (draw: (options: PieceOptions | undefined) => string) => (o: BallFrameOptions | undefined): string => flipSvg(draw(o), { yaw: turn(o?.yaw), pitch: turn(o?.pitch), line: o?.style === "line", thick: 0.025 });

/** A piece of gear from its drawing function. Turned, it flips like a coin (`flipSvg`): the front, then its mirrored back, with a thin rim. */
export function defineGear<Model>(def: GearDef<Model>): Piece<Model> {
  return { id: def.id, en: def.en, ja: def.ja, source: def.source, kind: "gear", model: def.model, size: def.size, svg: (o) => def.draw(o), frame: flip(def.draw) };
}

/** A drawn piece: its parts become a document in either style. */
export function drawGear(id: string, title: string, spec: GearSpec, options: PieceOptions | undefined): string {
  const o = resolveOptions(options);
  const line = o.style === "line";
  const main = o.tint ?? spec.main;
  const accent = o.accent ?? spec.accent ?? mix(main, -0.3);
  const gid = `g${hashOf(`${id}|${o.tint ?? ""}|${o.accent ?? ""}`)}`;
  const resolve = (c: string | undefined): string | undefined => (c === "$main" ? main : c === "$accent" ? accent : c);
  let body = "";
  for (const p of spec.parts) {
    const t = p.t === undefined ? "" : ` transform="${escape(p.t)}"`;
    const fill = resolve(p.fill);
    const hasFill = fill !== undefined && fill !== "none";
    if (line) {
      const mode = p.line ?? "stroke";
      if (mode === "none") continue;
      if (mode === "ink" && hasFill) body += `<path d="${p.d}" fill="currentColor"${t}/>`;
      else if (!hasFill && p.stroke !== undefined) body += `<path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${num(p.w ?? 2, 2)}"${t}/>`;
      else body += `<path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${num(Math.max(p.w ?? 2, 1.6), 2)}"${t}/>`;
      continue;
    }
    const stroke = resolve(p.stroke) ?? (hasFill ? mix(readColour(fill) === undefined ? "#888888" : fill, -0.45) : "none");
    const w = p.w ?? 0.9;
    const op = p.op === undefined ? "" : ` opacity="${p.op}"`;
    body += `<path d="${p.d}" fill="${hasFill ? fill : "none"}" stroke="${stroke}" stroke-width="${num(w, 2)}"${hasFill || stroke === "none" ? ` stroke-linejoin="round"` : ` stroke-linecap="round"`}${op}${t}/>`;
    if (hasFill && p.shade !== 0) body += `<path d="${p.d}" fill="url(#${gid})"${p.shade === undefined ? "" : ` opacity="${p.shade}"`}${t}/>`;
  }
  const defs = line ? "" : `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>`;
  const g = line ? `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>` : `<g stroke-linecap="round">${body}</g>`;
  return wrapPiece({ title: escape(title), size: o.size, theme: o.theme, defs, body: g, box: spec.box ?? "0 0 64 64" });
}

/** The pieces' drawing helpers: shapes written as path strings. */
export const rect = (x: number, y: number, w: number, h: number, r = 0): string =>
  r === 0 ? `M${x} ${y}h${w}v${h}h${-w}z` : `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;
export const ellipse = (cx: number, cy: number, rx: number, ry: number): string => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`;
export const circle = (cx: number, cy: number, r: number): string => ellipse(cx, cy, r, r);
export const poly = (...pts: Array<[number, number]>): string => `M${pts.map((p) => `${p[0]} ${p[1]}`).join("L")}z`;
/** A line from one point to another, as a path (to be drawn with a stroke width). */
export const seg = (x1: number, y1: number, x2: number, y2: number): string => `M${x1} ${y1}L${x2} ${y2}`;
/** A capsule: a thick line with round ends, as a closed path (so it has an outline in the line style). */
export function capsule(x1: number, y1: number, x2: number, y2: number, w: number): string {
  const dx = x2 - x1, dy = y2 - y1;
  const l = Math.hypot(dx, dy) || 1;
  const nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2);
  const r = w / 2;
  const f = (n: number): string => String(Math.round(n * 100) / 100);
  return `M${f(x1 + nx)} ${f(y1 + ny)}L${f(x2 + nx)} ${f(y2 + ny)}A${r} ${r} 0 0 0 ${f(x2 - nx)} ${f(y2 - ny)}L${f(x1 - nx)} ${f(y1 - ny)}A${r} ${r} 0 0 0 ${f(x1 + nx)} ${f(y1 + ny)}z`;
}

/** The ink of a copied colour drawing worked out as a line drawing: dark fills and strokes become `currentColor`, light ones are left out, the rest are a faint tint of it. Used where no other line artwork exists. */
export function monoOf(markup: string): string {
  const lum = (c: string): number => {
    const rgb = readColour(c);
    if (rgb === undefined) return 0.5;
    const [r, g, b] = rgb.map((v) => v / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  return markup
    .replace(/<(linearGradient|radialGradient)[\s\S]*?<\/\1>/g, "")
    .replace(/(fill|stroke)="(#[0-9a-fA-F]{3,6})"/g, (_m, attr: string, c: string) => {
      const l = lum(c);
      if (attr === "stroke") return `stroke="currentColor"`;
      return l < 0.5 ? `fill="currentColor"` : l > 0.86 ? `fill="none"` : `fill="currentColor" fill-opacity=".4"`;
    })
    .replace(/(fill|stroke)="url\(#[^)]*\)"/g, (_m, attr: string) => (attr === "fill" ? `fill="currentColor" fill-opacity=".25"` : `stroke="currentColor"`));
}

/** A piece we drew: the common case of `defineGear`. */
export function drawn(id: string, en: string, ja: string, spec: GearSpec, size?: PieceSize): Piece<GearSpec> {
  return defineGear({ id, en, ja, source: "drawn", size, model: spec, draw: (o) => drawGear(id, en, spec, o) });
}

/** The strings of a racket's head: a grid of lines clipped to an ellipse. */
export function strings(cx: number, cy: number, rx: number, ry: number, step: number): string {
  let d = "";
  const f = (n: number): string => String(Math.round(n * 10) / 10);
  for (let x = cx - rx + step; x < cx + rx - step / 2; x += step) {
    const h = ry * Math.sqrt(1 - ((x - cx) / rx) ** 2);
    d += `M${f(x)} ${f(cy - h)}V${f(cy + h)}`;
  }
  for (let y = cy - ry + step; y < cy + ry - step / 2; y += step) {
    const w = rx * Math.sqrt(1 - ((y - cy) / ry) ** 2);
    d += `M${f(cx - w)} ${f(y)}H${f(cx + w)}`;
  }
  return d;
}

/** A piece of gear copied, with changes, from an open icon set. */
export interface CopiedSpec {
  id: string;
  en: string;
  ja: string;
  source: PieceSource;
  /** The attribution the licence asks for: the author and the licence. */
  credit: string;
  /** The colour artwork's box and its (minified) markup. For a piece drawn in one colour (the glove) it is the path alone. */
  box: string;
  colour: string;
  /** The line artwork: a one-path icon, or `derived` to work it out of the colour one. */
  line: { box: string; d: string } | "derived";
  /** A pale shape to lay under line artwork that is only ink (a mask's face), so that it reads as a solid thing in colour. */
  underlay?: string;
  /** The colour a one-path piece is filled with (a glove's leather). */
  leather?: string;
  /** The ink of one-colour artwork in the colour style. */
  ink?: string;
  size?: PieceSize;
}

/** Copied artwork as a piece: the colour version as it was drawn, the line version in `currentColor`. */
export function copied(spec: CopiedSpec): Piece<CopiedSpec> {
  const draw = (options: PieceOptions | undefined): string => {
    const o = resolveOptions(options);
    const desc = spec.credit;
    if (o.style === "line") {
      if (spec.line === "derived") return wrapPiece({ title: escape(spec.en), desc, size: o.size, theme: o.theme, box: spec.box, body: `<g fill="currentColor" stroke-width="${num(Number(spec.box.split(" ")[2]) / 40, 2)}" stroke-linejoin="round" stroke-linecap="round">${monoOf(spec.colour)}</g>` });
      return wrapPiece({ title: escape(spec.en), desc, size: o.size, theme: o.theme, box: spec.line.box, body: `<path d="${spec.line.d}" fill="currentColor"/>` });
    }
    if (spec.leather !== undefined) {
      const gid = `g${hashOf(spec.id)}`;
      const leather = o.tint ?? spec.leather;
      const defs = `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>`;
      const body = `<path d="${spec.colour}" fill="${leather}" stroke="${mix(leather, -0.5)}" stroke-width="${num(Number(spec.box.split(" ")[2]) / 200, 2)}"/><path d="${spec.colour}" fill="url(#${gid})"/>`;
      return wrapPiece({ title: escape(spec.en), desc, size: o.size, theme: o.theme, box: spec.box, defs, body });
    }
    const under = spec.underlay === undefined ? "" : `<path d="${spec.underlay}" fill="#f4f1ea" stroke="#9aa3ae" stroke-width="1.2"/>`;
    const body = spec.ink === undefined ? spec.colour : `<g fill="${o.tint ?? spec.ink}">${spec.colour}</g>`;
    return wrapPiece({ title: escape(spec.en), desc, size: o.size, theme: o.theme, box: spec.box, body: under + body });
  };
  return { id: spec.id, en: spec.en, ja: spec.ja, source: spec.source, kind: "gear", model: spec, size: spec.size, svg: draw, frame: flip(draw) };
}
