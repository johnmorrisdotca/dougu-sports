// Vintage soccer balls, in worn leather (tan, brown, chestnut) with the stitching of their time, each on the construction of its period: the hand-stitched casing of the late 1800s (eight long panels and a
// button at each end), the laced ball of the 1900s (eight panels, a round cap at each end and a lace across a slit), the 18 strips of the 1930s (six panels of three strips), the 12 panels of the
// 1950s and the 32 panels of the 1960s. The panels are our own layouts of the sources in docs/references.md; no maker's ball, mark or pattern is drawn.
import { type BallSpec, type Surface, defineBall } from "./ball.engine.ts";
import { blend, mix } from "./ball.core.ts";
import { across, lacing, noise, running, scuffs } from "./ball.decal.ts";
import { paint18, seams18 } from "./ball.family.panelled.ts";
import { type V3, smallCircle } from "./ball.math.ts";
import { truncatedIcosahedron } from "./ball.polyhedra.ts";
import { dodecahedron, gorePoint, gores } from "./ball.tilings.ts";
import { SOCCER_SIZE } from "./ball.soccer.size.ts";

/** The ball the Laws describe from 1872: a sphere 27 to 28 inches (68.6 to 71.1 cm) round. The Laws' mass for the early years is left out, because the secondary sources read disagree on the figure and the year. */
const OLD_SIZE = {
  extentMm: 698.5 / Math.PI,
  diameterMm: 698.5 / Math.PI,
  circumferenceMm: 698.5,
  rule: "Laws of the Game of the Football Association, revised 1872: the ball is a sphere 27 to 28 inches round",
  note: "Before 1872 there was no rule. Diameter worked out from the middle of the circumference range. No mass is given, because the early figures could not be confirmed in a primary text.",
};

const LEATHER = { gloss: 0.22, shade: "#2b1608", grain: { f: 2.1, a: 0.34 } } as const;
const THREAD = "#e9d8b0";

/** A tone of leather: no two panels of old leather are alike. */
const tone = (base: string, i: number, spread = 0.2): string => mix(base, (noise(i, 4) - 0.5) * spread);

/** The seam of leather: a dark crease, with the highlight of its raised edge. */
const crease = (s: Surface, seams: ReadonlyArray<readonly V3[]>, colour: string, width = 1.3): string =>
  s.strokes(seams, colour, width) + s.strokes(seams, "#fff", width * 0.3, { deco: true, opacity: 0.3, dx: 0.25, dy: 0.3 });

const spec = (base: string, view: BallSpec["view"], draw: BallSpec["draw"], shade = LEATHER.shade): BallSpec => ({ view, base, mat: { ...LEATHER, shade }, draw });

/** The long gores, each one panel painted in a tone of the leather (a gore is a lune, so it is cut at the limb as one piece). */
function paintGores(s: Surface, g: ReturnType<typeof gores>, base: string): string {
  let out = "";
  g.panels.forEach((ring, i) => {
    out += s.panel(ring, tone(base, i), { n: 1 });
  });
  return out;
}

const POLES: Array<(g: ReturnType<typeof gores>) => V3> = [(g) => g.seams[0][0], (g) => g.seams[0][g.seams[0].length - 1]];

/** The late 1800s: eight long panels sewn by hand with a visible cross of thread, and a button where they meet at each end. */
export const BALL_SOCCER_1870_HAND_STITCHED = /* @__PURE__ */ defineBall({
  id: "ball:soccer-1870-hand-stitched",
  en: "Soccer ball, hand-stitched",
  ja: "手縫いのサッカーボール",
  size: OLD_SIZE,
  spec: spec("#b98a55", { yaw: 20, pitch: 28, roll: -8 }, (s, base, accent) => {
    const g = gores(8, 0, [0, 28, 0], 24, 4);
    let out = paintGores(s, g, base);
    out += scuffs(s, mix(base, -0.6), mix(base, 0.55), { dark: 18, pale: 8, seed: 2 });
    out += crease(s, g.seams, mix(base, -0.62));
    out += s.strokes(across(g.seams, 0.085, 0.024, 0.013), accent ?? THREAD, 0.75, { deco: true });
    for (const pole of POLES) {
      out += s.dots([pole(g)], 0.1, mix(base, -0.38), { light: true });
      out += s.dots([pole(g)], 0.045, mix(base, -0.62), { light: false });
    }
    return out;
  }),
});

