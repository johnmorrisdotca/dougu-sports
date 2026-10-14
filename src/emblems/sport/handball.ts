// Handball: a pictogram of a hand throwing the ball, drawn for this package, in a 64 by 64 box: the ball with its seams and lines of speed behind it, and the open hand, fingers spread, that carries it. The
// metal style paints its main shapes with a grey sheet, the line style draws one outline.
import { circlePath as circ, defineIcon } from "../emblem.shapes.ts";

/** Handball. */
export const SPORT_HANDBALL = /* @__PURE__ */ defineIcon("sport:handball", "Handball", "ハンドボール", "ours", {
  metal: "flat",
  ink: true,
  front: [
    ["t", "M3 9h12M1 17h10M4 25h7"],
    ["m", circ(42.5, 22.5, 16.5)],
    ["t", "M42.5 6v33M26 22.5h33M30.6 11.2Q42.5 22.5 30.6 33.8M54.4 11.2Q42.5 22.5 54.4 33.8"],
    ["m", "M30.9 26.3L30.4 25.3L29.5 24.7L28.3 24.7L27.3 25.2L26.7 26.1L22.2 40.3L15.3 43.8L13.8 41L13 37.2L12.4 36.1L11.4 35.4L10.2 35.4L9.1 35.9L8.7 36.4L8.5 36.9L8.4 38.1L9.2 42.3L12.2 48L10.7 51.1L11 52.5L7 55.1L6.2 55.7L5.6 56.5L5.3 57.4L5.2 58.4L5.4 59.4L5.8 60.3L6.5 61L7.3 61.6L8.2 61.9L9.2 62L10.2 61.8L13.8 59.6L22.4 60.3L30.8 55.3L32.7 48.3L43.9 42.2L44.7 41.4L45.1 40.3L44.8 39.2L44 38.4L42.9 38.1L41.8 38.3L34.8 42.2L42.2 35L42.5 33.9L42.2 32.9L41.4 32L40.3 31.7L39.2 32L38.8 32.3L31.2 39.7L37.2 29.9L37.3 28.7L37.1 28.2L36.7 27.7L35.8 27.1L34.6 27.1L33.6 27.6L33.3 28.1L27.9 36.7L30.9 27.5Z"],
  ],
});
