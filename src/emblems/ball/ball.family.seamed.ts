// Balls with the seam of a baseball or a tennis ball: one closed curve that winds twice round the sphere, x=(1-b)cos t + b cos 3t, y=(1-b)sin t - b sin 3t, z=2sqrt(b(1-b)) sin 2t.
// A baseball and a softball have red stitches that cross it in Vs; a tennis or padel ball has a white rubber strip along it; a sliotar a raised rib.
import { type BallDef, defineBall } from "./ball.engine.ts";
import { mix } from "./ball.core.ts";
import { stitchFor } from "./ball.contrast.ts";
import { region } from "./ball.region.ts";
import { scuffs } from "./ball.decal.ts";
import { type V3, add, cross, greatCircle, mul, norm, seamCurve } from "./ball.math.ts";
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
  /** Where the ball takes its logo and lettering (see `BallSpec.home`): a baseball and a softball do. */
  home?: BallSpec["home"];
}

/** The label area of a baseball's or a softball's seam (b = 0.4): the middle of one of its two leather pieces, the way up there, and the view that shows it. The point opposite is in the same leather piece, 0.6 radians clear of the seam, so lettering can go on the far side of the ball. */
export const SEAMED_HOME = (word: string): NonNullable<BallSpec["home"]> => ({
  c: [0.668, -0.669, -0.326],
  up: [0.601, 0.743, -0.293],
  reach: 0.82,
  view: { yaw: -127.8, pitch: -47.4, roll: -7.9 },
  word,
});

export function seamedBall(o: SeamedOptions): Piece<BallSpec> {
  const spec: BallSpec = {
    view: o.view ?? { yaw: 0, pitch: 0, roll: 0 },
    base: o.base,
    mat: o.mat,
    home: o.home,
    draw: (s, base, _accent, _colors, custom) => {
      const seam = seamCurve(o.b, 160);
      const paint = custom?.paint;
      const second = paint?.second;
      let out = "";
      // A two-tone ball: the second colour fills the region on the right of the seam (or a half of the ball), the body colour the rest.
      if (second !== undefined && !s.line) {
        if (paint?.split === "half" && o.home !== undefined) {
          const c = norm(o.home.c), ex = norm(cross(o.home.up, c));
          const turn = ((paint.angle ?? 0) * Math.PI) / 180;
          const n = add(mul(ex, Math.cos(turn)), mul(cross(c, ex), Math.sin(turn)));
          out += region(s, greatCircle(n, 120), second);
        } else out += region(s, [...seam].reverse(), second);
      }
      const grounds = second === undefined ? [base] : [base, second];
      if (custom?.print !== undefined && o.home !== undefined) out += custom.printer?.(s, custom.print, o.home.word, [base]) ?? "";
      if (o.groove !== undefined) out += s.stroke(seam, o.groove, 0.8, { closed: true, opacity: 0.55 });
      if (o.strip !== undefined) out += o.strip.raised === true ? s.seam(seam, o.strip.colour, o.strip.width, { closed: true }) : s.stroke(seam, o.strip.colour, o.strip.width, { closed: true });
      if (o.wear !== undefined) out += scuffs(s, mix(base, -0.55), mix(base, 0.6), { dark: o.wear.dark, pale: o.wear.pale, seed: o.wear.seed });
      if (o.stitch !== undefined) {
        const marks = stitches(seam, true, o.stitch.count, o.stitch.half, { v: true, lean: o.stitch.lean });
        const colour2 = o.stitch.colour2;
        if (second !== undefined && paint?.split !== "half") {
          // On a ball split along its seam each stitch's two legs lie on their own colour, and take the thread that shows on it.
          const legs = (pick: number): V3[][] => marks.map((m) => (pick === 0 ? [m[0] as V3, m[1] as V3] : [m[1] as V3, m[2] as V3]));
          out += s.strokes(legs(0), stitchFor([base], paint?.stitch, o.stitch.colour), o.stitch.width, { ink: false }) + s.strokes(legs(1), stitchFor([second], paint?.stitch, o.stitch.colour), o.stitch.width, { ink: false });
        } else {
          const colour = stitchFor(grounds, paint?.stitch, o.stitch.colour);
          if (colour2 === undefined || colour !== o.stitch.colour) out += s.strokes(marks, colour, o.stitch.width, { ink: false });
          else out += s.strokes(marks.filter((_, i) => i % 2 === 0), colour, o.stitch.width, { ink: false }) + s.strokes(marks.filter((_, i) => i % 2 === 1), colour2, o.stitch.width, { ink: false });
        }
      }
      if (o.strip === undefined && o.stitch === undefined) out += s.stroke(seam, "currentColor", 1.6, { closed: true });
      return out;
    },
  };
  return defineBall({ id: o.id, en: o.en, ja: o.ja, spec, size: o.size });
}
