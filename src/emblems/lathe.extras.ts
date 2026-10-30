// The decorations a few bodies of revolution use and most do not (see `ExtraDecor` in emblem.lathe.ts): an etched net of many diamonds, a shield laid on a round body, a nameplate laid on a flat face. A model that
// wants them sets `extras: LATHE_EXTRAS`; one that does not never imports this file, so its bundle carries none of the code.
import { mix } from "./emblem.core.ts";
import { type BallCtx, type DecorCtx, type ExtraDecor, radiusAt } from "./emblem.lathe.ts";

const RAD = Math.PI / 180;
const f = (n: number): string => String(Math.round(n * 10) / 10 + 0);
const pt = (x: number, y: number): string => `${f(x)} ${f(y)}`;

/** Draws one extra decoration of a solid, as markup ("" when none of it shows). */
export function LATHE_EXTRAS(c: DecorCtx, d: ExtraDecor): string {
  const { p, solid, yaw, where, at } = c;
  if (d[0] === "mesh") {
    const [, y0, y1, n, rows, name, width = 0.55] = d;
    let m = "";
    for (let i = 0; i < n; i++) {
      for (const way of [1, -1]) {
        let pen = false;
        for (let j = 0; j <= rows * 4; j++) {
          const u = j / (rows * 4);
          const y = y0 + (y1 - y0) * u;
          const deg = yaw + (360 * (i + way * rows * u)) / n;
          if (Math.cos(deg * RAD) <= 0.05) {
            pen = false;
            continue;
          }
          m += `${pen ? "L" : "M"}${where(radiusAt(p, y), y, deg)}`;
          pen = true;
        }
      }
    }
    if (m === "") return "";
    if (name === undefined) return `<path d="${m}" stroke="${mix(c.base.rgb, 0.55)}" stroke-width=".55" stroke-opacity=".9"/>`;
    // An etched net in a tone of its own: a dark line, then the tone laid on it a little to the side.
    const t = c.tone(name);
    return `<path d="${m}" transform="translate(.2 .25)" stroke="${mix(c.base.rgb, -0.6)}" stroke-width="${width}" stroke-opacity=".4"/><path d="${m}" stroke="${mix(t.rgb, 0.05)}" stroke-width="${width}"/>`;
  }
  if (d[0] === "patch") {
    const [, y0, y1, deg0, deg1, name] = d;
    const t = c.tone(name);
    const top: string[] = [];
    const bottom: string[] = [];
    for (let j = 0; j <= 12; j++) {
      const deg = yaw + deg0 + ((deg1 - deg0) * j) / 12;
      if (Math.cos(deg * RAD) <= 0.04) continue;
      top.push(where(radiusAt(p, y0), y0, deg));
      bottom.unshift(where(radiusAt(p, y1), y1, deg));
    }
    return top.length > 1 ? `<path d="M${top.join("L")}L${bottom.join("L")}z" fill="${t.fill}" stroke="${t.edge}" stroke-width=".5"/>` : "";
  }
  const [, face, y0, y1, u0, u1, name] = d;
  const n = solid.sides ?? 0;
  const a0 = (360 * face) / (n || 1) + yaw + (solid.turn ?? 0);
  const a1 = (360 * (face + 1)) / (n || 1) + yaw + (solid.turn ?? 0);
  if (n === 0 || Math.cos(((a0 + a1) / 2) * RAD) <= 1e-9) return "";
  const t = c.tone(name);
  const lerp = (y: number, u: number): string => {
    const c0 = at(radiusAt(p, y), y, a0);
    const c1 = at(radiusAt(p, y), y, a1);
    return pt(c0[0] + (c1[0] - c0[0]) * u, c0[1] + (c1[1] - c0[1]) * u);
  };
  return `<path d="M${lerp(y0, u0)}L${lerp(y0, u1)}L${lerp(y1, u1)}L${lerp(y1, u0)}z" fill="${t.fill}" stroke="${t.edge}" stroke-width=".5"/>`;
}

const rotate = (v: readonly [number, number, number], lz: number, lx: number, yaw: number): [number, number, number] => {
  const [x0, y0, z0] = v;
  const x1 = x0 * Math.cos(lz) - y0 * Math.sin(lz);
  const y1 = x0 * Math.sin(lz) + y0 * Math.cos(lz);
  const y2 = y1 * Math.cos(lx) - z0 * Math.sin(lx);
  const z2 = y1 * Math.sin(lx) + z0 * Math.cos(lx);
  return [x1 * Math.cos(yaw) + z2 * Math.sin(yaw), y2, -x1 * Math.sin(yaw) + z2 * Math.cos(yaw)];
};

