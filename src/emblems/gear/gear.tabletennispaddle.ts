// A table-tennis paddle and ball, drawn for this package: a round red rubber blade with a wooden edge and a flared handle, and a white ball.
import { circle, drawn } from "./gear.core.ts";

const T = "rotate(30 32 32)";

export const GEAR_TABLE_TENNIS_PADDLE = /* @__PURE__ */ drawn("gear:table-tennis-paddle", "Table-tennis paddle", "卓球のラケット", {
  main: "#d9392b",
  accent: "#d8a868",
  parts: [
    { d: "M28 38h8l1.6 21.4a2.6 2.6 0 0 1-2.6 2.6h-6a2.6 2.6 0 0 1-2.6-2.6z", fill: "$accent", t: T, cyl: 1, shade: 0 },
    { d: "M28.4 46h7.2M28.2 51h7.6M28.2 56h7.6", fill: "none", stroke: "#a87b3e", w: 0.8, t: T, line: "none" },
    { d: circle(32, 21, 17.5), fill: "$accent", t: T, shade: 0.5 },
    { d: circle(32, 21, 15.4), fill: "$main", t: T, shade: 1 },
    { d: "M22 12Q27 7.6 33 7.4", fill: "none", stroke: "#fff", w: 1.8, t: T, op: 0.5, line: "none", fx: true },
    { d: circle(52, 52, 6), fill: "#f6f4ef", stroke: "#8f98a3", shade: 0.9 },
    { d: "M48.4 48.8a6 6 0 0 1 3.6-1.6", fill: "none", stroke: "#fff", w: 1.2, line: "none", fx: true },
  ],
});
