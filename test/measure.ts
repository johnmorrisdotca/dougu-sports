// Measures a ball or an implement from the drawing itself. The piece is turned to its straight view (the default view undone, so a puck is edge-on and a rugby ball lies across the page) and drawn in a
// 100 by 100 box; the box units are turned into millimetres the way `lineup` does it, 92 box units to `extentMm`. What is read is the drawn geometry (the clip outline of a ball, the side faces of a puck
// or a stone, the blades of a shuttlecock), never the constants the piece was made from.
import type { Piece, PieceSize } from "../src/emblems/ball/ball.core.ts";

export interface Measured {
  /** The middle of the drawing in the 100 by 100 box. */
  centre: Pt;
  /** Across the page, in millimetres. */
  widthMm: number;
  /** Up the page, in millimetres. */
  heightMm: number;
  /** The length of the outline, in millimetres, for a pointed ball (its silhouette is a polygon). */
  outlineMm?: number;
}

type Pt = readonly [number, number];
const numbers = (text: string): number[] => (text.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);
/** The extent of some points and the middle of them, in box units. */
interface Box {
  w: number;
  h: number;
  cx: number;
  cy: number;
  outline?: number;
}
const bbox = (pts: readonly Pt[]): Box => {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return { w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
};

/** The points of a path made of M and L only. */
const polygon = (d: string): Pt[] => {
  const n = numbers(d);
  const out: Pt[] = [];
  for (let i = 0; i + 1 < n.length; i += 2) out.push([n[i], n[i + 1]]);
  return out;
};

/** The half-extents of the ellipse a path of two arcs draws: `M x y A rx ry deg 1 0 x2 y2 A ...`. */
const ellipse = (d: string): Box => {
  const m = /^M(-?[\d.]+) (-?[\d.]+)A(-?[\d.]+) (-?[\d.]+) (-?[\d.]+) 1 0 (-?[\d.]+) (-?[\d.]+)A/.exec(d);
  if (m === null) throw new Error(`not an ellipse: ${d.slice(0, 80)}`);
  const [rx, ry, deg] = [Number(m[3]), Number(m[4]), (Number(m[5]) * Math.PI) / 180];
  // The perimeter is Ramanujan's, the arcs being an ellipse.
  const outline = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  return { outline, w: 2 * Math.hypot(rx * Math.cos(deg), ry * Math.sin(deg)), h: 2 * Math.hypot(rx * Math.sin(deg), ry * Math.cos(deg)), cx: (Number(m[1]) + Number(m[6])) / 2, cy: (Number(m[2]) + Number(m[7])) / 2 };
};

/** The size of a ball in box units, from the shape its drawing is clipped to: a circle, an ellipse or the hull of a pointed ball. */
function silhouette(svg: string): Box {
  const clip = /<clipPath id="[^"]+">(.*?)<\/clipPath>/s.exec(svg)?.[1];
  if (clip === undefined) throw new Error("no clip outline");
  const circle = /<circle[^>]* r="([\d.]+)"/.exec(clip);
  if (circle !== null) return { w: 2 * Number(circle[1]), h: 2 * Number(circle[1]), cx: Number(/ cx="([\d.]+)"/.exec(clip)?.[1]), cy: Number(/ cy="([\d.]+)"/.exec(clip)?.[1]) };
  const use = /<use href="#([^"]+)"/.exec(clip)?.[1];
  const d = use === undefined ? /<path d="([^"]+)"/.exec(clip)?.[1] : new RegExp(`<path id="${use}" d="([^"]+)"`).exec(svg)?.[1];
  if (d === undefined) throw new Error("no outline path");
  if (d.includes("A")) return ellipse(d);
  const pts = polygon(d);
  let outline = 0;
  for (let i = 0; i < pts.length; i++) outline += Math.hypot(pts[i][0] - pts[(i + 1) % pts.length][0], pts[i][1] - pts[(i + 1) % pts.length][1]);
  return { ...bbox(pts), outline };
}

/** The size of a puck or a stone, from the corners of the side faces (the stack's slices, the curve at the foot of the wall left out: it is flat at the edge-on view; the caps are flat at an edge-on view and the handle is not part of the stone's height). */
function stack(svg: string): Box {
  const sides = [...svg.matchAll(/<path d="(M[^"]+Z)" fill="url\(#[^)]*s\d+\)"\/>/g)].map((m) => [...m[1].matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((q): Pt => [Number(q[1]), Number(q[2])]));
  if (sides.length === 0) throw new Error("no side faces");
  return bbox(sides.flat());
}

/** The size of a shuttlecock from the outlines of its feathers. */
function blades(svg: string): Box {
  const paths = [...svg.matchAll(/<path d="(M[^"]+Z)"/g)].map((m) => polygon(m[1]));
  if (paths.length < 16) throw new Error(`only ${paths.length} feathers`);
  return bbox(paths.flat());
}

interface Straight {
  yaw: number;
  pitch: number;
  roll: number;
}

/** Draws a piece with its default view undone and reads its size in millimetres. */
export function measure(piece: Piece): Measured {
  const model = piece.model as { view: Straight; slices?: number; feathers?: number };
  const size = piece.size as PieceSize;
  const svg = piece.frame({ size: 100, yaw: -model.view.yaw, pitch: -model.view.pitch, roll: -model.view.roll });
  const box = model.slices !== undefined ? stack(svg) : model.feathers !== undefined ? blades(svg) : silhouette(svg);
  const mm = size.extentMm / 92;
  return { centre: [box.cx, box.cy], widthMm: box.w * mm, heightMm: box.h * mm, ...(box.outline === undefined ? {} : { outlineMm: box.outline * mm }) };
}

/** What the rulebook says the straight view measures: the width, the height, and for a pointed ball the long way round. */
export function expected(size: PieceSize): { widthMm: number; heightMm: number; outlineMm?: number } {
  if (size.lengthMm !== undefined && size.diameterMm !== undefined) return { widthMm: size.diameterMm, heightMm: size.lengthMm };
  if (size.lengthMm !== undefined) return { widthMm: size.lengthMm, heightMm: (size.circumferenceMm ?? NaN) / Math.PI, ...(size.longCircumferenceMm === undefined ? {} : { outlineMm: size.longCircumferenceMm }) };
  const d = size.diameterMm ?? NaN;
  return { widthMm: d, heightMm: size.thicknessMm ?? d };
}
