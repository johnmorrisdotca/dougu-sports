// Pickleball: a perforated plastic ball. The outdoor ball has 40 small holes; the indoor ball has 26 larger ones (the rulebook gives 26 to 40 holes; the split is how balls are sold).
import { dottedBall } from "./ball.family.dotted.ts";
import { holeLayers } from "./ball.holes.ts";

/**
 * The Pickleball, outdoor emblem (ピックルボール（屋外用） in Japanese): id `ball:pickleball-outdoor`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_PICKLEBALL_OUTDOOR } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_PICKLEBALL_OUTDOOR.id, BALL_PICKLEBALL_OUTDOOR.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
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

/**
 * The Pickleball, indoor emblem (ピックルボール（屋内用） in Japanese): id `ball:pickleball-indoor`, a ball turned in 3D.
 * @example
 * ```ts
 * import { BALL_PICKLEBALL_INDOOR } from "@johnmorrisdotca/dougu-sports";
 * console.log(BALL_PICKLEBALL_INDOOR.id, BALL_PICKLEBALL_INDOOR.svg({ size: 48 }).startsWith("<svg"));
 * ```
 */
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
