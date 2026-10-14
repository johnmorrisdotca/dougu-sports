// The pieces that the sprite, the podium and the award case share: an emblem's document taken apart (its view box, its definitions, its body), and put together again inside another document with
// every id unique. The emblems are written by this package, so the parts are found by their shape, not by a general XML parser.

/** An emblem's document taken apart. */
export interface Parts {
  /** The view box, `0 0 64 64` unless the drawing came from elsewhere. */
  box: string;
  /** The definitions, one string for each top-level element of the `<defs>` (a gradient, a clip path, a filter), with the id it carries. */
  defs: readonly { id: string; text: string }[];
  /** Everything that draws: the body, with the `<title>`, `<style>` and `<defs>` taken out. A `<desc>` stays, because it carries the credit of copied art. */
  body: string;
}

/** The top-level elements of a run of markup, each with its `id` attribute (an empty string when it has none). */
function topLevel(markup: string): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  const tag = /<(\/?)[A-Za-z][\w:-]*[^>]*?(\/?)>/g;
  let depth = 0;
  let start = 0;
  for (let m = tag.exec(markup); m !== null; m = tag.exec(markup)) {
    if (m[1] === "/") {
      depth--;
      if (depth === 0) out.push({ id: "", text: markup.slice(start, m.index + m[0].length) });
    } else if (m[2] === "/") {
      if (depth === 0) out.push({ id: "", text: m[0] });
    } else {
      if (depth === 0) start = m.index;
      depth++;
    }
  }
  return out.map((e) => ({ id: /\sid="([^"]*)"/.exec(e.text)?.[1] ?? "", text: e.text }));
}

/** Takes an emblem's document apart. */
export function partsOf(svg: string): Parts {
  const open = /^<svg\s[^>]*>/.exec(svg);
  const box = (open === null ? undefined : /\sviewBox="([^"]+)"/.exec(open[0])?.[1]) ?? "0 0 64 64";
  let inner = open === null ? svg : svg.slice(open[0].length, svg.lastIndexOf("</svg>"));
  inner = inner.replace(/<title>[^<]*<\/title>/, "").replace(/<style>[^<]*<\/style>/, "");
  const defs: { id: string; text: string }[] = [];
  inner = inner.replace(/<defs>([\s\S]*?)<\/defs>/g, (_, content: string) => {
    defs.push(...topLevel(content));
    return "";
  });
  return { box, defs, body: inner };
}

/** The ids a document of ours refers to: `id="x"`, `url(#x)` and `href="#x"`. */
const REFERENCE = /(\sid="|url\(#|href="#)([^")]+)/g;

/**
 * Documents put together: the definitions of all of them in one list with none twice, and every id renamed so that two different definitions never share one. With a `prefix` the ids are the prefix and a short
 * counter, so a sheet's ids cannot meet the page's own; with none an id keeps its name until a different definition wants it.
 */
export class IdSpace {
  private readonly named = new Map<string, string>();
  private readonly taken = new Set<string>();
  private readonly prefix: string;
  private count = 0;
  readonly defs: string[] = [];

  constructor(prefix = "") {
    this.prefix = prefix;
  }

  private fresh(id: string): string {
    if (this.prefix === "") {
      let candidate = id;
      while (this.taken.has(candidate)) candidate = `${id}-${(++this.count).toString(36)}`;
      return candidate;
    }
    return `${this.prefix}_${(this.count++).toString(36)}`;
  }

  /** Takes one document's parts in: its definitions join the list, and its body comes back with the ids it uses. */
  add(parts: Parts): string {
    const rename = new Map<string, string>();
    const added: string[] = [];
    for (const def of parts.defs) {
      if (def.id === "") continue;
      const key = `${def.id}\u0000${def.text}`;
      let name = this.named.get(key);
      if (name === undefined) {
        name = this.fresh(def.id);
        this.taken.add(name);
        this.named.set(key, name);
        added.push(def.text);
      }
      rename.set(def.id, name);
    }
    const apply = (text: string): string => text.replace(REFERENCE, (all, lead: string, id: string) => (rename.has(id) ? `${lead}${rename.get(id)}` : all));
    for (const text of added) this.defs.push(apply(text));
    return apply(parts.body);
  }
}

/** A document nested inside another: its box becomes the place the parent gives it. */
export function nest(box: string, body: string, x: number, y: number, width: number, height: number): string {
  const n = (v: number): string => String(Math.round(v * 100) / 100 + 0);
  return `<svg x="${n(x)}" y="${n(y)}" width="${n(width)}" height="${n(height)}" viewBox="${box}">${body}</svg>`;
}
