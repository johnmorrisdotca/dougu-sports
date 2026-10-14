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
    ["k", "M43.5 16.1L48.6 19.8L46.7 25.9L40.3 25.9L38.4 19.8z"],
    ["t", "M43.5 16.1L43.5 6M48.6 19.8L58 16.8M46.7 25.9L53.3 35M40.3 25.9L33 36M38.4 19.8L27.2 16.2"],
    ["m", "M30.9 26.3L29.5 24.7L27.3 25.2L22.2 40.3L15.3 43.8L13.8 41L12.4 36.1L11.4 35.4L10.2 35.4L8.7 36.4L8.4 38.1L9.2 42.3L12.2 48L10.7 51.1L11 52.5L7 55.1L5.6 56.5L5.4 59.4L7.3 61.6L10.2 61.8L13.8 59.6L22.4 60.3L30.8 55.3L32.7 48.3L44.7 41.4L44.8 39.2L42.9 38.1L34.8 42.2L42.2 35L42.2 32.9L40.3 31.7L38.8 32.3L31.2 39.7L37.2 29.9L37.1 28.2L35.8 27.1L34.6 27.1L33.3 28.1L27.9 36.7Z"],
  ],
});
