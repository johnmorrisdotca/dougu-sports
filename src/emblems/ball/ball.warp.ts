// A drawing carried onto a sphere. A logo (an SVG made safe by `safeImage`) is flattened into outlines, every point of every outline is put on the ball with the `map` the caller gives (a flat plane
// laid on the ball at one point), and the engine draws what comes out: the fills as panels cut at the limb, the strokes as lines that thin as they turn away. Nothing is a transform of a flat picture,
// so the print curves with the ball, is foreshortened as a mark printed on a sphere is, and goes round the limb and out of sight as the ball turns. A picture that is not a vector (a photograph) is laid
// on in small triangles, each carried by an affine map of its own: close, not exact. Imports only this folder's helpers.
import { hexOf, num, readColour } from "./ball.core.ts";
import type { Surface } from "./ball.engine.ts";
import type { SafeImage, SafeNode } from "./ball.image.ts";
import type { V3 } from "./ball.math.ts";

export type P2 = readonly [number, number];
type Mat = readonly [number, number, number, number, number, number];

/** A flat shape of a drawing: its outlines, its paint, and the width of its stroke, in the drawing's own units. */
export interface Shape {
  subs: Array<{ pts: P2[]; closed: boolean }>;
  fill: string | undefined;
  stroke: string | undefined;
  /** The stroke's width, already scaled by the transforms the shape is under. */
  width: number;
  fillOpacity: number;
  strokeOpacity: number;
  evenodd: boolean;
}

const IDENTITY: Mat = [1, 0, 0, 1, 0, 0];
const mul = (a: Mat, b: Mat): Mat => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
const at = (m: Mat, p: P2): P2 => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];

/** The matrix of a `transform` attribute (matrix, translate, scale, rotate, skewX, skewY); an unreadable part is left out. */
function transformOf(text: string | undefined): Mat {
  let m = IDENTITY;
  for (const part of (text ?? "").matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)) {
    const a = (part[2] as string).trim().split(/[\s,]+/).filter((v) => v !== "").map(Number);
    if (a.some((v) => !Number.isFinite(v))) continue;
    const n = (i: number, d = 0): number => a[i] ?? d;
    let t: Mat = IDENTITY;
    switch (part[1]) {
      case "matrix":
        if (a.length === 6) t = [n(0), n(1), n(2), n(3), n(4), n(5)];
        break;
      case "translate":
        t = [1, 0, 0, 1, n(0), n(1)];
        break;
      case "scale":
        t = [n(0, 1), 0, 0, n(1, n(0, 1)), 0, 0];
        break;
      case "rotate": {
        const r = (n(0) * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
        t = mul(mul([1, 0, 0, 1, n(1), n(2)], [c, s, -s, c, 0, 0]), [1, 0, 0, 1, -n(1), -n(2)]);
        break;
      }
      case "skewX":
        t = [1, 0, Math.tan((n(0) * Math.PI) / 180), 1, 0, 0];
        break;
      default:
        t = [1, Math.tan((n(0) * Math.PI) / 180), 0, 1, 0, 0];
    }
    m = mul(m, t);
  }
  return m;
}

const NAMED: Readonly<Record<string, string>> = { black: "#000000", white: "#ffffff", red: "#ff0000", green: "#008000", blue: "#0000ff", yellow: "#ffff00", orange: "#ffa500", gray: "#808080", grey: "#808080", navy: "#000080", maroon: "#800000", purple: "#800080", teal: "#008080", silver: "#c0c0c0", gold: "#ffd700", lime: "#00ff00", aqua: "#00ffff", fuchsia: "#ff00ff", brown: "#a52a2a", pink: "#ffc0cb" };

/** Numbers of a path or a list, in order. */
const numbers = (text: string): number[] => (text.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []).map(Number).filter(Number.isFinite);

/**
 * The outlines of a path's data, curves flattened to `steps` segments at most. M, L, H, V, C, S, Q, T, A and Z, absolute and relative. A number that is not one ends the path.
 */
