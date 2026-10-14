// Cricket balls: a leather ball with one raised seam round its middle and three rows of stitches either side of it. Red for Tests, white for limited overs, pink for day-night matches.
// The stitching is drawn the way it is sewn: 78 stitches to a row, each square across the row.
import { type BallDef, defineBall } from "./ball.engine.ts";
import { greatCircle, smallCircle } from "./ball.math.ts";
import { stitches } from "./ball.stitch.ts";
import { mix } from "./ball.core.ts";
import type { Piece } from "./ball.core.ts";
import type { BallSpec } from "./ball.engine.ts";

const ROWS = [0.1, 0.19, 0.28];
const AXIS = [0.2, 1, 0.1] as const;

function cricket(id: string, en: string, ja: string, base: string, thread: string, size: BallDef["size"], shade: string): Piece<BallSpec> {
  return defineBall({
    id,
    en,
    ja,
    size,
    spec: {
      view: { yaw: 20, pitch: 24, roll: -12 },
      base,
      mat: { gloss: 0.62, shade, grain: { f: 1.1, a: 0.16 } },
      draw: (s, colour) => {
        let out = s.seam(greatCircle(AXIS, 96), mix(colour, -0.12), 2.6, { closed: true });
        const rows = ROWS.flatMap((r) => [r, -r]).map((lat) => smallCircle(AXIS, Math.PI / 2 - lat, 96));
        out += s.strokes(rows.flatMap((row) => stitches(row, true, 78, 0.026)), thread, 0.75, { ink: false });
        return out;
      },
    },
  });
}

const SIZE: BallDef["size"] = { extentMm: 72.1, diameterMm: 72.1, circumferenceMm: 226.5, massG: [156, 163], rule: "Laws of Cricket, Law 4 The Ball, 4.1 Weight and size (Size 1, Size 2, Size 3)", note: "Size 1 (men's). Diameter worked out from the middle of the circumference range. The Laws do not set a colour." };
export const BALL_CRICKET_RED = /* @__PURE__ */ cricket("ball:cricket-red", "Cricket ball, red", "クリケットボール（赤）", "#a9161e", "#f2e8d2", SIZE, "#2a0408");
export const BALL_CRICKET_WHITE = /* @__PURE__ */ cricket("ball:cricket-white", "Cricket ball, white", "クリケットボール（白）", "#f3f0e8", "#2a2a2a", SIZE, "#4a4a58");
export const BALL_CRICKET_PINK = /* @__PURE__ */ cricket("ball:cricket-pink", "Cricket ball, pink", "ピンクのクリケット球", "#e45a8c", "#2a2a2a", SIZE, "#4a0a22");
