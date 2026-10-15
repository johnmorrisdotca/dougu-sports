// What a ball is printed with: a logo wrapped onto the side of the ball, a stamp of text, a cursive maker's word and a small mark, laid out as a label on a flat plane that touches the ball at one point and
// carried onto the sphere with an equal-distance map, so every line of it curves with the ball and turns with it. Everything is our own drawing: our own cursive script (ball.script.ts), our own block
// lettering (ball.letters.ts), our own stars and circled letter, and no maker's, league's or team's name or mark; a logo and a mark of the caller's own are drawn from the SVG they give, made safe first.
// Imports only this folder's helpers.
import { type Piece, escape, hashOf, hexOf, readColour } from "./ball.core.ts";
import { contrast } from "./ball.contrast.ts";
import { type PrintOptions, hasPrint } from "./ball.core.ts";
import type { BallSpec, HomeFrame, Surface } from "./ball.engine.ts";
import { type SafeImage, safeImage } from "./ball.image.ts";
import { type Lettering, lineStrokes, textWidth } from "./ball.letters.ts";
import { type V3, add, mul, norm } from "./ball.math.ts";
import { scriptRuns, scriptWidth } from "./ball.script.ts";
import { signaturePath } from "./ball.signature.ts";
import { type P2, type PlaneMap, drawPicture, drawShapes, flattenPath, shapesOf } from "./ball.warp.ts";

/** The colours of a painted ball: `body` is the ball (or a soccer ball's hexagons), `second` the other half of a two-tone ball (or a soccer ball's pentagons). */
export interface BallPaint {
  /** The ball's colour: `#rgb`, `#rrggbb` or `rgb()`; anything else is ignored. */
  body?: string;
  /** The second colour. A baseball or a softball becomes two-tone, split along its seam or in halves; a soccer ball's pentagons take it. */
  second?: string;
  /** How a two-tone baseball or softball is divided: `"seam"` (the default: the figure-eight seam parts the two colours, as a commemorative ball is) or `"half"` (a flat cut through the middle). */
  split?: "seam" | "half";
  /** For `split: "half"`: the turn of the cut in degrees about the label's middle (0 is a vertical cut, body on the left). */
  angle?: number;
  /** The colour of the stitches. By default one that shows against the ball (red, cream or navy; on a two-tone ball each stitch's legs are the colour that shows on their own side). */
  stitch?: string;
}

/** A place on the ball in degrees from the middle of its default view: `lon` toward the right, `lat` toward the top, in the ball's own frame (it turns with the ball). */
export interface Spot {
  lon?: number;
  lat?: number;
}

/** Where the logo and the lettering go, as a place on the ball in degrees from the middle of its default view. By default the logo is there and so is the lettering, or the lettering is on the far side of the ball (`lon: 180`) when there is a logo. */
export interface BallSpots {
  decal?: Spot;
  label?: Spot;
}

/** A logo printed on the ball. */
export interface BallDecal {
  /** An SVG string. It is made safe first (only shapes, gradients and groups survive; no script, text, image, style or address), a gradient is its mean colour, and it is wrapped exactly onto the sphere. */
  svg?: string;
  /** Or a `data:` URI of an image: an SVG is read as `svg` is, a PNG, JPEG, GIF or WebP is laid on in small triangles (close, not exact). An address on the network is refused. */
  href?: string;
  /** How wide the logo is, in degrees of the sphere (about 55 by default). */
  size?: number;
  /** A turn of the logo on the ball, in degrees. */
  turn?: number;
}

/** The stamp: lines of bold block lettering, the first with a small star on each side, and an optional signature-style line under them. */
export interface BallStamp {
  /** The lines (up to three, 24 letters each, any letter, digit or `- . , ' / : &`; the ball's own default is `UNOFFICIAL` and `DIGITAL BASEBALL`). */
  lines?: readonly string[];
  /** Stars on each side of the first line (on by default). */
  stars?: boolean;
  /** A made-up signature under the lines: `true`, a seed (text or a number), or `{ seed, caption }` with a small line of words under it. The same seed always draws the same squiggle, and no seed is anyone's real hand. */
  sign?: boolean | string | number | { seed?: string | number; caption?: string };
  /** The ink, `#rgb`, `#rrggbb` or `rgb()`. Navy by default, or white or black where navy would not show on the ball. */
  colour?: string;
}

