// Objects that are not an ellipsoid: a puck, a stone, a shuttlecock. They share what a ball has (the rotation, the options, the shading palette and the `Piece` shape) and draw their own geometry.
import { type BallFrameOptions, type Piece, type PieceOptions, type PieceSize, type ResolvedOptions, escape, hashOf, labelled, radians, resolveOptions, wrapPiece } from "./ball.core.ts";
import { type M3, type V3, apply, rotation } from "./ball.math.ts";

export interface ObjectView {
  yaw: number;
  pitch: number;
  roll: number;
}

/** What an object's `draw` is given. */
export interface ObjectContext {
  rot: M3;
  opts: ResolvedOptions;
  /** True when the ball is turning: no grain. */
  turning: boolean;
  /** An id prefix that no other drawing of this piece in the page shares. */
  id: string;
  /** The thinnest line that shows at this size, in box units. */
  minWidth: number;
  /** A point of the object in its own space to the box: x, y and depth (positive toward you); one unit is 46 box units. */
  at(p: V3): [number, number, number];
}

export interface ObjectDef<Model extends object> {
  id: string;
  en: string;
  ja: string;
  size: PieceSize;
  view: ObjectView;
  /** How much of the box the object takes: its own unit is `46 * scale` box units. */
  scale?: number;
  /** A point of the object to put at the centre of the box. */
  shift?: V3;
  model: Model;
  /** The drawing: its definitions and its body. */
  draw: (c: ObjectContext) => { defs: string; body: string };
}

const finite = (v: number | undefined): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** An object as a piece. Its `model` is the def's model with the default `view` added, so that a view of it (or a test) can turn it to any aspect from there. */
export function defineObject<Model extends object>(def: ObjectDef<Model>): Piece<Model & { view: ObjectView }> {
  const render = (o: BallFrameOptions | undefined, turning: boolean): string => {
    const opts = resolveOptions(o);
    const rot = rotation(radians(def.view.yaw + finite(o?.yaw), 0), radians(def.view.pitch + finite(o?.pitch), 0), radians(def.view.roll + finite(o?.roll), 0));
    const id = `k${hashOf(`${def.id}|${opts.style}|${opts.tint ?? ""}|${opts.accent ?? ""}${opts.faceKey === "" ? "" : `|f${opts.faceKey}`}|${rot.map((r) => r.map((x) => x.toFixed(2)).join()).join()}`)}`;
    const at = (p: V3): [number, number, number] => {
      const sh = def.shift ?? [0, 0, 0];
      const k = def.scale ?? 1;
      const q = apply(rot, [(p[0] - sh[0]) * k, (p[1] - sh[1]) * k, (p[2] - sh[2]) * k]);
      return [50 + 46 * q[0], 50 - 46 * q[1], q[2]];
    };
    const { defs, body } = def.draw({ rot, opts, turning, id, minWidth: 80 / opts.size, at });
    return wrapPiece({ title: escape(def.en), size: opts.size, theme: opts.theme, defs, body });
  };
  return { id: def.id, en: def.en, ja: def.ja, source: "generated", kind: "ball", model: { ...def.model, view: def.view }, size: def.size, svg: labelled(def.en, def.ja, (o?: PieceOptions) => render(o, false)), frame: labelled(def.en, def.ja, (o?: BallFrameOptions) => render(o, true)) };
}
