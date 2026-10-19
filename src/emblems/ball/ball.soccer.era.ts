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

/** The 1970s: twelve dark slate pentagons and twenty white hexagons that each hold a pale dished hexagon. */
export const BALL_SOCCER_RETRO_PENTAGONS = /* @__PURE__ */ ball("ball:soccer-retro-pentagons", "Soccer, 1970s black-white", "70年代風・白黒", {
  view: VIEW,
  base: "#262c3b",
  ground: WHITE,
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    let out = "";
    t.hexagons.forEach((h, i) => {
      out += s.panel(shrink(h, t.hexagonCentres[i], 0.68), accent ?? "#dfe3ea", { n: 2 });
    });
    for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
    out += s.strokes(t.edges, GREY, 1.15);
    return out + lit(s, t.edges);
  },
});

/** The late 1970s: a trefoil of three straight leaves on each of the twenty hexagons, navy on white, each pointing at a pentagon. */
export const BALL_SOCCER_RETRO_LEAVES = /* @__PURE__ */ ball("ball:soccer-retro-leaves", "Soccer, late-1970s triads", "70年代後期風・三つ巴", {
  view: VIEW,
  base: "#243a63",
  ground: WHITE,
  mat: GLOSS,
  draw(s, base) {
    const t = truncatedIcosahedron();
    let out = laidTriads(s, t, hexFrames(t), triad(0.0, 0.34, 0, 0.2, 0), [base], base, 0.4);
    out += s.strokes(t.edges, mix(base, 0.45), 0.8);
    return out + lit(s, t.edges, 0.4);
  },
});

/** The 1980s: a five-petal rosette on each hexagon in a warm clay, each petal ornamented with a row of white beads along its spine, and gold-ringed dark pentagons. */
export const BALL_SOCCER_RETRO_ROSETTE = /* @__PURE__ */ ball("ball:soccer-retro-rosette", "Soccer, decorated triads", "80年代風・飾り三つ巴", {
  view: VIEW,
  base: "#d1633a",
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
    const petals = [0, 1, 2, 3, 4].map((k) => tongue(spiral(0.03, 0.27, (2 * Math.PI * k) / 5, 0), (u) => 0.1 * Math.min(1, u * 5) * (1 - u) ** 0.7, 3));
    out += laidTriads(s, t, hf, petals, [base], mix(base, -0.45), 0.5);
    const spines: V3[][] = [];
    for (const f of hf) for (let k = 0; k < 5; k++) spines.push(Array.from({ length: 2 }, (_, j) => f(...(spiral(0.07, 0.24, (2 * Math.PI * k) / 5, 0)(j) as [number, number]))));
    out += s.strokes(spines, "#fff7e6", 1.1, { dash: "0 2.3", deco: true });
    return out + s.strokes(t.edges, mix(base, -0.5), 1);
  },
});

/** The 1980s, second version: a six-armed star on each hexagon in deep teal with a saffron centre, over cream hexagons, with navy pentagons ringed in cream. */
export const BALL_SOCCER_RETRO_STAR = /* @__PURE__ */ ball("ball:soccer-retro-star", "Soccer, 1980s star", "80年代風・星形", {
  view: VIEW,
  base: "#1f7f86",
  ground: "#f6f0e2",
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    const hf = hexFrames(t);
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, "#1d2b45", { ink: true });
    t.pentagons.forEach((p, i) => {
      out += s.strokes([shrink(p, t.pentagonCentres[i], 0.4)], "#f6f0e2", 0.6, { closed: true, deco: true });
    });
    const ray = [[0.3, 0], [0.11, 0.075], [0.03, 0], [0.11, -0.075]] as const;
    out += s.panels(hf.flatMap((f) => [0, 1, 2, 3, 4, 5].map((k) => place(f, turned(ray, (Math.PI * k) / 3)))), base, { n: 1 });
    out += s.dots(t.hexagonCentres, 0.05, accent ?? "#e9a92b", { light: false });
    out += s.strokes(t.edges, mix(base, -0.5), 1);
    return out + lit(s, t.edges, 0.4);
  },
});

/** The 1990s: a pinwheel of three curved leaves in three colours (green, amber and plum) on a white ground, turning the other way from the 1970s, a solid deep green circle where the three meet, and deep green pentagons. */
export const BALL_SOCCER_RETRO_PINWHEEL = /* @__PURE__ */ ball("ball:soccer-retro-pinwheel", "Soccer, coloured triads", "90年代風・色つき三つ巴", {
  view: VIEW,
  base: "#2f9e63",
  ground: WHITE,
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, mix(base, -0.55), { ink: true });
    out += laidTriads(s, t, hexFrames(t), triad(0.0, 0.31, 0.9, 0.2, 0.2), [base, "#e08a2e", accent ?? "#7d3c98"], "#ffffff", 0.35);
    // A solid circle where the three colours meet, in the pentagons' deep green.
    out += s.dots(t.hexagonCentres, 0.052, mix(base, -0.55), { light: false });
    out += s.strokes(t.edges, GREY, 0.9);
    return out + lit(s, t.edges, 0.4);
  },
});

