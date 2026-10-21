// Pickleball: a perforated plastic ball. The outdoor ball has 40 small holes; the indoor ball has 26 larger ones (the rulebook gives 26 to 40 holes; the split is how balls are sold).
import { dottedBall } from "./ball.family.dotted.ts";
import { holeLayers } from "./ball.holes.ts";

export const BALL_PICKLEBALL_OUTDOOR = /* @__PURE__ */ dottedBall({
  id: "ball:pickleball-outdoor",
  en: "Pickleball, outdoor",
  ja: "ピックルボール（屋外用）",
  size: { extentMm: 74.2, diameterMm: 74.2, massG: [22.1, 26.5], rule: "USA Pickleball Equipment Standards Manual (Jan 2025, Revision 3.0), 2.D.1 Design, 2.D.3 Size, 2.D.4 Weight, 2.D.8 Design (holes); USA Pickleball 2026 Official Rulebook rule 3.C Ball Specifications", note: "The rulebook does not tell indoor and outdoor balls apart: both are 26 to 40 holes; 40 small holes is the outdoor ball as sold." },
  base: "#e6e83c",
  count: 40,
  radius: 0.13,
  mat: { gloss: 0.55, shade: "#4a5008", grain: { f: 1.4, a: 0.1 } },
  mark: "#454b0e",
  depth: 0.75,
  hollow: holeLayers,
});

export const BALL_PICKLEBALL_INDOOR = /* @__PURE__ */ dottedBall({
  id: "ball:pickleball-indoor",
  en: "Pickleball, indoor",
  ja: "ピックルボール（屋内用）",
  size: { extentMm: 74.2, diameterMm: 74.2, massG: [22.1, 26.5], rule: "USA Pickleball Equipment Standards Manual (Jan 2025, Revision 3.0), 2.D.1 Design, 2.D.3 Size, 2.D.4 Weight, 2.D.8 Design (holes); USA Pickleball 2026 Official Rulebook rule 3.C Ball Specifications", note: "The rulebook does not tell indoor and outdoor balls apart: both are 26 to 40 holes; 26 large holes is the indoor ball as sold." },
  base: "#f2f0e4",
  count: 26,
  radius: 0.19,
  mat: { gloss: 0.6, shade: "#3a3a40", grain: { f: 1.4, a: 0.08 } },
  mark: "#3d3d44",
  depth: 0.7,
  hollow: holeLayers,
});
