// A baseball glove with a ball, drawn for this package: a leather mitt of four fingers and a thumb round a deep pocket, a laced web, a wrist strap and a ball in the pocket.
import { capsule, circle, drawn, ellipse } from "./gear.core.ts";

export const GEAR_BASEBALL_GLOVE = /* @__PURE__ */ drawn("gear:baseball-glove", "Baseball glove", "野球のグラブ", {
  main: "#b5702f",
  accent: "#e6cfa0",
  parts: [
    { d: capsule(17, 30, 12.6, 16, 9.6), fill: "$main", cyl: 0.8, shade: 0.3 },
    { d: capsule(28, 28, 26.6, 11.6, 10), fill: "$main", cyl: 0.8, shade: 0.3 },
    { d: capsule(39, 28.4, 40.6, 12.6, 9.8), fill: "$main", cyl: 0.8, shade: 0.3 },
    { d: capsule(48, 32, 52.6, 19.4, 9), fill: "$main", cyl: 0.8, shade: 0.3 },
    { d: capsule(12, 42, 5.8, 34.6, 10), fill: "$main", cyl: 0.8, shade: 0.3 },
    { d: "M9 34C7 47 16 59 32 59C48 59 58 49 56 34C53 25 45 23 36 23C27 23 13 23 9 34Z", fill: "$main", shade: 0.6 },
    { d: ellipse(32, 42, 15.4, 12.4), fill: "#8f5220", stroke: "#6a3a14", shade: 0, line: "stroke" },
    { d: "M13.4 24.2L17 29.4M23.4 20L24.6 26M34 20.6L34 26M45 22.6L42.4 27.4M8.6 36L13.4 36.6", fill: "none", stroke: "$accent", w: 1.4, line: "none" },
    { d: "M20 55.6Q32 61 45 55.4", fill: "none", stroke: "$accent", w: 1.6, line: "none" },
    { d: "M22 56.4L44 56.6L43.4 60.8Q32 63.4 23 60.8Z", fill: "#7a4318", stroke: "#4a280c", shade: 0.3, line: "none" },
    { d: circle(32, 41, 7.8), fill: "#f6f3ec", stroke: "#8f98a3", shade: 0.9 },
    { d: "M27.2 35.4Q31 41 27.2 46.6M36.8 35.4Q33 41 36.8 46.6", fill: "none", stroke: "#c4262e", w: 1, line: "none" },
    { d: "M8.6 35Q9.6 29 13 26.4", fill: "none", stroke: "#fff", w: 1.6, op: 0.4, line: "none", fx: true },
  ],
});
