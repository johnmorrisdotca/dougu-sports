// Generic patterns of the kind a sports shop has on its wall, each in three colourways: stars, hexagon outlines, flames, chevrons, a two-tone swirl and a metallic glossy finish. Every pattern is our own
// drawing on a construction of the family (the 32 panels, or gores that run from pole to pole), and the balls are the size of an 11-a-side ball (IFAB Law 2). No logo, no brand, no team.
import { type BallSpec, type Surface, defineBall } from "./ball.engine.ts";
import { mix } from "./ball.core.ts";
import { frameAt, place, spiral, star, tongue, turned } from "./ball.decal.ts";
import type { V3 } from "./ball.math.ts";
import { shrink, truncatedIcosahedron } from "./ball.polyhedra.ts";
import { gorePoint, gores } from "./ball.tilings.ts";
import { SOCCER_SIZE } from "./ball.soccer.size.ts";

const VIEW = { yaw: 30, pitch: 24, roll: 8 } as const;
const GLOSS = { gloss: 0.8, shade: "#2a3450", grain: { f: 1.1, a: 0.16 } } as const;
const lit = (s: Surface, seams: ReadonlyArray<readonly V3[]>, width = 0.45): string => s.strokes(seams, "#fff", width, { deco: true, opacity: 0.45, dx: 0.3, dy: 0.35 });

const ball = (id: string, en: string, ja: string, spec: BallSpec) => defineBall({ id, en, ja, size: SOCCER_SIZE, spec });

/** The colours of a colourway: the ground, the main colour of the pattern (what `tint` replaces) and the colour of the pentagons or the second tone (what `accent` replaces). */
interface Way {
  ground: string;
  main: string;
  dark: string;
}

// Stars: a five-pointed star on every panel, on a white or a night-blue ground.
const stars = (w: Way): BallSpec => ({
  view: VIEW,
  base: w.main,
  ground: w.ground,
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    const dark = accent ?? w.dark;
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, dark, { ink: true });
    const big = star(5, 0.2, 0.09);
    const small = star(5, 0.12, 0.054);
    out += s.panels([
      ...t.hexagonCentres.map((c, i) => place(frameAt(c, t.hexagonPentagonSides[i][0]), turned(big, 0.35))),
      ...t.pentagonCentres.map((c, i) => place(frameAt(c, t.pentagons[i][0]), small)),
    ], base, { n: 1 });
    out += s.strokes(t.edges, mix(dark, 0.2), 1.05);
    return out + lit(s, t.edges);
  },
});

// Hexagon outlines: two outlines inside each hexagon, one inside the other, like a honeycomb; the pentagons are solid.
const hexagons = (w: Way): BallSpec => ({
  view: VIEW,
  base: w.main,
  ground: w.ground,
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    const dark = accent ?? w.dark;
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, dark, { ink: true });
    t.hexagons.forEach((h, i) => {
      out += s.strokes([shrink(h, t.hexagonCentres[i], 0.28), shrink(h, t.hexagonCentres[i], 0.58)], base, 1.1, { closed: true });
    });
    out += s.strokes(t.edges, mix(dark, 0.2), 1.1);
    return out + lit(s, t.edges);
  },
});

// Flames: five tongues of flame leave each dark pentagon, an outer one and a lighter inner one.
const flames = (w: Way, inner: string): BallSpec => ({
  view: VIEW,
  base: w.main,
  ground: w.ground,
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    const core = accent ?? inner;
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, w.dark, { ink: true });
    const flame = (r0: number, r1: number, a: number, wd: number) => tongue(spiral(r0, r1, a, 0.75), (u) => wd * Math.min(1, u * 6 + 0.3) * (1 - u) ** 0.75, 3);
    const frames = t.pentagonCentres.map((c, i) => frameAt(c, t.pentagons[i][0]));
    const rings = (r0: number, r1: number, da: number, wd: number): V3[][] => frames.flatMap((f) => [0, 1, 2, 3, 4].map((k) => place(f, flame(r0, r1, Math.PI / 5 + (2 * Math.PI * k) / 5 + da, wd))));
    out += s.panels(rings(0.19, 0.64, -0.1, 0.125), base, { n: 1 });
    out += s.panels(rings(0.21, 0.45, -0.03, 0.06), core, { n: 1 });
    return out + s.strokes(t.edges, mix(w.dark, 0.5), 1);
  },
});

