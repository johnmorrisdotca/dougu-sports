// Sumo gear, drawn for this package: the referee's war fan with its tassel, and the wrestler's belt with its stiff hanging cords.
import { capsule, circle, drawn, seg } from "./gear.core.ts";

export const GEAR_GUNBAI = /* @__PURE__ */ drawn("gear:gunbai", "Referee's war fan", "軍配", {
  box: "-0.4 0 64.7 64.7",
  main: "#4a2428",
  accent: "#f0dca6",
  parts: [
    { d: capsule(32, 44, 32, 54, 6.6), fill: "#c99456", cyl: 1, shade: 0 },
    { d: seg(28.8, 47, 35.2, 47) + seg(28.8, 50, 35.2, 50) + seg(28.8, 53, 35.2, 53), fill: "none", stroke: "#7a4a1c", w: 0.9, line: "none" },
    { d: "M32 2.4C46.4 2.4 55.4 12 55.4 24C55.4 36 44.4 44.4 38.4 47.4H25.6C19.6 44.4 8.6 36 8.6 24C8.6 12 17.6 2.4 32 2.4Z", fill: "$main", cyl: 0.8, shade: 0.4 },
    { d: "M32 7.6C43.4 7.6 50.4 15.2 50.4 24.6C50.4 33.4 42 40.4 36.6 43H27.4C22 40.4 13.6 33.4 13.6 24.6C13.6 15.2 20.6 7.6 32 7.6Z", fill: "$accent", stroke: "#d9a620", w: 1.2, shade: 0.5 },
    { d: circle(32, 24.6, 8.8), fill: "#c8202c", stroke: "#8a1620", shade: 0.6, line: "stroke" },
    { d: "M26 20Q28.6 16.8 32.6 16.6", fill: "none", stroke: "#fff", w: 1.4, op: 0.5, line: "none", fx: true },
    { d: circle(32, 56.4, 1.9), fill: "#d9a620", shade: 0.8 },
    { d: "M28.6 58.2H35.4L37.2 63.4H26.8Z", fill: "#c8202c", stroke: "#8a1620", shade: 0.5 },
    { d: seg(30, 59, 29.4, 63) + seg(32, 59, 32, 63) + seg(34, 59, 34.6, 63), fill: "none", stroke: "#8a1620", w: 0.6, line: "none" },
  ],
});

/** The cords that hang from the front of the belt, and the gilt ends of them: stiff, a little apart, spreading as they fall. */
const CORDS = ((): { cords: string; ends: string } => {
  let cords = "";
  let ends = "";
  for (let i = 0; i < 9; i++) {
    const x = 13 + i * 4.75;
    const dx = (i - 4) * 0.8;
    const y = 51 + (4 - Math.abs(i - 4)) * 0.9;
    cords += capsule(x, 32, x + dx, y, 2.8);
    ends += circle(x + dx, y + 1.4, 1.7);
  }
  return { cords, ends };
})();

export const GEAR_MAWASHI = /* @__PURE__ */ drawn("gear:mawashi", "Sumo belt", "廻し", {
  main: "#3b3f8c",
  accent: "#d9a620",
  parts: [
    { d: CORDS.cords, fill: "#e8e2d2", shade: 0.7 },
    { d: CORDS.ends, fill: "$accent", shade: 0.6, line: "none" },
    { d: "M17 27H47L43.4 41H20.6Z", fill: "$main", stroke: "#1c1f4a", cyl: 0.9, shade: 0.3 },
    { d: "M3 14Q32 5 61 14V28Q32 19 3 28Z", fill: "$main", cyl: 0.9, shade: 0.2 },
    { d: "M5 18.6Q32 9.6 59 18.6M5 23.4Q32 14.4 59 23.4", fill: "none", stroke: "#fff", w: 0.7, op: 0.4, line: "none", fx: true },
    { d: "M24.6 12.6h14.8V27H24.6z", fill: "$main", stroke: "#1c1f4a", cyl: 1, shade: 0.2 },
    { d: "M24.6 17.4h14.8M24.6 22.2h14.8", fill: "none", stroke: "#1c1f4a", w: 0.8, line: "none" },
  ],
});
