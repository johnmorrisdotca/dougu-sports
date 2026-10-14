// How a judo belt is tied, in six pictures: the torso of the judogi (the same jacket as `gear:judogi`, lapels crossed left over right, so the wearer's left panel lies on top and the funeral wrap's opposite is
// avoided) in close-up, and the belt (`$accent`, black by default) at each stage. The belt is the one `gear:judogi` and the belts are drawn with, so a step's belt takes `accent` like theirs.
//
//   1. the middle of the belt against the belly;  2. wrapped twice round the waist, both ends back in front;  3. the ends crossed in front;  4. one end brought up under both layers;
//   5. the flat square knot (hon-musubi);  6. both ends hanging even.
//
// The close-up is the jacket alone, drawn 1.55 times as big, so that the belt's width and the knot read at small sizes; a red number says which step it is, and a few small red marks (the middle, the way an end
// travels, the equal lengths) say what to look at. The marks and the number are not the suit's, so they ignore `tint` and `accent`.
import { circle, defineGear, drawGear, rect, type Part } from "./gear.core.ts";
import { fitSize, linePath } from "../ball/ball.letters.ts";
import type { PieceOptions } from "../ball/ball.core.ts";
import { BELT_EDGE, type Pt, belt, dark, f, judogiFlat, light, lerp, path, strip } from "./gear.budo.ts";

export type ObiStep = 1 | 2 | 3 | 4 | 5 | 6;

/** The belt's width in the jacket's own units (the judogi's), the two wraps' tops, and the middle of the belly. */
const W = 2.5;
const Y_UPPER = 25.2;
const Y_LOWER = 27.4;
const X0 = 18.2;
const X1 = 45.8;
const MID = 32;
/** The length of the two ends in these pictures: a little shorter than the judogi's, so that they stay inside the picture. */
const TAIL = 9.5;
/** The red of the marks. */
const MARK = "#d8342c";
const MARK_EDGE = "#8f1d17";
/** The close-up: the jacket, 1.55 times as big, with the belt about at the middle of the picture. */
const ZOOM = "translate(32 32) scale(1.55) translate(-32 -21.6)";

/** One wrap of the belt across the front, its top at `y`, drawn as the judogi's belt is: the band, two rows of stitching and their highlights. */
function wrap(y: number, x0 = X0, x1 = X1): Part[] {
  const row = (off: number): string => `M${f(x0 + 0.8)} ${f(y + W * off)}H${f(x1 - 0.8)}`;
  return [
    { d: rect(x0, y, Math.round((x1 - x0) * 10) / 10, W), fill: "$accent", stroke: BELT_EDGE, cyl: 0.5, shade: 0.25 },
    dark(row(0.3) + row(0.7), 0.28, 0.3),
    light(`M${f(x0 + 0.8)} ${f(y + W * 0.3 + 0.35)}H${f(x1 - 0.8)}M${f(x0 + 0.8)} ${f(y + W * 0.7 + 0.35)}H${f(x1 - 0.8)}`, 0.25, 0.2),
  ];
}

/** One end of the belt, from `a` to `b`: a strip with its two rows of stitching. */
function end(a: Pt, b: Pt, width = W * 1.02): Part[] {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const stitch = (off: number, t0: number, t1: number): string => {
    const p = lerp(a, b, t0), q = lerp(a, b, t1);
    const nx = (-dy / l) * off, ny = (dx / l) * off;
    return `M${f(p[0] + nx)} ${f(p[1] + ny)}L${f(q[0] + nx)} ${f(q[1] + ny)}`;
  };
  return [
    { d: path(strip(a, b, width)), fill: "$accent", stroke: BELT_EDGE, cyl: 0.55, shade: 0.25 },
    dark(stitch(-width * 0.18, 0.15, 0.97) + stitch(width * 0.18, 0.15, 0.97), 0.28, 0.3),
    light(stitch(-width * 0.18 + 0.35, 0.15, 0.97) + stitch(width * 0.18 + 0.35, 0.15, 0.97), 0.25, 0.2),
  ];
}

