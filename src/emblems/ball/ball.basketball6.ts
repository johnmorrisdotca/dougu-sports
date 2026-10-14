// Basketball, size 6 (women's competitions): the same pattern a little smaller, here a shade lighter.
import { defineBall } from "./ball.engine.ts";
import { basketballSpec } from "./ball.basketball.ts";

export const BALL_BASKETBALL_6 = /* @__PURE__ */ defineBall({
  id: "ball:basketball-6",
  en: "Basketball, size 6",
  ja: "バスケットボール6号球",
  size: { extentMm: 230.0, diameterMm: 230.0, circumferenceMm: 722.5, massG: [510, 550], rule: "FIBA Basketball Equipment 2026, Rule 2 Basketballs, 2.4 and Table 1 (size 6 = women's competitions)", note: "Diameter worked out from the middle of the circumference range." },
  spec: basketballSpec("#e57a26"),
});
