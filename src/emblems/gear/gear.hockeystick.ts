// An ice hockey stick and a puck, drawn for this package: a long shaft taped at the top, and a blade with a heel and a toe lying flat on the ice.
import { capsule, drawn } from "./gear.core.ts";

const T = "rotate(28 32 32)";

export const GEAR_HOCKEY_STICK = /* @__PURE__ */ drawn("gear:hockey-stick", "Hockey stick and puck", "スティックとパック", {
  main: "#c8202c",
  accent: "#f2efe8",
  parts: [
    { d: capsule(32, 1.5, 32, 47, 4.2), fill: "$main", t: T, cyl: 1, shade: 0 },
    { d: capsule(32, 1.5, 32, 11, 4.4), fill: "$accent", t: T, cyl: 0.8, shade: 0 },
    { d: "M22.4 42.6L28.6 45.6Q29 50.6 33 51.4H42.4Q45 51.4 44.8 54.6Q44.6 57.8 41.6 57.8H20.8Q17.4 57.8 17.8 54.6Q18.2 49.4 22.4 42.6Z", fill: "#dcb97b", cyl: 0.7, shade: 0 },
    { d: "M19.6 51.8L26 51.4L27 57.8H18.2ZM33 51.4H37.6L36.8 57.8H32Z", fill: "$accent", stroke: "none", op: 0.92, shade: 0, line: "none" },
    { d: "M48.6 52.4v3.2a5.4 2.3 0 0 0 10.8 0v-3.2a5.4 2.3 0 0 0-10.8 0z", fill: "#3a414b", cyl: 0.8, shade: 0 },
    { d: "M48.6 52.4a5.4 2.3 0 0 0 10.8 0a5.4 2.3 0 0 0-10.8 0z", fill: "#6b7480", shade: 0, line: "none" },
  ],
});
