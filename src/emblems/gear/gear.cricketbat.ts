// A cricket bat and a ball, drawn for this package: a broad willow blade with a ridge down the back, a cane handle with a grip, and a red ball with its seam.
import { capsule, circle, drawn } from "./gear.core.ts";

const T = "rotate(34 32 32)";

export const GEAR_CRICKET_BAT = /* @__PURE__ */ drawn("gear:cricket-bat", "Cricket bat", "クリケットのバット", {
  main: "#e6b96e",
  accent: "#2a2f38",
  parts: [
    { d: capsule(32, 2, 32, 26, 3.4), fill: "#c99a58", t: T, cyl: 1, shade: 0 },
    { d: capsule(32, 2, 32, 16, 4.4), fill: "$accent", t: T, cyl: 0.7, shade: 0 },
    { d: "M25.8 24.4h12.4L40.2 30V57a3 3 0 0 1-3 3H26.8a3 3 0 0 1-3-3V30z", fill: "$main", t: T, cyl: 0.9, shade: 0 },
    { d: "M32 31v27", fill: "none", stroke: "#b88540", w: 0.9, t: T, op: 0.9, line: "none", fx: true },
    { d: "M25 50.5h14", fill: "none", stroke: "#b88540", w: 0.8, t: T, line: "none", fx: true },
    { d: "M28.4 25.4L26.2 30.4", fill: "none", stroke: "#fff", w: 1.1, t: T, op: 0.5, line: "none", fx: true },
    { d: circle(53, 52.6, 6), fill: "#c4262e", stroke: "#6e1217", cyl: 0, shade: 0.7 },
    { d: "M48.6 48.6Q52 53 48.4 57M57.4 48.2Q54 52.6 57.6 57", fill: "none", stroke: "#f4ece0", w: 0.9, op: 0.9, line: "none" },
  ],
});
