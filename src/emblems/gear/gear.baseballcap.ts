// A baseball cap in three-quarter view with its brim toward the lower left, drawn for this package from two photographs of plain caps (docs/likeness-sources.md): the crown is a dome that is widest low at the back, with a
// button and a front seam set off to the right of the middle, three eyelets, and a brim that is a wide curved shield with its edge, its underside and rows of stitching. No team mark, lettering or brand. It turns with the gear coin-flip.
import { drawn, ellipse } from "./gear.core.ts";

export const GEAR_BASEBALL_CAP = /* @__PURE__ */ drawn("gear:baseball-cap", "Baseball cap", "野球帽", {
  main: "#243656",
  accent: "#d5dde6",
  parts: [
    // The crown: a dome from the back of the head over the button down to the band, dropping lower at the back and the right.
    { d: "M16.6 31.4C13.4 22.4 15.4 15.2 22 11.2C27.6 8 34.8 7.4 41.4 9C50 11.2 57.4 16.6 59.2 25.4C60.4 31.8 59.8 37.6 56 41.8C50.8 44.4 43.6 44.8 36.4 43.2C28.2 41.6 21 37.6 16.6 31.4Z", fill: "$main", cyl: 0.6 },
    // The seams of the panels: the front seam to the right of the button, one behind it, and the one on the left side.
    { d: "M38.6 9.2C41.4 18.4 44.6 28 45.4 42.4", fill: "none", stroke: "#152238", w: 0.9, line: "stroke" },
    { d: "M45.4 9.8C53.6 14 57 21 57.8 28", fill: "none", stroke: "#152238", w: 0.8, line: "stroke" },
    // The button, then the eyelets.
    { d: ellipse(36, 8.7, 3.1, 1.9), fill: "$accent", stroke: "#8f9bab", shade: 0.3 },
    { d: ellipse(21.5, 17.6, 1.2, 1.1), fill: "#101828", stroke: "$accent", w: 0.6, shade: 0 },
    { d: ellipse(34.4, 21, 1.2, 1.1), fill: "#101828", stroke: "$accent", w: 0.6, shade: 0 },
    { d: ellipse(50.6, 19, 1.2, 1.1), fill: "#101828", stroke: "$accent", w: 0.6, shade: 0 },
    // A light on the dome, from the upper left.
    { d: "M21.6 16.6C25 12.6 30.6 10.4 35.2 10.4", fill: "none", stroke: "#fff", w: 1.8, op: 0.3, line: "none", fx: true },
    // The brim: the top is a curved shield, widest at the front, with its edge, which is a thin band along the outer curve, and four rows of stitching.
    { d: "M4.6 41.8C9 36.4 13.8 32.6 18 30.4C21.4 37 27.4 41.2 35 43C42 44.4 48.4 44.2 54.6 40.6C55.8 47.6 52 52.6 44.6 55C34.6 58 19.6 56 11.8 49.8C7.6 46.8 5.4 44.4 4.6 41.8Z", t: "translate(0 1.7)", fill: "#17233a", stroke: "#101828", shade: 0.4 },
    { d: "M4.6 41.8C9 36.4 13.8 32.6 18 30.4C21.4 37 27.4 41.2 35 43C42 44.4 48.4 44.2 54.6 40.6C55.8 47.6 52 52.6 44.6 55C34.6 58 19.6 56 11.8 49.8C7.6 46.8 5.4 44.4 4.6 41.8Z", fill: "#2c4264", stroke: "#1a2740", cyl: 0.35 },
    { d: "M9.6 41.2C16 46.4 25.6 50.2 35.4 50.2C43.2 50.2 49.4 47.8 52.2 43.6M12.6 39.4C18.8 44.6 27.2 47.6 36 47.6C42.2 47.6 47.2 45.8 50.4 42.8M16 36.8C21.8 41.4 28.6 44.2 36.2 44.6", fill: "none", stroke: "$accent", w: 0.45, op: 0.55, line: "none" },
    // The band where the crown meets the brim.
    { d: "M18 30.6C22 37.4 28 41.4 36 43.2C43.6 44.6 49.6 44.2 55 41", fill: "none", stroke: "#101828", w: 1.3, line: "stroke" },
    // The light along the top of the brim.
    { d: "M9 40.6C13 36.4 16 34.4 18.4 33.2", fill: "none", stroke: "#fff", w: 1.4, op: 0.28, line: "none", fx: true },
  ],
});
