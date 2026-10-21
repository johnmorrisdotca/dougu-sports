// The coin-flip turn for any flat drawing: it takes a finished document and returns it turned. The face is squeezed by the cosine of the yaw and shows its back past a quarter turn, and the rim
// (the thickness of the sheet) shows as a dark edge on the side that is turning away, widest when the drawing is edge on. A piece with no drawing of its own for the back (a bat, a racket, a pictogram)
// shows its front mirrored and a little darker, as the other side of a cut-out; a pennant passes the drawing of its back. A pure function of strings and numbers; it imports nothing.

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

/** The slices an edge is built from: each is the silhouette moved a little further along the thickness, so that together they are a solid band. */
const SLICES = 8;
/** The least thickness of the edge on the screen, in pixels, so that a piece edge on never thins to a hairline however small it is drawn. */
const LEAST_PX = 2.4;

/**
 * A document turned by `yaw` and `pitch` degrees from its still drawing. With no turn it is the document itself.
 * The piece is a slab: its face is squeezed by the cosine of the turn, and between the face and its other side runs a solid edge (the thickness) that stays the same width on the screen while the face
 * narrows, so that edge on it is a band and never a hairline. The edge is the face's own colours darkened, and a thin part (a stick, a strap) keeps its edge because the squeezed face is made opaque again before it is moved.
 */
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
  const pixels = Number(/\swidth="([\d.]+)"/.exec(front.open)?.[1]) || 64;
  const thick = Math.min(Math.max(w * (o.thick ?? 0.035), (LEAST_PX * w) / pixels), w * 0.1);
  // The edge runs from the face toward the far side. For a face that looks to the eye it is behind it (a positive yaw carries the front toward the right, as it does for a ball and a cup, so the edge is on the
  // left); past a quarter turn the face seen is the back and the edge lies toward the front, on the other side. The whole slab is centred on the piece, so it does not slide as it turns.
  const side = showBack ? -1 : 1;
  const dx = -thick * Math.sin(o.yaw * RAD) * side;
  const dy = -thick * Math.sin(o.pitch * RAD) * Math.abs(across) * 0.6;
  const mirror = showBack && own === undefined;
  const cx = x0 + w / 2;
  const cy = y0 + h / 2;
  const flat = Math.abs(dx) + Math.abs(dy) < 0.05;
  // The id names everything the definition depends on (its region comes from the box), so two drawings in one page that share an id share one filter.
  const lift = Math.round(Math.min(1 / sx, 24) * 10) / 10;
  const dark = mirror && o.line !== true ? 0.8 : 1;
  const id = `dgf${o.line === true ? "l" : "c"}${mirror ? "b" : "f"}${Math.round(dx * 100)}_${Math.round(dy * 100)}_${lift}_${[x0, y0, w, h].map((v) => Math.round(v)).join("_")}`;
  const steps = flat ? "" : Array.from({ length: SLICES }, (_, k) => `<feOffset in="s" dx="${n2((dx * (k + 1)) / SLICES)}" dy="${n2((dy * (k + 1)) / SLICES)}" result="o${k + 1}"/>`).join("");
  const nodes = flat ? "" : Array.from({ length: SLICES }, (_, k) => `<feMergeNode in="o${SLICES - k}"/>`).join("");
  // The edge: the face's colours, darkened and made opaque again (the squeeze spread them thin); in the line style a flat dim ink.
  const edge =
    o.line === true
      ? `<feColorMatrix in="SourceGraphic" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${lift} 0" result="a"/><feFlood flood-color="currentColor"/><feComposite in2="a" operator="in" result="b"/><feComponentTransfer in="b" result="s"><feFuncA type="linear" slope=".5"/></feComponentTransfer>`
      : `<feColorMatrix in="SourceGraphic" values=".58 0 0 0 0 0 .58 0 0 0 0 0 .58 0 0 0 0 0 ${lift} 0" result="s"/>`;
  const dim = mirror && o.line !== true ? `<feColorMatrix in="SourceGraphic" values="${dark} 0 0 0 0 0 ${dark} 0 0 0 0 0 ${dark} 0 0 0 0 0 1 0" result="d"/>` : "";
  const filter =
    `<filter id="${id}" x="${n2(x0 - w * 0.15)}" y="${n2(y0 - h * 0.15)}" width="${n2(w * 1.3)}" height="${n2(h * 1.3)}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">` +
    `${flat ? "" : edge + steps}${dim}<feMerge>${nodes}<feMergeNode in="${dim === "" ? "SourceGraphic" : "d"}"/></feMerge></filter>`;
  const flip = mirror ? -1 : 1;
  const shift = flat ? "" : `translate(${n2(-dx / 2)} ${n2(-dy / 2)}) `;
  const group = `<g filter="url(#${id})"><g transform="${shift}translate(${n2(cx)} ${n2(cy)}) scale(${n2(sx * flip)} ${n2(sy)}) translate(${n2(-cx)} ${n2(-cy)})">${face.rest}</g></g>`;
  return `${front.open}${front.head}<defs>${filter}</defs>${group}</svg>`;
}
