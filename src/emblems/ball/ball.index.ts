// Every ball and implement, the way to draw one by id, to turn it, and to draw several at their true relative sizes. This file imports every ball; a consumer that wants one ball imports that ball's own
// module (`BALL_SOCCER` and the others) and calls its `svg` or `frame`, and a bundler keeps only that.
import type { BallFrameOptions, Piece, PieceOptions, PieceSize } from "./ball.core.ts";
import { escape, num, resolveOptions, PIECE_INK } from "./ball.core.ts";
import { BALL_AFL } from "./ball.afl.ts";
import { BALL_BASKETBALL } from "./ball.basketball.ts";
import { BALL_BASKETBALL_3X3 } from "./ball.basketball3x3.ts";
import { BALL_BASKETBALL_6 } from "./ball.basketball6.ts";
import { BALL_CRICKET_RED, BALL_CRICKET_WHITE, BALL_CRICKET_PINK } from "./ball.cricket.ts";
import { BALL_CURLING_STONE } from "./ball.curlingstone.ts";
import { BALL_DISCUS } from "./ball.discus.ts";
import { BALL_FIELD_HOCKEY } from "./ball.fieldhockey.ts";
import { BALL_FOOTBALL, BALL_FOOTBALL_CFL, BALL_FOOTBALL_IFAF } from "./ball.football.ts";
import { BALL_GAELIC_FOOTBALL, BALL_NETBALL } from "./ball.gaelic.ts";
import { BALL_GOLF } from "./ball.golf.ts";
import { BALL_HAMMER } from "./ball.hammer.ts";
import { BALL_HANDBALL } from "./ball.handball.ts";
import { BALL_PADEL } from "./ball.padel.ts";
import { BALL_PICKLEBALL_OUTDOOR, BALL_PICKLEBALL_INDOOR } from "./ball.pickleball.ts";
import { BALL_PLASTIC_BASEBALL_SLOTTED } from "./ball.plastic.ts";
import { BALL_PUCK } from "./ball.puck.ts";
import { PUCKS } from "./ball.puck.print.ts";
import { BALL_BASEBALL, BALL_SOCCER, BALL_SOCCER_COLOUR, BALL_SOCCER_ORANGE, BALL_SOCCER_YELLOW, BALL_SOFTBALL } from "./ball.printable.ts";
import { BALL_ROUNDNET } from "./ball.roundnet.ts";
import { BALL_RUGBY } from "./ball.rugby.ts";
import { BALL_SEPAK_TAKRAW } from "./ball.sepaktakraw.ts";
import { BALL_SHUTTLECOCK_FEATHER, BALL_SHUTTLECOCK_NYLON } from "./ball.shuttlecock.ts";
import { BALL_SLIOTAR } from "./ball.sliotar.ts";
import { BALL_LACROSSE, BALL_RACQUETBALL, BALL_TABLE_TENNIS, BALL_SHOT } from "./ball.smooth.ts";
import { BALL_SOCCER_26, BALL_SOCCER_18, BALL_SOCCER_14, BALL_SOCCER_12, BALL_SOCCER_6, BALL_SOCCER_26_ORANGE, BALL_SOCCER_18_ORANGE, BALL_SOCCER_14_ORANGE, BALL_SOCCER_12_ORANGE, BALL_SOCCER_6_ORANGE, BALL_SOCCER_26_YELLOW, BALL_SOCCER_18_YELLOW, BALL_SOCCER_14_YELLOW, BALL_SOCCER_12_YELLOW, BALL_SOCCER_6_YELLOW } from "./ball.soccer.panels.ts";
import { BALL_FUTSAL, BALL_BEACH_SOCCER } from "./ball.soccer.indoor.ts";
import { BALL_SOCCER_1870_HAND_STITCHED, BALL_SOCCER_1900_LACED, BALL_SOCCER_1930_18_PANEL, BALL_SOCCER_1950_12_PANEL, BALL_SOCCER_1960_32_PANEL_LEATHER } from "./ball.soccer.vintage.ts";
import { BALL_SOCCER_RETRO_PENTAGONS, BALL_SOCCER_RETRO_LEAVES, BALL_SOCCER_RETRO_ROSETTE, BALL_SOCCER_RETRO_STAR, BALL_SOCCER_RETRO_PINWHEEL, BALL_SOCCER_RETRO_KITES, BALL_SOCCER_14_PANEL_DOUBLE_BORDER, BALL_SOCCER_8_PANEL_PLAIN, BALL_SOCCER_6_PANEL_BANDS, BALL_SOCCER_6_PANEL_DIAMONDS, BALL_SOCCER_20_PANEL_DOTS, BALL_SOCCER_TRAINING_HIGH_VIS } from "./ball.soccer.era.ts";
import { BALL_SOCCER_STARS_BLUE, BALL_SOCCER_STARS_RED, BALL_SOCCER_STARS_NIGHT, BALL_SOCCER_HEXAGONS_CYAN, BALL_SOCCER_HEXAGONS_MAGENTA, BALL_SOCCER_HEXAGONS_LIME, BALL_SOCCER_FLAMES_FIRE, BALL_SOCCER_FLAMES_ICE, BALL_SOCCER_FLAMES_TOXIC, BALL_SOCCER_CHEVRONS_RED, BALL_SOCCER_CHEVRONS_GREEN, BALL_SOCCER_CHEVRONS_BLUE, BALL_SOCCER_SWIRL_BLUE, BALL_SOCCER_SWIRL_RED, BALL_SOCCER_SWIRL_TEAL, BALL_SOCCER_METALLIC_GOLD, BALL_SOCCER_METALLIC_SILVER, BALL_SOCCER_METALLIC_COBALT } from "./ball.soccer.store.ts";
import { BALL_BASEBALL_LEMON_PEEL, BALL_BASEBALL_RED_BLUE, BALL_BASEBALL_BLACK_RED, BALL_BASEBALL_VINTAGE_LEATHER, BALL_SOFTBALL_11_OPTIC } from "./ball.baseball.vintage.ts";
import { BALL_VOLLEYBALL_COLOURS, BALL_VOLLEYBALL_BRAZIL, BALL_VOLLEYBALL_JAPAN, BALL_VOLLEYBALL_CANADA, BALL_VOLLEYBALL_USA, BALL_VOLLEYBALL_ITALY, BALL_VOLLEYBALL_POLAND, BALL_VOLLEYBALL_FRANCE, BALL_VOLLEYBALL_SERBIA, BALL_VOLLEYBALL_NETHERLANDS, BALL_VOLLEYBALL_GERMANY } from "./ball.volleyball.flag.ts";
import { BALL_SQUASH_DOUBLE_YELLOW, BALL_SQUASH_YELLOW, BALL_SQUASH_RED, BALL_SQUASH_BLUE, BALL_SQUASH_GREEN } from "./ball.squash.ts";
import { BALL_TENNIS } from "./ball.tennis.ts";
import { BALL_TEQBALL } from "./ball.teqball.ts";
import { BALL_VOLLEYBALL, BALL_VOLLEYBALL_8, BALL_BEACH_VOLLEYBALL } from "./ball.volleyball.ts";
import { BALL_WATER_POLO } from "./ball.waterpolo.ts";

