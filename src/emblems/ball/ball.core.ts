// What every ball and every piece of gear is made of: the options, the colour helpers, the way a drawing is wrapped into a document, and the `Piece` object each one is.
// It imports nothing, so a ball stands alone: a bundler can take one ball module without the others. The shape of a piece (`id`, `en`, `ja`, `source`, `kind`, `model`, `svg`, `frame`)
// is the shape of an emblem in the emblem registry, so a registry can take a ball or a piece of gear as it is.

import type { FlagRenderer, PuckFace } from "./ball.face.ts";

/** `metal` (also written `colour`): full colour, with shading. `line`: one outline in `currentColor`. */
export type PieceStyle = "metal" | "colour" | "color" | "line";
/** `inherit` (the default): the page's text colour. `auto`: dark ink on a light device and pale ink on a dark one. `light` and `dark` force one. */
export type PieceTheme = "inherit" | "auto" | "light" | "dark";

export interface PieceOptions {
  /** `metal` or `colour` (the default) or `line`. */
  style?: PieceStyle;
  /** The width and height in pixels (64 by default); the drawing is a vector at any size. */
  size?: number;
  /** A colour that replaces the main colour of the piece, where it has one. A hex colour or `rgb()`; anything else is ignored. */
  tint?: string;
  theme?: PieceTheme;
  /** A second colour, where a piece has one (laces, a stripe). */
  accent?: string;
  /** Force the grain on or off. By default it is on for a colour ball of 48 pixels or more that is not turning. */
  grain?: boolean;
  /** The language of the `<title>`: `"en"` (the default) or `"ja"`. */
  locale?: "en" | "ja";
  /** A string is the `<title>` (escaped); `false` drops it and marks the drawing `aria-hidden="true"`. */
  title?: string | false;
  /** A puck: the print on its top face (see `PuckFace`). The printed pucks (`puck:*`) take it, and so does `ball:puck` through `renderEmblem`, `emblemFrame` and `ballFrame`. Anything else ignores it. */
  face?: PuckFace;
  /** A puck: a renderer for the flag codes this package does not draw (`face.flag`), `(code, { shape, size, theme }) => svg`, the one taisen-brackets takes. Synchronous. */
  flags?: FlagRenderer;
}

/** A turn: `yaw` degrees about the vertical axis (0 is the default view), `pitch` the tilt toward you, `roll` the turn about the line of sight. */
export interface BallFrameOptions extends PieceOptions {
  yaw?: number;
  pitch?: number;
  roll?: number;
}

/** Where a drawing comes from. */
export type PieceSource = "generated" | "drawn";
/** `ball` is turned in 3D; `gear` is a flat drawing in a metal, a colour and a line style, which flips like a coin when turned. */
export type PieceKind = "ball" | "gear";

/** The official size of a ball or an implement, from the rulebook that governs it. Lengths in millimetres, mass in grams. */
export interface PieceSize {
  /** The largest extent of the drawing (a ball's diameter, a football's length), in millimetres: the scale `lineup` draws at. */
  extentMm: number;
  /** Across a sphere or a disc. */
  diameterMm?: number;
  /** End to end, for a prolate ball or an implement. */
  lengthMm?: number;
  /** The width across the middle of a prolate ball, or a stone's height, a puck's thickness. */
  thicknessMm?: number;
  /** Round the middle, for a ball the rulebook measures that way. */
  circumferenceMm?: number;
  /** Round the long way, for a prolate ball. */
  longCircumferenceMm?: number;
  massG?: readonly [number, number];
  /** The rule the figures are from: document, edition and rule number. */
  rule: string;
  /** Anything the figures leave out, such as a figure that is the middle of a range or a part drawn shorter than it is. */
  note?: string;
}

/** One ball or piece of gear. */
export interface Piece<Model = unknown> {
  readonly id: string;
  readonly en: string;
  readonly ja: string;
  readonly source: PieceSource;
  readonly kind: PieceKind;
  readonly model: Model;
  /** The official size, where the rulebook gives one. */
  readonly size?: PieceSize;
  /** The still drawing: a document of SVG. */
  svg: (options?: PieceOptions) => string;
  /** The piece turned: a ball in 3D, gear flipped like a coin. */
  frame: (options?: BallFrameOptions) => string;
}

type Rgb = readonly [number, number, number];

export function readColour(value: string | undefined): Rgb | undefined {
  if (value === undefined) return undefined;
  const text = value.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text)?.[1];
  if (hex !== undefined) {
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
  }
  const rgb = /^rgb\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})\s*\)$/i.exec(text);
  return rgb === null ? undefined : [Math.min(255, Number(rgb[1])), Math.min(255, Number(rgb[2])), Math.min(255, Number(rgb[3]))];
}

const hex2 = (n: number): string => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
export const hexOf = (rgb: Rgb): string => `#${hex2(rgb[0])}${hex2(rgb[1])}${hex2(rgb[2])}`;

/** A colour mixed toward black (`amount` below 0) or white (above 0). */
export function mix(colour: string, amount: number): string {
  const rgb = readColour(colour) ?? [128, 128, 128];
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  return hexOf([rgb[0] + (target - rgb[0]) * t, rgb[1] + (target - rgb[1]) * t, rgb[2] + (target - rgb[2]) * t] as const);
}

