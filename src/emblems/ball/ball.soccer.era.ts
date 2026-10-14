// Soccer balls in the style of an era's match balls, each on the construction of its time and with graphics of our own that only evoke the period: the black and white 32 panels of the early 1970s, curved
// triangles in threes (late 1970s, 1980s and 1990s), a triangular sweep, the 14-panel propeller, the 8-panel grooved ball, 6 panels with ribbons, pixel blocks, 20 panels with a shell of lines, and a modern
// high-visibility training ball. The panel counts are facts of the constructions (docs/references.md); the drawings are not the real balls' and use none of their marks, names or patterns.
import { type BallSpec, type Surface, defineBall } from "./ball.engine.ts";
import { mix } from "./ball.core.ts";
import { frameAt, noise, place, spiral, tongue, turned } from "./ball.decal.ts";
import type { V3 } from "./ball.math.ts";
import { shrink, truncatedIcosahedron, type Truncated } from "./ball.polyhedra.ts";
import { gorePoint, gores, icosahedron, octahedron8, propellers14 } from "./ball.tilings.ts";
import { SOCCER_SIZE } from "./ball.soccer.size.ts";

const INK = "#1b1d22";
const WHITE = "#f8f8f6";
const GREY = "#6b7180";
const VIEW = { yaw: 30, pitch: 24, roll: 8 } as const;
const GLOSS = { gloss: 0.8, shade: "#2a3450", grain: { f: 1.1, a: 0.16 } } as const;

/** The highlight laid on a seam, so that it reads as a raised edge. */
const lit = (s: Surface, seams: ReadonlyArray<readonly V3[]>, width = 0.45): string => s.strokes(seams, "#fff", width, { deco: true, opacity: 0.45, dx: 0.3, dy: 0.35 });

const ball = (id: string, en: string, ja: string, spec: BallSpec) => defineBall({ id, en, ja, size: SOCCER_SIZE, spec });

/** What lies on the 32 panels: a frame at the middle of each hexagon, with x toward one of the three sides it shares with a pentagon. */
const hexFrames = (t: Truncated) => t.hexagonCentres.map((c, i) => frameAt(c, t.hexagonPentagonSides[i][0]));

/** Three curved blades in a pinwheel about the middle of a hexagon (a triad): each is a leaf along a spiral, `sweep` radians of turn, `w` wide. */
const triad = (r0: number, r1: number, sweep: number, w: number, start = 0.5): Array<ReturnType<typeof tongue>> =>
  [0, 1, 2].map((k) => tongue(spiral(r0, r1, start + (2 * Math.PI * k) / 3, sweep), (u) => w * Math.min(1, u * 5) * (1 - u) ** 0.7, 5));

/** The hexagons of a 32-panel ball carrying a triad each, over a ground; `colours` has one fill for each blade. */
function laidTriads(s: Surface, t: Truncated, frames: ReturnType<typeof hexFrames>, blades: ReturnType<typeof triad>, colours: readonly string[], edge: string, ew = 0.5): string {
  let out = "";
  for (let k = 0; k < blades.length; k++) out += s.panels(frames.map((f) => place(f, blades[k])), colours[k % colours.length], { n: 1 });
  // The colour drawing is filled and needs no outline; the line drawing is the outline alone.
  if (s.line) {
    const rings: V3[][] = [];
    for (const f of frames) for (const b of blades) rings.push(place(f, b));
    out += s.strokes(rings, edge, ew, { closed: true });
  }
  void t;
  return out;
}

/** The 1970s: twelve black pentagons with a white ring round a small boss, and twenty white hexagons that each hold a pale dished hexagon and a dot. */
export const BALL_SOCCER_1970_BLACK_WHITE = /* @__PURE__ */ ball("ball:soccer-1970-black-white", "Soccer, 1970s black-white", "70年代風・白黒", {
  view: VIEW,
  base: INK,
  ground: WHITE,
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    let out = "";
    t.hexagons.forEach((h, i) => {
      out += s.panel(shrink(h, t.hexagonCentres[i], 0.5), accent ?? "#e4e5e1", { n: 2 });
    });
    for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
    t.pentagons.forEach((p, i) => {
      out += s.strokes([shrink(p, t.pentagonCentres[i], 0.45)], "#fff", 0.5, { closed: true, deco: true, opacity: 0.85 });
    });
    out += s.dots(t.hexagonCentres, 0.03, base, { light: false });
    out += s.strokes(t.edges, GREY, 1.15);
    return out + lit(s, t.edges);
  },
});