/** The great circles of a basketball's seams, by their normals: the equator, the meridian, and the two curved seams that run from pole to pole at 60 degrees either side of it. */
const SEAMS: readonly (readonly [number, number, number])[] = [[0, 1, 0], [1, 0, 0], [Math.cos(Math.PI / 3), 0, -Math.sin(Math.PI / 3)], [Math.cos(Math.PI / 3), 0, Math.sin(Math.PI / 3)]];

/** Draws the seams of a basketball as grooves (each the front half of a great circle: one elliptical arc), and the specks of a grained finish. */
export function LATHE_BALL(c: BallCtx): string {
  const { ball, cx, cy } = c;
  const r = ball.r;
  const lz = ((ball.lean?.[0] ?? 0) * Math.PI) / 180;
  const lx = ((ball.lean?.[1] ?? 0) * Math.PI) / 180;
  const yaw = (c.yaw * Math.PI) / 180;
  const e = (c.elevation * Math.PI) / 180;
  const se = Math.sin(e);
  const ce = Math.cos(e);
  const view = [0, se, ce] as const;
  const screen = (v: readonly [number, number, number]): [number, number] => [v[0], -v[1] * ce + v[2] * se];
  const t = c.tone(ball.tone);
  let m = "";
  for (const n0 of SEAMS) {
    const n = rotate(n0, lz, lx, yaw);
    const facing = n[0] * view[0] + n[1] * view[1] + n[2] * view[2];
    const limb: [number, number, number] = [n[1] * view[2] - n[2] * view[1], n[2] * view[0] - n[0] * view[2], n[0] * view[1] - n[1] * view[0]];
    const size = Math.hypot(...limb);
    if (size < 0.02) continue;
    const a = screen([limb[0] / size, limb[1] / size, limb[2] / size]);
    const near = [view[0] - facing * n[0], view[1] - facing * n[1], view[2] - facing * n[2]] as const;
    const k = Math.hypot(...near);
    const mid = screen([near[0] / k, near[1] / k, near[2] / k]);
    const sweep = a[0] * mid[1] - a[1] * mid[0] > 0 ? 1 : 0;
    const angle = (Math.atan2(a[1], a[0]) * 180) / Math.PI;
    m += `M${pt(cx + r * a[0], cy + r * a[1])}A${f(r)} ${f(Math.max(0.05, r * Math.abs(facing)))} ${f(angle)} 0 ${sweep} ${pt(cx - r * a[0], cy - r * a[1])}`;
  }
  let out = "";
  if (m !== "") {
    if (c.line) out += `<path d="${m}" stroke-width="1.4"/>`;
    else if (c.flat) out += `<path d="${m}" stroke="${mix(t.rgb, -0.4)}" stroke-width="1"/>`;
    else {
      const inlay = ball.seam === undefined ? undefined : c.tone(ball.seam);
      out += `<path d="${m}" stroke="${mix(t.rgb, -0.5)}" stroke-width="${inlay === undefined ? 0.75 : 0.85}"/>`;
      out += inlay === undefined ? `<path d="${m}" transform="translate(.35 .4)" stroke="${mix(t.rgb, 0.55)}" stroke-width=".3" stroke-opacity=".8"/>` : `<path d="${m}" stroke="${mix(inlay.rgb, 0.1)}" stroke-width=".42"/>`;
    }
  }
  const grain = ball.grain ?? 0;
  if (grain > 0 && !c.line) {
    let dots = "";
    for (let i = 0; i < grain; i++) {
      const y = 1 - (2 * (i + 0.5)) / grain;
      const ring = Math.sqrt(1 - y * y);
      const theta = i * 2.39996;
      const p = rotate([ring * Math.cos(theta), y, ring * Math.sin(theta)], lz, lx, yaw);
      if (p[0] * view[0] + p[1] * view[1] + p[2] * view[2] < 0.12) continue;
      const [sx, sy] = screen(p);
      dots += `M${pt(cx + r * sx, cy + r * sy)}h0`;
    }
    if (dots !== "") out += `<path d="${dots}" stroke="${mix(t.rgb, -0.5)}" stroke-width=".36" stroke-opacity=".6"/>`;
  }
  return out;
}
