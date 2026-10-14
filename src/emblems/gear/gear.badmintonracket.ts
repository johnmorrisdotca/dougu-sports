// A badminton racket and a shuttlecock, drawn for this package: an oval strung head on a slender frame, a T-shaped throat and a grip, and a feathered shuttlecock on its cork.
import { capsule, drawn, ellipse, seg, strings } from "./gear.core.ts";

const T = "rotate(34 32 32)";
const S = "translate(50.5 50) rotate(48) scale(.95) translate(-32 -13)";

export const GEAR_BADMINTON_RACKET = /* @__PURE__ */ drawn("gear:badminton-racket", "Badminton racket", "バドミントンのラケット", {
  main: "#2f8fe0",
  accent: "#2a2f38",
  parts: [
    { d: strings(32, 15, 10.4, 13.4, 3.1), fill: "none", stroke: "#9aa7b6", w: 0.6, t: T },
    { d: ellipse(32, 15, 11, 14), fill: "none", stroke: "$main", w: 2.6, t: T },
    { d: "M24.2 24.6L30.6 36M39.8 24.6L33.4 36", fill: "none", stroke: "$main", w: 2.2, t: T },
    { d: capsule(32, 34, 32, 50, 2.2), fill: "#aeb6c0", t: T, cyl: 0.9, shade: 0 },
    { d: capsule(32, 46, 32, 62, 4.4), fill: "$accent", t: T, cyl: 0.8, shade: 0 },
    { d: seg(30, 52, 34, 52) + seg(30, 56, 34, 56), fill: "none", stroke: "#6a7482", w: 0.7, t: T, line: "none" },
    { d: "M28.4 20L24 4Q32 1 40 4L35.6 20z", fill: "#f4f6f8", stroke: "#9aa7b6", t: S, shade: 0.8 },
    { d: "M29.6 19L27 5M32 19.4V3.4M34.4 19L37 5", fill: "none", stroke: "#9aa7b6", w: 0.7, t: S, line: "none" },
    { d: "M27.6 20h8.8a4.4 4.4 0 0 1-8.8 0z", fill: "#e8cf9a", t: S, shade: 0.9 },
  ],
});