/** The cursive word where a maker's mark would sit. */
export interface BallScript {
  /** The word (up to 16 letters; a-z and a space; a capital without a drawing of its own is a tall small letter). By default the ball's own: `Baseball`, `Softball` or `Soccer`. */
  text?: string;
  colour?: string;
}

/** The small mark under the script: a letter in a circle, or a mark of your own. */
export interface BallMark {
  /** The letter in the circle (one letter or digit). By default the first letter of the script. */
  letter?: string;
  /** A mark of your own as an SVG string (made safe first, as a decal is), fitted in the circle's place. It replaces the circled letter. */
  svg?: string;
  /** Or a `data:` URI of an SVG (a raster picture is not taken for a mark). */
  href?: string;
  colour?: string;
}

const NAVY = "#1b2a5c";
const MAX_SVG = 60000;

/** The ink for a print on the given grounds: the wanted colour if it shows on all of them (3 to 1), else the first of navy, white and near-black that does. */
export function inkFor(grounds: readonly string[], wanted?: string): string {
  const w = wanted === undefined ? undefined : readColour(wanted);
  const list = [...(w === undefined ? [] : [hexOf(w)]), NAVY, "#ffffff", "#101418"];
  return list.find((c) => grounds.every((g) => contrast(c, g) >= 3)) ?? list[list.length - 1] as string;
}

const clean = (v: unknown, max: number): string | undefined => {
  if (typeof v !== "string" && typeof v !== "number") return undefined;
  const t = [...String(v).replace(/\p{Cc}/gu, " ").replace(/\s+/g, " ").trim()].slice(0, max).join("");
  return t === "" ? undefined : t;
};
const degrees = (v: unknown, d: number, lo: number, hi: number): number => (typeof v === "number" && Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d);

/** An SVG from a data URI, if the URI is one of an SVG: base64 or percent-encoded. */
function svgOfUri(uri: string): string | undefined {
  const m = /^data:image\/svg\+xml(?:;charset=[\w-]+)?(;base64)?,([\s\S]*)$/i.exec(uri.trim());
  if (m === null || (m[2] as string).length > MAX_SVG * 1.4) return undefined;
  try {
    const decode = (globalThis as { atob?: (data: string) => string }).atob;
    return m[1] === undefined ? decodeURIComponent(m[2] as string) : decode === undefined ? undefined : decode(m[2] as string);
  } catch {
    return undefined;
  }
}

/** A raster data URI that is safe to write into an attribute: PNG, JPEG, GIF or WebP, base64 only, of a size that fits in a document. */
const RASTER = /^data:image\/(?:png|jpe?g|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
const MAX_RASTER = 400000;

type Art = { kind: "vector"; img: SafeImage } | { kind: "picture"; href: string };

/** A logo or mark from a string and a URI, made safe; `undefined` when nothing drawable is left. A picture is taken only when `pictures` is true. */
function artOf(svg: unknown, href: unknown, prefix: string, pictures: boolean): Art | undefined {
  let source = typeof svg === "string" ? svg : undefined;
  let uri = typeof href === "string" ? href.trim() : undefined;
  if (source !== undefined && /^\s*data:/i.test(source)) {
    uri = source.trim();
    source = undefined;
  }
  if (source === undefined && uri !== undefined) {
    source = svgOfUri(uri);
    if (source === undefined && pictures && uri.length <= MAX_RASTER && RASTER.test(uri)) return { kind: "picture", href: uri };
  }
  const img = safeImage(source, prefix);
  return img === undefined ? undefined : { kind: "vector", img };
}

/** The frame a plane is laid on the ball in: at `spot` degrees from the label's middle, turned `turn` degrees. The map is equal-distance, so a length from the middle is the same on the ball in radians. */
function planeOf(home: HomeFrame, spot: Spot | undefined, turn = 0): PlaneMap {
  const lon = (degrees(spot?.lon, 0, -360, 360) * Math.PI) / 180, lat = (degrees(spot?.lat, 0, -90, 90) * Math.PI) / 180;
  const c1 = add(mul(home.c, Math.cos(lon)), mul(home.ex, Math.sin(lon)));
  const ex1 = add(mul(home.ex, Math.cos(lon)), mul(home.c, -Math.sin(lon)));
  const c = add(mul(c1, Math.cos(lat)), mul(home.up, Math.sin(lat)));
  const up = add(mul(home.up, Math.cos(lat)), mul(c1, -Math.sin(lat)));
  const t = (turn * Math.PI) / 180, ct = Math.cos(t), st = Math.sin(t);
  return (x, y) => {
    const px = x * ct - y * st, py = x * st + y * ct;
    const r = Math.min(Math.hypot(px, py), Math.PI);
    if (r < 1e-9) return c;
    return norm(add(mul(c, Math.cos(r)), mul(add(mul(ex1, px), mul(up, -py)), Math.sin(r) / Math.hypot(px, py))));
  };
}

const ringOf = (cx: number, cy: number, r: number, n = 28): P2[] => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i * 2 * Math.PI) / n), cy + r * Math.sin((i * 2 * Math.PI) / n)] as P2);
const starOf = (cx: number, cy: number, r: number): P2[] => Array.from({ length: 10 }, (_, i) => [cx + (i % 2 === 0 ? r : r * 0.42) * Math.cos(-Math.PI / 2 + (i * Math.PI) / 5), cy + (i % 2 === 0 ? r : r * 0.42) * Math.sin(-Math.PI / 2 + (i * Math.PI) / 5)] as P2);

