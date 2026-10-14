// Two displays made from emblems: a podium (first, second and third on tiered steps) and an award case (a team's trophies on a shelf, with a count for each). Both are one SVG string, pure functions of their
// arguments, in the page's text colour so they follow light and dark, with a title and a description for a screen reader. The emblems inside are the registry's, drawn without their own titles.
import { EMBLEM_INK, METALS, escape, mix, n2, readColour, type EmblemLocale, type EmblemStyle, type EmblemTheme, type Rgb } from "./emblem.core.ts";
import { emblemOf, renderEmblem, type EmblemRef } from "./emblem.api.ts";
import { IdSpace, nest, partsOf } from "./emblem.compose.ts";
import { encodeSvg } from "./emblem.uri.ts";

/** The options both displays share. */
export interface DisplayOptions {
  /** The width in pixels; the height follows the drawing's proportions. A podium is 320 by default, an award case as wide as its cells. */
  width?: number;
  /** `metal` (the default), `line` or `color`: the style of the emblems and of the steps and the shelf. */
  style?: EmblemStyle;
  /** `inherit` (the default), `auto`, `light` or `dark`, as for an emblem. */
  theme?: EmblemTheme;
  /** `"en"` (the default) or `"ja"`: the language of the default title and description, and of the emblems' names in the description. */
  locale?: EmblemLocale;
  /** A string is the `<title>`; `false` drops the title and the description and marks the drawing `aria-hidden="true"`. By default it is "Podium" or "Award case". */
  title?: string | false;
  /** The `<desc>`: by default it lists what is drawn, in words. */
  desc?: string;
}

/** One place of a podium. */
export interface PodiumPlace {
  /** The medal or trophy for the place: any emblem. By default the gold, silver and bronze medals. */
  emblem?: EmblemRef;
  /** The name of the winner, written under the step's top. Long names are cut short with an ellipsis. */
  name?: string;
  /** A flag for the winner: SVG markup (`<svg …>`), which is drawn as an image and so cannot run or load anything, or a URL (`https:`, a path on your site, or a `data:image/…` address). Anything else is left out. */
  flag?: string;
  /** A line on the step: a time, a score, a number of points. */
  label?: string;
}

/** What `podium` takes. */
export type PodiumOptions = DisplayOptions;

/** One kind of trophy in an award case. */
export interface AwardItem {
  /** The trophy, medal or crest: any emblem. */
  emblem: EmblemRef;
  /** How many the team has won; a badge `×N` shows when it is more than one. 1 by default; less than 1 leaves the item out, and the badge stops at 999. */
  count?: number;
  /** A line under the shelf: the years, or a name. */
  label?: string;
}

/** What `awardCase` takes. */
export interface AwardCaseOptions extends DisplayOptions {
  /** Items in a row before the case wraps into another (5 by default, 1 to 12). */
  perRow?: number;
  /** The width of an emblem in the drawing's own units (56 by default, 24 to 128): the pixel size at the default width. */
  size?: number;
  /** `shelf` (the default) stands the emblems on a plank under each row; `row` draws them with no plank. */
  layout?: "shelf" | "row";
}

const WORDS = {
  en: { podium: "Podium", case: "Award case", places: ["1st", "2nd", "3rd"] },
  ja: { podium: "表彰台", case: "トロフィーケース", places: ["1位", "2位", "3位"] },
} as const;

const FONT = 'font-family="system-ui,sans-serif"';

/** Text cut to a number of character widths, with an ellipsis where it was cut. */
function fit(text: string, max: number): string {
  const chars = [...text.replace(/\s+/g, " ").trim()];
  let width = 0;
  const out: string[] = [];
  for (const c of chars) {
    const w = (c.codePointAt(0) ?? 0) > 0x2e7f ? 2 : 1;
    if (width + w > max) return `${out.join("").trimEnd()}…`;
    width += w;
    out.push(c);
  }
  return out.join("");
}

