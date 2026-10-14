// The coin-flip turn for any flat drawing: it takes a finished document and returns it turned. The face is squeezed by the cosine of the yaw and shows its back past a quarter turn, and the rim
// (the thickness of the sheet) shows as a dark edge on the side that is turning away, widest when the drawing is edge on. A piece with no drawing of its own for the back (a bat, a racket, a pictogram)
// shows its front mirrored and a little darker, as the other side of a cut-out; a jersey or a pennant passes the drawing of its back. A pure function of strings and numbers; it imports nothing.

/** What a turn needs. `line` is the line style (the rim is drawn in the page's ink), `back` is the document of the back view, and `thick` is the thickness as a fraction of the width. */
export interface FlipOptions {
  yaw: number;
  pitch: number;
  line?: boolean;
  back?: string;
  thick?: number;
}

const RAD = Math.PI / 180;
const n2 = (value: number): string => String(Math.round(value * 100) / 100 + 0);

/** The parts of a document of SVG: its opening tag, its titles, and the rest. */
function split(svg: string): { open: string; head: string; rest: string; box: readonly [number, number, number, number] } {
  const open = /^<svg[^>]*>/.exec(svg)?.[0] ?? "";
  const after = svg.slice(open.length, svg.length - "</svg>".length);
  const head = /^<title>[\s\S]*?<\/title>(?:<desc>[\s\S]*?<\/desc>)?/.exec(after)?.[0] ?? "";
  const box = (/viewBox="([^"]*)"/.exec(open)?.[1] ?? "0 0 64 64").split(/\s+/).map(Number);
  return { open, head, rest: after.slice(head.length), box: [box[0] ?? 0, box[1] ?? 0, box[2] || 64, box[3] || 64] };
}

/** A document turned by `yaw` and `pitch` degrees from its still drawing. With no turn it is the document itself. */
export function flipSvg(svg: string, o: FlipOptions): string {
  if (o.yaw === 0 && o.pitch === 0) return svg;
  const across = Math.cos(o.yaw * RAD);
  const tilt = Math.cos(o.pitch * RAD);
  const front = split(svg);
  const showBack = across < 0;
  const own = showBack && o.back !== undefined ? split(o.back) : undefined;
  const face = own ?? front;
  const [x0, y0, w, h] = front.box;
  const sx = Math.max(Math.abs(across), 0.02);
  const sy = Math.max(Math.abs(tilt), 0.02);
  const thick = w * (o.thick ?? 0.035);
  const dx = thick * Math.sin(o.yaw * RAD);
  const dy = -thick * Math.sin(o.pitch * RAD) * 0.6;
  const mirror = showBack && own === undefined;
  const cx = x0 + w / 2;
  const cy = y0 + h / 2;
  // The turned face, then the filter that adds the rim behind it (and dims a mirrored back).
  const id = `dgf${o.line === true ? "l" : "c"}${mirror ? "b" : "f"}${Math.round(dx * 100)}_${Math.round(dy * 100)}`;
  const flood = o.line === true ? '<feFlood flood-color="currentColor" flood-opacity=".5"/>' : '<feFlood flood-color="#000" flood-opacity=".42"/>';
  const steps = [1, 2, 3].map((k) => (Math.abs(dx) + Math.abs(dy) < 0.05 ? "" : `<feOffset in="s" dx="${n2((dx * k) / 3)}" dy="${n2((dy * k) / 3)}" result="o${k}"/>`)).join("");
  const nodes = Math.abs(dx) + Math.abs(dy) < 0.05 ? "" : '<feMergeNode in="o3"/><feMergeNode in="o2"/><feMergeNode in="o1"/>';
  const dim = mirror && o.line !== true ? '<feColorMatrix in="SourceGraphic" values=".8 0 0 0 0 0 .8 0 0 0 0 0 .8 0 0 0 0 0 1 0" result="d"/>' : "";
  const filter =
    `<filter id="${id}" x="${n2(x0 - w * 0.15)}" y="${n2(y0 - h * 0.15)}" width="${n2(w * 1.3)}" height="${n2(h * 1.3)}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">` +
    `${flood}<feComposite in2="SourceAlpha" operator="in" result="s"/>${steps}${dim}<feMerge>${nodes}<feMergeNode in="${dim === "" ? "SourceGraphic" : "d"}"/></feMerge></filter>`;
  const flip = mirror ? -1 : 1;
  const group = `<g filter="url(#${id})"><g transform="translate(${n2(cx)} ${n2(cy)}) scale(${n2(sx * flip)} ${n2(sy)}) translate(${n2(-cx)} ${n2(-cy)})">${face.rest}</g></g>`;
  return `${front.open}${front.head}<defs>${filter}</defs>${group}</svg>`;
}