/** Every ball, in the order a gallery shows them. */
export const BALLS: readonly Piece[] = [BALL_SOCCER, BALL_SOCCER_COLOUR, BALL_SOCCER_26, BALL_SOCCER_18, BALL_SOCCER_14, BALL_SOCCER_12, BALL_SOCCER_6, BALL_SOCCER_ORANGE, BALL_SOCCER_26_ORANGE, BALL_SOCCER_18_ORANGE, BALL_SOCCER_14_ORANGE, BALL_SOCCER_12_ORANGE, BALL_SOCCER_6_ORANGE, BALL_SOCCER_YELLOW, BALL_SOCCER_26_YELLOW, BALL_SOCCER_18_YELLOW, BALL_SOCCER_14_YELLOW, BALL_SOCCER_12_YELLOW, BALL_SOCCER_6_YELLOW, BALL_FUTSAL, BALL_BEACH_SOCCER, BALL_SOCCER_1870_HAND_STITCHED, BALL_SOCCER_1900_LACED, BALL_SOCCER_1930_18_PANEL, BALL_SOCCER_1950_12_PANEL, BALL_SOCCER_1960_32_PANEL_LEATHER, BALL_SOCCER_RETRO_PENTAGONS, BALL_SOCCER_RETRO_LEAVES, BALL_SOCCER_RETRO_ROSETTE, BALL_SOCCER_RETRO_STAR, BALL_SOCCER_RETRO_PINWHEEL, BALL_SOCCER_RETRO_KITES, BALL_SOCCER_14_PANEL_DOUBLE_BORDER, BALL_SOCCER_8_PANEL_PLAIN, BALL_SOCCER_6_PANEL_BANDS, BALL_SOCCER_6_PANEL_DIAMONDS, BALL_SOCCER_20_PANEL_DOTS, BALL_SOCCER_TRAINING_HIGH_VIS, BALL_SOCCER_STARS_BLUE, BALL_SOCCER_STARS_RED, BALL_SOCCER_STARS_NIGHT, BALL_SOCCER_HEXAGONS_CYAN, BALL_SOCCER_HEXAGONS_MAGENTA, BALL_SOCCER_HEXAGONS_LIME, BALL_SOCCER_FLAMES_FIRE, BALL_SOCCER_FLAMES_ICE, BALL_SOCCER_FLAMES_TOXIC, BALL_SOCCER_CHEVRONS_RED, BALL_SOCCER_CHEVRONS_GREEN, BALL_SOCCER_CHEVRONS_BLUE, BALL_SOCCER_SWIRL_BLUE, BALL_SOCCER_SWIRL_RED, BALL_SOCCER_SWIRL_TEAL, BALL_SOCCER_METALLIC_GOLD, BALL_SOCCER_METALLIC_SILVER, BALL_SOCCER_METALLIC_COBALT, BALL_TEQBALL, BALL_BASKETBALL, BALL_BASKETBALL_6, BALL_BASKETBALL_3X3, BALL_BASEBALL, BALL_SOFTBALL, BALL_BASEBALL_LEMON_PEEL, BALL_BASEBALL_RED_BLUE, BALL_BASEBALL_BLACK_RED, BALL_BASEBALL_VINTAGE_LEATHER, BALL_SOFTBALL_11_OPTIC, BALL_TENNIS, BALL_PADEL, BALL_SLIOTAR, BALL_VOLLEYBALL, BALL_VOLLEYBALL_8, BALL_BEACH_VOLLEYBALL, BALL_VOLLEYBALL_COLOURS, BALL_VOLLEYBALL_BRAZIL, BALL_VOLLEYBALL_JAPAN, BALL_VOLLEYBALL_CANADA, BALL_VOLLEYBALL_USA, BALL_VOLLEYBALL_ITALY, BALL_VOLLEYBALL_POLAND, BALL_VOLLEYBALL_FRANCE, BALL_VOLLEYBALL_SERBIA, BALL_VOLLEYBALL_NETHERLANDS, BALL_VOLLEYBALL_GERMANY, BALL_CRICKET_RED, BALL_CRICKET_WHITE, BALL_CRICKET_PINK, BALL_FOOTBALL, BALL_FOOTBALL_CFL, BALL_FOOTBALL_IFAF, BALL_RUGBY, BALL_AFL, BALL_GAELIC_FOOTBALL, BALL_NETBALL, BALL_PICKLEBALL_OUTDOOR, BALL_PICKLEBALL_INDOOR, BALL_PLASTIC_BASEBALL_SLOTTED, BALL_SQUASH_DOUBLE_YELLOW, BALL_SQUASH_YELLOW, BALL_SQUASH_GREEN, BALL_SQUASH_RED, BALL_SQUASH_BLUE, BALL_RACQUETBALL, BALL_LACROSSE, BALL_FIELD_HOCKEY, BALL_TABLE_TENNIS, BALL_HANDBALL, BALL_WATER_POLO, BALL_GOLF, BALL_PUCK, BALL_CURLING_STONE, BALL_SHOT, BALL_DISCUS, BALL_HAMMER, BALL_SEPAK_TAKRAW, BALL_ROUNDNET, BALL_SHUTTLECOCK_FEATHER, BALL_SHUTTLECOCK_NYLON];

