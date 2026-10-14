// The emblem library's functions: draw one by id, turn one, read a string that may be an emblem's id. This file imports every drawing through the registry; a consumer that wants one drawing
// and nothing else imports that drawing's own module (`dougu-sports/ball/soccer`) and calls its `svg`.
import type { Emblem, EmblemOptions, EmblemStyle, EmblemTheme, FrameOptions } from "./emblem.core.ts";
import { EMBLEM_STYLES } from "./emblem.core.ts";
import { BALL_IDS, CREST_SHAPES, EMBLEM_ALIASES, EMBLEM_IDS, type BallId, type CrestShape, type EmblemId, type MedalKind, type SportName } from "./emblem.ids.ts";
import type { PieceSize } from "./ball/ball.core.ts";
import { EMBLEM_DESCRIPTIONS, type EmblemDescription } from "./emblem.descriptions.ts";
import { EMBLEM_TABLE } from "./emblem.registry.ts";

/** What can name an emblem: an id, a short name (`"cup"` for `"trophy:cup"`), either with a style (`"trophy:cup/line"`), or the emblem itself. */
export type EmblemRef = EmblemId | `${EmblemId}/${EmblemStyle}` | (string & {}) | Emblem;

/** The id and style a string names, or `undefined` when it is not an emblem. An id may end in `/metal`, `/line` or `/color`, and a trophy or an award may be written without its group (`cup`, `crown`). */
export function parseEmblem(value: unknown): { id: EmblemId; style: EmblemStyle | undefined } | undefined {
  if (typeof value !== "string") return undefined;
  let text = value.trim();
  if (text.length === 0 || text.length > 60) return undefined;
  let style: EmblemStyle | undefined;
  const slash = text.lastIndexOf("/");
  if (slash > 0) {
    const tail = text.slice(slash + 1) as EmblemStyle;
    if (!EMBLEM_STYLES.includes(tail)) return undefined;
    style = tail;
    text = text.slice(0, slash);
  }
  const id = Object.hasOwn(EMBLEM_ALIASES, text) ? EMBLEM_ALIASES[text] : text;
  return Object.hasOwn(EMBLEM_TABLE, id) ? { id: id as EmblemId, style } : undefined;
}

/** True when the value is the id of an emblem (not a short name, and with no style). */
export function isEmblemId(value: unknown): value is EmblemId {
  return typeof value === "string" && Object.hasOwn(EMBLEM_TABLE, value);
}

/** The emblem a reference names. An unknown name is an error that says what an id looks like. */
export function emblemOf(ref: EmblemRef): { emblem: Emblem; style: EmblemStyle | undefined } {
  if (typeof ref !== "string") return { emblem: ref, style: undefined };
  const parsed = parseEmblem(ref);
  if (parsed === undefined) throw new Error(`Unknown emblem "${ref.slice(0, 60)}". Ids look like "trophy:cup", "medal:gold", "sport:nhl" or "crest:shield"; see EMBLEM_IDS.`);
  return { emblem: EMBLEM_TABLE[parsed.id], style: parsed.style };
}

const withStyle = <T extends EmblemOptions>(style: EmblemStyle | undefined, options: T | undefined): T | undefined => (style === undefined || options?.style !== undefined ? options : ({ ...options, style } as T));

/**
 * An emblem as a document of SVG: `renderEmblem("award:medal")`, `renderEmblem("ball:soccer/line", { size: 20 })`. `style` is `metal` (full colour with gradients, the default), `line` (one outline in the
 * page's text colour) or `color` (flat fills); `tint` replaces the main colour; `theme` is `inherit` (the default), `auto`, `light` or `dark`. A pure function: the same arguments give the same string.
 * @example
 * ```ts
 * import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
 * const svg = renderEmblem("trophy:cup", { style: "line", size: 32 });
 * console.log(svg.startsWith("<svg"), svg.includes("<title>Cup</title>"));
 * // true true
 * ```
 */
export function renderEmblem(ref: EmblemRef, options?: EmblemOptions): string {
  const { emblem, style } = emblemOf(ref);
  return emblem.svg(withStyle(style, options));
}

/** The same as `renderEmblem`. */
export const emblemSvg: typeof renderEmblem = renderEmblem;

/**
 * An emblem turned: `yaw` degrees about its vertical axis and `pitch` degrees of tilt, from its resting view, in plain SVG. A cup, bowl or urn keeps its outline and moves its light, handles and seams; a medal flips like a coin and shows its back; a ball rolls; an icon is not turned.
 * @example
 * ```ts
 * import { emblemFrame, renderEmblem } from "@johnmorrisdotca/dougu-sports/turn";
 * console.log(emblemFrame("medal:gold", { yaw: 0 }) === renderEmblem("medal:gold"));
 * // true
 * ```
 */
