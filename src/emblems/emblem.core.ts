// What every emblem is made of: the options, the colours, the way a drawing is wrapped into a document, and the `Emblem` object each drawing is. It imports nothing from the rest of the
// package, so a bundler can take one emblem and leave the others.

/** `metal`: full colour with a gradient. `line`: one outline in `currentColor`. `color`: flat fills of the main colour, with no gradient. */
export type EmblemStyle = "metal" | "line" | "color";
export const EMBLEM_STYLES = ["metal", "line", "color"] as const satisfies readonly EmblemStyle[];

/**
 * Where the outline's colour comes from. `inherit` (the default for markup you put in a page): the page's text colour, `currentColor`. `auto`: dark ink on a light device and pale ink on a dark
 * one, for an image (an `<img>`, a data address) that cannot inherit. `light` and `dark` force one.
 */
export type EmblemTheme = "inherit" | "auto" | "light" | "dark";

export interface EmblemOptions {
  /** `metal` (the default), `line` or `color`. */
  style?: EmblemStyle;
  /** The width and height in pixels (64 by default); the drawing is a vector at any size. */
  size?: number;
  /** A colour for the main part: the metal of a medal, the patches of a ball, a team's colour. A hex colour or `rgb()`; anything else is ignored. */
  tint?: string;
  /** `inherit` (the default), `auto`, `light` or `dark`. */
  theme?: EmblemTheme;
  /** A second colour: a medal's ribbon, a crest's band, the flags of a trophy. A hex colour or `rgb()`; anything else is ignored. */
  accent?: string;
  /** The letters of a crest, up to three. */
  initials?: string;
  /** A ball: force the grain of its surface on or off. By default it is on for a ball of 48 pixels or more that is not turning. */
  grain?: boolean;
  /**
   * Text cut into the face of a medal or place badge, the plaque, the belt, and the plinth of a cup: any text, Japanese included, up to three lines (a line break, or a space between a word and a year, makes lines).
   * It wins over `label`, `year` and `rank`.
   */
  engrave?: string;
  /** The words to engrave ("MVP"), with `year` and `rank` as lines of their own. Ignored when `engrave` is given. */
  label?: string;
  /** A year, engraved small under the label (on a plaque, on its nameplate). A number or a string. */
  year?: number | string;
  /** A place or a number, engraved large ("1"). On a place badge it is the badge's own place unless given. */
  rank?: number | string;
  /** The engraving of a medal's back, shown when it is turned over. Without it the back is plain. */
  engraveBack?: string;
  /** A jersey's number (up to two digits: "7", "23", "00"), on the chest and big on the back. */
  number?: number | string;
  /** The name on the back of a jersey. */
  name?: string;
  /** A jersey's pattern, in its second colour: `"solid"` (the default), `"stripes"`, `"hoops"`, `"halves"`, `"sash"`, `"yoke"` or `"pinstripes"`; `true` is `"stripes"` and `false` is solid. */
  stripes?: boolean | "solid" | "stripes" | "hoops" | "halves" | "sash" | "yoke" | "pinstripes";
  /** A jersey's trim in its second colour: the bands of the sleeves and hem (the sides of a basketball's). On by default for the cuts that have it. */
  trim?: boolean;
  /** The colour of a jersey's number, and of a pennant's lettering when it is not the second colour. A hex colour or `rgb()`. */
  numberColor?: string;
  /** Which side of a jersey or a pennant is drawn at rest: `"front"` (the default) or `"back"`. */
  view?: "front" | "back";
}

/** A turn, in degrees from the resting view (0 and 0 is the still drawing): `yaw` about the vertical axis, `pitch` the tilt toward the eye. */
export interface FrameOptions extends EmblemOptions {
  yaw?: number;
  pitch?: number;
  /** A ball: the turn about the line of sight. */
  roll?: number;
}

/** The ink of a drawing when a theme sets it, and the page it is made to read on. */
export const EMBLEM_INK = { light: "#20262d", dark: "#eef1f3" } as const;
export const EMBLEM_PAGE = { light: "#ffffff", dark: "#14181c" } as const;

/** The metals. */
export const METALS = { gold: "#d9a620", silver: "#aeb6c0", bronze: "#b8733a" } as const;
/** A metal by name, or `flat` for a colour that is no metal (a crest's blue, a sport's plain ink). */
export type Metal = keyof typeof METALS | "flat";

/** Where an emblem's art comes from: drawn for this package (`ours`) or taken from a source listed in NOTICE.md. */
export type EmblemSource = "ours" | "material" | "generated" | "drawn" | "noto" | "mdi" | "commons" | "gameicons";
/** What an emblem is: a flat object (a front and a back, to flip), a ball (a sphere or a solid, turned in 3D), a body of revolution (`lathe`), an icon (one drawing, not turned) or a piece of gear (a flat drawing, not turned). */
export type EmblemKind = "flat" | "ball" | "lathe" | "icon" | "gear";

export type Rgb = readonly [number, number, number];