/** The id of every ball: `"ball:soccer"`, `"ball:cricket-red"`. */
export const BALL_IDS: readonly string[] = BALLS.map((b) => b.id);

const TABLE: ReadonlyMap<string, Piece> = new Map([...BALLS, ...PUCKS].map((b) => [b.id, b]));

/** A ball by its id, or by its name without the `ball:` (`"soccer"`); a printed puck by its id (`"puck:canada"`). An unknown name is an error that lists the ids. */
export function ballOf(name: string): Piece {
  const found = TABLE.get(/^(ball|puck):/.test(name) ? name : `ball:${name}`);
  if (found === undefined) throw new Error(`Unknown ball "${name}". The ids are ${BALL_IDS.join(", ")}, and the printed pucks ${PUCKS.map((p) => p.id).join(", ")}.`);
  return found;
}

/** True when the text is the id of a ball (or a ball's name without `ball:`). */
export const isBallId = (name: unknown): name is string => typeof name === "string" && TABLE.has(/^(ball|puck):/.test(name) ? name : `ball:${name}`);

/** A ball as a document of SVG: `renderBall("soccer", { size: 64 })`, or in the line style `renderBall("ball:puck", { style: "line" })`. The same arguments give the same string. */
export function renderBall(name: string, options?: PieceOptions): string {
  return ballOf(name).svg(options);
}

