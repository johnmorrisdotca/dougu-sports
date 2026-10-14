// A field hockey stick and ball, drawn for this package: a long taped shaft and a head that hooks round at the foot, with a flat face, beside a white ball.
import { capsule, circle, drawn } from "./gear.core.ts";

const T = "rotate(24 32 32)";

export const GEAR_FIELD_HOCKEY_STICK = /* @__PURE__ */ drawn("gear:field-hockey-stick", "Field hockey stick", "フィールド用スティック", {
  main: "#dcb06a",
  accent: "#2a2f38",
  parts: [
    { d: capsule(32, 1.5, 32, 44, 3.6), fill: "$main", t: T, cyl: 1, shade: 0 },
    { d: capsule(32, 1.5, 32, 16, 4.2), fill: "$accent", t: T, cyl: 0.7, shade: 0 },
    { d: "M24.2 41.2L29.8 43.6Q29.4 50.4 33.2 52.2H43.6Q46.6 52.4 46.6 55.6Q46.6 58.8 43.6 58.8H32.4Q22.8 58 23.4 48.4Q23.6 44.6 24.2 41.2Z", fill: "$main", cyl: 0.9, shade: 0 },
    { d: "M25.4 47.4Q25.6 55 33 56.6", fill: "none", stroke: "#fff", w: 1.1, op: 0.55, line: "none", fx: true },
    { d: capsule(31.5, 22.4, 31.5, 27.4, 4.2).replace(/^/, ""), fill: "$accent", t: T, line: "none", shade: 0.3 },
    { d: circle(54.5, 54.6, 4.8), fill: "#f4f2ee", stroke: "#8f98a3", shade: 0.9 },
    { d: "M51.4 51.8a4.6 4.6 0 0 1 3-1", fill: "none", stroke: "#fff", w: 1, line: "none", fx: true },
  ],
});
