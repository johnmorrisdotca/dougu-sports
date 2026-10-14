// A goal with a net, drawn for this package: a frame of round posts seen from the front and a little above, the back bar and the sloping top and sides, and a mesh of strings.
import { drawn, seg } from "./gear.core.ts";

/** The mesh: the back panel, the top, and the two sides, as strings. */
const MESH = ((): string => {
  let d = "";
  for (let x = 16; x <= 48; x += 4) d += seg(x, 20, x, 42);
  for (let y = 24; y <= 40; y += 4) d += seg(14, y, 50, y);
  d += seg(7, 13, 14, 20) + seg(57, 13, 50, 20) + seg(7, 44, 14, 42) + seg(57, 44, 50, 42);
  return d;
})();

export const GEAR_GOAL_NET = /* @__PURE__ */ drawn("gear:goal-net", "Goal net", "ゴールネット", {
  main: "#d62b2b",
  accent: "#dfe4ea",
  parts: [
    { d: "M7 12H57L50 20H14z", fill: "$accent", stroke: "none", op: 0.45, shade: 0, line: "none" },
    { d: "M7 12L14 20V42L7 46zM57 12L50 20V42L57 46z", fill: "$accent", stroke: "none", op: 0.28, shade: 0, line: "none" },
    { d: MESH, fill: "none", stroke: "#8f98a3", w: 0.6 },
    { d: "M14 20H50M14 20V42H50V20", fill: "none", stroke: "#aeb6c0", w: 1.4, line: "stroke" },
    { d: "M7 46V12H57V46", fill: "none", stroke: "$main", w: 4.2 },
    { d: "M7 46V12H57V46", fill: "none", stroke: "#fff", w: 1, op: 0.35, fx: true, line: "none", t: "translate(-.7 .4)" },
    { d: "M4.6 49H59.4", fill: "none", stroke: "#8f98a3", w: 3.2 },
  ],
});
