// An SVG that comes from outside, made safe to put inside a drawing: a strict allow-list, never a deny-list. The text is taken apart into tags; only the shapes, groups, gradients and clip paths survive, with only
// the attributes a drawing needs and values that cannot carry a script, an address or an entity. Everything else (script, style, text, image, use, foreignObject, filters, links, event handlers, `style`) is dropped
// with whatever it holds. Ids are renamed under a prefix so two drawings in a page cannot reach each other's gradients. Imports only the core's escape.
import { escape } from "./ball.core.ts";

/** A drawing made safe: the box of its coordinates and the markup of what it holds. */
export interface SafeImage {
  /** x, y, width and height of the drawing's own coordinates (its viewBox). */
  box: readonly [number, number, number, number];
  markup: string;
  /** The same drawing as a list of elements in order, with the attributes that survived (ids already renamed), for a caller that draws it its own way (`ball.warp.ts` wraps it onto a sphere). */
  nodes: readonly SafeNode[];
}

/** One element of a safe drawing: opened (`open`), closed (`close`) or both at once (`self`), with its safe attributes. */
export interface SafeNode {
  kind: "open" | "close" | "self";
  name: string;
  attrs: Readonly<Record<string, string>>;
}

const SHAPES = new Set(["g", "defs", "path", "circle", "ellipse", "rect", "line", "polyline", "polygon", "linearGradient", "radialGradient", "stop", "clipPath"]);
const ATTRS = new Set([
  "id", "d", "cx", "cy", "r", "rx", "ry", "x", "y", "x1", "y1", "x2", "y2", "fx", "fy", "width", "height", "points", "transform", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit",
  "stroke-dasharray", "stroke-dashoffset", "fill-opacity", "stroke-opacity", "opacity", "fill-rule", "clip-rule", "clip-path", "offset", "stop-color", "stop-opacity", "gradientUnits", "gradientTransform",
  "spreadMethod", "clipPathUnits",
]);
/** The attributes that may hold `url(#id)`. */
const REFS = new Set(["fill", "stroke", "clip-path"]);
/** A value is letters, digits and the few marks that colours, numbers, lists and transforms use: no colon (so no address), no `&` (so no entity), no quote, no angle bracket, no backslash. */
const VALUE = /^[A-Za-z0-9#%.,()\s+\-/_]*$/;
const MAX_LENGTH = 60000;
const MAX_NODES = 2000;

/** One attribute's value made safe, with its ids renamed, or `undefined` to drop it. */
function safeValue(name: string, raw: string, prefix: string): string | undefined {
  const value = raw.trim();
  if (value.length > 20000) return undefined;
  if (value.includes("url(")) {
    if (!REFS.has(name)) return undefined;
    const m = /^url\(\s*#([A-Za-z_][\w.-]*)\s*\)(\s+[a-z]+)?$/.exec(value);
    return m === null ? undefined : `url(#${prefix}${m[1] as string})${m[2] ?? ""}`;
  }
  if (name === "id") return /^[A-Za-z_][\w.-]*$/.test(value) ? `${prefix}${value}` : undefined;
  return VALUE.test(value) ? value : undefined;
}

/** The declarations of a `style` attribute as name and value pairs (the ones an attribute of the same name may carry are kept by the caller). */
function styleAttrs(style: string): [string, string][] {
  const out: [string, string][] = [];
  for (const part of style.split(";")) {
    const at = part.indexOf(":");
    if (at > 0) out.push([part.slice(0, at).trim().toLowerCase(), part.slice(at + 1).trim()]);
  }
  return out;
}

/** The box of the root's attributes: its viewBox's four numbers, else its width and height, else 100 by 100. */
function boxOf(attrs: Record<string, string>): readonly [number, number, number, number] {
  const vb = (attrs["viewBox"] ?? "").trim().split(/[\s,]+/).map(Number);
  if (vb.length === 4 && vb.every(Number.isFinite) && (vb[2] as number) > 0 && (vb[3] as number) > 0) return [vb[0] as number, vb[1] as number, vb[2] as number, vb[3] as number];
  const w = parseFloat(attrs["width"] ?? ""), h = parseFloat(attrs["height"] ?? "");
  return Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0 ? [0, 0, w, h] : [0, 0, 100, 100];
}

/** The markup of an SVG made safe, or `undefined` when there is none to be had: not text, too long, no `<svg>` root, nothing drawable left. `prefix` is put in front of every id and every reference to one. */
export function safeImage(source: unknown, prefix: string): SafeImage | undefined {
  if (typeof source !== "string" || source.length === 0 || source.length > MAX_LENGTH) return undefined;
  const cleaned = source.replace(/<!--[\s\S]*?-->/g, "").replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "").replace(/<\?[\s\S]*?\?>/g, "").replace(/<![^>]*>/g, "");
  const tag = /<(\/?)([A-Za-z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;
  let out = "";
  const list: SafeNode[] = [];
  let nodes = 0;
  let root: Record<string, string> | undefined;
  // The depth inside an element being dropped (0 when none is).
  let dropping = 0;
  // The elements written and still open, `#root` for the svg itself.
  const open: string[] = [];
  for (let m = tag.exec(cleaned); m !== null; m = tag.exec(cleaned)) {
    const closing = m[1] === "/";
    const name = m[2] as string;
    const selfClosed = m[4] === "/";
    if (dropping > 0) {
      if (closing) dropping--;
      else if (!selfClosed) dropping++;
      continue;
    }
    if (closing) {
      const top = open.pop();
      if (top !== undefined && top !== "#root") {
        out += `</${top}>`;
        list.push({ kind: "close", name: top, attrs: {} });
      }
      continue;
    }
    const attrs: Record<string, string> = {};
    for (const a of (m[3] as string).matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[a[1] as string] = (a[2] ?? a[3]) as string;
    if (root === undefined) {
      if (name !== "svg" || selfClosed) return undefined;
      root = attrs;
      open.push("#root");
      continue;
    }
    if (!SHAPES.has(name)) {
      if (!selfClosed) dropping = 1;
      continue;
    }
    if (++nodes > MAX_NODES) return undefined;
    const pairs: [string, string][] = Object.entries(attrs);
    if (attrs["style"] !== undefined) pairs.push(...styleAttrs(attrs["style"]));
    let written = "";
    const kept: Record<string, string> = {};
    const seen = new Set<string>();
    for (const [key, raw] of pairs) {
      if (!ATTRS.has(key) || seen.has(key)) continue;
      const v = safeValue(key, raw, prefix);
      if (v === undefined) continue;
      seen.add(key);
      kept[key] = v;
      written += ` ${key}="${escape(v)}"`;
    }
    list.push({ kind: selfClosed ? "self" : "open", name, attrs: kept });
    out += `<${name}${written}${selfClosed ? "/>" : ">"}`;
    if (!selfClosed) open.push(name);
  }
  if (root === undefined || !/<(path|circle|ellipse|rect|line|polyline|polygon)\b/.test(out)) return undefined;
  // Close what the text left open, so the markup is always balanced.
  for (let top = open.pop(); top !== undefined; top = open.pop()) {
    if (top === "#root") continue;
    out += `</${top}>`;
    list.push({ kind: "close", name: top, attrs: {} });
  }
  return { box: boxOf(root), markup: out, nodes: list };
}