export function emblemFrame(ref: EmblemRef, options?: FrameOptions): string {
  const { emblem, style } = emblemOf(ref);
  return emblem.frame(withStyle(style, options));
}

/** Whether a value is the id of a ball. */
export const isBallId = (value: unknown): value is BallId => typeof value === "string" && (BALL_IDS as readonly string[]).includes(value);

/** A ball rolled: the same as `emblemFrame`, for a ball's id only. A value that is not a ball is an error. */
export function ballFrame(id: BallId, options?: FrameOptions): string {
  if (!isBallId(id)) throw new Error(`"${String(id).slice(0, 60)}" is not a ball: ids look like "ball:soccer"; see BALL_IDS.`);
  return EMBLEM_TABLE[id].frame(options);
}

/** Every emblem as markup in the metal style at 64 pixels, by id. Use `renderEmblem` for another style or size. */
export const EMBLEMS: Readonly<Record<EmblemId, string>> = Object.freeze(Object.fromEntries(EMBLEM_IDS.map((id) => [id, EMBLEM_TABLE[id].svg()])) as Record<EmblemId, string>);

/** What an emblem is, without its drawing. */
export interface EmblemInfo {
  id: EmblemId;
  en: string;
  ja: string;
  source: Emblem["source"];
  kind: Emblem["kind"];
  /** A ball's or an implement's official size, with the rule it is from, where the rulebook gives one. */
  size?: PieceSize;
  /** What is drawn, in more words than the short name (which is the accessible name), for the docs and a gallery; not every emblem has one. */
  description?: EmblemDescription;
}

/** The names, source and kind of an emblem. */
export function emblemInfo(id: EmblemId): EmblemInfo {
  const e = EMBLEM_TABLE[id];
  const size = (e as { size?: PieceSize }).size;
  const description = EMBLEM_DESCRIPTIONS[id];
  return { id, en: e.en, ja: e.ja, source: e.source, kind: e.kind, ...(size === undefined ? {} : { size }), ...(description === undefined ? {} : { description }) };
}

/** An emblem's name in a language. */
export function emblemName(id: EmblemId, language: "en" | "ja" = "en"): string {
  return language === "ja" ? EMBLEM_TABLE[id].ja : EMBLEM_TABLE[id].en;
}

/** The data an emblem is drawn from: a flat emblem's shapes or a ball's marks, for a view that turns it itself. */
export function emblemModel(id: EmblemId): unknown {
  return EMBLEM_TABLE[id].model;
}

/** What `crest` takes. */
export interface CrestOptions {
  /** `shield` (the default), `roundel`, `diamond` or `pennant`. */
  shape?: CrestShape;
  /** The team's colour, or its colour and a second colour for the band and the ring. Hex colours or `rgb()`. */
  colors?: string | readonly [string, string?];
  /** Up to three letters. A crest with none has a star. */
  initials?: string;
  size?: number;
  style?: EmblemStyle;
  theme?: EmblemTheme;
}

/**
 * A generic crest tinted by a team's colours, with its letters if it has any: what a team with no logo gets. The letters are in the ink that reads on the colour.
 * @example
 * ```ts
 * import { crest } from "@johnmorrisdotca/dougu-sports/emblems";
 * const svg = crest({ shape: "shield", colors: ["#c8102e", "#f4f0e4"], initials: "NO" });
 * console.log(svg.includes(">NO<"));
 * // true
 * ```
 */
export function crest(options: CrestOptions = {}): string {
  const colors = typeof options.colors === "string" ? [options.colors] : (options.colors ?? []);
  const shape = (CREST_SHAPES as readonly string[]).includes(options.shape as string) ? (options.shape as CrestShape) : "shield";
  return EMBLEM_TABLE[`crest:${shape}`].svg({ tint: colors[0], accent: colors[1], initials: options.initials, size: options.size, style: options.style, theme: options.theme });
}

/** A medal on a ribbon: `medal("gold")`, `"silver"` or `"bronze"`; any other kind is the gold one. */
export function medal(kind: MedalKind, options?: EmblemOptions): string {
  return (EMBLEM_TABLE[`medal:${kind}` as EmblemId] ?? EMBLEM_TABLE["medal:gold"]).svg(options);
}

/** The icon of a sport, by the names of `SPORT_NAMES`: `sportIcon("nhl")`. An unknown sport is an error. */
export function sportIcon(sport: SportName, options?: EmblemOptions): string {
  const e = Object.hasOwn(EMBLEM_TABLE, `sport:${sport}`) ? EMBLEM_TABLE[`sport:${sport}` as EmblemId] : undefined;
  if (e === undefined) throw new Error(`Unknown sport "${String(sport).slice(0, 40)}": the icons are for the names in SPORT_NAMES.`);
  return e.svg(options);
}