/** The late 1970s: a pinwheel of three bold curved triangles on each of the twenty hexagons, black on white; their points meet round each of the twelve pentagons. */
export const BALL_SOCCER_1978_TRIAD = /* @__PURE__ */ ball("ball:soccer-1978-triad", "Soccer, late-1970s triads", "70年代後期風・三つ巴", {
  view: VIEW,
  base: INK,
  ground: WHITE,
  mat: GLOSS,
  draw(s, base) {
    const t = truncatedIcosahedron();
    let out = laidTriads(s, t, hexFrames(t), triad(0.0, 0.32, -0.85, 0.17, 0.3), [base], base, 0.4);
    out += s.strokes(t.edges, mix(base, 0.45), 0.8);
    return out + lit(s, t.edges, 0.4);
  },
});

/** The 1980s: the same triads in a warm clay, each blade ornamented with a row of white beads along its spine, and gold-ringed dark pentagons. */
export const BALL_SOCCER_1986_DECORATED_TRIAD = /* @__PURE__ */ ball("ball:soccer-1986-decorated-triad", "Soccer, decorated triads", "80年代風・飾り三つ巴", {
  view: VIEW,
  base: "#c4563a",
  ground: WHITE,
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    const hf = hexFrames(t);
    const gold = accent ?? "#e0a526";
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, "#3a2a2c", { ink: true });
    t.pentagons.forEach((p, i) => {
      out += s.strokes([shrink(p, t.pentagonCentres[i], 0.4)], gold, 0.6, { closed: true, deco: true });
    });
    out += laidTriads(s, t, hf, triad(0.0, 0.31, -0.85, 0.16, 0.3), [base], mix(base, -0.45), 0.5);
    const spines: V3[][] = [];
    for (const f of hf) for (let k = 0; k < 3; k++) spines.push(Array.from({ length: 6 }, (_, j) => f(...(spiral(0.06, 0.26, 0.3 + (2 * Math.PI * k) / 3, -0.85)(j / 5) as [number, number]))));
    out += s.strokes(spines, "#fff7e6", 1.1, { dash: "0 2.3", deco: true });
    return out + s.strokes(t.edges, mix(base, -0.5), 1);
  },
});

/** The 1990s: the triads in three colours (blue, red and gold) on a white ground, with deep navy pentagons. */
export const BALL_SOCCER_1998_COLOURED_TRIAD = /* @__PURE__ */ ball("ball:soccer-1998-coloured-triad", "Soccer, coloured triads", "90年代風・色つき三つ巴", {
  view: VIEW,
  base: "#1e56b8",
  ground: WHITE,
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, mix(base, -0.55), { ink: true });
    out += laidTriads(s, t, hexFrames(t), triad(0.0, 0.31, 0.9, 0.16, 0.2), [base, "#d8322f", accent ?? "#f2bf1b"], "#ffffff", 0.35);
    out += s.strokes(t.edges, GREY, 0.9);
    return out + lit(s, t.edges, 0.4);
  },
});

/** The early 2000s: long thin triangles that sweep across each hexagon from one side to the next, in graphite and gold, with a red spark, over charcoal pentagons. */
export const BALL_SOCCER_2002_TRIANGLE_SWEEP = /* @__PURE__ */ ball("ball:soccer-2002-triangle-sweep", "Soccer, triangle sweep", "00年代風・三角の流れ", {
  view: VIEW,
  base: "#4a4f5c",
  ground: "#f3efe4",
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    const gold = accent ?? "#d9a420";
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, mix(base, -0.45), { ink: true });
    const big = [[0.3, -0.03], [0.02, 0.2], [-0.05, 0.04]] as const;
    const small = [[0.27, 0.035], [0.12, 0.16], [0.1, 0.07]] as const;
    const frames = hexFrames(t);
    const turns = [0, 1, 2].map((k) => (2 * Math.PI * k) / 3);
    out += s.panels(frames.flatMap((f) => turns.map((a) => place(f, turned(big, a)))), base, { n: 1 });
    out += s.panels(frames.flatMap((f) => turns.map((a) => place(f, turned(small, a + 0.1)))), gold, { n: 1 });
    out += s.strokes(t.edges, GREY, 0.9);
    return out + lit(s, t.edges, 0.4);
  },
});