export function flattenPath(d: string, steps = 10): Array<{ pts: P2[]; closed: boolean }> {
  const subs: Array<{ pts: P2[]; closed: boolean }> = [];
  const tok = /([MmLlHhVvCcSsQqTtAaZz])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/gi;
  const items: Array<string | number> = [];
  // Arc flags may be written with no space after them ("a1 1 0 00.5.5"); the tokens are read by hand where an arc is.
  let m: RegExpExecArray | null;
  let i = 0;
  const upper = (c: string): string => c.toUpperCase();
  while ((m = tok.exec(d)) !== null) {
    if (m[1] !== undefined) items.push(m[1]);
    else items.push(Number(m[2]));
    i++;
    if (i > 40000) break;
  }
  void numbers;
  let x = 0, y = 0, sx = 0, sy = 0, cmd = "";
  let cur: { pts: P2[]; closed: boolean } | undefined;
  let lastC: P2 | undefined, lastQ: P2 | undefined;
  let k = 0;
  const nextNum = (): number | undefined => {
    const v = items[k];
    if (typeof v === "number") {
      k++;
      return v;
    }
    return undefined;
  };
  const start = (px: number, py: number): void => {
    cur = { pts: [[px, py]], closed: false };
    subs.push(cur);
  };
  const line = (px: number, py: number): void => {
    if (cur === undefined) start(x, y);
    (cur as { pts: P2[] }).pts.push([px, py]);
    x = px;
    y = py;
  };
  const cubic = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void => {
    const n = Math.max(3, Math.min(steps, Math.ceil((Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2)) / 6) + 3));
    const [x0, y0] = [x, y];
    for (let j = 1; j <= n; j++) {
      const t = j / n, u = 1 - t;
      line(u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3);
    }
    lastC = [x2, y2];
  };
  while (k < items.length) {
    const it = items[k];
    if (typeof it === "string") {
      cmd = it;
      k++;
      if (upper(cmd) === "Z") {
        if (cur !== undefined) cur.closed = true;
        x = sx;
        y = sy;
        cur = undefined;
        lastC = lastQ = undefined;
        continue;
      }
    } else if (cmd === "") break;
    else if (cmd === "M") cmd = "L";
    else if (cmd === "m") cmd = "l";
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    const c = upper(cmd);
    const need = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7 }[c as "M"];
    if (need === undefined) break;
    const a: number[] = [];
    for (let j = 0; j < need; j++) {
      const v = nextNum();
      if (v === undefined) return subs;
      a.push(v);
    }
    const prevC = lastC, prevQ = lastQ;
    lastC = lastQ = undefined;
    if (c === "M") {
      x = ox + (a[0] as number);
      y = oy + (a[1] as number);
      sx = x;
      sy = y;
      start(x, y);
    } else if (c === "L") line(ox + (a[0] as number), oy + (a[1] as number));
    else if (c === "H") line(ox + (a[0] as number), y);
    else if (c === "V") line(x, oy + (a[0] as number));
    else if (c === "C") cubic(ox + (a[0] as number), oy + (a[1] as number), ox + (a[2] as number), oy + (a[3] as number), ox + (a[4] as number), oy + (a[5] as number));
    else if (c === "S") {
      const r1: P2 = prevC === undefined ? [x, y] : [2 * x - prevC[0], 2 * y - prevC[1]];
      cubic(r1[0], r1[1], ox + (a[0] as number), oy + (a[1] as number), ox + (a[2] as number), oy + (a[3] as number));
    } else if (c === "Q" || c === "T") {
      const q: P2 = c === "Q" ? [ox + (a[0] as number), oy + (a[1] as number)] : prevQ === undefined ? [x, y] : [2 * x - prevQ[0], 2 * y - prevQ[1]];
      const e: P2 = c === "Q" ? [ox + (a[2] as number), oy + (a[3] as number)] : [ox + (a[0] as number), oy + (a[1] as number)];
      cubic(x + (2 / 3) * (q[0] - x), y + (2 / 3) * (q[1] - y), e[0] + (2 / 3) * (q[0] - e[0]), e[1] + (2 / 3) * (q[1] - e[1]), e[0], e[1]);
      lastQ = q;
      lastC = undefined;
    } else if (c === "A") {
      const [rx0, ry0, rot, large, sweep] = a as [number, number, number, number, number];
      const ex = ox + (a[5] as number), ey = oy + (a[6] as number);
      arc(x, y, Math.abs(rx0), Math.abs(ry0), rot, large !== 0, sweep !== 0, ex, ey).forEach((p) => line(p[0], p[1]));
    }
  }
  return subs;
}