/** What a ball's print is made of, after the caller's options are read and made safe. */
interface Parts {
  decal?: { art: Art; size: number; turn: number };
  script?: { text: string; colour?: string };
  mark?: { letter: string; colour?: string; art?: Art };
  stamp?: { lines: string[]; stars: boolean; colour?: string; sign?: { seed: string | number; caption?: string } };
}

/** The print asked for, made safe. `word` is the ball's own word, the default of the script and of the stamp's second line. */
function partsOf(p: PrintOptions, word: string): Parts {
  const out: Parts = {};
  const d = typeof p.decal === "string" ? { svg: p.decal } : typeof p.decal === "object" && p.decal !== null ? p.decal : undefined;
  if (d !== undefined) {
    const art = artOf(d.svg, d.href, "d", true);
    if (art !== undefined) out.decal = { art, size: (degrees(d.size, 0, 5, 170) * Math.PI) / 180, turn: degrees(d.turn, 0, -360, 360) };
  }
  const sc = p.script === true ? {} : typeof p.script === "string" ? { text: p.script } : typeof p.script === "object" && p.script !== null ? p.script : undefined;
  if (sc !== undefined) {
    const t = clean(sc.text, 16) ?? `${word[0]?.toUpperCase()}${word.slice(1)}`;
    if (scriptWidth(t) > 0) out.script = { text: t, colour: typeof sc.colour === "string" ? sc.colour : undefined };
  }
  const mk = p.mark === true ? {} : typeof p.mark === "string" ? (/^\s*(<|data:)/i.test(p.mark) ? { svg: p.mark } : { letter: p.mark }) : typeof p.mark === "object" && p.mark !== null ? p.mark : undefined;
  // The script brings its circled letter with it, unless the mark is switched off.
  const mark = mk ?? (out.script !== undefined && p.mark !== false ? {} : undefined);
  if (mark !== undefined) {
    const art = artOf(mark.svg, mark.href, "m", false);
    const letter = [...(clean(mark.letter, 1) ?? out.script?.text.trim()[0] ?? word[0] ?? "B")][0] as string;
    out.mark = { letter: letter.toUpperCase(), colour: typeof mark.colour === "string" ? mark.colour : undefined, art };
  }
  const st = p.stamp === true ? {} : typeof p.stamp === "string" ? { lines: [p.stamp] } : Array.isArray(p.stamp) ? { lines: p.stamp as string[] } : typeof p.stamp === "object" && p.stamp !== null ? (p.stamp as Record<string, unknown>) : undefined;
  if (st !== undefined) {
    const given = Array.isArray(st.lines) ? (st.lines as unknown[]).slice(0, 3).flatMap((l) => clean(l, 24) ?? []) : [];
    const lines = given.length > 0 ? given : ["UNOFFICIAL", `DIGITAL ${word.toUpperCase()}`];
    const sg = st.sign;
    const sign = sg === true ? { seed: "dougu" as string | number } : typeof sg === "string" || typeof sg === "number" ? { seed: sg } : typeof sg === "object" && sg !== null ? { seed: (sg as { seed?: string | number }).seed ?? "dougu", caption: clean((sg as { caption?: unknown }).caption, 24) } : undefined;
    out.stamp = { lines, stars: st.stars !== false, colour: typeof st.colour === "string" ? st.colour : undefined, sign };
  }
  return out;
}

