// Balls covered in round marks: the holes of a pickleball, the dimples of a golf ball or a field hockey ball, the coloured dots of a squash ball. The centres are an even spread over the sphere
// (a Fibonacci spiral), and each mark is a true cap on the sphere, so it foreshortens toward the limb.
import { defineBall, type BallDef } from "./ball.engine.ts";
import { mix } from "./ball.core.ts";
import { type V3, spread } from "./ball.math.ts";
import type { Piece } from "./ball.core.ts";
import type { BallSpec } from "./ball.engine.ts";
import type { Drill } from "./ball.holes.ts";

export interface DottedOptions {
  id: string;
  en: string;
  ja: string;
  size: BallDef["size"];
  base: string;
  count: number;
  /** A cap's radius in radians. */
  radius: number;
  /** How dark a mark is against the ball: 0 to 1. */
  depth?: number;
  view?: BallSpec["view"];
  mat: BallSpec["mat"];
  /** A mark's own colour, instead of a darker ball colour (a hole shows what is inside). */
  mark?: string;
  /** A lit rim on each mark (not for a dimple pattern of two hundred, which is large enough already). */
  light?: boolean;
  /** Real holes through the shell, not marks on it (`holeLayers` from ball.holes.ts, taken by the pickleball only): the near ones are cut out and show the inside of the ball, and where two line up the page shows through. The line style still draws marks. */
  hollow?: Drill;
  /** The ball's real colour is fixed, so `tint` does not recolour it (see `BallSpec.fixed`). */
  fixed?: boolean;
  /** Marks drawn as shallow bowls (dimples): a shadow on the upper left wall, a bright edge on the lower right, the ball's own colour inside. */
  dimples?: boolean;
  /** Turns the spread, so a ball does not show its spiral's pole straight on. */
  phase?: number;
}

/** The mark centres: `count` points, turned so that no pole faces the default view. */
export const dotCentres = (count: number, phase = 0): V3[] => spread(count, phase);

export function dottedBall(o: DottedOptions): Piece<BallSpec> {
  const centres = dotCentres(o.count, o.phase ?? 0);
  const spec: BallSpec = {
    view: o.view ?? { yaw: 20, pitch: 25, roll: 0 },
    base: o.base,
    fixed: o.fixed,
    mat: o.mat,
    draw: (s, base) => {
      const mark = o.mark ?? mix(base, -0.55);
      if (o.hollow !== undefined && !s.line) return "";
      return s.dots(centres, o.radius, mark, { opacity: o.depth ?? 0.55, ink: true, light: o.light ?? true, ...(o.dimples === true ? { dimple: mix(base, -0.04) } : {}) });
    },
    holes: o.hollow === undefined ? undefined : (s, id, base, shape, minWidth) => o.hollow!(s, id, { centres, radius: o.radius }, base, shape, minWidth),
  };
  return defineBall({ id: o.id, en: o.en, ja: o.ja, spec, size: o.size });
}