/** A small red mark: a line or a filled shape in the colour of the marks, drawn as ink in the line style too. */
const mark = (d: string, w = 0.6): Part => ({ d, fill: "none", stroke: MARK, w });
/** An arrow from `a` to `b`, with its head. */
function arrow(a: Pt, b: Pt, head = 1.7): Part {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l, uy = dy / l;
  const h = (s: number): string => `${f(b[0] - ux * head + -uy * head * s * 0.6)} ${f(b[1] - uy * head + ux * head * s * 0.6)}`;
  return mark(`M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}M${h(1)}L${f(b[0])} ${f(b[1])}L${h(-1)}`, 0.7);
}

/** The belt at each step, in the jacket's units, back to front. */
function beltAt(step: ObiStep): Part[] {
  const ends = (cx: number): number[] => [cx - 3.2, cx + 3.2];
  switch (step) {
    case 1: {
      // One layer across the belly, a notch marking the middle of the belt, and a red arrow down to it.
      const y = 26.3;
      return [...wrap(y), mark(`M${MID} ${f(y + 0.3)}V${f(y + W - 0.3)}`, 0.5), arrow([MID, y - 5.6], [MID, y - 0.8])];
    }
    case 2: {
      // Two wraps, and the ends that came round the back hanging free in front, apart.
      const [l, r] = ends(MID);
      return [...wrap(Y_LOWER), ...wrap(Y_UPPER), ...end([l, Y_LOWER + 0.8], [l - 0.4, Y_LOWER + 0.8 + TAIL]), ...end([r, Y_LOWER + 0.8], [r + 0.4, Y_LOWER + 0.8 + TAIL])];
    }
    case 3: {
      // The ends cross: the one on the wearer's left (the right of the picture) lies over the other.
      const top = Y_LOWER + 0.8;
      return [...wrap(Y_LOWER), ...wrap(Y_UPPER), ...end([MID - 2.4, top], [MID + 3.6, top + TAIL - 0.6]), ...end([MID + 2.4, top], [MID - 3.6, top + TAIL - 0.6])];
    }
    case 4: {
      // One end goes up under both wraps: it shows below the belt and again above it, the wraps hiding the middle of it, and a red arrow follows its way.
      const x = MID - 1.8;
      const under = end([x, Y_UPPER - 4.2], [x, Y_LOWER + 6.8]);
      const hanging = end([MID + 3.4, Y_LOWER + 0.8], [MID + 3.8, Y_LOWER + 0.8 + TAIL]);
      return [...under, ...wrap(Y_LOWER), ...wrap(Y_UPPER), ...hanging, arrow([MID - 5.8, Y_LOWER + 8.4], [MID - 5.8, Y_UPPER - 5.2])];
    }
    case 5: {
      // The knot: two half knots, the second laid the other way (the flat square knot), so the ends are not yet even, and a red turn over it for each half.
      const y = Y_UPPER + (Y_LOWER + W - Y_UPPER) / 2;
      return [
        ...belt({ edge: BELT_EDGE, main: "$accent", cx: MID, x0: X0, x1: X1, y: Y_UPPER, w: W, sag: 0, knot: 6.4, tail: TAIL + 1.2, tail2: TAIL - 2.6, splay: 14 }),
        mark(`M${MID - 4.4} ${f(y - 4.2)}Q${MID} ${f(y - 7.4)} ${MID + 4.4} ${f(y - 4.2)}`, 0.6),
        arrow([MID + 3.6, y - 6.4], [MID + 4.6, y - 4]),
      ];
    }
    case 6: {
      // Tied: both ends hang even, and a red mark under them shows their tips on one line.
      const yc = (Y_UPPER + Y_LOWER - 0.3 + W) / 2 + 0.2 * 3;
      const tip = yc + Math.cos((6 * Math.PI) / 180) * TAIL;
      const y = tip + 2;
      return [
        ...belt({ edge: BELT_EDGE, main: "$accent", cx: MID, x0: X0, x1: X1, y: Y_UPPER, w: W, sag: 0, knot: 6.4, tail: TAIL, splay: 6 }),
        mark(`M${MID - 4.6} ${f(y)}H${MID + 4.6}M${MID - 4.6} ${f(y - 1)}V${f(y + 1)}M${MID + 4.6} ${f(y - 1)}V${f(y + 1)}`, 0.5),
      ];
    }
  }
}

