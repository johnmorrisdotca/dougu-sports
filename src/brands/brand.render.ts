// Draws the fictional logos: a maker's mark, its wordmark or both, and a team's logo, as an SVG document or as a group to place inside another drawing. A pure function of its options: the same id and options give the same
// string, there are no ids, no gradients and no filters, and a colour that is not `#rgb`, `#rrggbb` or `rgb()` is ignored.
import { escape, hexOf, readColour } from "../emblems/emblem.core.ts";
import { LETTER_HEIGHT, lettering } from "./brand.letters.ts";
import { MAKERS, TEAMS, type LogoPart, type MakerData, type MakerId, type TeamData, type TeamId } from "./brand.data.ts";

/** What a maker's logo is made of: its mark alone (the default), its wordmark alone, the two side by side or the wordmark under the mark. */
export type LogoLayout = "mark" | "wordmark" | "horizontal" | "stacked";

/** The options every logo takes. */
export interface LogoOptions {
  /** `"full"` (the default) draws the logo in its own colours; `"mono"` draws it in one colour, `ink`. */
  color?: "full" | "mono";
  /** The colours of the logo for a light page (the default) or a dark one. */
  theme?: "light" | "dark";
  /** The one colour of a `"mono"` logo: `#rgb`, `#rrggbb` or `rgb()`. By default `currentColor`, so the logo takes the page's text colour. Ignored by a full-colour logo. */
  ink?: string;
  /** The height in pixels (64 by default); the width follows the layout. The drawing is a vector at any size. */
  size?: number;
  /** The `<title>`: a string writes that title (escaped), `false` drops it and marks the drawing `aria-hidden="true"`. By default the maker's name or the team's name. */
  title?: string | false;
}

/** The options of a maker's logo. */
export interface MakerLogoOptions extends LogoOptions {
  /** Which parts to draw. By default only the mark: the name is optional. */
  layout?: LogoLayout;
}

/** Where a logo goes inside another drawing: its top left corner and its height, in that drawing's units. */
export interface LogoPlace {
  x?: number;
  y?: number;
  /** The height of the logo in the drawing's units (100 by default). */
  size?: number;
}

const MARK = 100;
const r2 = (value: number): number => Math.round(value * 100) / 100;
const r4 = (value: number): number => Math.round(value * 10000) / 10000;
const HORIZONTAL_GAP = 16;
const WORD_HEIGHT_BESIDE = 34;
const STACK_GAP = 12;

interface Built {
  width: number;
  height: number;
  body: string;
}

const clampSize = (value: number | undefined, fallback: number): number => (typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.min(value, 4096) : fallback);

/** The colour of a mono logo: a colour that reads, or `currentColor`. */
function monoInk(ink: string | undefined): string {
  const rgb = readColour(ink);
  return rgb === undefined ? "currentColor" : hexOf(rgb);
}

const partsMarkup = (parts: readonly LogoPart[], colorOf: (part: LogoPart) => string): string => parts.map((part) => `<path fill="${colorOf(part)}" fill-rule="evenodd" d="${part.d}"/>`).join("");

function makerBody(maker: MakerData, layout: LogoLayout, o: LogoOptions | undefined): Built {
  const mono = o?.color === "mono";
  const palette = o?.theme === "dark" ? maker.dark : maker.light;
  const ink = monoInk(o?.ink);
  const mark = partsMarkup(maker.parts, (part) => (mono ? ink : part.role === "a" ? palette.a : palette.b));
  const word = lettering(maker.name, maker.lettering);
  const stroke = mono ? ink : palette.ink;
  const join = maker.lettering.corner === "round" ? "round" : "miter";
  const letters = `<path fill="none" stroke="${stroke}" stroke-width="${r2(maker.lettering.weight)}" stroke-linecap="${maker.lettering.cap}" stroke-linejoin="${join}" d="${word.d}"/>`;
  if (layout === "mark") return { width: MARK, height: MARK, body: mark };
  if (layout === "wordmark") return { width: r2(word.width), height: r2(word.height), body: letters };
  if (layout === "horizontal") {
    const k = WORD_HEIGHT_BESIDE / LETTER_HEIGHT;
    const top = MARK / 2 - (word.height * k) / 2;
    return { width: r2(MARK + HORIZONTAL_GAP + word.width * k), height: MARK, body: `${mark}<g transform="translate(${MARK + HORIZONTAL_GAP} ${r2(top)}) scale(${r4(k)})">${letters}</g>` };
  }
  const k = Math.min(0.32, 96 / word.width);
  const width = Math.max(MARK, word.width * k);
  const x = (width - MARK) / 2;
  const wx = (width - word.width * k) / 2;
  return {
    width: r2(width),
    height: r2(MARK + STACK_GAP + word.height * k),
    body: `<g transform="translate(${r2(x)} 0)">${mark}</g><g transform="translate(${r2(wx)} ${MARK + STACK_GAP}) scale(${r4(k)})">${letters}</g>`,
  };
}

