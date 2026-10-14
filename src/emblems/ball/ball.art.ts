// The small drawings a printed puck is made of, all our own: an eleven-point maple leaf, a five-point star, a Canadian-style flag (red, white, red, with that leaf) and the stars and stripes. Each is a string of SVG in
// a unit box (the leaf's blade is 2 wide and 2 tall about the origin) that the face scales and places; the flags take the width they are drawn at. Imports only the core's number writer.
import { num } from "./ball.core.ts";

/** The right half of the leaf, from the top tip down to the stem: eleven points in all with the left half mirrored (a tip, then a notch, five times over). y runs down. */
const LEAF_HALF: readonly (readonly [number, number])[] = [
  [0, -1], [0.15, -0.6], [0.36, -0.7], [0.33, -0.36], [0.67, -0.5], [0.55, -0.2], [1, -0.12], [0.74, 0.12], [0.86, 0.36], [0.4, 0.3], [0.42, 0.56], [0.06, 0.42],
];

/** A maple leaf with a stem, as a path about the origin: the blade spans -1 to 1 across and from -1 down to about 0.6, the stem to 1. */
export const LEAF_PATH: string = (() => {
  const right = LEAF_HALF.slice(1);
  const left = [...LEAF_HALF.slice(1)].reverse().map(([x, y]) => [-x, y] as const);
  const pts = [LEAF_HALF[0] as readonly [number, number], ...right, [0.06, 0.92], [-0.06, 0.92], ...left];
  return `M${pts.map(([x, y]) => `${num(x, 3)} ${num(y, 3)}`).join("L")}Z`;
})();

/** A maple leaf: centre (`cx`, `cy`), the width of the blade `w`, and a fill. */
export function leaf(cx: number, cy: number, w: number, fill: string): string {
  const k = w / 2;
  return `<path d="${LEAF_PATH}" transform="translate(${num(cx, 3)} ${num(cy, 3)}) scale(${num(k, 4)})" fill="${fill}"/>`;
}

/** A five-point star, as a polygon's points, with the given outer radius, centred on (`cx`, `cy`), pointing up (turned by `deg`). */
export function starPoints(cx: number, cy: number, r: number, deg = 0): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = ((deg + i * 36) * Math.PI) / 180;
    const rr = i % 2 === 0 ? r : r * 0.382;
    pts.push(`${num(cx + rr * Math.sin(a), 3)} ${num(cy - rr * Math.cos(a), 3)}`);
  }
  return pts.join(" ");
}

export const star = (cx: number, cy: number, r: number, fill: string, deg = 0): string => `<polygon points="${starPoints(cx, cy, r, deg)}" fill="${fill}"/>`;

/** The colours of the two flags: a red and a white, a navy and a red. Plain values of the flags' colours; the caller may replace them. */
export const FLAG = { red: "#d52b1e", white: "#ffffff", navy: "#0a3161", usRed: "#b31942" } as const;

/** A flag of Canada's pattern, 2 wide and 1 tall about the origin scaled to the width `w`: red, white, red, with the leaf on the white. */
export function canadaFlag(cx: number, cy: number, w: number, red = FLAG.red, white = FLAG.white): string {
  const k = w / 2;
  const t = `translate(${num(cx, 3)} ${num(cy, 3)}) scale(${num(k, 4)})`;
  return `<g transform="${t}"><rect x="-1" y="-.5" width="2" height="1" fill="${white}"/><rect x="-1" y="-.5" width=".5" height="1" fill="${red}"/><rect x=".5" y="-.5" width=".5" height="1" fill="${red}"/><path d="${LEAF_PATH}" transform="translate(0 -.03) scale(.3)" fill="${red}"/></g>`;
}

/**
 * The stars and stripes as a rectangle about the origin, `w` wide and `h` tall: thirteen stripes across, a canton of stars in the upper left (`canton` wide, seven stripes tall), and the stars in staggered rows, four
 * and three to a row, which is what reads at a puck's size (the flag has fifty, in nine rows). A star whose centre lies farther than `reach` from the origin is left out, so a disc cut from the field has no
 * half stars at its edge.
 */
export function starsAndStripes(w: number, h: number, canton: number, reach = Infinity, red: string = FLAG.usRed, white: string = FLAG.white, blue: string = FLAG.navy): string {
  const x0 = -w / 2, y0 = -h / 2, sh = h / 13;
  let out = `<rect x="${num(x0, 3)}" y="${num(y0, 3)}" width="${num(w, 3)}" height="${num(h, 3)}" fill="${white}"/>`;
  for (let i = 0; i < 13; i += 2) out += `<rect x="${num(x0, 3)}" y="${num(y0 + i * sh, 3)}" width="${num(w, 3)}" height="${num(sh, 3)}" fill="${red}"/>`;
  const ch = sh * 7;
  out += `<rect x="${num(x0, 3)}" y="${num(y0, 3)}" width="${num(canton, 3)}" height="${num(ch, 3)}" fill="${blue}"/>`;
  const r = Math.min(canton / 9.5, ch / 15);
  for (let row = 0; row < 7; row++) {
    const n = row % 2 === 0 ? 4 : 3;
    for (let c = 0; c < n; c++) {
      const x = x0 + canton * ((row % 2 === 0 ? c + 0.5 : c + 1) / 4);
      const y = y0 + ch * ((row + 0.5) / 7);
      if (Math.hypot(x, y) <= reach) out += star(x, y, r, white);
    }
  }
  return out;
}

/** A flag of the United States' pattern, 2 wide about the origin scaled to the width `w` (it is 1.9 to 1): stripes and a canton of stars. */
export function usaFlag(cx: number, cy: number, w: number): string {
  const k = w / 2;
  return `<g transform="translate(${num(cx, 3)} ${num(cy, 3)}) scale(${num(k, 4)})">${starsAndStripes(2, 2 / 1.9, 0.8)}</g>`;
}
