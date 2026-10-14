// Ice skates drawn by us, all facing right: a hockey skate, a figure skate and a speed skate.
import { capsule, drawn, rect, seg } from "./gear.core.ts";

export const GEAR_HOCKEY_SKATE = /* @__PURE__ */ drawn("gear:hockey-skate", "Hockey skate", "アイスホッケースケート", {
  main: "#232a36",
  accent: "#d4202c",
  parts: [
    { d: "M9 6h19v17c9 2 23 5 30 14v8H9z", fill: "$main" },
    { d: "M40 31c6 2 13 4 18 8v6H44z", fill: "$accent", shade: 0.5 },
    { d: seg(30, 26, 40, 30) + seg(27, 32, 37, 35), stroke: "#f4f1ea", w: 1.200, line: "none" },
    { d: rect(13, 45, 43, 5, 1), fill: "#c8ced6" },
    { d: rect(18, 49, 4, 6, 0), fill: "#c8ced6", shade: 0.4 },
    { d: rect(47, 49, 4, 6, 0), fill: "#c8ced6", shade: 0.4 },
    { d: capsule(6, 56, 61, 56, 5), fill: "#aab2bd", shade: 0.9 },
  ],
});

export const GEAR_FIGURE_SKATE = /* @__PURE__ */ drawn("gear:figure-skate", "Figure skate", "フィギュアスケート靴", {
  main: "#f6f2ea",
  accent: "#c8a26a",
  parts: [
    { d: "M9 3h16v26c10 2 24 6 31 13v6H9z", fill: "$main" },
    { d: rect(9, 45, 48, 4, 1.500), fill: "$accent", shade: 0.5 },
    { d: seg(26, 24, 31, 27) + seg(25, 29, 34, 32) + seg(24, 34, 37, 37) + seg(22, 39, 40, 42), stroke: "#8a949f", w: 1, line: "none" },
    { d: rect(11, 49, 8, 5, 0), fill: "$accent", shade: 0.4 },
    { d: rect(41, 49, 3, 5, 0), fill: "#aab2bd", shade: 0.4 },
    { d: "M7 55H49C55 55 59 52 60 46L64 47C63 55 58 60 49 60H7C4 60 4 55 7 55Z", fill: "#aab2bd", shade: 0.9 },
    
  ],
});

export const GEAR_SPEED_SKATE = /* @__PURE__ */ drawn("gear:speed-skate", "Speed skate", "スピードスケート靴", {
  main: "#2a5fb0",
  accent: "#1d1f24",
  parts: [
    { d: "M9 14h17l1 14c11 0 24 3 31 9v6H9z", fill: "$main" },
    { d: seg(28, 29, 37, 31) + seg(26, 34, 35, 36), stroke: "#f4f1ea", w: 1.200, line: "none" },
    { d: rect(14, 43, 42, 3, 1), fill: "$accent", shade: 0.4 },
    { d: rect(16, 46, 3, 8, 0), fill: "#aab2bd", shade: 0.4 },
    { d: rect(46, 46, 3, 8, 0), fill: "#aab2bd", shade: 0.4 },
    { d: capsule(2, 56, 62, 56, 3.600), fill: "#aab2bd", shade: 0.9 },
  ],
});