/** Two colours mixed: `t` 0 is `a`, 1 is `b`. */
export function blend(a: string, b: string, t: number): string {
  const x = readColour(a) ?? [128, 128, 128];
  const y = readColour(b) ?? [128, 128, 128];
  return hexOf([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t] as const);
}

/** Text made safe to write between tags and inside a double-quoted attribute. */
export const escape = (text: string): string => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A number written short: at most `digits` decimals, no trailing zeros, no `-0`. */
export const num = (value: number, digits = 1): string => {
  const text = (Math.round(value * 10 ** digits) / 10 ** digits).toString();
  return text === "-0" ? "0" : text;
};

/** A short stable hash of some text, for ids that two drawings of one piece agree on. */
export function hashOf(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

/** The options as the renderers use them. */
export interface ResolvedOptions {
  style: "colour" | "line";
  size: number;
  theme: PieceTheme;
  tint: string | undefined;
  accent: string | undefined;
  grain: boolean | undefined;
  face: PuckFace | undefined;
  flags: FlagRenderer | undefined;
  /** A string that tells two faces apart, for the ids of a drawing. */
  faceKey: string;
}

/** What tells one face from another: its plain data (a renderer is a function, and only its name goes in). */
function faceKeyOf(face: unknown): string {
  if (typeof face !== "object" || face === null) return "";
  try {
    return JSON.stringify(face, (k, v: unknown) => (typeof v === "function" ? `fn:${v.name}` : v)) ?? "";
  } catch {
    return "?";
  }
}

export function resolveOptions(o: PieceOptions | undefined): ResolvedOptions {
  const size = typeof o?.size === "number" && Number.isFinite(o.size) && o.size > 0 ? Math.min(Math.round(o.size * 100) / 100, 4096) : 64;
  const theme = o?.theme === "auto" || o?.theme === "light" || o?.theme === "dark" ? o.theme : "inherit";
  const tint = readColour(o?.tint);
  const accent = readColour(o?.accent);
  return { style: o?.style === "line" ? "line" : "colour", size, theme, tint: tint === undefined ? undefined : hexOf(tint), accent: accent === undefined ? undefined : hexOf(accent), grain: typeof o?.grain === "boolean" ? o.grain : undefined, face: typeof o?.face === "object" && o.face !== null ? o.face : undefined, flags: typeof o?.flags === "function" ? o.flags : undefined, faceKey: faceKeyOf(o?.face) + (typeof o?.flags === "function" ? `|fn:${o.flags.name}` : "") };
}

/** The ink of a drawing when a theme sets it, and the page it is made to read on. */
export const PIECE_INK = { light: "#20262d", dark: "#eef1f3" } as const;

/** A drawing wrapped into a document, in a 100 by 100 box: the title, the outline's colour for the theme, the definitions and the body. */
export function wrapPiece(o: { title: string; size: number; theme: PieceTheme; defs?: string; body: string; box?: string; desc?: string }): string {
  const colour = o.theme === "dark" ? PIECE_INK.dark : o.theme === "inherit" ? "" : PIECE_INK.light;
  const auto = o.theme === "auto" ? `<style>@media(prefers-color-scheme:dark){svg{color:${PIECE_INK.dark}}}</style>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.box ?? "0 0 100 100"}" width="${o.size}" height="${o.size}" role="img"${colour === "" ? "" : ` color="${colour}"`}>` +
    `<title>${escape(o.title)}</title>${o.desc === undefined ? "" : `<desc>${escape(o.desc)}</desc>`}${auto}${o.defs === undefined || o.defs === "" ? "" : `<defs>${o.defs}</defs>`}${o.body}</svg>`
  );
}

/** A piece's drawing function, with the `<title>` its options ask for: the Japanese name, a title of the caller's own, or none (the same rule as the emblems', in emblem.core.ts). */
export const labelled =
  <O extends PieceOptions>(en: string, ja: string, draw: (options?: O) => string) =>
  (options?: O): string => {
    const svg = draw(options);
    const title = options?.title;
    const custom = typeof title === "string" && title.trim() !== "";
    if (title === false) return svg.replace(/<title>[^<]*<\/title>/, "").replace(' role="img"', ' aria-hidden="true"');
    if (!custom && options?.locale !== "ja") return svg;
    const text = custom ? title.trim().slice(0, 300) : ja;
    const titled = svg.replace(/<title>[^<]*<\/title>/, () => `<title>${escape(text)}</title>`);
    return custom ? titled : titled.replace(' role="img"', ' role="img" lang="ja"');
  };

/** Degrees to radians, for a value that may be missing or not a number. */
export const radians = (degrees: number | undefined, fallback: number): number => ((typeof degrees === "number" && Number.isFinite(degrees) ? degrees : fallback) * Math.PI) / 180;

/** The definition of the grain filter: noise lit from the upper left and multiplied into what it is applied to. It works in the box's own units, so the grain stays where it is while a ball turns. */
export function grainDef(id: string, f: number, a: number, seed = 3): string {
  return `<filter id="${id}n" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="2" seed="${seed}" result="n"/><feDiffuseLighting in="n" lighting-color="#fff" surfaceScale="${a}" diffuseConstant="1.15" result="l"><feDistantLight azimuth="225" elevation="58"/></feDiffuseLighting><feBlend in="SourceGraphic" in2="l" mode="multiply"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
}