function teamBody(team: TeamData, o: LogoOptions | undefined): Built {
  const mono = o?.color === "mono";
  const palette = o?.theme === "dark" ? team.dark : team.light;
  const ink = monoInk(o?.ink);
  return { width: MARK, height: MARK, body: partsMarkup(team.parts, (part) => (mono ? ink : palette[part.role])) };
}

function document(built: Built, name: string, o: LogoOptions | undefined): string {
  const height = clampSize(o?.size, 64);
  const width = r2((height * built.width) / built.height);
  const title = o?.title === false ? undefined : typeof o?.title === "string" ? o.title : name;
  const label = title === undefined ? ' aria-hidden="true"' : ` role="img"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${built.width} ${built.height}" width="${width}" height="${r2(height)}"${label}>${title === undefined ? "" : `<title>${escape(title)}</title>`}${built.body}</svg>`;
}

function group(built: Built, place: LogoPlace | undefined): string {
  const size = clampSize(place?.size, MARK);
  const k = size / built.height;
  const x = typeof place?.x === "number" && Number.isFinite(place.x) ? place.x : 0;
  const y = typeof place?.y === "number" && Number.isFinite(place.y) ? place.y : 0;
  return `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r4(k)})">${built.body}</g>`;
}

const layoutOf = (value: unknown): LogoLayout => (value === "wordmark" || value === "horizontal" || value === "stacked" ? value : "mark");

function maker(id: MakerId): MakerData {
  if (!Object.hasOwn(MAKERS, id)) throw new Error(`Unknown maker "${String(id).slice(0, 40)}"; see MAKER_IDS.`);
  return MAKERS[id];
}

function team(id: TeamId): TeamData {
  if (!Object.hasOwn(TEAMS, id)) throw new Error(`Unknown team "${String(id).slice(0, 40)}"; see TEAM_IDS.`);
  return TEAMS[id];
}

/**
 * A fictional maker's logo as an SVG document: its mark by default, or its wordmark, or both (`layout`). In its own colours for a light or a dark page, or in one colour (`color: "mono"`, `ink`).
 * @example
 * ```ts
 * import { makerLogo } from "@johnmorrisdotca/dougu-sports/brands";
 * const svg = makerLogo("arvane", { size: 48 });
 * console.log(svg.startsWith("<svg"), svg.includes("<title>Arvane</title>"));
 * // true true
 * ```
 */
export function makerLogo(id: MakerId, o?: MakerLogoOptions): string {
  const data = maker(id);
  return document(makerBody(data, layoutOf(o?.layout), o), data.name, o);
}

/** A fictional team's logo as an SVG document, in its own colours for a light or a dark page, or in one colour. */
export function teamLogo(id: TeamId, o?: LogoOptions): string {
  const data = team(id);
  return document(teamBody(data, o), `${data.city} ${data.nickname}`, o);
}

/**
 * A maker's logo as a `<g>` to put inside another SVG: a jersey, a cap, a T-shirt, a card. It has no id, no gradient and no `<title>`, so any number of them can sit in one document. `x`, `y` and `size` place it in that drawing's units.
 */
export function makerLogoGroup(id: MakerId, place?: LogoPlace, o?: Omit<MakerLogoOptions, "size" | "title">): string {
  return group(makerBody(maker(id), layoutOf(o?.layout), o), place);
}

/** A team's logo as a `<g>` to put inside another SVG (see `makerLogoGroup`). */
export function teamLogoGroup(id: TeamId, place?: LogoPlace, o?: Omit<LogoOptions, "size" | "title">): string {
  return group(teamBody(team(id), o), place);
}
