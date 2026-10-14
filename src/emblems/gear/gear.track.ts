// Athletics gear drawn by us: starting blocks, a relay baton, a javelin and a hurdle.
import { capsule, drawn, poly, rect, seg } from "./gear.core.ts";

export const GEAR_STARTING_BLOCKS = /* @__PURE__ */ drawn("gear:starting-blocks", "Starting blocks", "スターティングブロック", {
  main: "#f08a1c",
  accent: "#3a3f48",
  parts: [
    { d: capsule(5, 53, 59, 53, 3.6), fill: "$accent" },
    { d: poly([15, 51], [23, 25], [31, 28], [26, 51]), fill: "$main" },
    { d: poly([38, 51], [43, 33], [51, 36], [49, 51]), fill: "$main" },
    { d: seg(17, 44, 28, 47) + seg(19.500, 36, 29, 39), stroke: "#a85a0e", w: 0.9, line: "none" },
    { d: poly([8, 53], [14, 53], [14, 57], [6, 57]), fill: "$accent", shade: 0.3 },
    { d: poly([50, 53], [58, 53], [60, 57], [52, 57]), fill: "$accent", shade: 0.3 },
  ],
});

export const GEAR_RELAY_BATON = /* @__PURE__ */ drawn("gear:relay-baton", "Relay baton", "リレーのバトン", {
  main: "#f2a31c",
  accent: "#ffffff",
  parts: [
    { d: capsule(11, 53, 53, 11, 9.5), fill: "$main", shade: 0.8 },
    { d: capsule(24, 40, 28.500, 35.500, 9.500), fill: "$accent", stroke: "none", op: 0.35, line: "none", shade: 0 },
  ],
});

export const GEAR_JAVELIN = /* @__PURE__ */ drawn("gear:javelin", "Javelin", "やり投げのやり", {
  main: "#e9e6dd",
  accent: "#8a5a2a",
  parts: [
    { d: capsule(5, 59, 55, 9, 2.8), fill: "$main" },
    { d: capsule(22, 42, 33, 31, 4.2), fill: "$accent", shade: 0.6 },
    { d: poly([50, 14], [60, 4], [56, 18]), fill: "#aeb6c0" },
  ],
});

export const GEAR_HURDLES = /* @__PURE__ */ drawn("gear:hurdles", "Hurdle", "ハードル", {
  main: "#f4f1ea",
  accent: "#1d1f24",
  parts: [
    { d: rect(13, 22, 4, 31), fill: "#aeb6c0", shade: 0.5 },
    { d: rect(47, 22, 4, 31), fill: "#aeb6c0", shade: 0.5 },
    { d: rect(5, 51, 18, 5, 1.500), fill: "$accent", shade: 0.4 },
    { d: rect(41, 51, 18, 5, 1.500), fill: "$accent", shade: 0.4 },
    { d: rect(7, 12, 50, 11, 1.500), fill: "$main" },
    { d: rect(7, 12, 9, 11, 1.500), fill: "$accent", shade: 0.4 },
    { d: rect(48, 12, 9, 11, 1.500), fill: "$accent", shade: 0.4 },
    { d: rect(16, 12, 16, 11, 0), fill: "$main", stroke: "none", line: "none", shade: 0 },
  ],
});