/** The ink of one part: its own colour if it is one, else the label's. */
const pen = (own: string | undefined, label: string): string => {
  const c = own === undefined ? undefined : readColour(own);
  return c === undefined ? label : hexOf(c);
};

/** Points of a flat curve onto the ball, each given as `[x, y]` in the plane's units. */
const lay = (map: PlaneMap, pts: readonly P2[]): V3[] => pts.map((p) => map(p[0], p[1]));

/** The size of the label's full width, in radians, for a ball that reaches `reach` from the middle of its label area. */
const labelWidth = (reach: number): number => Math.min(1.7, reach * 1.4);

/** The id of a drawing's definitions: from its own text, so that two logos in a page do not share. */
const idOf = (text: string): string => `p${hashOf(text)}`;

/**
 * The print of a ball as layers for its surface: the logo, then the label (the script, the circled letter, the stamp), each at its own place. `grounds` are the colours the print lies on, for the ink (the label's far side is the same colour as the front on every ball that has one). A ball
 * in the line style has none. Returns an empty string when nothing was asked for.
 */
export function printLayers(s: Surface, p: PrintOptions | undefined, word: string, grounds: readonly string[]): string {
  const home = s.home;
  if (p === undefined || home === undefined || s.line) return "";
  const parts = partsOf(p, word);
  let out = "";
  const labelled = parts.script !== undefined || parts.mark !== undefined || parts.stamp !== undefined;
  if (parts.decal !== undefined) {
    const d = parts.decal;
    const ink = inkFor(grounds);
    const map = planeOf(home, p.spots?.decal, d.turn);
    const size = d.size > 0 ? d.size : Math.min(1.3, home.reach * 1.25);
    if (d.art.kind === "picture") out += drawPicture(s, d.art.href, map, size, idOf(d.art.href.slice(0, 64) + d.art.href.length));
    else out += drawShapes(s, shapesOf(d.art.img, ink), d.art.img.box, map, size);
  }
  if (labelled) {
    const spot = p.spots?.label ?? (parts.decal !== undefined ? { lon: 180 } : undefined);
    out += labelLayers(s, parts, planeOf(home, spot), labelWidth(home.reach), inkFor(grounds, parts.stamp?.colour));
  }
  return out;
}