/** The mid 2000s: the 14-panel propeller layout (six propellers and eight triangles), with a fine line following each curved seam inside the panel, and a small ring on each triangle. */
export const BALL_SOCCER_2006_PROPELLER = /* @__PURE__ */ ball("ball:soccer-2006-propeller", "Soccer, 14-panel propeller", "14枚貼り・プロペラ形", {
  view: { yaw: 40, pitch: 36, roll: 0 },
  base: "#1f232b",
  ground: "#f4f2ea",
  mat: GLOSS,
  draw(s, base, accent) {
    const g = propellers14();
    const gold = accent ?? "#c9962b";
    let out = "";
    for (const p of g.triangles) out += s.panel(p, base, { n: 6, ink: true });
    g.triangles.forEach((p, i) => {
      out += s.panel(shrink(p, g.triangleCentres[i], 0.55), gold, { n: 4 });
    });
    // A line a little inside each propeller, following its seam.
    g.propellers.forEach((p, i) => {
      out += s.strokes([shrink(p, g.propellerCentres[i], 0.16).filter((_, j) => j % 2 === 0)], gold, 0.55, { closed: true, deco: true, opacity: 0.95 });
    });
    out += s.strokes(g.seams, "#3a3f4a", 1.4);
    return out + lit(s, g.seams);
  },
});

/** The early 2010s: the 8-panel layout, an octahedron whose edges are bent into S curves, with grooves for seams and fine contour lines across each panel. */
export const BALL_SOCCER_2010_GROOVED = /* @__PURE__ */ ball("ball:soccer-2010-grooved", "Soccer, 8-panel grooved", "8枚貼り・溝つき", {
  view: { yaw: 32, pitch: 26, roll: 0 },
  base: "#e9ecee",
  ground: "#eceff0",
  mat: { gloss: 0.7, shade: "#33404c", grain: { f: 1.6, a: 0.2 } },
  draw(s, base, accent) {
    const g = octahedron8();
    const tone = [base, accent ?? "#cfe3d6"];
    let out = "";
    g.panels.forEach((p, i) => {
      if (g.parity[i] === 1) out += s.panel(p, tone[1], { n: 1 });
    });
    const groove = "#3f4b57";
    g.panels.forEach((p, i) => {
      out += s.strokes([shrink(p, g.centres[i], 0.4).filter((_, j) => j % 2 === 0)], groove, 0.35, { closed: true, deco: true, opacity: 0.6 });
    });
    out += s.strokes(g.seams, groove, 1.8);
    out += s.strokes(g.seams, "#fff", 0.55, { deco: true, opacity: 0.55, dx: 0.5, dy: 0.55 });
    return out;
  },
});

/** The six gores of the thermobonded layout (see ball.soccer.panels.ts), for the layers drawn on them: only the gores whose tone is not the ground's are painted. */
function sixGores(s: Surface, tilt: readonly [number, number, number], tone: string, twist = 180): { g: ReturnType<typeof gores>; out: string } {
  const g = gores(6, twist, tilt);
  let out = "";
  for (const { ring, gore } of g.pieces) {
    if (gore % 3 !== 1) continue;
    out += s.panel(ring, tone, { n: 1 });
    out += s.strokes([ring], tone, 0.5, { closed: true, deco: true });
  }
  return { g, out };
}

/** The mid 2010s: six twisted panels in white, crossed by wide ribbons that swirl round the ball in teal, orange and violet. */
export const BALL_SOCCER_2014_RIBBON = /* @__PURE__ */ ball("ball:soccer-2014-ribbon", "Soccer, 6-panel ribbons", "6枚貼り・リボン柄", {
  view: { yaw: 20, pitch: 22, roll: 0 },
  base: "#14a7a0",
  ground: "#f5f5f1",
  mat: { gloss: 0.9, shade: "#2a3450", grain: { f: 0.7, a: 0.07 } },
  draw(s, base, accent) {
    const { g, out: panels } = sixGores(s, [0, 0, 28], "#ebebe5");
    const at = gorePoint(6, 180, [0, 0, 28]);
    const cols = [base, accent ?? "#f08a24", "#7a4bc2"];
    let out = panels;
    // Three ribbons on a gore, spiralling: each is a leaf whose spine follows a curve across the gore.
    for (let i = 0; i < 6; i++) {
      for (let k = 0; k < 2; k++) {
        const c = cols[(i + k) % 3];
        const left: V3[] = [];
        const right: V3[] = [];
        const s0 = -0.75 + k * 0.7 + (i % 2) * 0.12;
        for (let j = 0; j <= 10; j++) {
          const u = j / 10;
          const lat = s0 + 0.5 * u;
          const w = 0.1 + 0.16 * Math.sin(Math.PI * u) ** 0.8;
          left.push(at(i, 0.12 + 0.76 * u, lat));
          right.push(at(i, 0.12 + 0.76 * u, lat + w));
        }
        out += s.panel([...left, ...right.reverse()], c, { n: 1 });
      }
    }
    out += s.strokes(g.seams, GREY, 0.85);
    return out + lit(s, g.seams, 0.5);
  },
});

