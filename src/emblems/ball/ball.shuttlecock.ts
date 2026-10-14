// Shuttlecocks: a cork base and a skirt of 16 feathers (a goose's, overlapped), or a molded nylon skirt. Drawn from its parts in true 3D: the feathers are blades that lean out from the base, painted
// far to near, so the shuttlecock turns like any ball. 16 feathers, 62 to 70 mm long, the skirt 58 to 68 mm across (the BWF Laws, Law 2).
import { defineObject, type ObjectContext } from "./ball.object.ts";
import { type V3 } from "./ball.math.ts";
import { blend, mix, num } from "./ball.core.ts";

const FEATHERS = 16;
// One unit is 32 mm (the scale below makes 92 box units 150 mm): the skirt is 2 units across at the tips (63 mm), the base 0.84 across (27 mm) and the feathers 2.05 long from the tips to the top of the base
// (66 mm; the Law measures a feather's length that way, 62 to 70 mm).
const ROOT_R = 0.42;
const TIP_R = 1;
const ROOT_Y = -1.05;
const TIP_Y = 1.0;
const SLOPE = 0.56;

interface Parts {
  feather: string;
  shaft: string;
  cork: string;
  band: string;
  thread: string;
  nylon: boolean;
}

const drawShuttle = (c: ObjectContext, p: Parts): { defs: string; body: string } => {
  const line = c.opts.style === "line";
  const tip = (a: number, r: number, y: number, k = 0): V3 => [Math.cos(a) * r, y, Math.sin(a) * r + k];
  const pts = (...v: V3[]): string => v.map((q) => c.at(q)).map((q) => `${num(q[0])} ${num(q[1])}`).join("L");
  const blades: Array<{ depth: number; svg: string }> = [];
  const step = (2 * Math.PI) / FEATHERS;
  const rootHalf = p.nylon ? step / 2 : step * 0.36;
  const tipHalf = p.nylon ? step / 2 : step * 0.62;
  for (let i = 0; i < FEATHERS; i++) {
    const a = i * step;
    const corners: V3[] = [tip(a - rootHalf, ROOT_R, ROOT_Y), tip(a - tipHalf, TIP_R, TIP_Y), tip(a + tipHalf, TIP_R, TIP_Y), tip(a + rootHalf, ROOT_R, ROOT_Y)];
    const mid = tip(a, (ROOT_R + TIP_R) / 2, (ROOT_Y + TIP_Y) / 2);
    const m = c.at(mid);
    // How squarely the blade faces the light (from the upper left): a blade whose outward normal points left and toward you is bright.
    const nrm: V3 = [Math.cos(a), SLOPE * -0.5, Math.sin(a)];
    const nv = c.at([nrm[0], nrm[1], nrm[2]]);
    const origin = c.at([0, 0, 0]);
    const lx = (nv[0] - origin[0]) / 46, ly = (nv[1] - origin[1]) / 46, lz = nv[2] - 0;
    const lit = Math.max(0, Math.min(1, 0.55 + 0.4 * (-0.5 * lx + 0.55 * ly + 0.3 * lz)));
    const fill = blend(mix(p.feather, -0.28), mix(p.feather, 0.1), lit);
    const quill = `M${pts(tip(a, ROOT_R, ROOT_Y), tip(a, TIP_R, TIP_Y))}`;
    const outline = `M${pts(...corners)}Z`;
    const svg = line
      ? `<path d="${outline}${p.nylon ? "" : quill}"/>`
      : `<path d="${outline}" fill="${fill}"${p.nylon ? ` fill-opacity=".9"` : ""} stroke="${mix(p.feather, -0.55)}" stroke-width="${num(Math.max(0.7, c.minWidth * 0.6), 2)}" stroke-linejoin="round"/>` +
        (p.nylon ? "" : `<path d="${quill}" fill="none" stroke="${p.shaft}" stroke-width="${num(Math.max(0.45, c.minWidth * 0.5), 2)}" stroke-linecap="round" opacity=".8"/>`);
    blades.push({ depth: m[2], svg });
  }
  blades.sort((x, y) => x.depth - y.depth);
  const ring = (y: number, r: number): string => {
    const q: string[] = [];
    for (let i = 0; i <= 36; i++) q.push(`${i === 0 ? "M" : "L"}${pts(tip((i / 36) * 2 * Math.PI, r, y))}`);
    return q.join("");
  };
  // Where the base is: below the skirt, so it is behind it when the tip leans toward you, in front of it when the cork leans toward you.
  const base = c.at([0, ROOT_Y, 0]);
  const top = c.at([0, TIP_Y, 0]);
  const corkFirst = base[2] <= top[2];
  const cx = c.at([0, ROOT_Y - 0.4, 0]);
  const corkR = 46 * 0.43 * ROOT_R;
  const defs = line
    ? ""
    : `<radialGradient id="${c.id}k" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="${blend(p.cork, "#fff", 0.35)}"/><stop offset=".5" stop-color="${p.cork}"/><stop offset="1" stop-color="${mix(p.cork, -0.55)}"/></radialGradient>`;
  const cork = line
    ? `<circle cx="${num(cx[0])}" cy="${num(cx[1])}" r="${num(corkR)}"/>`
    : `<circle cx="${num(cx[0])}" cy="${num(cx[1])}" r="${num(corkR)}" fill="url(#${c.id}k)"/><path d="${ring(ROOT_Y + 0.02, ROOT_R)}" fill="none" stroke="${p.band}" stroke-width="${num(Math.max(1.4, c.minWidth), 2)}" opacity=".9"/>`;
  const thread = `<path d="${ring(0.55, 0.72)}" fill="none" stroke="${line ? "currentColor" : p.thread}" stroke-width="${num(Math.max(0.5, c.minWidth * 0.7), 2)}"${line ? ' opacity=".7"' : ""}/>`;
  const rim = `<path d="${ring(TIP_Y, TIP_R)}" fill="none" stroke="${line ? "currentColor" : mix(p.feather, -0.3)}" stroke-width="${num(Math.max(0.5, c.minWidth * 0.6), 2)}"${line ? ' opacity=".6"' : ' opacity=".5"'}/>`;
  const feathers = blades.map((b) => b.svg).join("");
  let body = corkFirst ? cork + feathers : feathers + cork;
  body += thread;
  if (line) body = `<g fill="none" stroke="currentColor" stroke-width="${num(Math.max(2.4, c.minWidth * 1.4), 2)}" stroke-linejoin="round" stroke-linecap="round">${body}${rim}</g>`;
  else body += rim;
  return { defs, body };
};

