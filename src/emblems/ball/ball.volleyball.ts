// Volleyball: the 18-panel indoor ball in yellow, blue and white, the 8-panel version, and the beach volleyball in its own bright colours. All made of our own layout of curved panels.
import { defineBall } from "./ball.engine.ts";
import { octants8, strips18 } from "./ball.family.panelled.ts";

const YELLOW = "#f3c81c";
const BLUE = "#1f5fbf";
const WHITE = "#f6f4ee";

export const BALL_VOLLEYBALL = /* @__PURE__ */ defineBall({
  id: "ball:volleyball",
  en: "Volleyball",
  ja: "バレーボール",
  size: { extentMm: 210.1, diameterMm: 210.1, circumferenceMm: 660.0, massG: [260, 280], rule: "FIVB Official Volleyball Rules 2025-2028, Rule 3 Balls, 3.1 Standards", note: "Diameter worked out from the middle of the circumference range." },
  spec: {
    view: { yaw: 28, pitch: 22, roll: 0 },
    base: YELLOW,
    mat: { gloss: 0.75, shade: "#1a2a50", grain: { f: 1.2, a: 0.12 } },
    draw: (s, base) =>
      strips18(
        s,
        [
          [base, BLUE],
          [WHITE, BLUE],
          [BLUE, WHITE],
          [base, WHITE],
          [WHITE, base],
          [BLUE, base],
        ],
        "#3a4560",
      ),
  },
});

export const BALL_VOLLEYBALL_8 = /* @__PURE__ */ defineBall({
  id: "ball:volleyball-8",
  en: "Volleyball, 8 panels",
  ja: "バレーボール（8枚貼り）",
  size: { extentMm: 210.1, diameterMm: 210.1, circumferenceMm: 660.0, massG: [260, 280], rule: "FIVB Official Volleyball Rules 2025-2028, Rule 3 Balls, 3.1 Standards", note: "Diameter worked out from the middle of the circumference range." },
  spec: {
    view: { yaw: 32, pitch: 26, roll: 0 },
    base: YELLOW,
    mat: { gloss: 0.75, shade: "#1a2a50", grain: { f: 1.2, a: 0.12 } },
    draw: (s, base) => octants8(s, (sx, sy, sz) => (sy > 0 ? (sx * sz > 0 ? base : BLUE) : sx * sz > 0 ? WHITE : BLUE), "#3a4560"),
  },
});

export const BALL_BEACH_VOLLEYBALL = /* @__PURE__ */ defineBall({
  id: "ball:beach-volleyball",
  en: "Beach volleyball",
  ja: "ビーチバレーボール",
  size: { extentMm: 213.3, diameterMm: 213.3, circumferenceMm: 670.0, massG: [260, 280], rule: "FIVB Official Beach Volleyball Rules 2025-2028, Rule 3 Balls, 3.1 Standards", note: "Diameter worked out from the middle of the circumference range." },
  spec: {
    view: { yaw: 28, pitch: 22, roll: 0 },
    base: "#f2701f",
    mat: { gloss: 0.6, shade: "#4a2410", grain: { f: 1.2, a: 0.1 } },
    draw: (s, base) =>
      strips18(
        s,
        [
          [base, WHITE],
          [WHITE, "#14a3d6"],
          [base, "#14a3d6"],
          [WHITE, base],
          [base, WHITE],
          [WHITE, "#14a3d6"],
        ],
        "#7a4a30",
      ),
  },
});