/** The step's number in a red disc at the top left, in the picture's own units (not zoomed). */
function badge(step: ObiStep): Part[] {
  const text = String(step);
  const letters = { weight: 0.2, wide: 1 } as const;
  const size = fitSize(text, letters, 5, 5.2);
  return [
    { d: circle(7.4, 7.4, 5), fill: MARK, stroke: MARK_EDGE, w: 0.7, shade: 0.4 },
    { d: linePath(text, { ...letters, size }, 7.4, 7.4), fill: "none", stroke: "#ffffff", w: letters.weight * size, line: "stroke" },
  ];
}

/** The parts of a step: the jacket in close-up, the belt at that stage and the number. */
function stepParts(step: ObiStep): Part[] {
  const zoomed = [...judogiFlat(true), ...beltAt(step)].map((p): Part => ({ ...p, t: ZOOM }));
  return [...zoomed, ...badge(step)];
}

const STEPS: ReadonlyArray<{ en: string; ja: string }> = [
  { en: "Belt step 1: centre", ja: "帯の結び方（1）中心" },
  { en: "Belt step 2: two wraps", ja: "帯の結び方（2）二重巻き" },
  { en: "Belt step 3: cross", ja: "帯の結び方（3）交差" },
  { en: "Belt step 4: tuck under", ja: "帯の結び方（4）下に通す" },
  { en: "Belt step 5: square knot", ja: "帯の結び方（5）本結び" },
  { en: "Belt step 6: even ends", ja: "帯の結び方（6）仕上げ" },
];

const SUIT = "#f6f4ee";
const BLACK = "#1f2228";
const stepPiece = (step: ObiStep) => {
  const id = `gear:obi-step-${step}`;
  const { en, ja } = STEPS[step - 1] as { en: string; ja: string };
  const spec = { main: SUIT, accent: BLACK, parts: stepParts(step) };
  return defineGear({ id, en, ja, source: "drawn", model: spec, draw: (o?: PieceOptions) => drawGear(id, en, spec, o) });
};

export const GEAR_OBI_STEP_1 = /* @__PURE__ */ stepPiece(1);
export const GEAR_OBI_STEP_2 = /* @__PURE__ */ stepPiece(2);
export const GEAR_OBI_STEP_3 = /* @__PURE__ */ stepPiece(3);
export const GEAR_OBI_STEP_4 = /* @__PURE__ */ stepPiece(4);
export const GEAR_OBI_STEP_5 = /* @__PURE__ */ stepPiece(5);
export const GEAR_OBI_STEP_6 = /* @__PURE__ */ stepPiece(6);

const BY_STEP = [GEAR_OBI_STEP_1, GEAR_OBI_STEP_2, GEAR_OBI_STEP_3, GEAR_OBI_STEP_4, GEAR_OBI_STEP_5, GEAR_OBI_STEP_6] as const;

/** One step of tying the belt, 1 to 6, with the usual options (`tint` is the jacket's colour, `accent` the belt's). A number that is not a step from 1 to 6 draws the last one. */
export const obiStep = (step: ObiStep, options?: PieceOptions): string => (BY_STEP[Number.isInteger(step) && step >= 1 && step <= 6 ? step - 1 : 5] as (typeof BY_STEP)[number]).svg(options);
