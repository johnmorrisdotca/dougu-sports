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
}

/** A turn, in degrees from the resting view (0 and 0 is the still drawing): `yaw` about the vertical axis, `pitch` the tilt toward the eye. */
export interface FrameOptions extends EmblemOptions {
  yaw?: number;
  pitch?: number;
}

/** The ink of a drawing when a theme sets it, and the page it is made to read on. */
export const EMBLEM_INK = { light: "#20262d", dark: "#eef1f3" } as const;
export const EMBLEM_PAGE = { light: "#ffffff", dark: "#14181c" } as const;

/** The metals. */
export const METALS = { gold: "#d9a620", silver: "#aeb6c0", bronze: "#b8733a" } as const;
export type Metal = keyof typeof METALS;

/** Where an emblem's art comes from: drawn for this package (`ours`) or taken from a source listed in NOTICE.md. */
export type EmblemSource = "ours" | "material" | "noto" | "mdi" | "game-icons";
/** What an emblem is: a flat object (a front and a back, to flip), a ball (marks on a sphere, to roll), a body of revolution (`lathe`) or an icon (one path, not turned). */
export type EmblemKind = "flat" | "ball" | "lathe" | "icon";

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
}

export function resolve(o: EmblemOptions | undefined): Resolved {
  const size = typeof o?.size === "number" && Number.isFinite(o.size) && o.size > 0 ? Math.min(Math.round(o.size * 100) / 100, 4096) : 64;
  const theme = o?.theme === "auto" || o?.theme === "light" || o?.theme === "dark" ? o.theme : "inherit";
  const style = o?.style === "line" || o?.style === "color" ? o.style : "metal";
  return { style, size, theme, tint: readColour(o?.tint) };
}

/** The main colour of a metal, or the tint when there is one. */
export const mainOf = (metal: Metal, tint: Rgb | undefined): Rgb => tint ?? (readColour(METALS[metal]) as Rgb);

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

/** The paint for a main colour in a style. The gradient's id names the colour, so two of one colour in a page agree. */
export function paintFor(style: EmblemStyle, main: Rgb, kind: "linear" | "radial" = "linear"): Paint {
  if (style === "line") return { main: "none", shade: "none", light: "none", ribbon: "none", defs: "" };
  const shade = mix(main, -0.28);
  const light = mix(main, 0.55);
  const ribbon = "#b3362b";
  if (style === "color") return { main: hexOf(main), shade, light, ribbon, defs: "" };
  const id = `dgs${kind === "radial" ? "r" : "l"}${hexOf(main).slice(1)}`;
  const stops = `<stop offset="0" stop-color="${mix(main, -0.3)}"/><stop offset="0.3" stop-color="${light}"/><stop offset="0.55" stop-color="${hexOf(main)}"/><stop offset="1" stop-color="${mix(main, -0.38)}"/>`;
  const defs =
    kind === "linear"
      ? `<defs><linearGradient id="${id}" x2="1" y2="0.2">${stops}</linearGradient></defs>`
      : `<defs><radialGradient id="${id}" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stop-color="${light}"/><stop offset="0.55" stop-color="${hexOf(main)}"/><stop offset="1" stop-color="${mix(main, -0.38)}"/></radialGradient></defs>`;
  return { main: `url(#${id})`, shade, light, ribbon, defs };
}

/** A drawing wrapped into a document: the title, the outline's colour for the theme, and the group that strokes it. */
export function wrap(o: { title: string; size: number; style: EmblemStyle; theme: EmblemTheme; defs?: string; body: string; box?: string }): string {
  const colour = o.theme === "dark" ? EMBLEM_INK.dark : o.theme === "inherit" ? "" : EMBLEM_INK.light;
  const auto = o.theme === "auto" ? `<style>@media(prefers-color-scheme:dark){svg{color:${EMBLEM_INK.dark}}}</style>` : "";
  const stroke = o.style === "line" ? 2.6 : 2.2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.box ?? "0 0 64 64"}" width="${o.size}" height="${o.size}" role="img"${colour === "" ? "" : ` color="${colour}"`}>` +
    `<title>${escape(o.title)}</title>${auto}${o.defs ?? ""}<g fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round">${o.body}</g></svg>`
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