const VIEW = { yaw: 0, pitch: 22, roll: -32 };

export const BALL_SHUTTLECOCK_FEATHER = /* @__PURE__ */ defineObject({
  id: "ball:shuttlecock-feather",
  en: "Shuttlecock, feather",
  ja: "水鳥シャトル",
  size: { extentMm: 150, diameterMm: 63, lengthMm: 66, massG: [4.74, 5.5], rule: "BWF Laws of Badminton, Law 2 Shuttle (2.1 general, 2.2 Feathered shuttle 2.2.1-2.2.6, 2.3 Non-feathered shuttle, 2.4 modifications) and Laws 3 Testing a shuttle for speed", note: "62 to 70 mm long with the tips on a circle 58 to 68 mm across, on a base 25 to 28 mm across; the box is drawn at the scale of the shuttlecock, which fills a part of it." },
  view: VIEW,
  scale: 0.43,
  shift: [0, 0.02, 0],
  model: { feathers: FEATHERS },
  draw: (c) => drawShuttle(c, { feather: "#fbfaf4", shaft: "#b5ac94", cork: "#c8925a", band: "#f6f2e8", thread: "#8a826a", nylon: false }),
});

export const BALL_SHUTTLECOCK_NYLON = /* @__PURE__ */ defineObject({
  id: "ball:shuttlecock-nylon",
  en: "Shuttlecock, nylon",
  ja: "ナイロンシャトル",
  size: { extentMm: 150, diameterMm: 63, lengthMm: 66, massG: [4.74, 5.5], rule: "BWF Laws of Badminton, Law 2 Shuttle (2.1 general, 2.2 Feathered shuttle 2.2.1-2.2.6, 2.3 Non-feathered shuttle, 2.4 modifications) and Laws 3 Testing a shuttle for speed", note: "A non-feathered shuttle follows the same measures, with a tolerance of 10 per cent (Law 2.3); the box is drawn at the scale of the shuttlecock, which fills a part of it." },
  view: VIEW,
  scale: 0.43,
  shift: [0, 0.02, 0],
  model: { feathers: FEATHERS },
  draw: (c) => drawShuttle(c, { feather: "#f2f4f6", shaft: "#aab0b8", cork: "#f0eadd", band: "#e04a3c", thread: "#7a8088", nylon: true }),
});
