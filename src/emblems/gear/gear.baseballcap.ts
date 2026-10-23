// A baseball cap in three-quarter view, drawn for this package: a six-panel crown, a button, seams, eyelets, and a brim whose top, edge and underside
// are separate so the side of the brim reads as well as the front. No team mark. It turns with the gear coin-flip (a rim, then the mirrored back).
import { circle, drawn, ellipse } from "./gear.core.ts";

export const GEAR_BASEBALL_CAP = /* @__PURE__ */ drawn("gear:baseball-cap", "Baseball cap", "野球帽", {
  main: "#243656",
  accent: "#d5dde6",
  parts: [
    { d: "M22 46Q38 42 58 48Q62 52 54 56Q38 52 20 54Z", fill: "#1a2740", stroke: "#121c30", shade: 0.4 },
    { d: "M24 40Q42 34 60 42Q63 46 56 50Q40 46 22 50Z", fill: "#2c4264", stroke: "#1a2740", cyl: 0.45 },
    { d: "M30 43.2Q42 40.4 54 44.6M28 46.2Q42 43.2 56 47.6", fill: "none", stroke: "$accent", w: 0.7, line: "stroke" },
    { d: "M16 40C12 26 20 12 34 9.2C48 6.4 56 16 57.2 28C58.4 38 52 46 40 48.4C28 50.6 18 48 16 40Z", fill: "$main", cyl: 0.7 },
    { d: "M34 12.2Q30 26 28.4 42M34 12.2Q40 24 44.6 40M34 12.6Q24 22 20.4 38M34 12.4Q46 20 52.4 34", fill: "none", stroke: "#152238", w: 1.1 },
    { d: circle(34, 10.2, 2.6), fill: "#1a2740", stroke: "#101828", shade: 0.3 },
    { d: circle(34, 10.2, 1.3), fill: "$accent", stroke: "#9aa6b4", shade: 0.2 },
    { d: ellipse(24.2, 28, 1.15, 1.5), fill: "#101828", stroke: "#101828", shade: 0 },
    { d: ellipse(46.6, 26.4, 1.15, 1.5), fill: "#101828", stroke: "#101828", shade: 0 },
    { d: "M20 42.4Q32 48.6 44 44.2", fill: "none", stroke: "#152238", w: 2.2, line: "stroke" },
    { d: "M22 16Q30 11 40 12.4", fill: "none", stroke: "#fff", w: 1.6, op: 0.35, line: "none", fx: true },
  ],
});