/** The early 2000s: long kites that sweep across each hexagon, in slate blue and silver, over charcoal pentagons. */
export const BALL_SOCCER_RETRO_KITES = /* @__PURE__ */ ball("ball:soccer-retro-kites", "Soccer, triangle sweep", "00年代風・三角の流れ", {
  view: VIEW,
  base: "#3d5a80",
  ground: "#f3efe4",
  mat: GLOSS,
  draw(s, base, accent) {
    const t = truncatedIcosahedron();
    const gold = accent ?? "#cfd6df";
    let out = "";
    for (const p of t.pentagons) out += s.panel(p, mix(base, -0.45), { ink: true });
    const big = [[0.31, 0], [0.15, 0.11], [-0.03, 0], [0.15, -0.11]] as const;
    const small = [[0.25, 0], [0.15, 0.055], [0.06, 0], [0.15, -0.055]] as const;
    const frames = hexFrames(t);
    const turns = [0, 1, 2].map((k) => (2 * Math.PI * k) / 3);
    out += s.panels(frames.flatMap((f) => turns.map((a) => place(f, turned(big, a)))), base, { n: 1 });
    out += s.panels(frames.flatMap((f) => turns.map((a) => place(f, turned(small, a)))), gold, { n: 1 });
    out += s.strokes(t.edges, GREY, 0.9);
    return out + lit(s, t.edges, 0.4);
  },
});

/** The mid 2000s: the 14-panel layout (six propellers and eight triangles) with a double border: two parallel black lines along every seam (a thin gap between them), and two parallel red lines inside each propeller; white propellers, dark triangles with a red dot. */
export const BALL_SOCCER_14_PANEL_DOUBLE_BORDER = /* @__PURE__ */ ball("ball:soccer-14-panel-double-border", "Soccer, 14-panel propeller", "14枚貼り・プロペラ形", {
  view: { yaw: 40, pitch: 36, roll: 0 },
  base: "#23282f",
  ground: "#f4f2ea",
  mat: GLOSS,
  draw(s, base, accent) {
    const g = propellers14();
    const red = accent ?? "#c8302f";
    const ring = (p: readonly V3[], c: V3, k: number): V3[] => shrink(p, c, k).filter((_, j) => j % 3 === 0);
    let out = "";
    for (const p of g.triangles) out += s.panel(p, base, { n: 6, ink: true });
    out += s.dots(g.triangleCentres, 0.05, red, { light: false });
    // The double red border inside each propeller, two parallel lines following its seam.
    g.propellers.forEach((p, i) => {
      for (const k of [0.2, 0.3]) out += s.strokes([ring(p, g.propellerCentres[i], k)], red, 0.7, { closed: true, deco: true, opacity: 0.95 });
    });
    // The double black border on every seam: two black lines with a thin gap of ground between them.
    out += s.strokes(g.seams, "#16181c", 2.7);
    out += s.strokes(g.seams, "#f4f2ea", 0.8);
    return out + lit(s, g.seams);
  },
});