/**
 * A ball turned: `yaw` degrees about its own vertical axis, `pitch` of tilt toward you and `roll` about the line of sight, all added to the ball's default 3/4 view, so `yaw` from 0 to 360 is one turn
 * of a turntable. The grain stays out of a turning ball. Every ball is drawn in true 3D: the seams, panels and marks are on the sphere and turn with it.
 * @example
 * ```ts
 * import { ballFrame } from "@johnmorrisdotca/kyogijo-stadiums/balls";
 * const frames = [0, 60, 120, 180, 240, 300].map((yaw) => ballFrame("soccer", { yaw, size: 48 }));
 * console.log(frames.length, frames[0].startsWith("<svg"));
 * // 6 true
 * ```
 */
export function ballFrame(name: string, options?: BallFrameOptions): string {
  return ballOf(name).frame(options);
}

/** The official size of a ball, with the rule it comes from. */
export function ballSize(name: string): PieceSize | undefined {
  return ballOf(name).size;
}

export interface LineupOptions extends PieceOptions {
  /** `true` (the default): each ball at its real size next to the others. `same`: every ball as large as the largest. */
  scale?: "true" | "same";
  /** The height of the tallest ball in pixels (96 by default). */
  height?: number;
  /** The gap between two balls, in pixels (8 by default). */
  gap?: number;
  /** `bottom` (the default: they stand on one line) or `centre`. */
  align?: "bottom" | "centre";
}

/**
 * Several balls side by side. At the true scale each ball is as big, next to the others, as the rulebook makes it: a puck beside a basketball looks right. `extentMm` is what a ball's drawing is
 * scaled by (the ball's largest size in a box of 92 units), so the sizes are the rules' sizes, not a guess. The result is one document of SVG.
 * @example
 * ```ts
 * import { lineup } from "@johnmorrisdotca/kyogijo-stadiums/balls";
 * const svg = lineup(["golf", "tennis", "soccer", "puck"], { scale: "true", height: 80 });
 * console.log(svg.includes("<title>"));
 * // true
 * ```
 */
export function lineup(names: readonly string[], options?: LineupOptions): string {
  const pieces = names.map(ballOf);
  const height = typeof options?.height === "number" && Number.isFinite(options.height) && options.height > 0 ? Math.min(options.height, 2000) : 96;
  const gap = typeof options?.gap === "number" && Number.isFinite(options.gap) && options.gap >= 0 ? Math.min(options.gap, 400) : 8;
  const trueScale = options?.scale !== "same";
  const largest = Math.max(...pieces.map((p) => p.size?.extentMm ?? 1), 1);
  // Pixels per box unit: the largest piece's box is `height` tall.
  const boxes = pieces.map((p) => (trueScale ? (height * (p.size?.extentMm ?? largest)) / largest : height));
  const width = boxes.reduce((sum, b) => sum + b, 0) + gap * Math.max(0, pieces.length - 1);
  const resolved = resolveOptions(options);
  const colour = resolved.theme === "dark" ? PIECE_INK.dark : resolved.theme === "inherit" ? "" : PIECE_INK.light;
  const auto = resolved.theme === "auto" ? `<style>@media(prefers-color-scheme:dark){svg{color:${PIECE_INK.dark}}}</style>` : "";
  let x = 0;
  const parts = pieces.map((p, i) => {
    const box = boxes[i];
    const doc = p.svg({ ...options, size: Math.max(1, box) });
    const inner = doc.slice(doc.indexOf(">") + 1, doc.lastIndexOf("</svg>"));
    const y = options?.align === "centre" ? (height - box) / 2 : height - box;
    const out = `<g transform="translate(${num(x, 2)} ${num(y, 2)}) scale(${num(box / 100, 4)})">${inner}</g>`;
    x += box + gap;
    return out;
  });
  const title = `Balls at ${trueScale ? "their true relative sizes" : "one size"}: ${pieces.map((p) => p.en).join(", ")}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(width, 2)} ${num(height, 2)}" width="${num(width, 2)}" height="${num(height, 2)}" role="img"${colour === "" ? "" : ` color="${colour}"`}><title>${escape(title)}</title>${auto}${parts.join("")}</svg>`;
}

export { PUCKS };

export type { BallFrameOptions, Piece, PieceOptions, PieceSize, PieceStyle, PieceTheme } from "./ball.core.ts";
