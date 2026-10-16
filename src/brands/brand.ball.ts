// Puts a maker's mark on a ball: the options that print it (`decal`), and the ball drawn with them. The balls that take a printed logo are the baseball, the softball and the classic soccer balls (see docs/custom-balls.md);
// any other ball ignores the print and is drawn plain.
import { renderEmblem, type EmblemRef } from "../emblems/emblem.api.ts";
import type { EmblemOptions } from "../emblems/emblem.core.ts";
import type { MakerId } from "./brand.data.ts";
import { makerLogo, type MakerLogoOptions } from "./brand.render.ts";

/** How a maker's logo sits on a ball. */
export interface MakerBallOptions extends Omit<MakerLogoOptions, "size" | "title"> {
  /** How wide the logo is, in degrees of the ball (the mark alone 50 by default, a layout with a wordmark 74). */
  width?: number;
  /** A turn of the logo on the ball, in degrees. */
  turn?: number;
}

/**
 * The ball options that print a maker's logo on it: `{ decal: { svg, size, turn } }`, to spread into the options of `renderEmblem`, `emblemFrame` or `bindTurn`. The logo is wrapped onto the sphere, so it curves with the ball and turns with it.
 * @example
 * ```ts
 * import { makerBall } from "@johnmorrisdotca/dougu-sports/brands";
 * console.log(makerBall("arvane").decal.svg.includes("<path"));
 * // true
 * ```
 */
export function makerBall(id: MakerId, o?: MakerBallOptions): { decal: { svg: string; size: number; turn: number } } {
  const layout = o?.layout ?? "mark";
  const size = typeof o?.width === "number" && Number.isFinite(o.width) ? Math.min(Math.max(o.width, 8), 120) : layout === "mark" ? 50 : 74;
  const turn = typeof o?.turn === "number" && Number.isFinite(o.turn) ? o.turn : 0;
  return { decal: { svg: makerLogo(id, { ...o, title: false, size: 200 }), size, turn } };
}

/** A ball with a maker's logo printed on it: `renderMakerBall("ball:baseball", "arvane", { size: 320 })`. Any other options of the ball (`paint`, `stamp`, `spots`...) go in `ball`. */
export function renderMakerBall(ball: EmblemRef, id: MakerId, o?: MakerBallOptions, ballOptions?: EmblemOptions): string {
  return renderEmblem(ball, { ...ballOptions, ...makerBall(id, o) });
}