/** The points of an elliptical arc (the SVG endpoint form) after its start, as far as its end. */
function arc(x1: number, y1: number, rx: number, ry: number, rotDeg: number, large: boolean, sweep: boolean, x2: number, y2: number): P2[] {
  if ((x1 === x2 && y1 === y2) || rx === 0 || ry === 0) return [[x2, y2]];
  const phi = (rotDeg * Math.PI) / 180, cp = Math.cos(phi), sp = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cp * dx + sp * dy, y1p = -sp * dx + cp * dy;
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) {
    rx *= Math.sqrt(lam);
    ry *= Math.sqrt(lam);
  }
  const num2 = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const co = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, num2 / den));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cp * cxp - sp * cyp + (x1 + x2) / 2, cy = sp * cxp + cp * cyp + (y1 + y2) / 2;
  const ang = (ux: number, uy: number, vx: number, vy: number): number => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && dt > 0) dt -= 2 * Math.PI;
  if (sweep && dt < 0) dt += 2 * Math.PI;
  const n = Math.max(3, Math.ceil(Math.abs(dt) / (Math.PI / 14)));
  const out: P2[] = [];
  for (let j = 1; j <= n; j++) {
    const t = t1 + (dt * j) / n;
    out.push([cp * rx * Math.cos(t) - sp * ry * Math.sin(t) + cx, sp * rx * Math.cos(t) + cp * ry * Math.sin(t) + cy]);
  }
  out[n - 1] = [x2, y2];
  return out;
}

interface Style {
  m: Mat;
  fill: string;
  stroke: string;
  sw: number;
  fo: number;
  so: number;
  op: number;
  rule: string;
}

/**
 * The shapes of a safe drawing in order, with the paint each one ends up with. A gradient is the mean of its stops, `currentColor` is `ink`, an opacity multiplies down the groups, a clip path is not applied,
 * and what is in `defs` or a `clipPath` is not drawn. `box` is the drawing's own box, to size the curves' samples.
 */
export function shapesOf(img: SafeImage, ink: string): Shape[] {
  const grads = new Map<string, string>();
  // The mean colour of each gradient, from its stops.
  let gid: string | undefined;
  let stops: Array<[number, number, number]> = [];
  const finish = (): void => {
    if (gid !== undefined && stops.length > 0) grads.set(gid, hexOf([stops.reduce((a, c) => a + c[0], 0) / stops.length, stops.reduce((a, c) => a + c[1], 0) / stops.length, stops.reduce((a, c) => a + c[2], 0) / stops.length]));
    gid = undefined;
    stops = [];
  };
  const colourOf = (value: string | undefined): string | undefined => {
    if (value === undefined) return undefined;
    const v = value.trim();
    if (v === "" || v === "none" || v === "transparent") return undefined;
    if (v === "currentColor") return ink;
    const ref = /^url\(\s*#([^)\s]+)\s*\)/.exec(v);
    if (ref !== null) return grads.get(ref[1] as string);
    const rgb = readColour(v);
    if (rgb !== undefined) return hexOf(rgb);
    return NAMED[v.toLowerCase()];
  };
  // Gradients first, wherever they are, so that a fill may name one defined later.
  for (const n of img.nodes) {
    if (n.kind === "close" && (n.name === "linearGradient" || n.name === "radialGradient")) finish();
    else if (n.kind !== "close" && (n.name === "linearGradient" || n.name === "radialGradient")) {
      finish();
      gid = n.attrs["id"];
      if (n.kind === "self") gid = undefined;
    } else if (n.name === "stop" && gid !== undefined) {
      const c = colourOf(n.attrs["stop-color"] ?? "#000000");
      const rgb = c === undefined ? undefined : readColour(c);
      if (rgb !== undefined) stops.push([rgb[0], rgb[1], rgb[2]]);
    }
  }
  finish();
  const scale = Math.max(img.box[2], img.box[3]);
  const out: Shape[] = [];
  const stack: Style[] = [{ m: IDENTITY, fill: "#000000", stroke: "none", sw: 1, fo: 1, so: 1, op: 1, rule: "nonzero" }];
  let skip = 0;
  const num1 = (v: string | undefined, d: number): number => {
    const n = v === undefined ? NaN : parseFloat(v);
    return Number.isFinite(n) ? n : d;
  };
  const opacityOf = (v: string | undefined): number => Math.max(0, Math.min(1, num1(v, 1)));
  for (const n of img.nodes as readonly SafeNode[]) {
    if (n.kind === "close") {
      if (skip > 0 && (n.name === "defs" || n.name === "clipPath")) skip--;
      else if (skip === 0 && stack.length > 1) stack.pop();
      continue;
    }
    if (n.name === "defs" || n.name === "clipPath") {
      if (n.kind === "open") skip++;
      continue;
    }
    if (skip > 0 || n.name === "linearGradient" || n.name === "radialGradient" || n.name === "stop") {
      if (n.kind === "open" && skip === 0) stack.push(stack[stack.length - 1] as Style);
      continue;
    }
    const parent = stack[stack.length - 1] as Style;
    const a = n.attrs;
    const st: Style = {
      m: a["transform"] === undefined ? parent.m : mul(parent.m, transformOf(a["transform"])),
      fill: a["fill"] ?? parent.fill,
      stroke: a["stroke"] ?? parent.stroke,
      sw: num1(a["stroke-width"], parent.sw),
      fo: a["fill-opacity"] === undefined ? parent.fo : opacityOf(a["fill-opacity"]),
      so: a["stroke-opacity"] === undefined ? parent.so : opacityOf(a["stroke-opacity"]),
      op: parent.op * opacityOf(a["opacity"]),
      rule: a["fill-rule"] ?? parent.rule,
    };
    if (n.name === "g") {
      if (n.kind === "open") stack.push(st);
      continue;
    }
    let subs: Array<{ pts: P2[]; closed: boolean }> = [];
    const f = (k: string, d = 0): number => num1(a[k], d);
    const ring = (cx: number, cy: number, rx: number, ry: number): P2[] => Array.from({ length: 48 }, (_, i) => [cx + rx * Math.cos((i * Math.PI) / 24), cy + ry * Math.sin((i * Math.PI) / 24)] as P2);
    switch (n.name) {
      case "path":
        subs = flattenPath(a["d"] ?? "", Math.max(4, Math.min(14, Math.round(scale / 8))));
        break;
      case "rect": {
        const x = f("x"), y = f("y"), w = f("width"), h = f("height");
        if (w > 0 && h > 0) subs = [{ pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], closed: true }];
        break;
      }
      case "circle":
        if (f("r") > 0) subs = [{ pts: ring(f("cx"), f("cy"), f("r"), f("r")), closed: true }];
        break;
      case "ellipse":
        if (f("rx") > 0 && f("ry") > 0) subs = [{ pts: ring(f("cx"), f("cy"), f("rx"), f("ry")), closed: true }];
        break;
      case "line":
        subs = [{ pts: [[f("x1"), f("y1")], [f("x2"), f("y2")]], closed: false }];
        break;
      case "polyline":
      case "polygon": {
        const v = numbers(a["points"] ?? "");
        const pts: P2[] = [];
        for (let i = 0; i + 1 < v.length; i += 2) pts.push([v[i] as number, v[i + 1] as number]);
        if (pts.length > 1) subs = [{ pts, closed: n.name === "polygon" }];
        break;
      }
      default:
        break;
    }
    if (n.kind === "open") stack.push(st);
    if (subs.length === 0) continue;
    const det = Math.sqrt(Math.abs(st.m[0] * st.m[3] - st.m[1] * st.m[2]));
    out.push({
      subs: subs.map((s) => ({ pts: s.pts.map((p) => at(st.m, p)), closed: s.closed })),
      fill: colourOf(st.fill),
      stroke: colourOf(st.stroke),
      width: st.sw * det,
      fillOpacity: st.fo * st.op,
      strokeOpacity: st.so * st.op,
      evenodd: st.rule === "evenodd",
    });
  }
  return out;
}

