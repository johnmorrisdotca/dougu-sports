// A football helmet, drawn for this package: a glossy shell seen from the side with a stripe over the crown, an ear hole, and a cage of bars across the face opening.
import { drawn, ellipse } from "./gear.core.ts";

export const GEAR_FOOTBALL_HELMET = /* @__PURE__ */ drawn("gear:football-helmet", "Football helmet", "アメフトのヘルメット", {
  main: "#cfd6de",
  accent: "#c8202c",
  parts: [
    { d: "M6 38C3 21 15 7 32 7C45 7 53 15 53 27V33L48.6 36L45.6 46C41.6 55 29.6 57 19.6 54C11.6 51 7 46 6 38Z", fill: "$main", cyl: 0.6 },
    { d: "M45 11.6Q22 9.4 12 31", fill: "none", stroke: "$accent", w: 4.4, line: "none" },
    { d: ellipse(25.5, 39, 6, 7.2), fill: "#2a2f38", stroke: "#1b1f27", shade: 0.5 },
    { d: "M21 33Q25 30.4 30 33", fill: "none", stroke: "#fff", w: 1, op: 0.45, line: "none", fx: true },
    { d: "M13 18Q21 9.6 33 10", fill: "none", stroke: "#fff", w: 2, op: 0.55, line: "none", fx: true },
    { d: "M52.6 28Q62 29.6 61 38L57 47Q54 52 46 52.4", fill: "none", stroke: "#4a5362", w: 2.6 },
    { d: "M50.4 35H60.4M49.2 41.6H58.4M47 47.4H55.4", fill: "none", stroke: "#4a5362", w: 2 },
    { d: "M45.6 46L50 52.4M38.6 55.4Q43 54.4 46 52.4", fill: "none", stroke: "#2a2f38", w: 2, line: "none" },
  ],
});