/** The late 2010s: six panels covered with square pixel blocks, thick where the ball is dark and thinning out toward the lighter side. */
export const BALL_SOCCER_2018_PIXEL = /* @__PURE__ */ ball("ball:soccer-2018-pixel", "Soccer, pixel blocks", "ピクセル柄", {
  view: { yaw: 20, pitch: 22, roll: 0 },
  base: "#2a2f3a",
  ground: "#f2f2ee",
  mat: { gloss: 0.9, shade: "#2a3450", grain: { f: 0.7, a: 0.07 } },
  draw(s, base, accent) {
    const { g, out: panels } = sixGores(s, [0, 0, 28], "#e7e7e1", 90);
    const pal = [base, mix(base, 0.4), accent ?? "#d4472f", "#e6b53a", mix(base, 0.4)];
    let out = panels;
    const groups: V3[][][] = pal.map(() => []);
    const rows = 17, cols = 34;
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 0; c < cols; c++) {
        const lon = (2 * Math.PI * c) / cols, lat = Math.PI * (r / rows - 0.5);
        // Dense on one side (longitude near 0.8 turns), a few scattered elsewhere.
        const band = Math.cos(lon - 3.2 * lat - 4.1);
        const density = band > 0 ? 0.04 + 0.8 * band ** 0.9 : 0.02;
        if (noise(r, c) > density) continue;
        const d = (Math.PI / cols) * 1.7, e = (Math.PI / rows) * 0.85;
        const corner = (a: number, b: number): V3 => [Math.sin(lon + a) * Math.cos(lat + b), Math.sin(lat + b), Math.cos(lon + a) * Math.cos(lat + b)];
        const k = Math.floor(noise(c, r + 50) * pal.length);
        groups[k].push([corner(0, 0), corner(d, 0), corner(d, e), corner(0, e)]);
      }
    }
    pal.forEach((c, k) => {
      out += s.panels(groups[k], c, { n: 1, ink: k === 0 });
    });
    out += s.strokes(g.seams, GREY, 0.85);
    return out + lit(s, g.seams, 0.5);
  },
});

/** The early 2020s: twenty triangles (an icosahedron) in three warm tones, each carrying a shell of nested edges and a trail of speed lines. */
export const BALL_SOCCER_2022_SPEED_SHELL = /* @__PURE__ */ ball("ball:soccer-2022-speed-shell", "Soccer, 20-panel shell", "20枚貼り・貝殻柄", {
  view: { yaw: 30, pitch: 24, roll: 8 },
  base: "#8c1d3b",
  ground: "#f1ece0",
  mat: GLOSS,
  draw(s, base, accent) {
    const g = icosahedron();
    const gold = accent ?? "#d9a93a";
    const fill = [mix(base, 0.0), "#f1ece0", gold, mix(base, 0.35)];
    let out = "";
    fill.forEach((c, k) => {
      out += s.panels(g.panels.filter((_, i) => g.colour[i] === k), c, { n: 4, ink: k === 0 });
    });
    g.panels.forEach((p, i) => {
      const inner = g.colour[i] === 0 ? "#f1ece0" : base;
      for (const k of [0.3, 0.58]) out += s.strokes([shrink(p, g.centres[i], k)], inner, 0.45, { closed: true, deco: true, opacity: 0.85 });
    });
    out += s.strokes(g.seams, mix(base, -0.5), 1.1);
    return out + lit(s, g.seams);
  },
});

/** A modern high-visibility training ball: 32 panels in fluorescent yellow-green, hot pink pentagons ringed in black, and three dark speed marks across each hexagon. */
export const BALL_SOCCER_TRAINING_HIGH_VIS = /* @__PURE__ */ ball("ball:soccer-training-high-vis", "Soccer, high-vis training", "蛍光トレーニングボール", {
  view: VIEW,
  base: "#ff2f7d",
  ground: "#d8f21f",
  mat: { gloss: 0.7, shade: "#3a5010", grain: { f: 1.3, a: 0.2 } },
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
    t.pentagons.forEach((p, i) => {
      out += s.strokes([shrink(p, t.pentagonCentres[i], 0.4)], accent ?? INK, 0.7, { closed: true, deco: true });
    });
    const dash = [[-0.1, -0.06], [0.1, -0.06], [0.1, -0.035], [-0.1, -0.035]] as const;
    const moved = dash.map(([x, y]) => [x + 0.05, y - 0.04] as const);
    out += s.panels(hexFrames(t).flatMap((f) => [0, 1, 2].map((k) => place(f, turned(moved, (2 * Math.PI * k) / 3 + 0.5)))), accent ?? INK, { n: 1 });
    out += s.strokes(t.edges, "#6d8a10", 1.1);
    return out + lit(s, t.edges);
  },
});
