// A flat object: a front and a back drawn from paths, which the turning view flips like a coin. Imports only the core.
import { degrees, mainOf, n2, paintFor, resolve, wrap, type Emblem, type EmblemOptions, type EmblemSource, type FrameOptions, type Metal, type Paint } from "./emblem.core.ts";

/** A path and the part of the paint it takes. `detail` is the light colour, with a thin outline. */
export interface Shape {
  d: string;
  part: "main" | "ribbon" | "detail";
}

/** What a flat emblem is drawn from. */
export interface FlatModel {
  metal: Metal;
  front: readonly Shape[];
  back: readonly Shape[];
}

/** A circle as a path, so every shape is one kind of thing. */
export const circlePath = (cx: number, cy: number, r: number): string => `M${n2(cx - r)} ${n2(cy)}a${n2(r)} ${n2(r)} 0 1 0 ${n2(2 * r)} 0a${n2(r)} ${n2(r)} 0 1 0 ${n2(-2 * r)} 0Z`;

/** A star as a path, one point up. */
export function starPath(cx: number, cy: number, outer: number, inner: number, points = 5): string {
  const parts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    parts.push(`${i === 0 ? "M" : "L"}${n2(cx + r * Math.cos(angle))} ${n2(cy + r * Math.sin(angle))}`);
  }
  return `${parts.join("")}Z`;
}

const fillOf = (shape: Shape, paint: Paint): string => (shape.part === "main" ? paint.main : shape.part === "ribbon" ? paint.ribbon : paint.light);

function drawShapes(shapes: readonly Shape[], paint: Paint): string {
  return shapes.map((shape) => `<path d="${shape.d}" fill="${fillOf(shape, paint)}"${shape.part === "detail" ? ` stroke-width="1.2"` : ""}/>`).join("");
}

/**
 * A flat emblem. Turning it about its vertical axis squeezes it by the cosine of the turn, and past a quarter turn shows the back, as a coin turns; a tilt squeezes it from the top.
 * The result is marked `@__PURE__` by the caller, so a bundler drops it when nothing uses it.
 */
export function defineFlat(id: string, en: string, ja: string, source: EmblemSource, model: FlatModel): Emblem<FlatModel> {
  const draw = (options: FrameOptions | undefined, yaw: number, pitch: number): string => {
    const r = resolve(options);
    const paint = paintFor(r.style, mainOf(model.metal, r.tint));
    const across = Math.cos((yaw * Math.PI) / 180);
    const tilt = Math.cos((pitch * Math.PI) / 180);
    const sx = Math.sign(across || 1) * Math.max(Math.abs(across), 0.02);
    const sy = Math.max(Math.abs(tilt), 0.02);
    const shapes = across < 0 ? model.back : model.front;
    const turned = yaw === 0 && pitch === 0 ? "" : ` transform="translate(32 32) scale(${n2(sx)} ${n2(sy)}) translate(-32 -32)"`;
    return wrap({ title: en, size: r.size, style: r.style, theme: r.theme, defs: paint.defs, body: `<g${turned}>${drawShapes(shapes, paint)}</g>` });
  };
  return {
    id,
    en,
    ja,
    source,
    kind: "flat",
    model,
    svg: (options?: EmblemOptions) => draw(options, 0, 0),
    frame: (options?: FrameOptions) => draw(options, degrees(options?.yaw), degrees(options?.pitch)),
  };
}