/** The early 2010s: the 8-panel layout, an octahedron whose edges are bent into S curves, with plain seams: the white panels are plain, and the slate-blue ones carry three white contour lines. */
export const BALL_SOCCER_8_PANEL_PLAIN = /* @__PURE__ */ ball("ball:soccer-8-panel-plain", "Soccer, 8-panel grooved", "8枚貼り・溝つき", {
  view: { yaw: 32, pitch: 26, roll: 0 },
  base: "#f6f8f8",
  ground: "#f6f8f8",
  mat: { gloss: 0.7, shade: "#1f3340", grain: { f: 1.6, a: 0.2 } },
  draw(s, base, accent) {
    const g = octahedron8();
    const tone = [base, accent ?? "#5f86c0"];
    let out = "";
    g.panels.forEach((p, i) => {
      if (g.parity[i] === 1) out += s.panel(p, tone[1], { n: 1 });
    });
    // Contour lines on the blue panels only; the white ones stay plain.
    const groove = "#16262f";
    g.panels.forEach((p, i) => {
      if (g.parity[i] !== 1) return;
      const ink = "#ffffff";
      for (const [k, w] of [[0.72, 0.8], [0.48, 0.8], [0.24, 0.8]] as const) out += s.strokes([shrink(p, g.centres[i], k).filter((_, j) => j % 3 === 0)], ink, w, { closed: true, deco: true, opacity: 0.95 });
    });
    // The grooves: a wide dark channel with a lit lip beside it.
    out += s.strokes(g.seams, groove, 1.3);
    out += s.strokes(g.seams, "#fff", 0.5, { deco: true, opacity: 0.6, dx: 0.4, dy: 0.45 });
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

/** A series of diamonds at the two poles of a six-gore ball, where all the seams meet: three nested diamonds, outer to inner in `cols`. */
function poleDiamonds(s: Surface, at: (i: number, u: number, s: number) => V3, cols: readonly [string, string, string]): string {
  const diamond = (k: number): ReadonlyArray<readonly [number, number]> => [[0.32 * k, 0], [0, 0.19 * k], [-0.32 * k, 0], [0, -0.19 * k]];
  let out = "";
  for (const pole of [1, -1]) {
    const f = frameAt(at(0, 0, pole), at(0, 0.5, pole * 0.8));
    [1, 0.62, 0.26].forEach((k, j) => {
      out += s.panel(place(f, diamond(k)), cols[j], { n: 1 });
    });
  }
  return out;
}

/** The mid 2010s: six twisted panels in white, crossed by straight bands along each panel in blue, amber and magenta, and a series of diamonds at each pole where the seams meet. */
export const BALL_SOCCER_6_PANEL_BANDS = /* @__PURE__ */ ball("ball:soccer-6-panel-bands", "Soccer, 6-panel ribbons", "6枚貼り・リボン柄", {
  view: { yaw: 20, pitch: 22, roll: 0 },
  base: "#3b6fb6",
  ground: "#f5f5f1",
  mat: { gloss: 0.9, shade: "#2a3450", grain: { f: 0.7, a: 0.07 } },
  draw(s, base, accent) {
    const { g, out: panels } = sixGores(s, [0, 0, 28], "#ebebe5");
    const at = gorePoint(6, 180, [0, 0, 28]);
    const cols = [base, accent ?? "#e8b22e", "#c2386a"];
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
          const lat = s0;
          const w = 0.16;
          left.push(at(i, 0.12 + 0.76 * u, lat));
          right.push(at(i, 0.12 + 0.76 * u, lat + w));
        }
        out += s.panel([...left, ...right.reverse()], c, { n: 1 });
      }
    }
    out += s.strokes(g.seams, GREY, 0.85);
    out += poleDiamonds(s, at, [cols[0], "#f5f5f1", cols[1]]);
    return out + lit(s, g.seams, 0.5);
  },
});

/** The late 2010s: six panels covered with small diamonds, thick on one side and thinning out toward the other, and a series of diamonds at each pole where the seams meet. */
export const BALL_SOCCER_6_PANEL_DIAMONDS = /* @__PURE__ */ ball("ball:soccer-6-panel-diamonds", "Soccer, pixel blocks", "ピクセル柄", {
  view: { yaw: 20, pitch: 22, roll: 0 },
  base: "#2a2f3a",
  ground: "#f2f2ee",
  mat: { gloss: 0.9, shade: "#2a3450", grain: { f: 0.7, a: 0.07 } },
  draw(s, base, accent) {
    const { g, out: panels } = sixGores(s, [0, 0, 28], "#e7e7e1", 90);
    const pal = [base, mix(base, 0.4), accent ?? "#1fa39a", "#e6b53a", mix(base, 0.4)];
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
        groups[k].push([corner(d / 2, 0), corner(d, e / 2), corner(d / 2, e), corner(0, e / 2)]);
      }
    }
    pal.forEach((c, k) => {
      out += s.panels(groups[k], c, { n: 1, ink: k === 0 });
    });
    out += s.strokes(g.seams, GREY, 0.85);
    out += poleDiamonds(s, gorePoint(6, 90, [0, 0, 28]), [base, "#e7e7e1", pal[2]]);
    return out + lit(s, g.seams, 0.5);
  },
});

/** The early 2020s: twenty triangles (an icosahedron) in deep blue, cream and sand, each carrying one inner outline and a dot at its middle. */
export const BALL_SOCCER_20_PANEL_DOTS = /* @__PURE__ */ ball("ball:soccer-20-panel-dots", "Soccer, 20-panel shell", "20枚貼り・貝殻柄", {
  view: { yaw: 30, pitch: 24, roll: 8 },
  base: "#1f4f7d",
  ground: "#f1ece0",
  mat: GLOSS,
  draw(s, base, accent) {
    const g = icosahedron();
    const gold = accent ?? "#e4b04a";
    const fill = [mix(base, 0.0), "#f1ece0", gold, mix(base, 0.35)];
    let out = "";
    fill.forEach((c, k) => {
      out += s.panels(g.panels.filter((_, i) => g.colour[i] === k), c, { n: 4, ink: k === 0 });
    });
    g.panels.forEach((p, i) => {
      const inner = g.colour[i] === 0 ? "#f1ece0" : base;
      for (const k of [0.55]) out += s.strokes([shrink(p, g.centres[i], k)], inner, 0.45, { closed: true, deco: true, opacity: 0.85 });
    });
    out += s.dots(g.centres, 0.02, base, { light: false });
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
