// Puts a maker's mark on a ball: the options that print it (`decal`), and the ball drawn with them. The balls that take a printed logo are the baseball, the softball and the classic soccer balls (see docs/custom-balls.md);
// any other ball ignores the print and is drawn plain.
import { renderEmblem, type EmblemRef } from "../emblems/emblem.api.ts";
import type { EmblemOptions } from "../emblems/emblem.core.ts";
import type { MakerId } from "./brand.data.ts";
import { makerLogo, type MakerLogoOptions } from "./brand.render.ts";

/**
 * How a maker's logo sits on a ball.
 * @example
 * ```ts
 * import type { MakerBallOptions } from "@johnmorrisdotca/dougu-sports/brands";
 * const options: MakerBallOptions = { layout: "stacked", width: 60, turn: 10 };
 * console.log(options.width);
 * ```
 */
export interface MakerBallOptions extends Omit<MakerLogoOptions, "size" | "title"> {
  /** How wide the logo is, in degrees of the ball (the mark alone 50 by default, a layout with a wordmark 74). */
  width?: number;
  /** A turn of the logo on the ball, in degrees. */
  turn?: number;
}

/**
 * The ball options that print a maker's logo on it: `{ decal: { svg, size, turn } }`, to spread into the options of `renderEmblem`, `emblemFrame` or `bindTurn`. The logo is wrapped onto the sphere, so it curves with the ball and turns with it.
 * @param id - A maker id from `MAKER_IDS`.
 * @param o - The layout, colours, width and turn of the logo on the ball.
 * @returns The ball options `{ decal }` that print the logo.
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

/**
 * A ball with a maker's logo printed on it: `renderMakerBall("ball:baseball", "arvane", { size: 320 })`. Any other options of the ball (`paint`, `stamp`, `spots`...) go in `ball`.
 * @param ball - The ball to print on: an id or an emblem.
 * @param id - A maker id from `MAKER_IDS`.
 * @param o - How the logo sits on the ball.
 * @param ballOptions - The other options of the ball.
 * @returns The printed ball as a document of SVG.
 * @example
 * ```ts
 * import { renderMakerBall } from "@johnmorrisdotca/dougu-sports/brands";
 * console.log(renderMakerBall("ball:baseball", "arvane", { width: 40 }, { size: 160 }).startsWith("<svg"));
 * ```
 */
export function renderMakerBall(ball: EmblemRef, id: MakerId, o?: MakerBallOptions, ballOptions?: EmblemOptions): string {
  return renderEmblem(ball, { ...ballOptions, ...makerBall(id, o) });
}
