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