/** A polyline with points added so that no segment is longer than `step`. */
export function densify(pts: readonly P2[], step: number, closed: boolean): P2[] {
  const out: P2[] = [];
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) {
    const a = pts[i] as P2, b = pts[(i + 1) % pts.length] as P2;
    const k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let j = 0; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k]);
  }
  if (!closed) out.push(pts[pts.length - 1] as P2);
  return out;
}

/** What puts a flat point of the drawing on the ball: plane coordinates (y down) to a point of the sphere. */
export type PlaneMap = (x: number, y: number) => V3;

/**
 * Shapes drawn on the ball. The drawing's box is fitted into a square of side `size` (radians, in the plane the `map` lays on the ball) and centred; `cap` is the longest segment kept before points are added
 * (radians), so a straight edge curves with the sphere.
 */
export function drawShapes(s: Surface, shapes: readonly Shape[], box: readonly [number, number, number, number], map: PlaneMap, size: number, o?: { opacity?: number; colour?: string }): string {
  const k = size / Math.max(box[2], box[3]);
  const cx = box[0] + box[2] / 2, cy = box[1] + box[3] / 2;
  const to = (p: P2): P2 => [(p[0] - cx) * k, (p[1] - cy) * k];
  const step = 0.07;
  let out = "";
  for (const sh of shapes) {
    const fill = o?.colour ?? sh.fill;
    const stroke = o?.colour ?? sh.stroke;
    const op = o?.opacity ?? 1;
    if (fill !== undefined && sh.fillOpacity > 0) {
      const rings = sh.subs.filter((q) => q.pts.length > 2).map((q) => densify(q.pts.map(to), step, true).map((p) => map(p[0], p[1])));
      if (rings.length > 0) out += s.panels(rings, fill, { n: 1, ink: true, opacity: sh.fillOpacity * op === 1 ? undefined : Math.round(sh.fillOpacity * op * 100) / 100, rule: sh.evenodd ? "evenodd" : undefined });
    }
    if (stroke !== undefined && sh.strokeOpacity > 0 && sh.width > 0) {
      for (const closed of [true, false]) {
        const curves = sh.subs.filter((q) => q.closed === closed && q.pts.length > 1).map((q) => densify(q.pts.map(to), step, closed).map((p) => map(p[0], p[1])));
        if (curves.length > 0) out += s.strokes(curves, stroke, sh.width * k * s.radius, { closed, digits: 2, opacity: sh.strokeOpacity * op === 1 ? undefined : Math.round(sh.strokeOpacity * op * 100) / 100 });
      }
    }
  }
  return out;
}