/** The 1900s: eight panels, a round cap at each end, and a slit across which a lace is drawn to shut the casing once the bladder is in. */
export const BALL_SOCCER_1900_LACED = /* @__PURE__ */ defineBall({
  id: "ball:soccer-1900-laced",
  en: "Soccer ball, laced",
  ja: "紐つきのサッカーボール",
  size: OLD_SIZE,
  spec: spec("#8a5a30", { yaw: 24, pitch: 22, roll: 6 }, (s, base, accent) => {
    const g = gores(8, 0, [0, 18, 0], 24, 4);
    const at = gorePoint(8, 0, [0, 18, 0]);
    let out = paintGores(s, g, base);
    const poles = POLES.map((p) => p(g));
    const rim = poles.map((p) => smallCircle(p, 0.32, 40));
    poles.forEach((p, i) => {
      out += s.panel(rim[i], mix(base, -0.16), { n: 1 });
    });
    out += scuffs(s, mix(base, -0.6), mix(base, 0.5), { dark: 18, pale: 8, seed: 5 });
    out += crease(s, g.seams.map((c) => c.slice(3, 22)), mix(base, -0.62), 1.2) + crease(s, rim, mix(base, -0.62), 1.2);
    out += s.strokes(across(g.seams.map((c) => c.slice(3, 22)), 0.1, 0.02), accent ?? THREAD, 0.6, { deco: true });
    const lace = lacing(at(7, 0.5, 0), at(7, 0.5, 0.2), 0.62, 6, 0.032);
    out += s.stroke(lace.slit, mix(base, -0.75), 2.4);
    out += s.dots(lace.eyelets, 0.011, mix(base, -0.7), { light: false });
    out += s.strokes(lace.crossings, accent ?? THREAD, 0.85, { deco: true });
    out += s.strokes(lace.ends, accent ?? THREAD, 0.85, { deco: true });
    return out;
  }),
});

/** The 1930s: eighteen strips, six panels of three, in two tones of leather, the seams stitched in two rows. */
export const BALL_SOCCER_1930_18_PANEL = /* @__PURE__ */ defineBall({
  id: "ball:soccer-1930-18-panel",
  en: "Soccer ball, 18 strips",
  ja: "18枚貼りの革ボール",
  size: OLD_SIZE,
  spec: spec("#9c4f26", { yaw: 28, pitch: 22, roll: 0 }, (s, base, accent) => {
    const light = blend(base, "#d9a56a", 0.55);
    const seams = seams18();
    let out = paint18(s, [[base, light], [light, base], [base, light], [light, base], [base, light], [light, base]]);
    out += scuffs(s, mix(base, -0.6), mix(base, 0.55), { dark: 11, pale: 5, seed: 3 });
    out += crease(s, seams, mix(base, -0.6), 1.15);
    out += s.strokes(running(seams, 0.13), accent ?? THREAD, 0.6, { deco: true });
    return out;
  }),
});

/** The 1950s: twelve pentagons, in four tones of chestnut leather so that no two that touch match, the seams stitched. */
export const BALL_SOCCER_1950_12_PANEL = /* @__PURE__ */ defineBall({
  id: "ball:soccer-1950-12-panel",
  en: "Soccer ball, 12 panels",
  ja: "12枚貼りの革ボール",
  size: OLD_SIZE,
  spec: spec("#7a3a1c", { yaw: 30, pitch: 24, roll: 8 }, (s, base, accent) => {
    const g = dodecahedron();
    const fill = [mix(base, 0.1), mix(base, -0.12), mix(base, 0.26), mix(base, 0.02)];
    let out = "";
    g.panels.forEach((p, i) => {
      out += s.panel(p, fill[g.colour[i]], { n: 6, ink: g.colour[i] === 1 });
    });
    out += scuffs(s, mix(base, -0.6), mix(base, 0.55), { dark: 12, pale: 5, seed: 7 });
    out += crease(s, g.seams, mix(base, -0.6), 1.2);
    out += s.strokes(running(g.seams, 0.11), accent ?? THREAD, 0.55, { deco: true });
    return out;
  }),
});

/** The 1960s: the 32 panels (twelve pentagons and twenty hexagons) in leather, tan hexagons and chestnut pentagons, stitched along the seams. */
export const BALL_SOCCER_1960_32_PANEL_LEATHER = /* @__PURE__ */ defineBall({
  id: "ball:soccer-1960-32-panel-leather",
  en: "Soccer ball, 32 leather",
  ja: "32枚貼りの革ボール",
  size: SOCCER_SIZE,
  spec: {
    ...spec("#6e3517", { yaw: 30, pitch: 24, roll: 8 }, (s, base, accent) => {
      const t = truncatedIcosahedron();
      let out = "";
      for (const p of t.pentagons) out += s.panel(p, base, { ink: true });
      out += scuffs(s, mix(base, -0.5), "#f0d2a8", { dark: 6, pale: 3, seed: 11 });
      out += crease(s, t.edges, mix(base, -0.55), 1.1);
      out += s.strokes(running(t.edges, 0.13), accent ?? THREAD, 0.5, { deco: true });
      return out;
    }),
    ground: "#d6a976",
  },
});
