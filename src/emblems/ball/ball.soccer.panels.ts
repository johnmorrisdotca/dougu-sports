// Soccer balls with other panel counts than the classic 32, each worked out in true 3D from a tiling of the sphere (see ball.tilings.ts): 26 panels, 18, 14, 12 and a thermobonded 6; and the same
// constructions, with the classic one, in winter orange and in high-visibility yellow. Generic constructions only: no brand's or tournament's ball or graphics.
import { type BallSpec, type Surface, defineBall } from "./ball.engine.ts";
import { blend, mix } from "./ball.core.ts";
import { strips18 } from "./ball.family.panelled.ts";
import type { V3 } from "./ball.math.ts";
import { truncatedIcosahedron } from "./ball.polyhedra.ts";
import { dodecahedron, gores, propellers14, rhombicuboctahedron } from "./ball.tilings.ts";
import { CLASSIC_HOME, SOCCER_SIZE } from "./ball.soccer.size.ts";

/** The tones a construction is laid in: the light panels, the dark ones, two in between, and the seam. */
export interface Tones {
  light: string;
  dark: string;
  mid: string;
  /** A third tone between the light and the mid one, for a third kind of panel. */
  deep: string;
  seam: string;
  /** What a layout lays between its panels and its seams (the print of a ball that has one), if it has any. */
  under?: (s: Surface) => string;
}

export type Layout = (s: Surface, t: Tones) => string;

const INK = "#1e2025";
const WHITE = "#f8f8f6";
const SEAM = "#6b7180";

/** The highlight laid on a seam, so that it reads as a raised edge. */
const lit = (s: Surface, seams: ReadonlyArray<readonly V3[]>, width = 0.45): string => s.strokes(seams, "#fff", width, { deco: true, opacity: 0.45, dx: 0.3, dy: 0.35 });

export const classic: Layout = (s, t) => {
  const g = truncatedIcosahedron();
  let out = "";
  for (const p of g.pentagons) out += s.panel(p, t.dark, { ink: true });
  out += t.under?.(s) ?? "";
  out += s.strokes(g.edges, t.seam, 1.15);
  return out + lit(s, g.edges);
};

/** 26 panels: eight triangles dark, the six squares on the cube's faces mid, the twelve on its edges light. */
const panels26: Layout = (s, t) => {
  const g = rhombicuboctahedron();
  const fill = [t.dark, t.mid, t.light];
  let out = "";
  g.panels.forEach((p, i) => {
    out += s.panel(p, fill[g.kinds[i]], { n: 6, ink: g.kinds[i] === 0 });
  });
  out += s.strokes(g.seams, t.seam, 1.15);
  return out + lit(s, g.seams);
};

/** 18 panels: three strips on each face of a cube, the strips of neighbouring faces square to each other; dark and light in turn. */
const panels18: Layout = (s, t) =>
  strips18(
    s,
    [
      [t.light, t.dark],
      [t.dark, t.light],
      [t.light, t.dark],
      [t.dark, t.light],
      [t.light, t.dark],
      [t.dark, t.light],
    ],
    t.seam,
    1.15,
  );

/** 14 panels: eight triangles dark and six propellers in three tones, one for each axis of the cube (so no two that touch match). */
const panels14: Layout = (s, t) => {
  const g = propellers14();
  const tone = [t.mid, t.deep, t.light];
  let out = "";
  g.propellers.forEach((p, i) => {
    out += s.panel(p, tone[g.axis[i]], { n: 1 });
  });
  for (const p of g.triangles) out += s.panel(p, t.dark, { n: 6, ink: true });
  out += s.strokes(g.seams, t.seam, 1.15);
  return out + lit(s, g.seams);
};

/** 12 panels: a dodecahedron, its pentagons in four tones so that no two neighbours match. */
const panels12: Layout = (s, t) => {
  const g = dodecahedron();
  const fill = [t.light, t.dark, t.light, t.mid];
  let out = "";
  g.panels.forEach((p, i) => {
    out += s.panel(p, fill[g.colour[i]], { n: 6, ink: g.colour[i] === 1 });
  });
  out += s.strokes(g.seams, t.seam, 1.15);
  return out + lit(s, g.seams);
};

