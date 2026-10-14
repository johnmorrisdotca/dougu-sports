// A small SVG minifier for the artwork the gear is copied from: it drops the editor's wrappers and metadata, writes every path in absolute coordinates at a precision that suits the artwork's size
// (so rounding cannot drift), and renames the ids that gradients are referred to by. It is a modification of the copied files, and each module it writes says so.
import { createHash } from "node:crypto";

const NUMBER = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/y;

/** The commands of a path, each with its numbers. Arc flags may run into the number after them ("a1 1 0 01 1 1"). */
export function parsePath(d) {
  const out = [];
  let i = 0;
  const skip = () => {
    while (i < d.length && /[\s,]/.test(d[i])) i++;
  };
  const number = () => {
    skip();
    NUMBER.lastIndex = i;
    const m = NUMBER.exec(d);
    if (m === null) throw new Error(`bad path near ${d.slice(i, i + 20)}`);
    i = NUMBER.lastIndex;
    return Number(m[0]);
  };
  const flag = () => {
    skip();
    const c = d[i++];
    if (c !== "0" && c !== "1") throw new Error("bad arc flag");
    return Number(c);
  };
  const ARITY = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  let cmd = "";
  while (true) {
    skip();
    if (i >= d.length) break;
    if (/[a-zA-Z]/.test(d[i])) cmd = d[i++];
    else if (cmd === "") throw new Error("path has no command");
    const up = cmd.toUpperCase();
    if (up === "Z") {
      out.push({ cmd: "Z", args: [] });
      continue;
    }
    const args = [];
    for (let k = 0; k < ARITY[up]; k++) args.push(up === "A" && (k === 3 || k === 4) ? flag() : number());
    out.push({ cmd, args });
    if (cmd === "M") cmd = "L";
    else if (cmd === "m") cmd = "l";
  }
  return out;
}

/** The path in absolute coordinates, rounded to `p` decimals. */
export function absolutize(d, p) {
  const f = (n) => {
    const t = (Math.round(n * 10 ** p) / 10 ** p).toString();
    return t === "-0" ? "0" : t;
  };
  let x = 0, y = 0, sx = 0, sy = 0;
  let lastC = null;
  let lastQ = null;
  const out = [];
  for (const { cmd, args: a } of parsePath(d)) {
    const rel = cmd !== cmd.toUpperCase();
    const up = cmd.toUpperCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    let nextC = null, nextQ = null;
    switch (up) {
      case "M":
        x = ox + a[0]; y = oy + a[1]; sx = x; sy = y;
        out.push(`M${f(x)} ${f(y)}`);
        break;
      case "L":
        x = ox + a[0]; y = oy + a[1];
        out.push(`L${f(x)} ${f(y)}`);
        break;
      case "H":
        x = ox + a[0];
        out.push(`H${f(x)}`);
        break;
      case "V":
        y = oy + a[0];
        out.push(`V${f(y)}`);
        break;
      case "C": {
        const c1 = [ox + a[0], oy + a[1]], c2 = [ox + a[2], oy + a[3]];
        x = ox + a[4]; y = oy + a[5];
        out.push(`C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(x)} ${f(y)}`);
        nextC = c2;
        break;
      }
      case "S": {
        const c1 = lastC === null ? [x, y] : [2 * x - lastC[0], 2 * y - lastC[1]];
        const c2 = [ox + a[0], oy + a[1]];
        x = ox + a[2]; y = oy + a[3];
        out.push(`C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(x)} ${f(y)}`);
        nextC = c2;
        break;
      }
      case "Q": {
        const c = [ox + a[0], oy + a[1]];
        x = ox + a[2]; y = oy + a[3];
        out.push(`Q${f(c[0])} ${f(c[1])} ${f(x)} ${f(y)}`);
        nextQ = c;
        break;
      }
      case "T": {
        const c = lastQ === null ? [x, y] : [2 * x - lastQ[0], 2 * y - lastQ[1]];
        x = ox + a[0]; y = oy + a[1];
        out.push(`Q${f(c[0])} ${f(c[1])} ${f(x)} ${f(y)}`);
        nextQ = c;
        break;
      }
      case "A":
        x = ox + a[5]; y = oy + a[6];
        out.push(`A${f(a[0])} ${f(a[1])} ${f(a[2])} ${a[3]} ${a[4]} ${f(x)} ${f(y)}`);
        break;
      case "Z":
        x = sx; y = sy;
        out.push("Z");
        break;
    }
    lastC = nextC;
    lastQ = nextQ;
  }
  return out.join("");
}

const roundList = (text, p) =>
  text
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((n) => (Math.round(Number(n) * 10 ** p) / 10 ** p).toString())
    .join(" ");

/** The decimals that suit a box of this size. */
export const precisionFor = (size) => (size > 500 ? 0 : size > 30 ? 1 : 2);

