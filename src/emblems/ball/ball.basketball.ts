// The basketball: an orange sphere with the equator, the meridian and the two curved side channels. The channels are the curves latitude = +-(0.304 + 0.585 sin^2 longitude) round the ball,
// each crossing the meridian square on and swinging away from the equator toward both sides; the constants were fitted to a photograph and a drawing of a generic ball (a least-squares
// match of 1,766 seam pixels), not copied from either. FIBA allows at most 12 seams of at most 6.35 mm; this ball has the four channels of the usual pattern.
import { type BallSpec, defineBall } from "./ball.engine.ts";
import { greatCircle, lonLat, smallCircle } from "./ball.math.ts";
import type { V3 } from "./ball.math.ts";
import { mix, type PieceSize } from "./ball.core.ts";

const L0 = 0.304;
const AMP = 0.585;

/** One side channel: the wave above the equator for `sign` 1 and below it for -1. */
export const basketballChannel = (sign: 1 | -1, n = 72): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const lon = (i / n) * 2 * Math.PI;
    return lonLat(lon, sign * (L0 + AMP * Math.sin(lon) ** 2));
  });

/** The spec of a basketball: its colour, and the colour of its lower half for a two-tone ball. */
export function basketballSpec(base: string, lower?: string): BallSpec {
  return {
    view: { yaw: 46.8, pitch: -13.5, roll: 183.6 },
    base,
    mat: { gloss: 0.5, shade: "#4a1c06", grain: { f: 1.1, a: 0.32 } },
    draw(s, colour) {
      const ink = mix(colour, -0.88);
      let out = "";
      if (lower !== undefined) out += s.panel(smallCircle([0, -1, 0], 1.545, 72), lower, { n: 1, ink: false });
      const curves = [greatCircle([0, 1, 0], 72), greatCircle([1, 0, 0], 72), basketballChannel(1), basketballChannel(-1)];
      out += s.strokes(curves, ink, 2.0, { closed: true });
      return out;
    },
  };
}

const SIZE7: PieceSize = { extentMm: 241.9, diameterMm: 241.9, circumferenceMm: 760.0, massG: [580, 620], rule: "FIBA Basketball Equipment 2026, Rule 2 Basketballs, 2.4 and Table 1 (size 7 = men's competitions)", note: "Diameter worked out from the middle of the circumference range." };

export const BALL_BASKETBALL = /* @__PURE__ */ defineBall({ id: "ball:basketball", en: "Basketball", ja: "バスケットボール", size: SIZE7, spec: basketballSpec("#e0701f") });
