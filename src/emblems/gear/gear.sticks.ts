// A goalie's stick, a hurley and a curling broom, drawn by us.
import { capsule, drawn, poly, rect, seg } from "./gear.core.ts";

const TURN = "translate(30 29) rotate(28) scale(.78) translate(-32 -33)";

export const GEAR_GOALIE_STICK = /* @__PURE__ */ drawn("gear:goalie-stick", "Goalie stick", "ゴールキーパーのスティック", {
  main: "#d9b57a",
  accent: "#1d1f24",
  parts: [
    { d: rect(30, 1, 4.4, 36, 1.5), fill: "#c79a58", t: TURN },
    { d: rect(30, 24, 4.4, 9, 0), fill: "$accent", t: TURN, shade: 0.4 },
    { d: poly([24, 33], [42, 33], [43, 56], [23, 56]), fill: "$main", t: TURN },
    { d: seg(23.600, 38, 42.500, 38) + seg(23.400, 44, 42.700, 44) + seg(23.200, 50, 42.800, 50), stroke: "$accent", w: 1.1, t: TURN, line: "none" },
    { d: "M13 56h46c2 0 3 1 3 3v2c0 1-1 2-3 2H13c-2 0-3-1-3-2v-2c0-2 1-3 3-3z", fill: "$main", t: TURN },
  ],
});

export const GEAR_HURLEY = /* @__PURE__ */ drawn("gear:hurley", "Hurley", "ハーリー（ハーリングのスティック）", {
  main: "#e0c48e",
  accent: "#8a949f",
  parts: [
    { d: capsule(32, 3, 32, 42, 3.6), fill: "#d6b378", t: TURN },
    { d: rect(29.500, 12, 5, 5, 0), fill: "$accent", t: TURN, shade: 0.5 },
    { d: "M28 38C18 41 13 49 15 57c1 5 9 5 17 5s16 0 17-5c2-8-3-16-13-19z", fill: "$main", t: TURN },
    { d: "M22 52c6 3 14 3 20 0", stroke: "#a98650", w: 1, t: TURN, line: "none" },
  ],
});

export const GEAR_CURLING_BROOM = /* @__PURE__ */ drawn("gear:curling-broom", "Curling broom", "カーリングのブラシ", {
  main: "#2a5fb0",
  accent: "#f4efe4",
  parts: [
    { d: capsule(55, 6, 31, 40, 3.4), fill: "#3a4252", shade: 0.5 },
    { d: rect(10, 38, 24, 8, 2.500), fill: "$main", t: "rotate(36.900 31 42)" },
    { d: rect(10, 46, 24, 8, 1.500), fill: "$accent", t: "rotate(36.900 31 42)" },
    { d: seg(14, 49, 14, 53) + seg(18, 49, 18, 53) + seg(22, 49, 22, 53) + seg(26, 49, 26, 53) + seg(30, 49, 30, 53), stroke: "#9aa3ae", w: 0.8, t: "rotate(36.900 31 42)", line: "none" },
  ],
});
