// Balls with the seam of a baseball or a tennis ball: one closed curve that winds twice round the sphere, x=(1-b)cos t + b cos 3t, y=(1-b)sin t - b sin 3t, z=2sqrt(b(1-b)) sin 2t.
// A baseball and a softball have red stitches that cross it in Vs; a tennis or padel ball has a white rubber strip along it; a sliotar a raised rib.
import { type BallDef, defineBall } from "./ball.engine.ts";
import { seamCurve } from "./ball.math.ts";
import { stitches } from "./ball.stitch.ts";
import type { Piece } from "./ball.core.ts";
import type { BallSpec } from "./ball.engine.ts";

export interface SeamedOptions {
  id: string;
  en: string;
  ja: string;
  size: BallDef["size"];
  base: string;
  /** The seam's parameter b. */
  b: number;
  view?: BallSpec["view"];
  mat: BallSpec["mat"];
  /** A strip along the seam: its colour and width. */
  strip?: { colour: string; width: number; raised?: boolean };
  /** Stitches across the seam: colour, count, the half-length across it (radians) and the stroke width. */
  stitch?: { colour: string; count: number; half: number; width: number; lean: number };
  /** A thin groove along the seam. */
  groove?: string;
}

export function seamedBall(o: SeamedOptions): Piece<BallSpec> {
  const spec: BallSpec = {
    view: o.view ?? { yaw: 0, pitch: 0, roll: 0 },
    base: o.base,
    mat: o.mat,
    draw: (s) => {
      const seam = seamCurve(o.b, 160);
      let out = "";
      if (o.groove !== undefined) out += s.stroke(seam, o.groove, 0.8, { closed: true, opacity: 0.55 });
      if (o.strip !== undefined) out += o.strip.raised === true ? s.seam(seam, o.strip.colour, o.strip.width, { closed: true }) : s.stroke(seam, o.strip.colour, o.strip.width, { closed: true });
      if (o.stitch !== undefined) out += s.strokes(stitches(seam, true, o.stitch.count, o.stitch.half, { v: true, lean: o.stitch.lean }), o.stitch.colour, o.stitch.width, { ink: false });
      if (o.strip === undefined && o.stitch === undefined) out += s.stroke(seam, "currentColor", 1.6, { closed: true });
      return out;
    },
  };
  return defineBall({ id: o.id, en: o.en, ja: o.ja, spec, size: o.size });
}