// Chevrons: eight gores from pole to pole, every other one coloured, crossed by three bands that bend into a V on each gore, so that round the ball they make a zigzag.
const chevrons = (w: Way): BallSpec => ({
  view: { yaw: 24, pitch: 24, roll: 0 },
  base: w.main,
  ground: w.ground,
  mat: GLOSS,
  draw(s, base, accent) {
    const dark = accent ?? w.dark;
    const tilt = [0, 22, 0] as const;
    const g = gores(8, 0, tilt);
    const at = gorePoint(8, 0, tilt);
    let out = "";
    for (let i = 0; i < 8; i += 2) out += s.panel(g.panels[i], base, { n: 1 });
    for (let i = 0; i < 8; i++) {
      for (const s0 of [-0.28, 0.02, 0.32]) {
        const upper: V3[] = [], lower: V3[] = [];
        for (let j = 0; j <= 4; j++) {
          const u = j / 4;
          const dip = 0.34 * Math.abs(u - 0.5);
          upper.push(at(i, u, s0 + 0.12 + dip));
          lower.push(at(i, u, s0 + dip));
        }
        const band = [...lower, ...upper.reverse()];
        out += s.panel(band, dark, { n: 2 });
        if (s.line) out += s.strokes([band], dark, 0.6, { closed: true });
      }
    }
    out += s.strokes(g.seams, mix(dark, 0.3), 0.7);
    return out + lit(s, g.seams, 0.4);
  },
});

// Swirl: four gores that twist round the ball, two of them in one colour and two in the other.
const swirl = (w: Way): BallSpec => ({
  view: { yaw: 20, pitch: 24, roll: 0 },
  base: w.main,
  ground: w.ground,
  mat: { gloss: 0.9, shade: "#2a3450", grain: { f: 0.8, a: 0.08 } },
  draw(s, base) {
    const g = gores(4, 330, [0, 24, 0], 24, 6);
    let out = "";
    for (const { ring, gore } of g.pieces) {
      if (gore % 2 === 1) continue;
      out += s.panel(ring, base, { n: 4, ink: true });
      out += s.strokes([ring], base, 0.5, { closed: true, deco: true });
    }
    out += s.strokes(g.seams, mix(w.dark, 0.2), 0.9);
    return out + lit(s, g.seams, 0.5);
  },
});

// Metallic: the 32 panels in a polished finish that mirrors the sky above and the ground below, a light metal on the hexagons and a dark one on the pentagons.
const metallic = (w: Way): BallSpec => ({
  view: VIEW,
  base: w.dark,
  ground: w.main,
  mat: { gloss: 1, metal: true, shade: mix(w.dark, -0.4), rim: 0.8 },
  draw(s, base) {
    const t = truncatedIcosahedron();
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
    out += s.strokes(t.edges, mix(base, -0.2), 1.1);
    return out + lit(s, t.edges, 0.55);
  },
});

const BLUE: Way = { ground: "#f4f6fb", main: "#1f56c4", dark: "#12306f" };
const RED: Way = { ground: "#f8f4f2", main: "#d8312f", dark: "#6e1313" };
const NIGHT: Way = { ground: "#16275a", main: "#f2c230", dark: "#0a1230" };
const CYAN: Way = { ground: "#f4f8fa", main: "#12a8c8", dark: "#143a52" };
const MAGENTA: Way = { ground: "#faf4f8", main: "#d62a8c", dark: "#4a1a52" };
const LIME: Way = { ground: "#f6f9ee", main: "#5fb81a", dark: "#1b3a12" };
const FIRE: Way = { ground: "#f6f1e8", main: "#ff6a13", dark: "#1b1b1f" };
const ICE: Way = { ground: "#f2f6fa", main: "#1e8cff", dark: "#0d1b3d" };
const TOXIC: Way = { ground: "#f3f6ea", main: "#2bbf5a", dark: "#241a3a" };
const CHEV_RED: Way = { ground: "#f8f6f2", main: "#d6312e", dark: "#1f2128" };
const CHEV_GREEN: Way = { ground: "#f8f6ee", main: "#1fa65a", dark: "#f0c81c" };
const CHEV_BLUE: Way = { ground: "#f6f7fa", main: "#1f5fbf", dark: "#f08a24" };
const SWIRL_BLUE: Way = { ground: "#f6f6f2", main: "#1f5fbf", dark: "#143f86" };
const SWIRL_RED: Way = { ground: "#1f2128", main: "#d6312e", dark: "#d6312e" };
const SWIRL_TEAL: Way = { ground: "#14b0c8", main: "#f08a24", dark: "#0c6d80" };
const GOLD: Way = { ground: "#e3b73a", main: "#e3b73a", dark: "#7a560f" };
const SILVER: Way = { ground: "#cdd3db", main: "#cdd3db", dark: "#4d5662" };
const COBALT: Way = { ground: "#5b93e0", main: "#5b93e0", dark: "#15306a" };

