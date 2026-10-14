// Gear for the field and court, drawn by us: a baseball bat, a basketball hoop, a volleyball net, goal posts, a cricket wicket and a roundnet set.
import { capsule, drawn, ellipse, rect, seg } from "./gear.core.ts";

const BAT = "rotate(-38 32 32)";

export const GEAR_BASEBALL_BAT = /* @__PURE__ */ drawn("gear:baseball-bat", "Baseball bat", "野球のバット", {
  main: "#d9b57a",
  accent: "#3a2a1a",
  parts: [
    { d: "M6 29.200c-2.200 0-3.300 1.200-3.300 2.800s1.100 2.800 3.300 2.800L8 33.500H28C36 33.500 40 36.200 46 36.200H55a4.200 4.200 0 0 0 0-8.400H46C40 27.800 36 30.500 28 30.500H8z", fill: "$main", t: BAT },
    { d: rect(9, 30.500, 11, 3, 0), fill: "$accent", t: BAT, shade: 0.4 },
    { d: seg(47, 28.500, 47, 35.500), stroke: "#a98650", w: 0.9, t: BAT, line: "none" },
  ],
});

export const GEAR_BASKETBALL_HOOP = /* @__PURE__ */ drawn("gear:basketball-hoop", "Basketball hoop", "バスケットゴール", {
  main: "#e8501a",
  accent: "#f4f1ea",
  parts: [
    { d: rect(8, 3, 48, 28, 2.500), fill: "$accent", stroke: "#8a949f", w: 1.600 },
    { d: rect(23, 13, 18, 14, 0), fill: "none", stroke: "$main", w: 1.800 },
    { d: rect(27, 28, 10, 5, 0), fill: "#8a949f", shade: 0.4, line: "none" },
    { d: "M19.500 35.500L26 57M25 38L29.500 57.500M32 39V58M39 38L34.500 57.500M44.500 35.500L38 57M20.500 43.500h23M23 50.500h18", stroke: "#b8c0c8", w: 1, line: "stroke" },
    { d: ellipse(32, 35, 13.500, 4), stroke: "$main", w: 2.800 },
  ],
});

const MESH = ((): string => {
  let d = "";
  for (let x = 13; x < 52; x += 4) d += `M${x} 19V43`;
  for (let y = 23; y < 43; y += 4) d += `M9 ${y}H55`;
  return d;
})();

export const GEAR_VOLLEYBALL_NET = /* @__PURE__ */ drawn("gear:volleyball-net", "Volleyball net", "バレーボールのネット", {
  main: "#f4f1ea",
  accent: "#c8202c",
  parts: [
    { d: MESH, stroke: "#4a5260", w: 0.8, line: "stroke" },
    { d: rect(9, 13, 46, 6, 1), fill: "$main" },
    { d: rect(9, 42, 46, 3, 0), fill: "$main", shade: 0.3 },
    { d: rect(5, 5, 4, 56, 1.500), fill: "#9aa3ae", shade: 0.6 },
    { d: rect(55, 5, 4, 56, 1.500), fill: "#9aa3ae", shade: 0.6 },
    { d: rect(11, 3, 2, 26, 0), fill: "$accent", shade: 0.3, line: "none" },
    { d: rect(51, 3, 2, 26, 0), fill: "$accent", shade: 0.3, line: "none" },
  ],
});

export const GEAR_GOALPOSTS = /* @__PURE__ */ drawn("gear:goalposts", "Goal posts", "ゴールポスト", {
  main: "#f2c21b",
  accent: "#2b6cb5",
  parts: [
    { d: rect(30.500, 36, 3, 24, 1), fill: "$main", shade: 0.5 },
    { d: rect(22, 58, 20, 4, 1.500), fill: "$accent", shade: 0.4 },
    { d: rect(16, 3, 3, 34, 1.500), fill: "$main", shade: 0.6 },
    { d: rect(45, 3, 3, 34, 1.500), fill: "$main", shade: 0.6 },
    { d: rect(16, 33, 32, 3.500, 1), fill: "$main", shade: 0.6 },
  ],
});

export const GEAR_WICKET = /* @__PURE__ */ drawn("gear:wicket", "Cricket wicket", "クリケットのウィケット", {
  main: "#ecd9a8",
  accent: "#c28a48",
  parts: [
    { d: seg(8, 58.500, 56, 58.500), stroke: "#6aa84f", w: 2.400, line: "none" },
    { d: rect(19, 13, 5, 45, 1.500), fill: "$main" },
    { d: rect(29.500, 13, 5, 45, 1.500), fill: "$main" },
    { d: rect(40, 13, 5, 45, 1.500), fill: "$main" },
    { d: capsule(20, 10.500, 32.500, 10.500, 3.400), fill: "$accent", shade: 0.7 },
    { d: capsule(31.500, 10.500, 43.500, 10.500, 3.400), fill: "$accent", shade: 0.7 },
  ],
});

export const GEAR_ROUNDNET_SET = /* @__PURE__ */ drawn("gear:roundnet-set", "Roundnet set", "ラウンドネットのセット", {
  main: "#1f2328",
  accent: "#f0b429",
  parts: [
    { d: capsule(9, 40, 8, 54, 2.600), fill: "#4a525d", shade: 0.5 },
    { d: capsule(55, 40, 56, 54, 2.600), fill: "#4a525d", shade: 0.5 },
    { d: capsule(21, 44, 21, 55, 2.600), fill: "#4a525d", shade: 0.5 },
    { d: capsule(43, 44, 43, 55, 2.600), fill: "#4a525d", shade: 0.5 },
    { d: ellipse(32, 33, 24, 9), fill: "$accent", stroke: "none", op: 0.6, shade: 0, line: "none" },
    { d: "M8 33H56M32 24V42M15 27.500L49 38.500M15 38.500L49 27.500", stroke: "#4a525d", w: 0.8, line: "stroke" },
    { d: ellipse(32, 33, 14, 5.200), fill: "none", stroke: "#4a525d", w: 0.8 },
    { d: ellipse(32, 33, 25.500, 10.500), stroke: "$main", w: 3 },
  ],
});
