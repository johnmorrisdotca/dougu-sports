// Plain round balls: the lacrosse ball, the racquetball, the table-tennis ball and the shot. A faint seam where a real one has it.
import { defineBall } from "./ball.engine.ts";
import { greatCircle } from "./ball.math.ts";

export const BALL_LACROSSE = /* @__PURE__ */ defineBall({
  id: "ball:lacrosse",
  en: "Lacrosse ball",
  ja: "ラクロスボール",
  size: { extentMm: 63.7, diameterMm: 63.7, circumferenceMm: 200.05, massG: [141.75, 148.83], rule: "World Lacrosse Rules of Men's Field Lacrosse 2025-2027 (Ver 1.0), Section 2 Equipment, Rule 14 The Ball, 14.1", note: "Diameter worked out from the middle of the circumference range." },
  spec: {
    view: { yaw: 0, pitch: 0, roll: 0 },
    base: "#f2791c",
    mat: { gloss: 0.5, shade: "#5a2208", grain: { f: 1.5, a: 0.14 } },
    draw: () => "",
  },
});

export const BALL_RACQUETBALL = /* @__PURE__ */ defineBall({
  id: "ball:racquetball",
  en: "Racquetball",
  ja: "ラケットボール",
  size: { extentMm: 57.1, diameterMm: 57.1, massG: [39.7, 39.7], rule: "USA Racquetball Rules, Rule 2.2 Ball Specifications (a)-(b); Rule 2.3 Ball Selection", note: "Nominal values; the rule gives no tolerance." },
  spec: {
    view: { yaw: 25, pitch: 30, roll: 0 },
    base: "#2f63d2",
    mat: { gloss: 0.55, shade: "#06143a", grain: { f: 1.5, a: 0.1 } },
    draw: (s) => s.stroke(greatCircle([0.35, 0.9, 0.25], 72), "#10265e", 0.9, { closed: true, opacity: 0.5, deco: false }),
  },
});

export const BALL_TABLE_TENNIS = /* @__PURE__ */ defineBall({
  id: "ball:table-tennis",
  en: "Table-tennis ball",
  ja: "卓球ボール",
  size: { extentMm: 40.0, diameterMm: 40.0, massG: [2.7, 2.7], rule: "Laws of Table Tennis, 2.3 The Ball, 2.3.1-2.3.3" },
  spec: {
    view: { yaw: 25, pitch: 30, roll: 0 },
    base: "#f6f5f0",
    mat: { gloss: 0.32, shade: "#2e3550", grain: { f: 2, a: 0.05 } },
    draw: (s) => s.stroke(greatCircle([0.3, 0.8, 0.5], 72), "#9aa0ac", 0.45, { closed: true, opacity: 0.8 }),
  },
});

export const BALL_SHOT = /* @__PURE__ */ defineBall({
  id: "ball:shot",
  en: "Shot",
  ja: "砲丸",
  size: { extentMm: 120, diameterMm: 120, massG: [7260, 7260], rule: "World Athletics Technical Rules (C2.1), Rule 33 Shot Put - implement specification ('Shot'); smooth finish N7 (Ra <= 1.6 micrometres)", note: "Men's shot, 110 to 130 mm across; 7.260 kg is a minimum." },
  spec: {
    view: { yaw: 0, pitch: 0, roll: 0 },
    base: "#8c949e",
    mat: { gloss: 0.95, shade: "#0c1018", metal: true, rim: 1 },
    draw: () => "",
  },
});
