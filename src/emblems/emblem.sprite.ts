// A sheet of symbols: each emblem drawn once, then used as many times as a page wants it with a `<use>` that costs a few nodes and a few dozen bytes.
import { EMBLEM_INK, escape, resolve, type EmblemLocale, type EmblemOptions } from "./emblem.core.ts";
import { emblemOf, parseEmblem, renderEmblem, type EmblemRef } from "./emblem.api.ts";
import { IdSpace, partsOf } from "./emblem.compose.ts";

/** What `emblemSprite` takes: the options every symbol is drawn with, and the prefix of its ids. */
export interface SpriteOptions extends EmblemOptions {
  /** The start of every id in the sheet (letters, digits and hyphens, starting with a letter). By default it is made from the emblems and the options, so the same call gives the same sheet. */
  prefix?: string;
}

/** What one `<use>` takes. */
export interface UseOptions {
  /** The width and height in pixels (64 by default). */
  size?: number;
  /** A class for the `<svg>` that holds the `<use>`. */
  class?: string;
  /** The `<title>`: a string writes that title, `false` drops it and hides the drawing from a screen reader. By default it is the emblem's name. */
  title?: string | false;
  /** The language of the default title, `"en"` or `"ja"`. */
  locale?: EmblemLocale;
}

/** A sheet of symbols and the snippets that draw them. */
export interface Sprite {
  /** One hidden `<svg>` of `<symbol>`s; put it once in the page, anywhere in `<body>`. */
  sheet: string;
  /** The markup for one use of a symbol: `<svg><title>…</title><use href="#…"/></svg>`. The emblem must be one the sprite was made with. */
  use: (ref: EmblemRef, options?: UseOptions) => string;
}

const hash = (text: string): string => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
};

/** The key a reference goes by in a sprite: the id, and the style when the reference names one. */
function keyOf(ref: EmblemRef): string {
  if (typeof ref !== "string") return ref.id;
  const parsed = parseEmblem(ref);
  if (parsed === undefined) throw new Error(`Unknown emblem "${ref.slice(0, 60)}". Ids look like "ball:soccer" or "medal:gold/line"; see EMBLEM_IDS.`);
  return parsed.style === undefined ? parsed.id : `${parsed.id}/${parsed.style}`;
}

/**
 * A sprite sheet: every emblem in `ids` drawn once as a `<symbol>`, with the gradients and other definitions shared and every id unique across the sheet, and a `use(id, { size, class, title })` that returns the
 * markup for one more of it. Put `sheet` in the page once; a bracket or a table that shows the same ball or medal fifty times then adds a few nodes each time, not the whole drawing. The symbols are drawn without the
 * grain a large ball has by default (pass `grain: true` to keep it). `style`, `tint`, `accent` and `theme` are the sheet's, for every symbol; a different look is another sprite, or an id that names its style (`"medal:gold/line"`).
 * @example
 * ```ts
 * import { emblemSprite } from "@johnmorrisdotca/dougu-sports/emblems";
 * const sprite = emblemSprite(["ball:soccer", "medal:gold"]);
 * console.log(sprite.use("ball:soccer", { size: 24 }).startsWith("<svg"));
 * // true
 * ```
 */
export function emblemSprite(ids: readonly EmblemRef[], options?: SpriteOptions): Sprite {
  const keys = [...new Set(ids.map(keyOf))];
  const { prefix: asked, ...drawn } = options ?? {};
  const prefix = typeof asked === "string" && /^[A-Za-z][\w-]{0,31}$/.test(asked) ? asked : `dgs${hash(`${keys.join(",")}|${JSON.stringify(drawn)}`)}`;
  const theme = drawn.theme === "dark" || drawn.theme === "light" || drawn.theme === "auto" ? drawn.theme : "inherit";
  const space = new IdSpace(prefix);
  const symbols: string[] = [];
  const symbolOf = new Map<string, string>();
  for (const key of keys) {
    const svg = renderEmblem(key, { ...drawn, theme: "inherit", title: false, locale: undefined, grain: drawn.grain ?? false });
    const parts = partsOf(svg);
    const name = `${prefix}-${key.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
    symbolOf.set(key, name);
    symbols.push(`<symbol id="${name}" viewBox="${escape(parts.box)}">${space.add(parts)}</symbol>`);
  }
  const rule = theme === "auto" ? `<style>@media(prefers-color-scheme:dark){svg.${prefix}{color:${EMBLEM_INK.dark}}}</style>` : "";
  const sheet =
    `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false">` +
    `${rule}${space.defs.length === 0 ? "" : `<defs>${space.defs.join("")}</defs>`}${symbols.join("")}</svg>`;
  const color = theme === "dark" ? EMBLEM_INK.dark : theme === "light" ? EMBLEM_INK.light : "";
  const use = (ref: EmblemRef, o?: UseOptions): string => {
    const key = keyOf(ref);
    const symbol = symbolOf.get(key);
    if (symbol === undefined) throw new Error(`"${key}" is not in this sprite; it holds ${keys.slice(0, 8).join(", ")}${keys.length > 8 ? ", …" : ""}.`);
    const size = resolve({ size: o?.size }).size;
    const classes = [theme === "auto" ? prefix : "", typeof o?.class === "string" ? o.class.trim() : ""].filter(Boolean).join(" ");
    const { emblem } = emblemOf(ref);
    const title = o?.title === false ? false : typeof o?.title === "string" && o.title.trim() !== "" ? o.title.trim().slice(0, 300) : o?.locale === "ja" ? emblem.ja : emblem.en;
    const lang = o?.locale === "ja" && typeof o?.title !== "string" ? ' lang="ja"' : "";
    return (
      `<svg width="${size}" height="${size}"${title === false ? ' aria-hidden="true"' : ` role="img"${lang}`}${classes === "" ? "" : ` class="${escape(classes)}"`}${color === "" ? "" : ` color="${color}"`}>` +
      `${title === false ? "" : `<title>${escape(title)}</title>`}<use href="#${symbol}"/></svg>`
    );
  };
  return { sheet, use };
}