/** The inner markup of an SVG file, minified. Returns the box and the markup. */
export function minify(source, keyPrefix) {
  let s = source;
  const box = /viewBox="([^"]+)"/.exec(s)?.[1];
  if (box === undefined) throw new Error("no viewBox");
  const size = Math.max(...box.split(/\s+/).slice(2).map(Number));
  const p = precisionFor(size);
  // Wrappers and metadata.
  s = s.replace(/<\?xml[\s\S]*?\?>/g, "").replace(/<!DOCTYPE[\s\S]*?\]>/g, "").replace(/<!DOCTYPE[^>]*>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<metadata[\s\S]*?<\/metadata>/g, "").replace(/<title[\s\S]*?<\/title>/g, "").replace(/<sodipodi:namedview[\s\S]*?(?:\/>|<\/sodipodi:namedview>)/g, "");
  s = s.replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, "").replace(/<\/?switch>/g, "");
  s = s.replace(/<i:[a-zA-Z]+[^>]*\/>/g, "").replace(/<i:([a-zA-Z]+)[\s\S]*?<\/i:\1>/g, "");
  // Root element.
  const open = /<svg\b[^>]*>/.exec(s);
  if (open === null) throw new Error("no <svg>");
  s = s.slice(open.index + open[0].length).replace(/<\/svg>\s*$/, "");
  // Attributes the viewer does not need.
  s = s.replace(/\s(?:inkscape|sodipodi|i|ns\d*|rdf|dc|cc|xmlns|xml)(?::[\w-]+)?="[^"]*"/g, "").replace(/\sxlink:href=/g, " href=").replace(/\s(?:enable-background|x|y|version)="[^"]*"(?=[^>]*>)/g, (m, off, str) => (/^<(?:rect|image|use|svg)\b/.test(str.slice(str.lastIndexOf("<", off))) ? m : ""));
  // Style declarations as attributes (shorter, and easier to recolour).
  const ATTRS = new Set(["fill", "stroke", "stroke-width", "opacity", "fill-opacity", "stroke-opacity", "stop-color", "stop-opacity", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit"]);
  s = s.replace(/\sstyle="([^"]*)"/g, (_m, css) => {
    const attrs = [];
    const rest = [];
    for (const decl of css.split(";")) {
      const [name, ...value] = decl.split(":");
      if (name === undefined || name.trim() === "") continue;
      const prop = name.trim();
      const v = value.join(":").trim();
      if (ATTRS.has(prop)) attrs.push(` ${prop}="${v}"`);
      else rest.push(`${prop}:${v}`);
    }
    return attrs.join("") + (rest.length === 0 ? "" : ` style="${rest.join(";")}"`);
  });
  // Numbers.
  s = s.replace(/\sd="([^"]*)"/g, (_m, d) => ` d="${absolutize(d, p)}"`);
  s = s.replace(/\spoints="([^"]*)"/g, (_m, pts) => ` points="${roundList(pts, p)}"`);
  s = s.replace(/\s(cx|cy|r|rx|ry|x1|y1|x2|y2|fx|fy)="(-?[\d.]+)"/g, (_m, a, n) => ` ${a}="${Math.round(Number(n) * 10 ** (p + 1)) / 10 ** (p + 1)}"`);
  s = s.replace(/\stransform="matrix\(([^)]*)\)"/g, (_m, t) => ` transform="matrix(${roundList(t, 4)})"`).replace(/\sgradientTransform="matrix\(([^)]*)\)"/g, (_m, t) => ` gradientTransform="matrix(${roundList(t, 5)})"`);
  s = s.replace(/\soffset="(-?[\d.]+)"/g, (_m, n) => ` offset="${Math.round(Number(n) * 100) / 100}"`);
  // Ids: only the ones that are referred to are kept, renamed.
  const ids = [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const used = ids.filter((id) => s.includes(`#${id}`));
  const map = new Map(used.map((id, i) => [id, `${keyPrefix}${i}`]));
  s = s.replace(/\sid="([^"]+)"/g, (_m, id) => (map.has(id) ? ` id="${map.get(id)}"` : ""));
  for (const [from, to] of map) s = s.split(`#${from})`).join(`#${to})`).split(`"#${from}"`).join(`"#${to}"`);
  // Whitespace.
  s = s.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").replace(/\s+\/>/g, "/>").replace(/\s+>/g, ">").trim();
  if (/<script|<image|<foreignObject|href="https?:/i.test(s)) throw new Error("the artwork has script, an image or an outside reference");
  return { box, markup: s };
}

/** A short id prefix from a key. */
export const prefixOf = (key) => `a${createHash("sha1").update(key).digest("hex").slice(0, 4)}`;

/** The path data of a one-path icon (an MDI icon, a Pinhead icon). */
export function iconPath(source, skip = []) {
  const box = /viewBox="([^"]+)"/.exec(source)?.[1];
  if (box === undefined) throw new Error("no viewBox");
  const size = Math.max(...box.split(/\s+/).slice(2).map(Number));
  const ds = [...source.matchAll(/<path\b[^>]*?\sd="([^"]*)"/g)].map((m) => m[1]).filter((d) => !skip.includes(d));
  if (ds.length === 0) throw new Error("no path");
  return { box, d: ds.map((d) => absolutize(d, precisionFor(size))).join("") };
}
