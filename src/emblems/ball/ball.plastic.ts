// The slotted plastic practice baseball: a hollow white plastic ball the size of a baseball, with eight oblong slots on one half and the other half solid. The figures are from the English Wikipedia
// article on the ball (accessed 2026-10-21): hollow resilient plastic, a wall no more than 1/8 inch (3.2 mm) thick, eight oblong holes of 0.75 inch (19 mm), on one half only, about the size of a regulation
// baseball. The holes are real, as a pickleball's are (ball.holes.ts): the near ones are cut out of the shell and show the inside of the ball, and where a near slot and a far one line up the page shows through.
// No maker's name is in this package: it is a generic ball.
import { defineBall } from "./ball.engine.ts";
import type { V3 } from "./ball.math.ts";
import { holeLayers, slotRing } from "./ball.holes.ts";

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
