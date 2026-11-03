import { emblemDataUri } from "./emblem.uri.ts";
import { emblemOf, renderEmblem, type EmblemRef } from "./emblem.api.ts";
import type { EmblemOptions } from "./emblem.core.ts";

/**
 * What `emblemEmbedCode` takes: the look of the emblem, how it turns, and where the package's pages are.
 * @example
 * ```ts
 * import type { EmbedOptions } from "@johnmorrisdotca/dougu-sports/emblems";
 * const options: EmbedOptions = { style: "line", size: 160, turnable: true, speed: 24 };
 * console.log(options.size);
 * ```
 */
export interface EmbedOptions extends Pick<EmblemOptions, "style" | "size" | "tint" | "accent" | "initials" | "theme" | "locale"> {
  /** The angle it is drawn at, in degrees. */
  yaw?: number;
  pitch?: number;
  roll?: number;
  /** A drag, the arrow keys and Space turn it. */
  turnable?: boolean;
  /** It turns by itself (not for a reader who prefers reduced motion). */
  autoplay?: boolean;
  /** Degrees a second. */
  speed?: number;
  /** Where the embed page is: this package's demo site by default. */
  site?: string;
  /** Where the package's `element` script is: jsDelivr's copy of the latest version by default. */
  cdn?: string;
}

/**
 * The ways to put one emblem in a page, each as the text to paste.
 * @example
 * ```ts
 * import { emblemEmbedCode } from "@johnmorrisdotca/dougu-sports/emblems";
 * import type { EmbedCode } from "@johnmorrisdotca/dougu-sports/emblems";
 * const code: EmbedCode = emblemEmbedCode("medal:gold");
 * console.log(code.iframe.startsWith("<iframe"), code.img.startsWith("<img"));
 * ```
 */
export interface EmbedCode {
  /** The `<script>` that registers `<dougu-emblem>`. */
  script: string;
  /** The `<dougu-emblem>` tag with its attributes. */
  element: string;
  /** The script and the tag, to paste into a page. */
  html: string;
  /** An `<iframe>` of the embed page, which needs no script on your page. */
  iframe: string;
  /** The embed page's address. */
  address: string;
  /** An ES module that imports the element and draws the emblem. */
  module: string;
  /** An `<img>` with the drawing in its `src` as a data address. */
  img: string;
  /** The drawing as SVG markup. */
  svg: string;
}

const escapeHtml = (text: string): string => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Every way to put one emblem in a page, as text to copy: the script and tag, an iframe, an ES module, an `<img>` with a data address, and the raw SVG. The tag and the iframe carry the same choices, so they draw the same emblem.
 * @param ref - An emblem id (or short name, or an emblem).
 * @param options - How it looks and turns, and where the package's pages are (`site`, `cdn`).
 * @returns The snippets, as strings.
 * @example
 * ```ts
 * import { emblemEmbedCode } from "@johnmorrisdotca/dougu-sports/emblems";
 * const code = emblemEmbedCode("trophy:cup", { style: "line", size: 160, turnable: true });
 * console.log(code.element);
 * ```
 */
export function emblemEmbedCode(ref: EmblemRef, options: EmbedOptions = {}): EmbedCode {
  const { emblem } = emblemOf(ref);
  const id = typeof ref === "string" ? ref : emblem.id;
  const size = options.size ?? 64;
  const site = (options.site ?? "https://johnmorrisdotca.github.io/dougu-sports/").replace(/\/?$/, "/");
  const cdn = options.cdn ?? "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/dougu-sports/element/+esm";
  const pairs: [string, string][] = [["emblem", id]];
  if (options.style !== undefined && options.style !== "metal") pairs.push(["variant", options.style]);
  if (options.size !== undefined) pairs.push(["size", String(options.size)]);
  if (options.tint) pairs.push(["tint", options.tint]);
  if (options.accent) pairs.push(["accent", options.accent]);
  if (options.initials) pairs.push(["initials", options.initials]);
  if (options.theme !== undefined && options.theme !== "inherit") pairs.push(["theme", options.theme]);
  if (options.locale === "ja") pairs.push(["locale", "ja"]);
  for (const name of ["yaw", "pitch", "roll", "speed"] as const) if (options[name] !== undefined && Number.isFinite(options[name])) pairs.push([name, String(options[name])]);
  const attributes = pairs.map(([name, value]) => ` ${name}="${escapeHtml(value)}"`).join("");
  const element = `<dougu-emblem${attributes}${options.turnable ? " turnable" : ""}${options.autoplay ? " autoplay" : ""}></dougu-emblem>`;
  const script = `<script type="module" src="${escapeHtml(cdn)}"></script>`;
  const query = new URLSearchParams(pairs);
  if (options.turnable) query.set("turnable", "1");
  if (options.autoplay) query.set("autoplay", "1");
  const address = `${site}embed.html?${query.toString()}`;
  const name = options.locale === "ja" ? emblem.ja : emblem.en;
  const frame = Math.ceil(size) + 16;
  const draw = { ...options } as Record<string, unknown>;
  for (const key of ["yaw", "pitch", "roll", "turnable", "autoplay", "speed", "site", "cdn"]) delete draw[key];
  const svgOptions = { ...draw, ...(options.style === undefined ? {} : { style: options.style }) } as EmblemOptions;
  return {
    script,
    element,
    html: `${script}\n${element}`,
    iframe: `<iframe src="${escapeHtml(address)}" title="${escapeHtml(name)}" width="${frame}" height="${frame}" loading="lazy" style="border:0"></iframe>`,
    address,
    module: `import "@johnmorrisdotca/dougu-sports/element";\n\nconst emblem = document.createElement("dougu-emblem");\n${pairs.map(([n, v]) => `emblem.setAttribute("${n}", ${JSON.stringify(v)});`).join("\n")}${options.turnable ? '\nemblem.setAttribute("turnable", "");' : ""}${options.autoplay ? '\nemblem.setAttribute("autoplay", "");' : ""}\ndocument.body.append(emblem);`,
    img: `<img src="${escapeHtml(emblemDataUri(ref, svgOptions))}" alt="${escapeHtml(name)}" width="${size}" height="${size}">`,
    svg: renderEmblem(ref, svgOptions),
  };
}