/** 6 panels, thermobonded: six twisted gores whose long seams run pole to pole as shallow grooves, and no stitching. */
const panels6: Layout = (s, t) => {
  const g = gores(6, 180, [0, 0, 28]);
  const tone = [t.light, t.mid, t.dark];
  let out = "";
  // A gore is cut across into four pieces, each filled alike and edged in its own colour so that no hairline shows between them.
  for (const { ring, gore } of g.pieces) {
    const fill = tone[gore % 3];
    out += s.panel(ring, fill, { n: 1, ink: gore % 3 === 2 });
    out += s.strokes([ring], fill, 0.5, { closed: true, deco: true });
  }
  out += s.strokes(g.seams, t.seam, 0.85);
  return out + lit(s, g.seams, 0.5);
};

export const LAYOUTS = { classic, 26: panels26, 18: panels18, 14: panels14, 12: panels12, 6: panels6 } as const;
export type Construction = keyof typeof LAYOUTS;

interface Colourway {
  /** The main colour: what `tint` replaces. */
  base: string;
  /** The second colour, which `accent` replaces. */
  accent: string;
}

/** The black-and-white ball, winter orange (an orange that shows against snow and in low light) and high-visibility yellow, with dark panels. */
const COLOURWAYS = {
  white: { base: INK, accent: "#d9dde6" },
  orange: { base: "#ff6a13", accent: INK },
  yellow: { base: "#e8f21c", accent: INK },
} as const satisfies Record<string, Colourway>;
type Way = keyof typeof COLOURWAYS;

const gloss = { gloss: 0.8, shade: "#2a3450", grain: { f: 1.1, a: 0.16 } } as const;

/** The spec of a construction in a colourway. The black-and-white ball is laid on a white ground with `base` the dark panels; a coloured one is laid on `base`, with the dark panels `accent`. */
function specOf(construction: Construction, way: Way, view: BallSpec["view"]): BallSpec {
  const layout = LAYOUTS[construction];
  if (way === "white") {
    return {
      view,
      base: INK,
      ground: WHITE,
      mat: construction === 6 ? { ...gloss, gloss: 0.9, grain: { f: 0.7, a: 0.07 } } : gloss,
      home: construction === "classic" ? CLASSIC_HOME : undefined,
      draw: (s, base, accent, _colors, custom) => layout(s, { light: WHITE, dark: base, mid: accent ?? "#dfe2ea", deep: blend(accent ?? "#dfe2ea", base, 0.12), seam: SEAM, under: construction === "classic" ? (u) => custom?.printer?.(u, custom.print, "soccer", [custom.paint?.body ?? WHITE]) ?? "" : undefined }),
    };
  }
  const c = COLOURWAYS[way];
  return {
    view,
    base: c.base,
    mat: { ...(construction === 6 ? { ...gloss, gloss: 0.9, grain: { f: 0.7, a: 0.07 } } : gloss), shade: mix(c.base, -0.65) },
    home: construction === "classic" ? CLASSIC_HOME : undefined,
    draw: (s, base, accent, _colors, custom) => layout(s, { light: base, dark: accent ?? c.accent, mid: blend(base, "#ffffff", 0.4), deep: blend(base, "#ffffff", 0.18), seam: mix(base, -0.5), under: construction === "classic" ? (u) => custom?.printer?.(u, custom.print, "soccer", [base]) ?? "" : undefined }),
  };
}

