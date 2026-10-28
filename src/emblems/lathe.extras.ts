// The decorations a few bodies of revolution use and most do not (see `ExtraDecor` in emblem.lathe.ts): an etched net of many diamonds, a shield laid on a round body, a nameplate laid on a flat face. A model that
// wants them sets `extras: LATHE_EXTRAS`; one that does not never imports this file, so its bundle carries none of the code.
import { mix } from "./emblem.core.ts";
import { type DecorCtx, type ExtraDecor, radiusAt } from "./emblem.lathe.ts";

const RAD = Math.PI / 180;
const f = (n: number): string => String(Math.round(n * 10) / 10 + 0);
const pt = (x: number, y: number): string => `${f(x)} ${f(y)}`;

/** Draws one extra decoration of a solid, as markup ("" when none of it shows). */
export function LATHE_EXTRAS(c: DecorCtx, d: ExtraDecor): string {
  const { p, solid, yaw, where, at } = c;
  if (d[0] === "mesh") {
    const [, y0, y1, n, rows] = d;
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
    return m === "" ? "" : `<path d="${m}" stroke="${mix(c.base.rgb, 0.55)}" stroke-width=".55" stroke-opacity=".9"/>`;
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
  if (n === 0 || Math.cos(((a0 + a1) / 2) * RAD) <= 0) return "";
  const t = c.tone(name);
  const lerp = (y: number, u: number): string => {
    const c0 = at(radiusAt(p, y), y, a0);
    const c1 = at(radiusAt(p, y), y, a1);
    return pt(c0[0] + (c1[0] - c0[0]) * u, c0[1] + (c1[1] - c0[1]) * u);
  };
  return `<path d="M${lerp(y0, u0)}L${lerp(y0, u1)}L${lerp(y1, u1)}L${lerp(y1, u0)}z" fill="${t.fill}" stroke="${t.edge}" stroke-width=".5"/>`;
}