/**
 * A picture that is not a vector, laid on the ball in triangles. The picture is fitted into a square of side `size` radians; `href` is a data URI that was checked by the caller. Each triangle of a grid of
 * `n` by `n` cells is the picture's piece carried by the one affine map that fits its three corners, clipped to the triangle (grown a little so that no seam shows); a triangle with a corner out of
 * sight is left out. Returns the markup, with the picture in a definition of its own.
 */
export function drawPicture(s: Surface, href: string, map: PlaneMap, size: number, id: string, n = 6): string {
  const grid: Array<[number, number, number, number, number]> = [];
  for (let iy = 0; iy <= n; iy++) {
    for (let ix = 0; ix <= n; ix++) {
      const u = map((ix / n - 0.5) * size, (iy / n - 0.5) * size);
      const p = s.project(u);
      grid.push([p[0], p[1], p[2], (ix / n) * 100, (iy / n) * 100]);
    }
  }
  const at2 = (ix: number, iy: number): [number, number, number, number, number] => grid[iy * (n + 1) + ix] as [number, number, number, number, number];
  let defs = `<image id="${id}i" width="100" height="100" href="${href}"/>`;
  let body = "";
  let count = 0;
  const tri = (a: ReturnType<typeof at2>, b: ReturnType<typeof at2>, c: ReturnType<typeof at2>): void => {
    if (a[2] < 0.04 || b[2] < 0.04 || c[2] < 0.04) return;
    // The affine map from picture (u, v) to the screen, from the three corners.
    const det = (b[3] - a[3]) * (c[4] - a[4]) - (c[3] - a[3]) * (b[4] - a[4]);
    if (Math.abs(det) < 1e-9) return;
    const m = (p0: number, p1: number, p2: number): [number, number, number] => {
      const ma = ((p1 - p0) * (c[4] - a[4]) - (p2 - p0) * (b[4] - a[4])) / det;
      const mb = ((p2 - p0) * (b[3] - a[3]) - (p1 - p0) * (c[3] - a[3])) / det;
      return [ma, mb, p0 - ma * a[3] - mb * a[4]];
    };
    const [m0, m2, m4] = m(a[0], b[0], c[0]);
    const [m1, m3, m5] = m(a[1], b[1], c[1]);
    const gx = (a[0] + b[0] + c[0]) / 3, gy = (a[1] + b[1] + c[1]) / 3;
    const grow = (p: ReturnType<typeof at2>): string => {
      const dx = p[0] - gx, dy = p[1] - gy, l = Math.hypot(dx, dy) || 1;
      return `${num(p[0] + (dx / l) * 0.3, 2)} ${num(p[1] + (dy / l) * 0.3, 2)}`;
    };
    const cid = `${id}t${count++}`;
    defs += `<clipPath id="${cid}"><path d="M${grow(a)}L${grow(b)}L${grow(c)}Z"/></clipPath>`;
    body += `<g clip-path="url(#${cid})"><use href="#${id}i" transform="matrix(${num(m0, 4)} ${num(m1, 4)} ${num(m2, 4)} ${num(m3, 4)} ${num(m4, 2)} ${num(m5, 2)})"/></g>`;
  };
  for (let iy = 0; iy < n; iy++) {
    for (let ix = 0; ix < n; ix++) {
      tri(at2(ix, iy), at2(ix + 1, iy), at2(ix, iy + 1));
      tri(at2(ix + 1, iy), at2(ix + 1, iy + 1), at2(ix, iy + 1));
    }
  }
  return body === "" ? "" : `<defs>${defs}</defs>${body}`;
}
