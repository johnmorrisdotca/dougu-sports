// Swimming and diving gear drawn by us: a diving board over water, and a pair of goggles.
import { capsule, drawn, ellipse, rect } from "./gear.core.ts";

export const GEAR_DIVING_BOARD = /* @__PURE__ */ drawn("gear:diving-board", "Diving board", "飛び込み板", {
  box: "-1.4 -0.8 66.8 66.8",
  main: "#4b84b8",
  accent: "#8a949f",
  parts: [
    { d: rect(8, 36, 11, 24, 1.500), fill: "$accent" },
    { d: rect(3, 29, 52, 7, 3), fill: "$main", shade: 0.9 },
    { d: "M0 53q8-5 16 0t16 0 16 0 16 0v11H0z", fill: "#4fb3e8", stroke: "#2d86bd", op: 0.9, shade: 0 },
    { d: "M0 58q8-5 16 0t16 0 16 0 16 0", stroke: "#bfe6f8", w: 1.200, line: "none" },
  ],
});

export const GEAR_SWIM_GOGGLES = /* @__PURE__ */ drawn("gear:swim-goggles", "Swim goggles", "水泳のゴーグル", {
  box: "-2.1 -2.1 68.2 68.2",
  main: "#2a7fd0",
  accent: "#1d1f24",
  parts: [
    { d: capsule(9, 31, 0.500, 25, 2.600), fill: "$accent", shade: 0 },
    { d: capsule(55, 31, 63.500, 25, 2.600), fill: "$accent", shade: 0 },
    { d: "M28.500 29q3.500-3.500 7 0", stroke: "$accent", w: 2.600 },
    { d: ellipse(19, 33, 12, 10), fill: "$main", stroke: "$accent", w: 2.200, shade: 0.8 },
    { d: ellipse(45, 33, 12, 10), fill: "$main", stroke: "$accent", w: 2.200, shade: 0.8 },
    { d: ellipse(15.500, 29, 4.500, 2.600), fill: "#ffffff", stroke: "none", op: 0.5, shade: 0, line: "none" },
    { d: ellipse(41.500, 29, 4.500, 2.600), fill: "#ffffff", stroke: "none", op: 0.5, shade: 0, line: "none" },
  ],
});
