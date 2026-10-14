// Gear: pieces of equipment drawn flat from a list of parts (a path, a colour, how it reads as a line), in the same three styles as the trophies: `metal` (a fill shaded across and along, edged in a darker tone
// of itself), `color` (flat fills with the same edges) and `line` (`currentColor`). A piece turns like a coin through the one turn every flat drawing shares (emblem.flip.ts): squeezed by the cosine of the yaw,
// its back mirrored, with a thin rim. Self-contained: it imports only the shared option and colour helpers of the ball folder and the coin-flip turn.
import { flipSvg } from "../emblem.flip.ts";
import { type BallFrameOptions, type Piece, type PieceOptions, type PieceSize, type PieceSource, escape, hashOf, labelled, mix, num, readColour, resolveOptions, wrapPiece } from "../ball/ball.core.ts";

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
  /** How much light and shade the part takes along a diagonal, 0 (flat) to 1 (the default). */
  shade?: number;
  /** How much a part is shaded across its own width, as a round shaft is (a bright band, a dark side), 0 to 1. Drawn in the part's own frame, so it follows the part's transform. */
  cyl?: number;
  /** A highlight or a shadow laid on a part: drawn in the metal style only, never flat and never as a line. */
  fx?: boolean;
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
  return { id: def.id, en: def.en, ja: def.ja, source: def.source, kind: "gear", model: def.model, size: def.size, svg: labelled(def.en, def.ja, (o?: PieceOptions) => def.draw(o)), frame: labelled(def.en, def.ja, flip(def.draw)) };
}

/** A drawn piece: its parts become a document in the metal, color or line style, whole or turned (the turn is `flipSvg`'s). */
export function drawGear(id: string, title: string, spec: GearSpec, options: PieceOptions | undefined): string {
  const o = resolveOptions(options);
  const line = o.style === "line";
  const flat = options?.style === "color";
  const main = o.tint ?? spec.main;
  const accent = o.accent ?? spec.accent ?? mix(main, -0.3);
  const gid = `g${hashOf(`${id}|${o.tint ?? ""}|${o.accent ?? ""}`)}`;
  const resolve = (c: string | undefined): string | undefined => (c === "$main" ? main : c === "$accent" ? accent : c);
  let body = "";
  let across = false;
  let along = false;
  // Parts in a row with one transform share one group, so that a close-up of many parts says its transform once.
  let open = "";
  for (const p of spec.parts) {
    const move = p.t ?? "";
    if (move !== open) {
      if (open !== "") body += "</g>";
      if (move !== "") body += `<g transform="${escape(move)}">`;
      open = move;
    }
    const fill = resolve(p.fill);
    const hasFill = fill !== undefined && fill !== "none";
    if (line) {
      const mode = p.line ?? "stroke";
      if (mode === "none" || p.fx === true) continue;
      if (mode === "ink" && hasFill) body += `<path d="${p.d}" fill="currentColor"/>`;
      else if (!hasFill && p.stroke !== undefined) body += `<path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${num(p.w ?? 2, 2)}"/>`;
      else body += `<path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${num(Math.max(p.w ?? 2, 1.6), 2)}"/>`;
      continue;
    }
    const op = p.op === undefined ? "" : ` opacity="${p.op}"`;
    if (p.fx === true) {
      if (!flat) body += `<path d="${p.d}" fill="${fill}"${op}/>`;
      continue;
    }
    const stroke = resolve(p.stroke) ?? (hasFill ? mix(readColour(fill) === undefined ? "#888888" : fill, -0.45) : "none");
    const w = p.w ?? 0.9;
    body += `<path d="${p.d}" fill="${hasFill ? fill : "none"}" stroke="${stroke}" stroke-width="${num(w, 2)}"${hasFill || stroke === "none" ? ` stroke-linejoin="round"` : ` stroke-linecap="round"`}${op}/>`;
    if (hasFill && !flat) {
      if (p.shade !== 0) {
        along = true;
        body += `<path d="${p.d}" fill="url(#${gid})"${p.shade === undefined ? "" : ` opacity="${p.shade}"`}/>`;
      }
      if (p.cyl !== undefined && p.cyl > 0) {
        across = true;
        body += `<path d="${p.d}" fill="url(#${gid}c)"${p.cyl === 1 ? "" : ` opacity="${p.cyl}"`}/>`;
      }
    }
  }
  if (open !== "") body += "</g>";
  const defs =
    (along ? `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>` : "") +
    (across ? `<linearGradient id="${gid}c" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".26" stop-color="#fff" stop-opacity=".5"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset=".88" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>` : "");
  const box = spec.box ?? "0 0 64 64";
  const inner = line ? `<g stroke-linecap="round" stroke-linejoin="round">${body}</g>` : `<g stroke-linecap="round">${body}</g>`;
  return wrapPiece({ title: escape(title), size: o.size, theme: o.theme, defs, body: inner, box });
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

/**
 * A shape of varying width along a curve, as a closed path: a cubic Bezier from `a` to `b` through the controls `c1` and `c2`, drawn `width(t)` wide at the fraction `t` of the way along. A bow, a blade or a feather
 * is one of these. `steps` is how many segments each side has.
 */
export function swell(a: readonly [number, number], c1: readonly [number, number], c2: readonly [number, number], b: readonly [number, number], width: (t: number) => number, steps = 14): string {
  const at = (t: number): [number, number] => {
    const u = 1 - t;
    return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]];
  };
  const f = (n: number): string => String(Math.round(n * 10) / 10);
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = at(t);
    const q = at(Math.min(1, t + 0.01));
    const r = at(Math.max(0, t - 0.01));
    const dx = q[0] - r[0];
    const dy = q[1] - r[1];
    const l = Math.hypot(dx, dy) || 1;
    const h = width(t) / 2;
    left.push(`${f(p[0] - (dy / l) * h)} ${f(p[1] + (dx / l) * h)}`);
    right.push(`${f(p[0] + (dy / l) * h)} ${f(p[1] - (dx / l) * h)}`);
  }
  return `M${left.join("L")}L${right.reverse().join("L")}z`;
}
