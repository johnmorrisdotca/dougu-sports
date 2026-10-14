// Kendo gear, drawn for this package: the bamboo sword with its leather fittings, and the helmet with its steel grille, cloth flaps and throat guard.
import { capsule, drawn, ellipse, seg } from "./gear.core.ts";

const T = "rotate(40 32 32) translate(32 33) scale(1.25) translate(-32 -33)";

export const GEAR_SHINAI = /* @__PURE__ */ drawn("gear:shinai", "Bamboo sword", "竹刀", {
  main: "#e2c47c",
  accent: "#27345f",
  parts: [
    { d: capsule(32, 6, 32, 46, 4.6), fill: "$main", t: T, cyl: 1, shade: 0 },
    { d: "M30.6 8V45M33.4 8V45", fill: "none", stroke: "#b58e3c", w: 0.6, t: T, op: 0.8, line: "none" },
    { d: "M32 3.6a2.6 3 0 0 1 2.6 3v3.2h-5.2V6.6a2.6 3 0 0 1 2.6-3z", fill: "#6b3a1f", t: T, cyl: 0.8, shade: 0 },
    { d: "M29.2 20.4h5.6v3.6h-5.6z", fill: "#6b3a1f", t: T, cyl: 0.8, shade: 0 },
    { d: "M34.8 9.4V45", fill: "none", stroke: "#efe3c0", w: 0.8, t: T, line: "none" },
    { d: ellipse(32, 47.6, 7.4, 2.4), fill: "$accent", t: T, cyl: 0.6, shade: 0.4 },
    { d: capsule(32, 48, 32, 61, 5), fill: "$accent", t: T, cyl: 0.9, shade: 0 },
    { d: seg(29.8, 51, 34.2, 51) + seg(29.8, 54, 34.2, 54) + seg(29.8, 57, 34.2, 57), fill: "none", stroke: "#8fa0d0", w: 0.7, t: T, op: 0.8, line: "none" },
  ],
});

/** The bars of the grille across the face opening. */
const BARS = ((): string => {
  let d = "";
  for (let y = 24; y <= 46; y += 3.8) {
    const h = 15.4 * Math.sqrt(Math.max(0.01, 1 - ((y - 34) / 16) ** 2));
    d += `M${32 - h} ${y}H${32 + h}`;
  }
  return d;
})();

export const GEAR_KENDO_MEN = /* @__PURE__ */ drawn("gear:kendo-men", "Kendo helmet", "剣道の面", {
  main: "#34478a",
  accent: "#c8cfd8",
  parts: [
    { d: "M14 48L17 60Q32 66 47 60L50 48Z", fill: "$main", cyl: 0.5, shade: 0.4 },
    { d: "M18 53.4h28M18.6 57h26.8", fill: "none", stroke: "#8fa0d0", w: 0.8, op: 0.8, line: "none" },
    { d: "M32 3C48 3 59 12 59 26V37Q59 46 52 50L47 50L47 24H17V50L12 50Q5 46 5 37V26C5 12 16 3 32 3Z", fill: "$main", cyl: 0.7, shade: 0.4 },
    { d: "M9 28H17M9 33H17M9 38H17M9 43H15M47 28H55M47 33H55M47 38H55M49 43H55", fill: "none", stroke: "#8fa0d0", w: 0.8, op: 0.8, line: "none" },
    { d: "M13 11Q32 5 51 11M10.6 16.4Q32 10.6 53.4 16.4M9 21.6Q32 15.8 55 21.6", fill: "none", stroke: "#8fa0d0", w: 0.8, op: 0.8, line: "none" },
    { d: ellipse(32, 35, 17.4, 18.6), fill: "#1f2430", stroke: "$accent", w: 2.4, shade: 0, line: "stroke" },
    { d: BARS, fill: "none", stroke: "$accent", w: 1.5 },
    { d: seg(32, 18.4, 32, 51.6), fill: "none", stroke: "$accent", w: 1.2, line: "none" },
    { d: "M14.6 12Q22 6.6 32 6", fill: "none", stroke: "#fff", w: 1.6, op: 0.4, line: "none", fx: true },
  ],
});
