// Kyudo gear, drawn for this package: the long bow, held a third of the way up from its lower tip, with its string and wrapped grip; and the arrow, with its feathers, nock and steel point.
import { capsule, drawn, swell } from "./gear.core.ts";

/** The bow's limbs: a long upper limb and a short lower one, thickest at the hand and thin at the tips. */
const BOW = swell([44, 2], [12, 10], [16, 52], [38, 62], (t) => 1.6 + 2.6 * Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.6, 22);

export const GEAR_YUMI = /* @__PURE__ */ drawn("gear:yumi", "Long bow", "弓", {
  main: "#4a2e1e",
  accent: "#d9b66a",
  parts: [
    { d: "M44 2.4L38 62", fill: "none", stroke: "#f1ead8", w: 0.9 },
    { d: BOW, fill: "$main", cyl: 0.8, shade: 0.2 },
    { d: "M20.4 38.6L28.6 40.2L28.4 48.8L19.8 47.2Z", fill: "$accent", cyl: 0.7, shade: 0.3 },
    { d: "M21 41.6L28.4 43M20.8 44.6L28.2 46", fill: "none", stroke: "#8a6a2a", w: 0.7, line: "none" },
    { d: "M20.6 17.6L26.6 17.4M18.4 24.8L24.4 25M20.2 30.2L26 31", fill: "none", stroke: "$accent", w: 1.4, line: "none" },
    { d: "M20.4 13.6Q26 11.4 30 6", fill: "none", stroke: "#fff", w: 0.9, op: 0.4, line: "none", fx: true },
  ],
});

const T = "rotate(40 32 32) translate(32 33) scale(1.22) translate(-32 -33)";

export const GEAR_YA = /* @__PURE__ */ drawn("gear:ya", "Arrow", "矢", {
  main: "#d6ae63",
  accent: "#f4f1ea",
  parts: [
    { d: capsule(32, 9, 32, 58, 2.2), fill: "$main", t: T, cyl: 1, shade: 0 },
    { d: "M32 1.4L33.8 9.8H30.2Z", fill: "#aeb6c0", t: T, cyl: 0.9, shade: 0.3 },
    { d: "M31.2 38.4Q27.8 43.4 28.2 55.4Q30.4 53 31.2 48.6Z", fill: "$accent", t: T, shade: 0.5 },
    { d: "M32.8 38.4Q36.2 43.4 35.8 55.4Q33.6 53 32.8 48.6Z", fill: "$accent", t: T, shade: 0.5 },
    { d: "M32 36.6Q33.6 46 32 56Q30.4 46 32 36.6Z", fill: "$accent", t: T, shade: 0.5 },
    { d: "M28.6 49.4Q30 47.8 31.2 47.8M35.4 49.4Q34 47.8 32.8 47.8", fill: "none", stroke: "#3a2a22", w: 1.4, t: T, line: "none" },
    { d: "M30.6 57h2.8l.3 3.8h-3.4z", fill: "#3a2a22", t: T, cyl: 0.5, shade: 0.3 },
    { d: "M30.4 36h3.2M30.4 24h3.2", fill: "none", stroke: "#8a6a2a", w: 0.8, t: T, line: "none" },
  ],
});