/** The label: its items from the top down, centred on the plane's origin. */
function labelLayers(s: Surface, parts: Parts, map: PlaneMap, W: number, ink: string): string {
  type Item = { h: number; draw: (cy: number) => string };
  const items: Item[] = [];
  const gap = W * 0.085;
  const digits = 2;
  const stroke = (curves: readonly (readonly P2[])[], colour: string, width: number, extra?: { closed?: boolean }): string => s.strokes(curves.map((c) => lay(map, c)), colour, width * s.radius, { digits, ...extra });
  if (parts.script !== undefined) {
    const sc = parts.script;
    const runs = scriptRuns(sc.text);
    const wide = scriptWidth(sc.text);
    const k = Math.min((W * 0.82) / wide, W * 0.03);
    const high = 22 * k;
    const colour = pen(sc.colour, ink);
    items.push({
      h: high,
      draw: (cy) => {
        const ox = (-wide * k) / 2 + wide * k * 0.02, oy = cy + high / 2 - k * 0.5;
        const tiers: P2[][][] = [[], [], []];
        for (const run of runs) {
          let cur: P2[] = [];
          let tier = -1;
          run.pts.forEach((pt, i) => {
            const q: P2 = [ox + pt[0] * k, oy - pt[1] * k];
            if (i === 0) {
              cur = [q];
              return;
            }
            const t = run.tier[i - 1] as number;
            if (t !== tier && cur.length > 1) {
              tiers[tier]?.push(cur);
              cur = [cur[cur.length - 1] as P2];
            }
            tier = t;
            cur.push(q);
          });
          if (cur.length > 1) tiers[tier]?.push(cur);
        }
        const w = [0.34, 0.7, 1.2];
        return stroke(tiers[0] as P2[][], colour, w[0] as number * k) + stroke(tiers[1] as P2[][], colour, w[1] as number * k) + stroke(tiers[2] as P2[][], colour, w[2] as number * k);
      },
    });
  }
  if (parts.mark !== undefined) {
    const mk = parts.mark;
    const r = W * 0.062;
    const colour = pen(mk.colour, ink);
    items.push({
      h: r * 2,
      draw: (cy) => {
        if (mk.art !== undefined && mk.art.kind === "vector") return drawShapes(s, shapesOf(mk.art.img, colour), mk.art.img.box, (x, y) => map(x, y + cy), r * 2.6);
        const L: Lettering = { size: r * 1.15, weight: 0.2, wide: 0.9 };
        return stroke([ringOf(0, cy, r)], colour, r * 0.2, { closed: true }) + stroke(lineStrokes(mk.letter, L, 0, cy, 5), colour, L.size * L.weight);
      },
    });
  }
  if (parts.stamp !== undefined) {
    const st = parts.stamp;
    const colour = pen(st.colour, ink);
    st.lines.forEach((text, i) => {
      const want = i === 0 ? { weight: 0.22, wide: 0.78 } : { weight: 0.22, wide: 0.78 };
      const room = W * (i === 0 ? 0.62 : 0.98);
      const base = i === 0 ? W * 0.075 : W * 0.105;
      const w1 = textWidth(text, { ...want, size: 1 });
      const size = Math.min(base, room / w1);
      const L: Lettering = { ...want, size };
      items.push({
        h: size * 1.1,
        draw: (cy) => {
          let o = stroke(lineStrokes(text, L, 0, cy, 5), colour, size * L.weight);
          if (i === 0 && st.stars) {
            const half = textWidth(text, L) / 2;
            const r = size * 0.62;
            for (const sx of [-1, 1]) o += s.panel(lay(map, starOf(sx * (half + r * 1.5), cy, r)), colour, { n: 1, ink: true });
          }
          return o;
        },
      });
    });
    if (st.sign !== undefined) {
      const sg = st.sign;
      const seed = sg.seed;
      const width = W * 0.52;
      items.push({
        h: width * 0.34,
        draw: (cy) => {
          const subs = flattenPath(signaturePath(seed), 8);
          return stroke(subs.map((q) => q.pts.map((pt): P2 => [pt[0] * width, pt[1] * width + cy])), colour, width * 0.014);
        },
      });
      if (sg.caption !== undefined) {
        const size = W * 0.036;
        const L: Lettering = { size, weight: 0.16, wide: 0.8, track: 0.12 };
        items.push({ h: size * 1.4, draw: (cy) => stroke(lineStrokes(sg.caption as string, L, 0, cy, 4), colour, size * L.weight) });
      }
    }
  }
  const total = items.reduce((a, it) => a + it.h, 0) + gap * Math.max(0, items.length - 1);
  let y = -total / 2;
  let out = "";
  for (const it of items) {
    out += it.draw(y + it.h / 2);
    y += it.h + gap;
  }
  return out;
}

/** What `printLayers` was given, for the id of a drawing (so two prints of one ball have their own definitions). */
export const printKey = (p: PrintOptions | undefined): string => (p === undefined ? "" : escape(hashOf(JSON.stringify(p))));

/**
 * A ball that can be printed. The balls themselves carry no printing code (a ball bundled alone stays small): `renderEmblem` and the registry use this, and so can you for one ball taken from its own module:
 * `const ball = printed(BALL_BASEBALL); ball.svg({ stamp: true })`. The same ball with the printer in its options; options that ask for no print draw exactly what the plain ball draws.
 */
export const printed = <P extends Piece<BallSpec>>(piece: P): P => ({
  ...piece,
  svg: (o) => piece.svg(hasPrint(o as PrintOptions) ? { ...o, printer: printLayers } : o),
  frame: (o) => piece.frame(hasPrint(o as PrintOptions) ? { ...o, printer: printLayers } : o),
});
