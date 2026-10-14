// Squash, racquetball and padel rackets and the pickleball paddle, drawn by us: head up, in a 64 by 64 box.
import { capsule, circle, drawn, ellipse, rect, seg, strings } from "./gear.core.ts";

export const GEAR_SQUASH_RACKET = /* @__PURE__ */ drawn("gear:squash-racket", "Squash racket", "スカッシュのラケット", {
  main: "#2b3a52",
  accent: "#e0502a",
  parts: [
    { d: strings(32, 19, 11, 15, 3.4), stroke: "#8a95a3", w: 0.7, line: "stroke" },
    { d: ellipse(32, 19, 11.5, 15.5), stroke: "$main", w: 2.8 },
    { d: "M25.5 33.5L30.6 43M38.5 33.5L33.4 43", stroke: "$main", w: 2.4 },
    { d: capsule(32, 40, 32, 60, 4.6), fill: "$accent", shade: 0.6 },
    { d: seg(30, 48, 34, 48) + seg(30, 52, 34, 52) + seg(30, 56, 34, 56), stroke: "#5a2412", w: 0.8, line: "none" },
  ],
});

export const GEAR_RACQUETBALL_RACKET = /* @__PURE__ */ drawn("gear:racquetball-racket", "Racquetball racket", "ラケットボールのラケット", {
  main: "#2a63c8",
  accent: "#1b1f27",
  parts: [
    { d: strings(32, 21, 14.5, 17, 3.4), stroke: "#8a95a3", w: 0.7 },
    { d: "M32 3.5c9.5 0 16 6 16 17.500c0 8-4.500 13.500-10.500 15.500L35 38.500h-6l-2.500-2c-6-2-10.500-7.500-10.500-15.500C16 9.500 22.500 3.500 32 3.500z", stroke: "$main", w: 3.2 },
    { d: capsule(32, 36, 32, 59, 5.4), fill: "$accent", shade: 0.5 },
    { d: seg(29.600, 46, 34.400, 46) + seg(29.600, 51, 34.400, 51) + seg(29.600, 56, 34.400, 56), stroke: "#555a66", w: 0.8, line: "none" },
  ],
});

const holes = (): string => {
  let d = "";
  for (let r = 0; r < 4; r++) {
    const y = 12 + r * 6.5;
    const n = r === 0 ? 3 : r === 1 ? 4 : r === 2 ? 4 : 3;
    for (let i = 0; i < n; i++) d += circle(32 + (i - (n - 1) / 2) * 6.4, y, 1.35);
  }
  return d;
};

export const GEAR_PADEL_RACKET = /* @__PURE__ */ drawn("gear:padel-racket", "Padel racket", "パデルのラケット", {
  main: "#2a2f38",
  accent: "#f2701d",
  parts: [
    { d: "M32 3c11 0 18 7 18 18c0 8.500-5 14.500-11 17.500l-2 5h-10l-2-5C19 35.500 14 29.500 14 21C14 10 21 3 32 3z", fill: "$main", stroke: "$accent", w: 2 },
    { d: holes(), fill: "#e4e9ee", stroke: "none", line: "stroke", shade: 0, w: 1.4 },
    { d: capsule(32, 43, 32, 60, 5.4), fill: "$accent", shade: 0.5 },
    { d: seg(29.5, 49, 34.5, 49) + seg(29.500, 53, 34.5, 53) + seg(29.5, 57, 34.5, 57), stroke: "#5a2c0a", w: 0.8, line: "none" },
  ],
});

const dimples = (): string => {
  let d = "";
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) d += circle(20.500 + c * 7.600 + (r % 2) * 3.8, 10 + r * 6.5, 1.1);
  return d;
};

export const GEAR_PICKLEBALL_PADDLE = /* @__PURE__ */ drawn("gear:pickleball-paddle", "Pickleball paddle", "ピックルボールのパドル", {
  main: "#1fa3a8",
  accent: "#f2701d",
  parts: [
    { d: rect(14, 3, 36, 35, 11), fill: "$main", stroke: "$accent", w: 2.2 },
    { d: dimples(), fill: "#ffffff", stroke: "none", op: 0.35, shade: 0, line: "none" },
    { d: rect(27, 37, 10, 22, 3), fill: "#24272e", shade: 0.5 },
    { d: seg(27.500, 45, 36.500, 45) + seg(27.500, 50, 36.500, 50) + seg(27.500, 55, 36.500, 55), stroke: "#5a5f6a", w: 0.8, line: "none" },
  ],
});
