// The size of a size 5 soccer ball under the Laws of the Game, which every 11-a-side soccer ball here shares (the panels, the colours and the cover change; the rule does not).
import type { PieceSize } from "./ball.core.ts";

export const SOCCER_SIZE: PieceSize = {
  extentMm: 219.6,
  diameterMm: 219.6,
  circumferenceMm: 690.0,
  massG: [410, 450],
  rule: "IFAB Laws of the Game, Law 2 The Ball, section 2.1 Qualities and measurements",
  note: "Diameter worked out from the middle of the circumference range (68 to 70 cm).",
};

/** Where the classic 32-panel ball takes a logo and lettering: the middle of a white hexagon, the way up there, and the view that shows it (the hexagon on the far side is the same, so the label can go there). */
export const CLASSIC_HOME: import("./ball.engine.ts").BallSpec["home"] = {
  c: [-0.577, -0.577, -0.577],
  up: [-0.408, 0.816, -0.408],
  reach: 0.38,
  view: { yaw: 124.5, pitch: -40.8, roll: -6.1 },
  word: "soccer",
};
