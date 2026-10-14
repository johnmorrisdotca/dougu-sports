// Balls with the seam of a baseball or a tennis ball: one closed curve that winds twice round the sphere, x=(1-b)cos t + b cos 3t, y=(1-b)sin t - b sin 3t, z=2sqrt(b(1-b)) sin 2t.
// A baseball and a softball have red stitches that cross it in Vs; a tennis or padel ball has a white rubber strip along it; a sliotar a raised rib.
import { type BallDef, defineBall } from "./ball.engine.ts";
import { mix } from "./ball.core.ts";
import { scuffs } from "./ball.decal.ts";
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
  /** Stitches across the seam: colour, count, the half-length across it (radians) and the stroke width. With `colour2` every other stitch is in that colour (a two-thread seam). */
  stitch?: { colour: string; colour2?: string; count: number; half: number; width: number; lean: number };
  /** Scuffs of wear: the number of dark and of pale patches. */
  wear?: { dark: number; pale: number; seed?: number };
  /** A thin groove along the seam. */
  groove?: string;
}

export function seamedBall(o: SeamedOptions): Piece<BallSpec> {
  const spec: BallSpec = {
    view: o.view ?? { yaw: 0, pitch: 0, roll: 0 },
    base: o.base,
    mat: o.mat,
    draw: (s, base) => {
      const seam = seamCurve(o.b, 160);
      let out = "";
      if (o.groove !== undefined) out += s.stroke(seam, o.groove, 0.8, { closed: true, opacity: 0.55 });
      if (o.strip !== undefined) out += o.strip.raised === true ? s.seam(seam, o.strip.colour, o.strip.width, { closed: true }) : s.stroke(seam, o.strip.colour, o.strip.width, { closed: true });
      if (o.wear !== undefined) out += scuffs(s, mix(base, -0.55), mix(base, 0.6), { dark: o.wear.dark, pale: o.wear.pale, seed: o.wear.seed });
      if (o.stitch !== undefined) {
        const marks = stitches(seam, true, o.stitch.count, o.stitch.half, { v: true, lean: o.stitch.lean });
        const second = o.stitch.colour2;
        if (second === undefined) out += s.strokes(marks, o.stitch.colour, o.stitch.width, { ink: false });
        else out += s.strokes(marks.filter((_, i) => i % 2 === 0), o.stitch.colour, o.stitch.width, { ink: false }) + s.strokes(marks.filter((_, i) => i % 2 === 1), second, o.stitch.width, { ink: false });
      }
      if (o.strip === undefined && o.stitch === undefined) out += s.stroke(seam, "currentColor", 1.6, { closed: true });
      return out;
    },
  };
  return defineBall({ id: o.id, en: o.en, ja: o.ja, spec, size: o.size });
}
