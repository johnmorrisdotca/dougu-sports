// A ball: marks on a sphere, which the turning view rolls. The marks are polygons laid on the surface; each is projected by the turn and drawn when it faces the eye. Imports only the core.
import { degrees, hexOf, n2, paintFor, readColour, resolve, wrap, type Emblem, type EmblemOptions, type EmblemSource, type FrameOptions, type Rgb } from "./emblem.core.ts";

type Vec = readonly [number, number, number];

/** One patch: where it sits on the unit sphere, how many sides, and its angular radius in radians. */
export interface Mark {
  at: Vec;
  sides: number;
  radius: number;
}

/** What a ball is drawn from. */
export interface BallModel {
  /** The ball's own colour, as `#rrggbb`. */
  base: string;
  /** The colour of the patches, as `#rrggbb`; a `tint` replaces it. */
  ink: string;
  marks: readonly Mark[];
  /** The resting view, in degrees: what `yaw: 0, pitch: 0` shows. */
  rest: { yaw: number; pitch: number };
}

const unit = (v: Vec): Vec => {
  const length = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / length, v[1] / length, v[2] / length];
};
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** A point turned `yaw` about the vertical axis, then `pitch` about the horizontal one (degrees). Up is +y, the eye is at +z. */
export function turn(v: Vec, yaw: number, pitch: number): Vec {
  const a = (yaw * Math.PI) / 180;
  const b = (pitch * Math.PI) / 180;
  const x1 = v[0] * Math.cos(a) + v[2] * Math.sin(a);
  const z1 = -v[0] * Math.sin(a) + v[2] * Math.cos(a);
  return [x1, v[1] * Math.cos(b) - z1 * Math.sin(b), v[1] * Math.sin(b) + z1 * Math.cos(b)];
}

/** The corners of a mark on the sphere. */
function corners(mark: Mark): Vec[] {
  const c = unit(mark.at);
  const u = unit(cross(c, Math.abs(c[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
  const v = cross(c, u);
  return Array.from({ length: mark.sides }, (_, i) => {
    const t = (2 * Math.PI * i) / mark.sides;
    const s = Math.sin(mark.radius);
    return unit([c[0] * Math.cos(mark.radius) + (u[0] * Math.cos(t) + v[0] * Math.sin(t)) * s, c[1] * Math.cos(mark.radius) + (u[1] * Math.cos(t) + v[1] * Math.sin(t)) * s, c[2] * Math.cos(mark.radius) + (u[2] * Math.cos(t) + v[2] * Math.sin(t)) * s]);
  });
}

const RADIUS = 28;

function drawBall(title: string, model: BallModel, options: FrameOptions | undefined, yaw: number, pitch: number): string {
  const r = resolve(options);
  const base = readColour(model.base) as Rgb;
  const ink = r.tint ?? (readColour(model.ink) as Rgb);
  const paint = paintFor(r.style, base, "radial");
  const view = { yaw: model.rest.yaw + yaw, pitch: model.rest.pitch + pitch };
  const patches = model.marks
    .map((mark) => {
      if (turn(unit(mark.at), view.yaw, view.pitch)[2] <= -0.1) return "";
      const points = corners(mark).map((corner) => {
        const [x, y, z] = turn(corner, view.yaw, view.pitch);
        const edge = z < 0 ? Math.hypot(x, y) || 1 : 1;
        return `${n2(32 + (RADIUS * x) / edge)} ${n2(32 - (RADIUS * y) / edge)}`;
      });
      return `<path d="M${points.join("L")}Z" fill="${r.style === "line" ? "none" : hexOf(ink)}" stroke-width="1.4"/>`;
    })
    .join("");
  return wrap({ title, size: r.size, style: r.style, theme: r.theme, defs: paint.defs, body: `<circle cx="32" cy="32" r="${RADIUS}" fill="${paint.main}"/>${patches}` });
}

/** A ball. Its still drawing is its resting view; `frame` rolls it by `yaw` and `pitch` degrees from there. */
export function defineBall(id: string, en: string, ja: string, source: EmblemSource, model: BallModel): Emblem<BallModel> {
  const draw = (options: FrameOptions | undefined, yaw: number, pitch: number): string => drawBall(en, model, options, yaw, pitch);
  return {
    id,
    en,
    ja,
    source,
    kind: "ball",
    model,
    svg: (options?: EmblemOptions) => draw(options, 0, 0),
    frame: (options?: FrameOptions) => draw(options, degrees(options?.yaw), degrees(options?.pitch)),
  };
}

/** The twelve corners of an icosahedron, as unit vectors: where a football's pentagons sit. */
export const ICOSAHEDRON: readonly Vec[] = (() => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw: Vec[] = [];
  for (const a of [-1, 1]) for (const b of [-phi, phi]) raw.push([0, a, b], [a, b, 0], [b, 0, a]);
  return raw.map(unit);
})();