export const BALL_SOCCER_STARS_BLUE = /* @__PURE__ */ ball("ball:soccer-stars-blue", "Soccer, stars, blue", "星柄・青", stars(BLUE));
export const BALL_SOCCER_STARS_RED = /* @__PURE__ */ ball("ball:soccer-stars-red", "Soccer, stars, red", "星柄・赤", stars(RED));
export const BALL_SOCCER_STARS_NIGHT = /* @__PURE__ */ ball("ball:soccer-stars-night", "Soccer, stars, night", "星柄・夜空", stars(NIGHT));

export const BALL_SOCCER_HEXAGONS_CYAN = /* @__PURE__ */ ball("ball:soccer-hexagons-cyan", "Soccer, hexagons, cyan", "六角形柄・シアン", hexagons(CYAN));
export const BALL_SOCCER_HEXAGONS_MAGENTA = /* @__PURE__ */ ball("ball:soccer-hexagons-magenta", "Soccer, hexagons, magenta", "六角形柄・マゼンタ", hexagons(MAGENTA));
export const BALL_SOCCER_HEXAGONS_LIME = /* @__PURE__ */ ball("ball:soccer-hexagons-lime", "Soccer, hexagons, lime", "六角形柄・ライム", hexagons(LIME));

export const BALL_SOCCER_FLAMES_FIRE = /* @__PURE__ */ ball("ball:soccer-flames-fire", "Soccer, flames, fire", "炎柄・ファイア", flames(FIRE, "#ffd21f"));
export const BALL_SOCCER_FLAMES_ICE = /* @__PURE__ */ ball("ball:soccer-flames-ice", "Soccer, flames, ice", "炎柄・アイス", flames(ICE, "#c4e8ff"));
export const BALL_SOCCER_FLAMES_TOXIC = /* @__PURE__ */ ball("ball:soccer-flames-toxic", "Soccer, flames, toxic", "炎柄・トキシック", flames(TOXIC, "#dcf23a"));

export const BALL_SOCCER_CHEVRONS_RED = /* @__PURE__ */ ball("ball:soccer-chevrons-red", "Soccer, chevrons, red", "シェブロン柄・赤", chevrons(CHEV_RED));
export const BALL_SOCCER_CHEVRONS_GREEN = /* @__PURE__ */ ball("ball:soccer-chevrons-green", "Soccer, chevrons, green", "シェブロン柄・緑", chevrons(CHEV_GREEN));
export const BALL_SOCCER_CHEVRONS_BLUE = /* @__PURE__ */ ball("ball:soccer-chevrons-blue", "Soccer, chevrons, blue", "シェブロン柄・青", chevrons(CHEV_BLUE));

export const BALL_SOCCER_SWIRL_BLUE = /* @__PURE__ */ ball("ball:soccer-swirl-blue", "Soccer, swirl, blue", "渦巻き柄・青", swirl(SWIRL_BLUE));
export const BALL_SOCCER_SWIRL_RED = /* @__PURE__ */ ball("ball:soccer-swirl-red", "Soccer, swirl, red", "渦巻き柄・赤", swirl(SWIRL_RED));
export const BALL_SOCCER_SWIRL_TEAL = /* @__PURE__ */ ball("ball:soccer-swirl-teal", "Soccer, swirl, teal", "渦巻き柄・ティール", swirl(SWIRL_TEAL));

export const BALL_SOCCER_METALLIC_GOLD = /* @__PURE__ */ ball("ball:soccer-metallic-gold", "Soccer, metallic, gold", "メタリック・金", metallic(GOLD));
export const BALL_SOCCER_METALLIC_SILVER = /* @__PURE__ */ ball("ball:soccer-metallic-silver", "Soccer, metallic, silver", "メタリック・銀", metallic(SILVER));
export const BALL_SOCCER_METALLIC_COBALT = /* @__PURE__ */ ball("ball:soccer-metallic-cobalt", "Soccer, metallic, cobalt", "メタリック・コバルト", metallic(COBALT));