/** The id, and the English and Japanese names, of each construction in each colourway (short, because the name is the accessible name: 26 characters in English and 12 in Japanese at most). */
const NAMES: Record<Construction, Record<Way, { id: string; en: string; ja: string }>> = {
  classic: {
    white: { id: "soccer", en: "Soccer ball", ja: "サッカーボール" },
    orange: { id: "soccer-orange", en: "Soccer ball, orange", ja: "32枚貼り・オレンジ" },
    yellow: { id: "soccer-yellow", en: "Soccer ball, yellow", ja: "32枚貼り・蛍光イエロー" },
  },
  26: {
    white: { id: "soccer-26", en: "Soccer ball, 26 panels", ja: "26枚貼りサッカーボール" },
    orange: { id: "soccer-26-orange", en: "Soccer 26 panels, orange", ja: "26枚貼り・オレンジ" },
    yellow: { id: "soccer-26-yellow", en: "Soccer 26 panels, yellow", ja: "26枚貼り・蛍光イエロー" },
  },
  18: {
    white: { id: "soccer-18", en: "Soccer ball, 18 panels", ja: "18枚貼りサッカーボール" },
    orange: { id: "soccer-18-orange", en: "Soccer 18 panels, orange", ja: "18枚貼り・オレンジ" },
    yellow: { id: "soccer-18-yellow", en: "Soccer 18 panels, yellow", ja: "18枚貼り・蛍光イエロー" },
  },
  14: {
    white: { id: "soccer-14", en: "Soccer ball, 14 panels", ja: "14枚貼りサッカーボール" },
    orange: { id: "soccer-14-orange", en: "Soccer 14 panels, orange", ja: "14枚貼り・オレンジ" },
    yellow: { id: "soccer-14-yellow", en: "Soccer 14 panels, yellow", ja: "14枚貼り・蛍光イエロー" },
  },
  12: {
    white: { id: "soccer-12", en: "Soccer ball, 12 panels", ja: "12枚貼りサッカーボール" },
    orange: { id: "soccer-12-orange", en: "Soccer 12 panels, orange", ja: "12枚貼り・オレンジ" },
    yellow: { id: "soccer-12-yellow", en: "Soccer 12 panels, yellow", ja: "12枚貼り・蛍光イエロー" },
  },
  6: {
    white: { id: "soccer-6", en: "Soccer ball, 6 panels", ja: "6枚貼りサッカーボール" },
    orange: { id: "soccer-6-orange", en: "Soccer 6 panels, orange", ja: "6枚貼り・オレンジ" },
    yellow: { id: "soccer-6-yellow", en: "Soccer 6 panels, yellow", ja: "6枚貼り・蛍光イエロー" },
  },
};

const VIEWS: Record<Construction, BallSpec["view"]> = {
  classic: { yaw: 30, pitch: 24, roll: 8 },
  26: { yaw: 30, pitch: 24, roll: 8 },
  18: { yaw: 28, pitch: 22, roll: 0 },
  14: { yaw: 16, pitch: 14, roll: 0 },
  12: { yaw: 30, pitch: 24, roll: 8 },
  6: { yaw: 20, pitch: 22, roll: 0 },
};

function make(construction: Construction, way: Way): ReturnType<typeof defineBall> {
  const n = NAMES[construction][way];
  return defineBall({ id: `ball:${n.id}`, en: n.en, ja: n.ja, size: SOCCER_SIZE, spec: specOf(construction, way, VIEWS[construction]) });
}

export const BALL_SOCCER_26 = /* @__PURE__ */ make(26, "white");
export const BALL_SOCCER_18 = /* @__PURE__ */ make(18, "white");
export const BALL_SOCCER_14 = /* @__PURE__ */ make(14, "white");
export const BALL_SOCCER_12 = /* @__PURE__ */ make(12, "white");
export const BALL_SOCCER_6 = /* @__PURE__ */ make(6, "white");

export const BALL_SOCCER_ORANGE = /* @__PURE__ */ make("classic", "orange");
export const BALL_SOCCER_26_ORANGE = /* @__PURE__ */ make(26, "orange");
export const BALL_SOCCER_18_ORANGE = /* @__PURE__ */ make(18, "orange");
export const BALL_SOCCER_14_ORANGE = /* @__PURE__ */ make(14, "orange");
export const BALL_SOCCER_12_ORANGE = /* @__PURE__ */ make(12, "orange");
export const BALL_SOCCER_6_ORANGE = /* @__PURE__ */ make(6, "orange");

export const BALL_SOCCER_YELLOW = /* @__PURE__ */ make("classic", "yellow");
export const BALL_SOCCER_26_YELLOW = /* @__PURE__ */ make(26, "yellow");
export const BALL_SOCCER_18_YELLOW = /* @__PURE__ */ make(18, "yellow");
export const BALL_SOCCER_14_YELLOW = /* @__PURE__ */ make(14, "yellow");
export const BALL_SOCCER_12_YELLOW = /* @__PURE__ */ make(12, "yellow");
export const BALL_SOCCER_6_YELLOW = /* @__PURE__ */ make(6, "yellow");
