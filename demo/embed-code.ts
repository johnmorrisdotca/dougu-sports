// The code that puts an emblem in a page, for each tab of the family's embed panel. The package writes five of the ways itself (`emblemEmbedCode`: the script and tag, the tag, an iframe, an ES module, an image address
// and the SVG); the framework tabs are the shared snippets with the tag's attributes. Pure: no DOM. The index page and the builder fill the panel from here, and a test runs what it writes against the package.
import { embedSnippet, type EmbedKind } from "@johnmorrisdotca/kazoku-ui/embed-panel";
import { emblemEmbedCode, emblemName, type EmbedOptions, type EmblemId } from "../src/index.ts";

export const PACKAGE = "@johnmorrisdotca/dougu-sports";
export const CDN = `https://cdn.jsdelivr.net/npm/${PACKAGE}`;

/** The panel's tabs: the family's seven, then the package's own image address and SVG. */
export const KINDS = ["html", "module", "react", "vue", "angular", "svelte", "iframe", "image", "svg"] as const;
/** The builder also keeps the tag alone, without its script. */
export const BUILDER_KINDS = ["html", "element", "module", "react", "vue", "angular", "svelte", "iframe", "image", "svg"] as const;
export type Kind = (typeof BUILDER_KINDS)[number];

const unescape = (text: string): string => text.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/** The attributes of the `<dougu-emblem>` tag `emblemEmbedCode` wrote, in order; a bare one (`turnable`) has the value "". */
export function attrsOf(element: string): [string, string][] {
  const inside = /^<dougu-emblem([^>]*)>/.exec(element)?.[1] ?? "";
  return [...inside.matchAll(/\s([\w-]+)(?:="([^"]*)")?/g)].map((one) => [one[1]!, unescape(one[2] ?? "")]);
}

/** The text for one tab. `options.site` is where the embed page is (the package's own site when left out). */
export function embedCode(kind: Kind, id: EmblemId, options: EmbedOptions): string {
  const all = emblemEmbedCode(id, options);
  switch (kind) {
    case "html":
      return all.html;
    case "element":
      return all.element;
    case "module":
      return all.module;
    case "iframe":
      return all.iframe;
    case "image":
      return all.img;
    case "svg":
      return all.svg;
    default: {
      const size = Math.ceil(options.size ?? 64) + 16;
      return embedSnippet(kind as EmbedKind, { package: PACKAGE, cdn: CDN, tag: "dougu-emblem", element: "element", entries: [], attrs: attrsOf(all.element), name: "emblem", iframe: { src: all.address, title: emblemName(id, options.locale ?? "en"), width: size, height: size } });
    }
  }
}

/** The credit for what the picture shows. */
export const CREDIT = "Drawn by Dougu Sports (MIT). No league's, team's or maker's mark is in any emblem.";