/** An image address that is safe to put in an `<image>`: SVG markup becomes a data address (an image cannot run script or load anything), a URL must be `https:`, a path of your own site, or an image data address. */
export function safeImage(source: unknown): string | undefined {
  if (typeof source !== "string") return undefined;
  const text = source.trim();
  if (text === "" || text.length > 100_000) return undefined;
  if (/^<svg[\s>]/i.test(text)) {
    const root = /^<svg[^>]*>/i.exec(text);
    if (root === null) return undefined;
    const withNamespace = /\sxmlns\s*=/.test(root[0]) ? text : text.replace(/^<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
    // An `=` is encoded as well, so that nothing in the address reads as an attribute to a scanner that looks for one.
    return `data:image/svg+xml;utf8,${encodeSvg(withNamespace).replace(/=/g, "%3D")}`;
  }
  if (/^https:\/\/[^\s"'<>\\@]+$/i.test(text)) return text;
  if (/^data:image\/(png|jpeg|gif|webp|avif|svg\+xml)[;,][^\s"'<>\\]*$/i.test(text)) return text;
  if (/^(?:\/(?!\/)|\.{1,2}\/)[\w\-./~%+@]*$/.test(text)) return text;
  return undefined;
}

/** The emblem as a part of another drawing: its body and its definitions, with no title. */
function inner(ref: EmblemRef, style: EmblemStyle | undefined, space: IdSpace): { box: string; body: string } {
  const parts = partsOf(renderEmblem(ref, { style, theme: "inherit", title: false, grain: false }));
  return { box: parts.box, body: space.add(parts) };
}

/** The document that holds a display: size, theme, title and description. */
function document(o: DisplayOptions, kind: "podium" | "case", box: readonly [number, number, number, number], defs: readonly string[], body: string, desc: string, defaultWidth: number): string {
  const [x, y, w, h] = box;
  const width = typeof o.width === "number" && Number.isFinite(o.width) && o.width > 0 ? Math.min(Math.round(o.width * 100) / 100, 4096) : defaultWidth;
  const locale = o.locale === "ja" ? "ja" : "en";
  const theme = o.theme === "auto" || o.theme === "light" || o.theme === "dark" ? o.theme : "inherit";
  const colour = theme === "dark" ? EMBLEM_INK.dark : theme === "inherit" ? "" : EMBLEM_INK.light;
  const auto = theme === "auto" ? `<style>@media(prefers-color-scheme:dark){svg{color:${EMBLEM_INK.dark}}}</style>` : "";
  const hidden = o.title === false;
  const title = typeof o.title === "string" && o.title.trim() !== "" ? o.title.trim().slice(0, 300) : WORDS[locale][kind === "case" ? "case" : "podium"];
  const text = typeof o.desc === "string" && o.desc.trim() !== "" ? o.desc.trim().slice(0, 1000) : desc;
  const lang = locale === "ja" && typeof o.title !== "string" && !hidden ? ' lang="ja"' : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n2(x)} ${n2(y)} ${n2(w)} ${n2(h)}" width="${n2(width)}" height="${n2((width * h) / w)}"${hidden ? ' aria-hidden="true"' : ` role="img"${lang}`}${colour === "" ? "" : ` color="${colour}"`}>` +
    `${hidden ? "" : `<title>${escape(title)}</title><desc>${escape(text)}</desc>`}${auto}${defs.length === 0 ? "" : `<defs>${defs.join("")}</defs>`}` +
    `<g ${FONT} fill="none" stroke="none">${body}</g></svg>`
  );
}

const NAME_OF = (ref: EmblemRef, locale: EmblemLocale): string => (locale === "ja" ? emblemOf(ref).emblem.ja : emblemOf(ref).emblem.en);

/** A step: the three metals tint the steps in the metal and colour styles; in the line style they are outlines. */
function step(style: EmblemStyle, place: number, x: number, y: number, w: number, h: number, defs: string[]): string {
  const metal = readColour([METALS.gold, METALS.silver, METALS.bronze][place] ?? METALS.gold) as Rgb;
  const edge = mix(metal, -0.3);
  if (style === "line") return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" stroke="currentColor" stroke-width="2"/>`;
  if (style === "color") return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${mix(metal, 0)}" fill-opacity=".34" stroke="${edge}" stroke-width="1.5"/>`;
  const id = `dgpd${place + 1}`;
  const hex = mix(metal, 0);
  const def = `<linearGradient id="${id}" x2="0" y2="1"><stop offset="0" stop-color="${mix(metal, 0.35)}" stop-opacity=".78"/><stop offset="1" stop-color="${hex}" stop-opacity=".22"/></linearGradient>`;
  if (!defs.includes(def)) defs.push(def);
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#${id})" stroke="${edge}" stroke-width="1.5"/>`;
}

/**
 * A podium: first, second and third on tiered steps (second on the left, first in the middle, third on the right), each with a medal or a trophy, and optionally a name, a flag and a line of text. `places[0]` is first;
 * a place left out is an empty step. The drawing is the page's text colour on tinted steps, so it reads on light and dark; it has a title and a description that says who stands where. A flag is SVG markup or a URL
 * and is drawn as an `<image>`, so it cannot run script or reach anything it was not given; anything that is neither is left out.
 * @example
 * ```ts
 * import { podium } from "@johnmorrisdotca/dougu-sports/emblems";
 * const svg = podium([{ name: "Aoki", label: "9.80" }, { name: "Brown" }, { name: "Chen" }]);
 * console.log(svg.includes("<desc>1st: Aoki (9.80); 2nd: Brown; 3rd: Chen</desc>"));
 * // true
 * ```
 */
export function podium(places: readonly (PodiumPlace | null | undefined)[], options: PodiumOptions = {}): string {
  const style: EmblemStyle = options.style === "line" || options.style === "color" ? options.style : "metal";
  const locale: EmblemLocale = options.locale === "ja" ? "ja" : "en";
  const space = new IdSpace();
  const stepDefs: string[] = [];
  const base = 206;
  const heights = [100, 78, 60] as const;
  const centres = [160, 56, 264] as const;
  const defaults: readonly EmblemRef[] = ["medal:gold", "medal:silver", "medal:bronze"];
  let top = base;
  let body = "";
  const said: string[] = [];
  for (const place of [1, 0, 2] as const) {
    const entry = places[place] ?? undefined;
    const c = centres[place] as number;
    const h = heights[place] as number;
    const t = base - h;
    body += step(style, place, c - 48, t, 96, h, stepDefs);
    body += `<text x="${c}" y="${t + 31}" text-anchor="middle" font-size="26" font-weight="800" fill="currentColor" fill-opacity=".85">${place + 1}</text>`;
    if (entry === undefined) continue;
    const label = typeof entry.label === "string" ? fit(entry.label, 18) : "";
    if (label !== "") body += `<text x="${c}" y="${t + 50}" text-anchor="middle" font-size="11" fill="currentColor">${escape(label)}</text>`;
    const ref = entry.emblem ?? (defaults[place] as EmblemRef);
    const emblem = inner(ref, style, space);
    const emblemTop = t - 62;
    body += nest(emblem.box, emblem.body, c - 30, emblemTop, 60, 60);
    let cursor = emblemTop;
    const flag = safeImage(entry.flag);
    if (flag !== undefined) {
      cursor -= 20;
      body += `<image href="${escape(flag)}" x="${c - 12}" y="${cursor}" width="24" height="16" preserveAspectRatio="xMidYMid meet"/><rect x="${c - 12}" y="${cursor}" width="24" height="16" stroke="currentColor" stroke-opacity=".4" stroke-width=".75"/>`;
    }
    const name = typeof entry.name === "string" ? fit(entry.name, 16) : "";
    if (name !== "") {
      cursor -= 6;
      body += `<text x="${c}" y="${cursor}" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">${escape(name)}</text>`;
      cursor -= 11;
    }
    top = Math.min(top, cursor);
    const who = name !== "" ? (typeof entry.name === "string" ? entry.name.replace(/\s+/g, " ").trim() : name) : NAME_OF(ref, locale);
    const line = typeof entry.label === "string" ? entry.label.replace(/\s+/g, " ").trim() : "";
    // Japanese writes its description with full-width punctuation and 、 between the places.
    said[place] = locale === "ja" ? `${WORDS.ja.places[place]}：${who}${line !== "" ? `（${line}）` : ""}` : `${WORDS.en.places[place]}: ${who}${line !== "" ? ` (${line})` : ""}`;
  }
  top = Math.max(0, Math.min(top, base - 100 - 62) - 6);
  const desc = said.filter(Boolean).join(locale === "ja" ? "、" : "; ");
  return document(options, "podium", [0, top, 320, base + 6 - top], [...space.defs, ...stepDefs], body, desc, 320);
}

/**
 * An award case: a team's trophies on a shelf (or in a row), each drawn once with a `×N` badge when the team has won it more than once, wrapping into more rows after `perRow` items. Each item can carry a line of
 * text, such as its years. The drawing follows the page's text colour, has a title and a description that lists what is in the case, and holds at most 60 items.
 * @example
 * ```ts
 * import { awardCase } from "@johnmorrisdotca/dougu-sports/emblems";
 * const svg = awardCase([{ emblem: "trophy:hockey-cup", count: 3 }, { emblem: "medal:gold" }]);
 * console.log(svg.includes("×3"));
 * // true
 * ```
 */
export function awardCase(items: readonly AwardItem[], options: AwardCaseOptions = {}): string {
  const style: EmblemStyle = options.style === "line" || options.style === "color" ? options.style : "metal";
  const locale: EmblemLocale = options.locale === "ja" ? "ja" : "en";
  const perRow = typeof options.perRow === "number" && Number.isFinite(options.perRow) ? Math.max(1, Math.min(12, Math.floor(options.perRow))) : 5;
  const size = typeof options.size === "number" && Number.isFinite(options.size) ? Math.max(24, Math.min(128, options.size)) : 56;
  const shelf = options.layout !== "row";
  const list = items
    .filter((item) => item !== null && typeof item === "object")
    .map((item) => ({ item, count: item.count === undefined ? 1 : Math.min(999, Math.floor(Number(item.count))) }))
    .filter(({ count }) => count >= 1)
    .slice(0, 60);
  const space = new IdSpace();
  const gap = shelf ? 24 : 16;
  const cell = size + gap;
  const columns = Math.max(1, Math.min(perRow, list.length));
  const labelled = list.some(({ item }) => typeof item.label === "string" && item.label.trim() !== "");
  const rowHeight = 10 + size + (shelf ? 8 : 0) + (labelled ? 18 : 0) + 8;
  const rows = Math.max(1, Math.ceil(list.length / perRow));
  const pad = 8;
  const width = columns * cell + 2 * pad;
  const wide = Math.max(4, Math.floor(cell / 5.4));
  let body = "";
  const said: string[] = [];
  for (let r = 0; r < rows; r++) {
    const y0 = pad + r * rowHeight;
    const emblemY = y0 + 10;
    const plank = emblemY + size;
    if (shelf) body += `<rect x="${pad}" y="${plank}" width="${columns * cell}" height="6" rx="2" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-opacity=".5" stroke-width="1"/>`;
    for (let c = 0; c < columns; c++) {
      const entry = list[r * perRow + c];
      if (entry === undefined) break;
      const x = pad + c * cell + gap / 2;
      const emblem = inner(entry.item.emblem, style, space);
      body += nest(emblem.box, emblem.body, x, emblemY, size, size);
      const label = typeof entry.item.label === "string" ? fit(entry.item.label, wide) : "";
      if (label !== "") body += `<text x="${n2(x + size / 2)}" y="${plank + (shelf ? 20 : 14)}" text-anchor="middle" font-size="10" fill="currentColor">${escape(label)}</text>`;
      if (entry.count > 1) {
        const text = `×${entry.count}`;
        const w = 10 + text.length * 6.4;
        const right = x + size + 4;
        body += `<rect x="${n2(right - w)}" y="${n2(emblemY - 4)}" width="${n2(w)}" height="16" rx="8" fill="${EMBLEM_INK.light}" stroke="${EMBLEM_INK.dark}" stroke-width="1"/><text x="${n2(right - w / 2)}" y="${n2(emblemY + 7.5)}" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">${text}</text>`;
      }
      const name = NAME_OF(entry.item.emblem, locale);
      const note = typeof entry.item.label === "string" ? entry.item.label.replace(/\s+/g, " ").trim() : "";
      // The badge is drawn ×N; spoken in Japanese the count is N回, because a screen reader reads × unevenly.
      if (locale === "ja") said.push(`${name}${entry.count > 1 ? ` ${entry.count}回` : ""}${note === "" ? "" : `（${note}）`}`);
      else said.push(`${name}${entry.count > 1 ? ` ×${entry.count}` : ""}${note === "" ? "" : ` (${note})`}`);
    }
  }
  return document(options, "case", [0, 0, width, pad * 2 + rows * rowHeight - 8], space.defs, body, said.join(locale === "ja" ? "、" : ", "), width);
}
