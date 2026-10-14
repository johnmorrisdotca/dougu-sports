// The 3x3 basketball: two-tone, orange above and charcoal below, the size of a 6 and the weight of a 7. Our own two-tone scheme; the rules fix the size and the weight.
import { defineBall } from "./ball.engine.ts";
import { basketballSpec } from "./ball.basketball.ts";

export const BALL_BASKETBALL_3X3 = /* @__PURE__ */ defineBall({
  id: "ball:basketball-3x3",
  en: "Basketball, 3x3",
  ja: "3x3バスケットボール",
  size: { extentMm: 232.4, diameterMm: 232.4, circumferenceMm: 730.0, massG: [580, 620], rule: "FIBA 3x3 Official Equipment & Software Appendix to the 3x3 Official Rules (Dec 2024 update), Table 1 and section 5.7 (as quoted by balls.com)", note: "Not read in the FIBA 3x3 equipment appendix itself (fiba3x3.com refused the request); the figures are those a ball retailer prints from it: the circumference of a size 6 with the weight of a size 7. Diameter worked out from the middle of the circumference range." },
  spec: basketballSpec("#e0701f", "#2b2d33"),
});
