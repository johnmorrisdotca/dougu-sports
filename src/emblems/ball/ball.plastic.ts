// The slotted plastic practice baseball: a hollow white plastic ball the size of a baseball, with eight oblong slots on one half and the other half solid. The figures are from the English Wikipedia
// article on the ball (accessed 2026-10-21): hollow resilient plastic, a wall no more than 1/8 inch (3.2 mm) thick, eight oblong holes of 0.75 inch (19 mm), on one half only, about the size of a regulation
// baseball. The holes are real, as a pickleball's are (ball.holes.ts): the near ones are cut out of the shell and show the inside of the ball, and where a near slot and a far one line up the page shows through.
// No maker's name is in this package: it is a generic ball.
import { defineBall } from "./ball.engine.ts";
import type { V3 } from "./ball.math.ts";
import { holeLayers, slotRing } from "./ball.holes.ts";
import { greatCircle } from "./ball.math.ts";
import { region } from "./ball.region.ts";
import type { Piece } from "./ball.core.ts";
import type { BallSpec } from "./ball.engine.ts";

/** The axis of the perforated half: its pole, the middle of the solid-free half's ring of slots. */
const POLE: V3 = [0, 0, 1];
/** Eight slots in a ring round the pole at 36 degrees from it (the ring is about half way out in a picture of the ball seen from its pole), each running along the line to the pole. */
const COLATITUDE = (36 * Math.PI) / 180;
const SLOTS = 8;
/** A slot is 19 mm long on a ball 73.8 mm across (a radius of 36.9 mm): 0.515 radians, half of it 0.2575. Its width is not given; a third of its length is how it is drawn. */
const HALF_LONG = 19 / 73.8;
const HALF_WIDTH = HALF_LONG / 3;

const CENTRES: readonly V3[] = Array.from({ length: SLOTS }, (_, i) => {
  const a = (i / SLOTS) * 2 * Math.PI + Math.PI / 8;
  return [Math.sin(COLATITUDE) * Math.cos(a), Math.sin(COLATITUDE) * Math.sin(a), Math.cos(COLATITUDE)] as const;
});
const DIRS: readonly V3[] = CENTRES.map((m) => [POLE[0] - m[0] * m[2], POLE[1] - m[1] * m[2], POLE[2] - m[2] * m[2]] as const);

/**
 * The Plastic baseball, slotted emblem (野球の穴あき練習球 in Japanese): id `ball:plastic-baseball-slotted`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_PLASTIC_BASEBALL_SLOTTED } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_PLASTIC_BASEBALL_SLOTTED.id, BALL_PLASTIC_BASEBALL_SLOTTED.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
export const BALL_PLASTIC_BASEBALL_SLOTTED = /* @__PURE__ */ defineBall({
  id: "ball:plastic-baseball-slotted",
  en: "Plastic baseball, slotted",
  ja: "野球の穴あき練習球",
  size: { extentMm: 73.8, diameterMm: 73.8, rule: "English Wikipedia, the article on the perforated plastic practice ball (accessed 2026-10-21): hollow plastic, wall at most 3.2 mm, eight oblong holes of 19 mm on one half only; size taken from Official Baseball Rules, Rule 3.01 The Ball", note: "The article says only that the ball is about the size of a regulation baseball, so the diameter is a baseball's (the middle of the circumference range). No mass is stated by a source read; none is given. The slots' width is not given and is drawn at a third of their length." },
  spec: {
    view: { yaw: -22, pitch: 22, roll: 0 },
    base: "#f4f4f0",
    mat: { gloss: 0.5, shade: "#3b3e46", grain: { f: 1.4, a: 0.08 } },
    draw: (s) => (s.line ? s.strokes(CENTRES.map((m, i) => slotRing(m, DIRS[i], HALF_WIDTH, HALF_LONG)), "#000", 1, { closed: true }) : ""),
    holes: (s, id, base, shape, minWidth) => holeLayers(s, id, { centres: CENTRES, radius: HALF_WIDTH, long: HALF_LONG, dirs: DIRS }, base, shape, minWidth),
  },
});

/**
 * The common hollow plastic practice baseball with slots all over it (the other, the one-sided ball above, is the first): one ring of five large oval slots on each half, running toward the pole, the two rings
 * turned half a step apart so that no slot faces another across the seam, and often two-tone, the halves split along the seam. A slot is about 22 mm long and 14 mm wide on a ball of the size of a baseball, an oval
 * and not a slit (larger than the 19 mm of the one-sided ball, as the photographs show); the other figures are the same facts as above, and the number and the layout of the slots are drawn from photographs looked at and never copied. No maker's name is in this package.
 */
