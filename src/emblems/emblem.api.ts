// The emblem library's functions: draw one by id, turn one, read a string that may be an emblem's id. This file imports every drawing through the registry; a consumer that wants one drawing
// and nothing else imports that drawing's own module (`dougu-sports/ball/soccer`) and calls its `svg`.
import type { Emblem, EmblemOptions, EmblemStyle, FrameOptions } from "./emblem.core.ts";
import { EMBLEM_STYLES } from "./emblem.core.ts";
import { BALL_IDS, EMBLEM_IDS, type BallId, type EmblemId } from "./emblem.ids.ts";
import { EMBLEM_TABLE } from "./emblem.registry.ts";

/** What can name an emblem: an id, or an id with a style (`"award:medal/line"`), or the emblem itself. */
export type EmblemRef = EmblemId | `${EmblemId}/${EmblemStyle}` | (string & {}) | Emblem;

/** The id and style a string names, or `undefined` when it is not an emblem. An id may end in `/metal`, `/line` or `/color`. */
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
  return Object.hasOwn(EMBLEM_TABLE, text) ? { id: text as EmblemId, style } : undefined;
}

/** True when the value is the id of an emblem (with no style). */
export function isEmblemId(value: unknown): value is EmblemId {
  return typeof value === "string" && Object.hasOwn(EMBLEM_TABLE, value);
}

/** The emblem a reference names. An unknown name is an error that says what an id looks like. */
export function emblemOf(ref: EmblemRef): { emblem: Emblem; style: EmblemStyle | undefined } {
  if (typeof ref !== "string") return { emblem: ref, style: undefined };
  const parsed = parseEmblem(ref);
  if (parsed === undefined) throw new Error(`Unknown emblem "${ref.slice(0, 60)}". Ids look like "award:medal" or "ball:soccer"; see EMBLEM_IDS.`);
  return { emblem: EMBLEM_TABLE[parsed.id], style: parsed.style };
}

const withStyle = <T extends EmblemOptions>(style: EmblemStyle | undefined, options: T | undefined): T | undefined => (style === undefined || options?.style !== undefined ? options : ({ ...options, style } as T));

/**
 * An emblem as a document of SVG: `renderEmblem("award:medal")`, `renderEmblem("ball:soccer/line", { size: 20 })`. `style` is `metal` (full colour with gradients, the default), `line` (one outline in the
 * page's text colour) or `color` (flat fills); `tint` replaces the main colour; `theme` is `inherit` (the default), `auto`, `light` or `dark`. A pure function: the same arguments give the same string.
 * @example
 * ```ts
 * import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
 * const svg = renderEmblem("award:medal", { style: "line", size: 32 });
 * console.log(svg.startsWith("<svg"), svg.includes("<title>Medal</title>"));
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
 * An emblem turned: `yaw` degrees about its vertical axis and `pitch` degrees of tilt, from its resting view, in plain SVG. A flat emblem (a medal) flips like a coin and shows its back; a ball rolls.
 * @example
 * ```ts
 * import { emblemFrame, renderEmblem } from "@johnmorrisdotca/dougu-sports/turn";
 * console.log(emblemFrame("award:medal", { yaw: 0 }) === renderEmblem("award:medal"));
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
}

/** The names, source and kind of an emblem. */
export function emblemInfo(id: EmblemId): EmblemInfo {
  const e = EMBLEM_TABLE[id];
  return { id, en: e.en, ja: e.ja, source: e.source, kind: e.kind };
}

/** An emblem's name in a language. */
export function emblemName(id: EmblemId, language: "en" | "ja" = "en"): string {
  return language === "ja" ? EMBLEM_TABLE[id].ja : EMBLEM_TABLE[id].en;
}

/** The data an emblem is drawn from: a flat emblem's shapes or a ball's marks, for a view that turns it itself. */
export function emblemModel(id: EmblemId): unknown {
  return EMBLEM_TABLE[id].model;
}
