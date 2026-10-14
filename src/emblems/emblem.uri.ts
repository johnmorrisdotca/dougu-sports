// An emblem as a data address, for an `<img>`, a CSS background or a canvas. An image cannot inherit its page's text colour, so the colour is settled here: the line style, a pictogram and a Material
// icon are drawn in `currentColor`, and that becomes a concrete colour.
import { EMBLEM_INK, hexOf, readColour, type EmblemOptions } from "./emblem.core.ts";
import { renderEmblem, type EmblemRef } from "./emblem.api.ts";

/** What `emblemDataUri` takes: the emblem's options, and the colour of the line. */
export interface DataUriOptions extends EmblemOptions {
  /** The colour of the outline and of anything drawn in the ink: `#rgb`, `#rrggbb` or `rgb()`. It wins over `theme`. Anything else is ignored. */
  color?: string;
}

/** Text as the body of a data address: every character that could end an attribute, a quoted `url()` or an unquoted one is percent-encoded, and the rest is left alone. */
export function encodeSvg(svg: string): string {
  return encodeURIComponent(svg).replace(/%(3A|2F|2C|3B|3D|40)/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16))).replace(/['()*!]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * An emblem as a data address, `data:image/svg+xml;utf8,…`, with every character that could break an attribute or a CSS `url()` percent-encoded, so the string goes anywhere: `img.src`, `background-image:
 * url("…")`, `new Image().src` for a canvas. The ink is settled for you, because `currentColor` does not cross an `<img>` boundary: `color` is the line's colour; without it `theme: "dark"` is pale ink, and `"light"`
 * and `"inherit"` (the default) are dark ink. `theme: "auto"` keeps the page's colour scheme (`prefers-color-scheme`) in the image.
 * @example
 * ```ts
 * import { emblemDataUri } from "@johnmorrisdotca/dougu-sports/emblems";
 * const src = emblemDataUri("medal:gold", { size: 48 });
 * console.log(src.startsWith("data:image/svg+xml;utf8,%3Csvg"));
 * // true
 * ```
 */
export function emblemDataUri(ref: EmblemRef, options?: DataUriOptions): string {
  const { color, ...rest } = options ?? {};
  const picked = readColour(color);
  const ink = picked !== undefined ? hexOf(picked) : rest.theme === "dark" ? EMBLEM_INK.dark : rest.theme === "auto" ? undefined : EMBLEM_INK.light;
  let svg = renderEmblem(ref, { ...rest, theme: ink === undefined ? "auto" : "inherit" });
  // `currentColor` becomes the ink. A drawing that asked for `auto` keeps its colour-scheme rule, with the dark ink as its light default.
  svg = ink === undefined ? svg.replace("<style>@media", `<style>svg{color:${EMBLEM_INK.light}}@media`) : svg.replace(/currentColor/g, ink);
  return `data:image/svg+xml;utf8,${encodeSvg(svg)}`;
}
