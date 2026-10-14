// Baseballs of other times and threads: the early "lemon-peel" ball (four lines of stitching that meet at two points), the figure-8 ball with a seam stitched in red and blue and in black and red (the
// colours of the two leagues' laces in the 1930s), an aged leather one, and an optic yellow 11 inch softball. The figure-8 seam is the parametric curve of ball.math.ts, as for the modern baseball.
import { defineBall } from "./ball.engine.ts";
import { mix } from "./ball.core.ts";
import { across, scuffs } from "./ball.decal.ts";
import { seamedBall } from "./ball.family.seamed.ts";
import { gores } from "./ball.tilings.ts";
import { BALL_BASEBALL } from "./ball.baseball.ts";

const SIZE = BALL_BASEBALL.size!;

/** The 1850s and 1860s: a cover of four pieces sewn along four seams that run from one point to the opposite one, like the peel of a lemon, in aged leather with a dark thread. No rule fixed the ball then, so it is drawn at the size of today's. */
export const BALL_BASEBALL_LEMON_PEEL = /* @__PURE__ */ defineBall({
  id: "ball:baseball-lemon-peel",
  en: "Baseball, lemon-peel",
  ja: "レモンピール型野球ボール",
  size: { ...SIZE, rule: "Official Baseball Rules, Rule 3.01 The Ball (today's size; no rule fixed the ball in the 1850s and 1860s)", note: "Drawn at the size of today's ball. Diameter worked out from the middle of the circumference range." },
  spec: {
    view: { yaw: 18, pitch: 30, roll: -10 },
    base: "#e1cfa6",
    mat: { gloss: 0.25, shade: "#4a3a2a", grain: { f: 1.6, a: 0.2 } },
    draw: (s, base, accent) => {
      const g = gores(4, 0, [0, 28, 0], 24, 4);
      let out = "";
      for (let i = 0; i < 4; i += 2) out += s.panel(g.panels[i], mix(base, -0.07), { n: 1 });
      out += scuffs(s, mix(base, -0.55), mix(base, 0.5), { dark: 10, pale: 5, seed: 4 });
      out += s.strokes(g.seams, "#8a7452", 0.9);
      out += s.strokes(across(g.seams, 0.06, 0.03, 0.012), accent ?? "#5a3a24", 0.85, { ink: false });
      return out;
    },
  },
});

const STITCH = { count: 108, half: 0.075, width: 0.85, lean: 0.032 } as const;
const WHITE = "#f4f0e6";
const common = { size: SIZE, base: WHITE, b: 0.4, view: { yaw: 18, pitch: 28, roll: -10 }, mat: { gloss: 0.3, shade: "#4a3a2a", grain: { f: 1.4, a: 0.12 } }, groove: "#8a7a62" } as const;

/** The figure-8 seam stitched with alternate red and blue stitches (the American League's laces, in the recollection of a 1930s player). */
export const BALL_BASEBALL_RED_BLUE = /* @__PURE__ */ seamedBall({ ...common, id: "ball:baseball-red-blue", en: "Baseball, red and blue", ja: "赤青の縫い糸の野球ボール", stitch: { ...STITCH, colour: "#c4262e", colour2: "#2257a8" } });

/** The figure-8 seam stitched with alternate black and red stitches (the National League's laces, in the same recollection). */
export const BALL_BASEBALL_BLACK_RED = /* @__PURE__ */ seamedBall({ ...common, id: "ball:baseball-black-red", en: "Baseball, black and red", ja: "黒赤の縫い糸の野球ボール", stitch: { ...STITCH, colour: "#c4262e", colour2: "#1d1d20" } });

/** An old ball: the leather gone the colour of tea and scuffed, the red thread faded. */
export const BALL_BASEBALL_VINTAGE_LEATHER = /* @__PURE__ */ seamedBall({
  ...common,
  id: "ball:baseball-vintage-leather",
  en: "Baseball, aged leather",
  ja: "古びた革の野球ボール",
  base: "#d8c08e",
  mat: { gloss: 0.2, shade: "#43301c", grain: { f: 1.7, a: 0.26 } },
  groove: "#7a6240",
  stitch: { ...STITCH, colour: "#a23a2c" },
  wear: { dark: 16, pale: 8, seed: 6 },
});

/** The optic yellow 11 inch softball: 27.9 cm (circumference 27.6 to 28.3 cm, 166.5 to 173.6 g), red stitch, as the WBSC's Slow Pitch rules set it for women and girls. */
export const BALL_SOFTBALL_11_OPTIC = /* @__PURE__ */ seamedBall({
  id: "ball:softball-11-optic",
  en: "Softball, 11 in, optic",
  ja: "11インチ蛍光ソフト",
  size: {
    extentMm: 279.5 / Math.PI,
    diameterMm: 279.5 / Math.PI,
    circumferenceMm: 279.5,
    massG: [166.5, 173.6],
    rule: "WBSC Official Rules of Softball Slow Pitch 2026-2029, Appendix 3 (Ball Standards), B.2 and the 'Ball standards' table: the 27.9 cm (11 in) ball, white or yellow optic cover, red stitch",
    note: "Circumference 27.6 to 28.3 cm. Diameter worked out from the middle of the range. The rule asks for at least 80 stitches in each cover on a flat-seam ball (88 on the 12 in ball); 80 are drawn.",
  },
  base: "#d8e22a",
  b: 0.4,
  view: { yaw: 18, pitch: 28, roll: -10 },
  mat: { gloss: 0.35, shade: "#4c5a10", grain: { f: 1.4, a: 0.12 } },
  groove: "#8a9420",
  stitch: { colour: "#d0262c", count: 80, half: 0.085, width: 0.95, lean: 0.04 },
});