const PRACTICE_HALF_LONG = 0.3;
const PRACTICE_HALF_WIDTH = 0.19;
const PRACTICE_PER_HALF = 6;
const PRACTICE_COLATITUDE = 56;
const ALL = ([1, -1] as const).flatMap((sign) =>
  Array.from({ length: PRACTICE_PER_HALF }, (_, i) => {
    const a = (((sign === 1 ? 0 : 180 / PRACTICE_PER_HALF) + (i / PRACTICE_PER_HALF) * 360) * Math.PI) / 180;
    const t = (PRACTICE_COLATITUDE * Math.PI) / 180;
    const m: V3 = [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), sign * Math.cos(t)];
    const along: V3 = [-m[0] * m[2] * sign, -m[1] * m[2] * sign, sign - m[2] * m[2] * sign];
    return { m, dir: along };
  }),
);
const PRACTICE_CENTRES: readonly V3[] = ALL.map((one) => one.m);
const PRACTICE_DIRS: readonly V3[] = ALL.map((one) => one.dir);

function practice(id: string, en: string, ja: string, colours: { first: string; second?: string }): Piece<BallSpec> {
  const seam = greatCircle([0, 0, 1], 120).reverse();
  return defineBall({
    id,
    en,
    ja,
    size: { extentMm: 73.8, diameterMm: 73.8, rule: "English Wikipedia, the article on the perforated plastic practice ball (accessed 2026-10-21): hollow plastic, wall at most 3.2 mm; size taken from Official Baseball Rules, Rule 3.01 (the middle of the circumference range). The count and layout of the slots are drawn from photographs looked at, not copied.", note: "The size of a slot on this ball is not given by the article (19 mm is the one-sided ball's): it is drawn about 22 by 14 mm, an oval, to match the photographs. The mass is not stated. " },
    spec: {
      view: { yaw: -22, pitch: 26, roll: 0 },
      base: colours.second ?? colours.first,
      ...(colours.second === undefined ? {} : { ground: colours.first }),
      mat: { gloss: 0.5, shade: "#2b2e36", grain: { f: 1.4, a: 0.08 } },
      draw: (s, base) =>
        (colours.second === undefined ? "" : region(s, seam, base)) +
        (s.line ? s.strokes(PRACTICE_CENTRES.map((m, i) => slotRing(m, PRACTICE_DIRS[i] as V3, PRACTICE_HALF_WIDTH, PRACTICE_HALF_LONG)), "#000", 1, { closed: true }) : ""),
      holes: (s, hid, base, shape, minWidth) => holeLayers(s, hid, { centres: PRACTICE_CENTRES, radius: PRACTICE_HALF_WIDTH, long: PRACTICE_HALF_LONG, dirs: PRACTICE_DIRS }, base, shape, minWidth),
    },
  });
}

/**
 * The Practice ball, two-tone emblem (穴あき練習球(二色)): id `ball:plastic-baseball-practice`, the high-visibility yellow and black two-tone ball with slots on both halves, turned in 3D.
 * @example
 * ```ts
 * import { BALL_PLASTIC_BASEBALL_PRACTICE } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_PLASTIC_BASEBALL_PRACTICE.id, BALL_PLASTIC_BASEBALL_PRACTICE.svg({ size: 48 }).includes("<mask"));
 * ```
 */
export const BALL_PLASTIC_BASEBALL_PRACTICE = /* @__PURE__ */ practice("ball:plastic-baseball-practice", "Practice ball, two-tone", "穴あき練習球(二色)", { first: "#d4ee1a", second: "#1d1f24" });

/**
 * The Practice ball, white emblem (穴あき練習球(白)): id `ball:plastic-baseball-practice-white`, one colour, with slots on both halves, turned in 3D.
 * @example
 * ```ts
 * import { BALL_PLASTIC_BASEBALL_PRACTICE_WHITE } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_PLASTIC_BASEBALL_PRACTICE_WHITE.id, BALL_PLASTIC_BASEBALL_PRACTICE_WHITE.svg({ size: 48 }).includes("<mask"));
 * ```
 */
export const BALL_PLASTIC_BASEBALL_PRACTICE_WHITE = /* @__PURE__ */ practice("ball:plastic-baseball-practice-white", "Practice ball, white", "穴あき練習球(白)", { first: "#f4f4f0" });

/**
 * The Practice ball, orange emblem (穴あき練習球(橙)): id `ball:plastic-baseball-practice-orange`, one colour, with slots on both halves, turned in 3D.
 * @example
 * ```ts
 * import { BALL_PLASTIC_BASEBALL_PRACTICE_ORANGE } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_PLASTIC_BASEBALL_PRACTICE_ORANGE.id, BALL_PLASTIC_BASEBALL_PRACTICE_ORANGE.svg({ size: 48 }).includes("<mask"));
 * ```
 */
export const BALL_PLASTIC_BASEBALL_PRACTICE_ORANGE = /* @__PURE__ */ practice("ball:plastic-baseball-practice-orange", "Practice ball, orange", "穴あき練習球(橙)", { first: "#f07a1c" });
