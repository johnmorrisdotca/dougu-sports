// A tennis racket and a ball, drawn for this package: a large oval strung head with a heavy frame, a triangular throat and a grip, and a yellow ball with its seam.
import { capsule, circle, drawn, ellipse, seg, strings } from "./gear.core.ts";

const T = "rotate(32 32 32)";

export const GEAR_TENNIS_RACKET = /* @__PURE__ */ drawn("gear:tennis-racket", "Tennis racket and ball", "テニスのラケットとボール", {
  main: "#2b64c8",
  accent: "#2a2f38",
  parts: [
    { d: strings(32, 16, 12, 14.4, 3.4), fill: "none", stroke: "#9aa7b6", w: 0.6, t: T },
    { d: ellipse(32, 16, 12.8, 15.2), fill: "none", stroke: "$main", w: 3, t: T },
    { d: "M23 27.6L30.4 38.4H33.6L41 27.6", fill: "none", stroke: "$main", w: 2.4, t: T },
    { d: capsule(32, 36, 32, 46, 2.6), fill: "$main", t: T, cyl: 0.8, shade: 0 },
    { d: capsule(32, 44, 32, 62, 5), fill: "$accent", t: T, cyl: 0.8, shade: 0 },
    { d: seg(29.4, 50, 34.6, 50) + seg(29.4, 55, 34.6, 55), fill: "none", stroke: "#6a7482", w: 0.7, t: T, line: "none" },
    { d: circle(52, 53, 7), fill: "#d4e22a", stroke: "#8a9410", shade: 0.8 },
    { d: "M46.8 48.6Q52 52 48 59M57.4 47.8Q53 52.4 57.4 58.6", fill: "none", stroke: "#fff", w: 1.1, op: 0.85, line: "none" },
  ],
});