/** A colour from `#rgb`, `#rrggbb` or `rgb(r, g, b)`, or `undefined` for anything else. */
export function readColour(value: string | undefined): Rgb | undefined {
  if (typeof value !== "string") return undefined;
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
export function mix(rgb: Rgb, amount: number): string {
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  return hexOf([rgb[0] + (target - rgb[0]) * t, rgb[1] + (target - rgb[1]) * t, rgb[2] + (target - rgb[2]) * t] as const);
}

/** Text made safe to write between tags and inside a double-quoted attribute. */
export const escape = (text: string): string => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A number written for a path: two decimals at most, and never `-0`. */
export const n2 = (value: number): string => String(Math.round(value * 100) / 100 + 0);

/** The options as the renderers use them. */
export interface Resolved {
  style: EmblemStyle;
  size: number;
  theme: EmblemTheme;
  tint: Rgb | undefined;
  accent: string | undefined;
  initials: string;
}

export function resolve(o: EmblemOptions | undefined): Resolved {
  const size = typeof o?.size === "number" && Number.isFinite(o.size) && o.size > 0 ? Math.min(Math.round(o.size * 100) / 100, 4096) : 64;
  const theme = o?.theme === "auto" || o?.theme === "light" || o?.theme === "dark" ? o.theme : "inherit";
  const style = o?.style === "line" || o?.style === "color" ? o.style : "metal";
  const accent = readColour(o?.accent);
  const initials = typeof o?.initials === "string" ? [...o.initials.trim()].slice(0, 3).join("").toUpperCase() : "";
  return { style, size, theme, tint: readColour(o?.tint), accent: accent === undefined ? undefined : hexOf(accent), initials };
}

/** What is to be cut into a face: the free text, or the label, year and rank, and the text of the back. A line is at most 24 letters and has no control character. */
export interface Engraving {
  free?: string;
  label?: string;
  year?: string;
  rank?: string;
  back?: string;
}

/** A text from outside made safe: control characters removed, at most 24 letters a line and `lines` lines, or `undefined` when nothing is left. */
export const clean = (value: unknown, lines = 1): string | undefined => {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const text = String(value)
    .split(/\r?\n/)
    .slice(0, lines)
    .map((line) => [...line.replace(/\p{Cc}/gu, "").trim()].slice(0, 24).join(""))
    .filter((line) => line !== "")
    .join("\n");
  return text === "" ? undefined : text;
};


/** The main colour of a metal, or the tint when there is one. */
export const mainOf = (metal: Metal, tint: Rgb | undefined): Rgb => tint ?? (readColour(metal === "flat" ? "#8a949e" : METALS[metal]) as Rgb);

/** The relative luminance of a colour, 0 to 1. */
export function lum(rgb: Rgb): number {
  const [r, g, b] = rgb.map((c) => {
    const k = c / 255;
    return k <= 0.03928 ? k / 12.92 : ((k + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Black or white, whichever reads better on a colour. */
export const onColour = (rgb: Rgb): string => ((lum(rgb) + 0.05) / 0.05 > 1.05 / (lum(rgb) + 0.05) ? "#000000" : "#ffffff");

/** A turn in degrees, as a finite number (0 for anything else). */
export const degrees = (value: number | undefined): number => (typeof value === "number" && Number.isFinite(value) ? value % 360 : 0);

/** The colours a drawing is painted with. In the `line` style every fill is `none`. */
export interface Paint {
  /** The main part: a gradient's `url(#…)` in the metal style, a flat colour in `color`. */
  main: string;
  shade: string;
  light: string;
  /** A second colour: a ribbon. */
  ribbon: string;
  /** The definitions the fills refer to. */
  defs: string;
}

/** The paint of a ball: a radial gradient in the metal style. The gradient's id names the colour, so two of one colour in a page agree. */
export function paintFor(style: EmblemStyle, main: Rgb): Paint {
  if (style === "line") return { main: "none", shade: "none", light: "none", ribbon: "none", defs: "" };
  const shade = mix(main, -0.28);
  const light = mix(main, 0.55);
  const ribbon = "#b3362b";
  if (style === "color") return { main: hexOf(main), shade, light, ribbon, defs: "" };
  const id = `dgsr${hexOf(main).slice(1)}`;
  const defs = `<defs><radialGradient id="${id}" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="${light}"/><stop offset="0.55" stop-color="${hexOf(main)}"/><stop offset="1" stop-color="${mix(main, -0.38)}"/></radialGradient></defs>`;
  return { main: `url(#${id})`, shade, light, ribbon, defs };
}

/** A gradient: its id, its definition (a fragment for a `<defs>`) and the fill that names it. */
export interface Gradient {
  id: string;
  def: string;
  fill: string;
}
const stops = (list: readonly (readonly [number, string])[]): string => list.map(([at, colour]) => `<stop offset="${n2(at).replace(/^0\./, ".")}" stop-color="${colour}"/>`).join("");

/**
 * The shading of a round metal body: a dark edge, a bright band left of the middle, the metal, a darker side, and a faint light from the rim on the far edge, as polished metal throws it. `shift` slides the bright
 * band (a turn). The id names the colour and the shift, so two bodies of one colour in a page share one definition.
 */
export function cylinderGradient(main: Rgb, shift = 0): Gradient {
  const h = Math.max(0.14, Math.min(0.5, 0.3 + shift));
  const id = `dgsc${hexOf(main).slice(1)}${shift === 0 ? "" : `s${Math.round(shift * 100) + 100}`}`;
  const list: [number, string][] = [[0, mix(main, -0.5)], [0.1, mix(main, -0.16)], [h, mix(main, 0.62)], [h + 0.26, mix(main, 0.08)], [0.84, mix(main, -0.36)], [0.95, mix(main, -0.1)], [1, mix(main, -0.52)]];
  return { id, def: `<linearGradient id="${id}">${stops(list)}</linearGradient>`, fill: `url(#${id})` };
}

/** The shading of a round flat or a ball: light from the top left, the metal, then dark at the far edge. */
export function orbGradient(main: Rgb): Gradient {
  const id = `dgso${hexOf(main).slice(1)}`;
  return { id, def: `<radialGradient id="${id}" cx="0.36" cy="0.3" r="0.82">${stops([[0, mix(main, 0.7)], [0.3, mix(main, 0.2)], [0.62, hexOf(main)], [1, mix(main, -0.42)]])}</radialGradient>`, fill: `url(#${id})` };
}

/** The shading of a flat sheet of metal, from a bright corner to a dark one. */
export function sheetGradient(main: Rgb): Gradient {
  const id = `dgsd${hexOf(main).slice(1)}`;
  return { id, def: `<linearGradient id="${id}" x2="1" y2="1">${stops([[0, mix(main, 0.55)], [0.35, mix(main, 0.12)], [0.6, hexOf(main)], [1, mix(main, -0.4)]])}</linearGradient>`, fill: `url(#${id})` };
}

/** The shading of a raised rim: bright on the top left, dark on the bottom right, as a bevel catches the light (or the other way round, for a groove). */
export function bevelGradient(main: Rgb, groove = false): Gradient {
  const id = `dgse${hexOf(main).slice(1)}${groove ? "g" : ""}`;
  const [a, b] = groove ? [mix(main, -0.45), mix(main, 0.6)] : [mix(main, 0.65), mix(main, -0.5)];
  return { id, def: `<linearGradient id="${id}" x2="1" y2="1">${stops([[0, a], [0.5, hexOf(main)], [1, b]])}</linearGradient>`, fill: `url(#${id})` };
}

/** The gradients' definitions as one `<defs>`, with none twice. */
export const defsOf = (gradients: readonly Gradient[]): string => {
  const seen = new Set<string>();
  const list = gradients.filter((g) => !seen.has(g.id) && seen.add(g.id));
  return list.length === 0 ? "" : `<defs>${list.map((g) => g.def).join("")}</defs>`;
};

/** A drawing wrapped into a document: the title, the outline's colour for the theme, and the group that strokes it. */
export function wrap(o: { title: string; size: number; style: EmblemStyle; theme: EmblemTheme; defs?: string; body: string; box?: string; edge?: string; width?: number }): string {
  const colour = o.theme === "dark" ? EMBLEM_INK.dark : o.theme === "inherit" ? "" : EMBLEM_INK.light;
  const auto = o.theme === "auto" ? `<style>@media(prefers-color-scheme:dark){svg{color:${EMBLEM_INK.dark}}}</style>` : "";
  // `edge` is a colour of the drawing's own for the outline (a metal's darker tone); without it the outline is the page's ink. The `line` style is always the page's ink.
  const ink = o.edge !== undefined && o.style !== "line" ? o.edge : "currentColor";
  const stroke = o.width ?? (o.style === "line" ? 2.6 : 2.2);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.box ?? "0 0 64 64"}" width="${o.size}" height="${o.size}" role="img"${colour === "" ? "" : ` color="${colour}"`}>` +
    `<title>${escape(o.title)}</title>${auto}${o.defs ?? ""}<g fill="none" stroke="${ink}" stroke-width="${n2(stroke)}" stroke-linejoin="round" stroke-linecap="round">${o.body}</g></svg>`
  );
}

/** One emblem: its id and names, where its art comes from, and the functions that draw it. Importing one of these pulls in its own module and the small renderer it needs, not the other emblems. */
export interface Emblem<Model = unknown> {
  readonly id: string;
  readonly en: string;
  readonly ja: string;
  readonly source: EmblemSource;
  readonly kind: EmblemKind;
  /** The data the still drawing and the turning view are both made from. */
  readonly model: Model;
  /** The still drawing: a document of SVG. */
  svg: (options?: EmblemOptions) => string;
  /** The emblem turned by `yaw` and `pitch` degrees from its resting view, in plain SVG. `frame({ yaw: 0, pitch: 0 })` is `svg()`. An icon is not turned. */
  frame: (options?: FrameOptions) => string;
}
