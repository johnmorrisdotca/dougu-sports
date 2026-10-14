// An ice hockey stick and a puck, drawn for this package: a long shaft taped at the top, and a blade with a heel and a toe lying flat on the ice.
import { capsule, drawn } from "./gear.core.ts";

const T = "rotate(28 32 32)";

export const GEAR_HOCKEY_STICK = /* @__PURE__ */ drawn("gear:hockey-stick", "Hockey stick and puck", "スティックとパック", {
  main: "#c8202c",
  accent: "#f2efe8",
  parts: [
    { d: capsule(32, 1.5, 32, 47, 4.2), fill: "$main", t: T, cyl: 1, shade: 0 },
    { d: capsule(32, 1.5, 32, 11, 4.4), fill: "$accent", t: T, cyl: 0.8, shade: 0 },
    { d: "M23.2 41.6L29.4 44.4C29 49 31 51.6 35.6 51.6H43.4Q46.8 51.8 46.4 54.8Q46 58 42.4 58H19.8Q16.4 58 17 54.4C17.8 49.6 20 45 23.2 41.6Z", fill: "#dcb97b", cyl: 0.7, shade: 0 },
    { d: "M19 52.4L25 49.6L26.6 58H18ZM33.6 51.6H38.4L37.6 58H32.6Z", fill: "$accent", stroke: "none", op: 0.92, shade: 0, line: "none" },
    { d: "M48.6 52.4v3.2a5.4 2.3 0 0 0 10.8 0v-3.2a5.4 2.3 0 0 0-10.8 0z", fill: "#3a414b", cyl: 0.8, shade: 0 },
    { d: "M48.6 52.4a5.4 2.3 0 0 0 10.8 0a5.4 2.3 0 0 0-10.8 0z", fill: "#6b7480", shade: 0, line: "none" },
  ],
});
