// Every piece of gear, and the way to draw one by id. This file imports every piece; a consumer that wants one imports that piece's own module (`GEAR_HOCKEY_STICK` and the others) and calls its `svg`.
import type { Piece, PieceOptions } from "../ball/ball.core.ts";
import { GEAR_BADMINTON_RACKET } from "./gear.badmintonracket.ts";
import { GEAR_BASEBALL_GLOVE } from "./gear.baseballglove.ts";
import { GEAR_CRICKET_BAT } from "./gear.cricketbat.ts";
import { GEAR_BASEBALL_BAT, GEAR_BASKETBALL_HOOP, GEAR_VOLLEYBALL_NET, GEAR_GOALPOSTS, GEAR_WICKET, GEAR_ROUNDNET_SET } from "./gear.field.ts";
import { GEAR_FIELD_HOCKEY_STICK } from "./gear.fieldhockeystick.ts";
import { GEAR_FOOTBALL_HELMET } from "./gear.footballhelmet.ts";
import { GEAR_GOALIE_MASK } from "./gear.goaliemask.ts";
import { GEAR_GOAL_NET } from "./gear.goalnet.ts";
import { GEAR_HOCKEY_STICK } from "./gear.hockeystick.ts";
import { GEAR_LACROSSE_STICK } from "./gear.lacrossestick.ts";
import { GEAR_SQUASH_RACKET, GEAR_RACQUETBALL_RACKET, GEAR_PADEL_RACKET, GEAR_PICKLEBALL_PADDLE } from "./gear.rackets.ts";
import { GEAR_HOCKEY_SKATE, GEAR_FIGURE_SKATE, GEAR_SPEED_SKATE } from "./gear.skates.ts";
import { GEAR_GOALIE_STICK, GEAR_HURLEY, GEAR_CURLING_BROOM } from "./gear.sticks.ts";
import { GEAR_TABLE_TENNIS_PADDLE } from "./gear.tabletennispaddle.ts";
import { GEAR_TENNIS_RACKET } from "./gear.tennisracket.ts";
import { GEAR_STARTING_BLOCKS, GEAR_RELAY_BATON, GEAR_JAVELIN, GEAR_HURDLES } from "./gear.track.ts";
import { GEAR_DIVING_BOARD, GEAR_SWIM_GOGGLES } from "./gear.water.ts";
import { GEAR_GUNBAI, GEAR_MAWASHI } from "./gear.sumo.ts";
import { GEAR_SHINAI, GEAR_KENDO_MEN } from "./gear.kendo.ts";
import { GEAR_JUDOGI, GEAR_JUDOGI_BLUE, GEAR_JUDOGI_FOLDED, GEAR_JUDOGI_BLUE_FOLDED, GEAR_JUDOGI_BACK, GEAR_JUDOGI_BLUE_BACK, GEAR_KARATE_GI, GEAR_OBI, GEAR_OBI_WHITE, GEAR_OBI_YELLOW, GEAR_OBI_ORANGE, GEAR_OBI_GREEN, GEAR_OBI_BLUE, GEAR_OBI_BROWN, GEAR_OBI_KOHAKU, GEAR_OBI_RED, GEAR_OBI_WOMEN, GEAR_OBI_WHITE_YELLOW, GEAR_OBI_YELLOW_ORANGE, GEAR_OBI_ORANGE_GREEN, GEAR_OBI_GREEN_BLUE, GEAR_OBI_BLUE_BROWN } from "./gear.budo.ts";
import { GEAR_YUMI, GEAR_YA } from "./gear.kyudo.ts";

/** Every piece of gear, in the order a gallery shows them. */
export const GEARS: readonly Piece[] = [GEAR_HOCKEY_STICK, GEAR_GOALIE_STICK, GEAR_HOCKEY_SKATE, GEAR_GOALIE_MASK, GEAR_GOAL_NET, GEAR_FIELD_HOCKEY_STICK, GEAR_LACROSSE_STICK, GEAR_CRICKET_BAT, GEAR_WICKET, GEAR_TABLE_TENNIS_PADDLE, GEAR_BADMINTON_RACKET, GEAR_TENNIS_RACKET, GEAR_SQUASH_RACKET, GEAR_RACQUETBALL_RACKET, GEAR_PADEL_RACKET, GEAR_PICKLEBALL_PADDLE, GEAR_ROUNDNET_SET, GEAR_VOLLEYBALL_NET, GEAR_BASKETBALL_HOOP, GEAR_BASEBALL_BAT, GEAR_BASEBALL_GLOVE, GEAR_FOOTBALL_HELMET, GEAR_GOALPOSTS, GEAR_HURLEY, GEAR_CURLING_BROOM, GEAR_FIGURE_SKATE, GEAR_SPEED_SKATE, GEAR_DIVING_BOARD, GEAR_SWIM_GOGGLES, GEAR_STARTING_BLOCKS, GEAR_RELAY_BATON, GEAR_JAVELIN, GEAR_HURDLES, GEAR_GUNBAI, GEAR_MAWASHI, GEAR_SHINAI, GEAR_KENDO_MEN, GEAR_JUDOGI, GEAR_JUDOGI_BLUE, GEAR_JUDOGI_FOLDED, GEAR_JUDOGI_BLUE_FOLDED, GEAR_JUDOGI_BACK, GEAR_JUDOGI_BLUE_BACK, GEAR_OBI, GEAR_OBI_WHITE, GEAR_OBI_YELLOW, GEAR_OBI_ORANGE, GEAR_OBI_GREEN, GEAR_OBI_BLUE, GEAR_OBI_BROWN, GEAR_OBI_KOHAKU, GEAR_OBI_RED, GEAR_OBI_WOMEN, GEAR_OBI_WHITE_YELLOW, GEAR_OBI_YELLOW_ORANGE, GEAR_OBI_ORANGE_GREEN, GEAR_OBI_GREEN_BLUE, GEAR_OBI_BLUE_BROWN, GEAR_YUMI, GEAR_YA, GEAR_KARATE_GI];

/** The id of every piece of gear: `"gear:hockey-stick"`. */
export const GEAR_IDS: readonly string[] = GEARS.map((g) => g.id);

const TABLE: ReadonlyMap<string, Piece> = new Map(GEARS.map((g) => [g.id, g]));

/** A piece of gear by its id, or by its name without the `gear:`. An unknown name is an error that lists the ids. */
export function gearOf(name: string): Piece {
  const found = TABLE.get(name.startsWith("gear:") ? name : `gear:${name}`);
  if (found === undefined) throw new Error(`Unknown gear "${name}". The ids are ${GEAR_IDS.join(", ")}.`);
  return found;
}

/** True when the text is the id of a piece of gear (or a name without `gear:`). */
export const isGearId = (name: unknown): name is string => typeof name === "string" && TABLE.has(name.startsWith("gear:") ? name : `gear:${name}`);

/**
 * A piece of gear as a document of SVG, in the colour style (the default) or the line style (`currentColor`).
 * @example
 * ```ts
 * import { renderGear } from "@johnmorrisdotca/kyogijo-stadiums/gear";
 * const colour = renderGear("hockey-stick", { size: 48 });
 * const line = renderGear("hockey-stick", { size: 48, style: "line" });
 * console.log(colour !== line, line.includes("currentColor"));
 * // true true
 * ```
 */
export function renderGear(name: string, options?: PieceOptions): string {
  return gearOf(name).svg(options);
}

export type { Piece, PieceOptions, PieceStyle, PieceTheme } from "../ball/ball.core.ts";
