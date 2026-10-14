// What each sport is played and won with: its ball, its gear, the trophy its champion lifts and, where the sport is in the Games, the medal. Every id is an id of the registry (a test holds it), so a page that
// draws a sport's equipment, or a card for a team of that sport, asks for the list and draws each id with `renderEmblem`.
import type { BallId, GearId, MedalId, SportName, TrophyId } from "./emblem.ids.ts";

/** The equipment of one sport. */
export interface SportEquipment {
  sport: SportName;
  /** The ball, or the implement that stands for one (the puck, the shuttlecock, the shot). Swimming, diving, artistic swimming and skating have none. */
  ball?: BallId;
  /** The gear the sport has an emblem for, most telling first. Empty where the package has none yet. */
  gear: GearId[];
  /** The trophy that stands for the sport's cup: its own where the package draws one, otherwise a plain cup, bowl or globe. */
  trophy: TrophyId;
  /** The medal of the sport's champion, for a sport in the Games. */
  medal?: MedalId;
}

type Entry = readonly [ball: BallId | undefined, gear: readonly GearId[], trophy: TrophyId, medal?: MedalId];

const GOLD: MedalId = "medal:gold";

const TABLE: Readonly<Record<SportName, Entry>> = {
  nfl: ["ball:football", ["gear:football-helmet", "gear:goalposts"], "trophy:football"],
  cfl: ["ball:football-cfl", ["gear:football-helmet", "gear:goalposts"], "trophy:canadian-bowl"],
  ifaf: ["ball:football-ifaf", ["gear:football-helmet", "gear:goalposts"], "trophy:cup"],
  nhl: ["ball:puck", ["gear:hockey-stick", "gear:hockey-skate", "gear:goalie-mask", "gear:goal-net"], "trophy:hockey-cup"],
  nba: ["ball:basketball", ["gear:basketball-hoop"], "trophy:basketball"],
  mlb: ["ball:baseball", ["gear:baseball-bat", "gear:baseball-glove"], "trophy:baseball"],
  soccer: ["ball:soccer", ["gear:goal-net"], "trophy:soccer-globe", GOLD],
  curling: ["ball:curling-stone", ["gear:curling-broom"], "trophy:bowl", GOLD],
  tennis: ["ball:tennis", ["gear:tennis-racket"], "trophy:tennis-cup", GOLD],
  volleyball: ["ball:volleyball", ["gear:volleyball-net"], "trophy:cup", GOLD],
  badminton: ["ball:shuttlecock-feather", ["gear:badminton-racket"], "trophy:cup", GOLD],
  pickleball: ["ball:pickleball-outdoor", ["gear:pickleball-paddle"], "trophy:cup"],
  tabletennis: ["ball:table-tennis", ["gear:table-tennis-paddle"], "trophy:cup", GOLD],
  padel: ["ball:padel", ["gear:padel-racket"], "trophy:cup"],
  squash: ["ball:squash", ["gear:squash-racket"], "trophy:cup", GOLD],
  racquetball: ["ball:racquetball", ["gear:racquetball-racket"], "trophy:cup"],
  sepaktakraw: ["ball:sepak-takraw", [], "trophy:cup"],
  teqball: ["ball:teqball", [], "trophy:cup"],
  roundnet: ["ball:roundnet", ["gear:roundnet-set"], "trophy:cup"],
  netball: ["ball:netball", [], "trophy:cup"],
  swimming: [undefined, ["gear:swim-goggles"], "trophy:cup", GOLD],
  waterpolo: ["ball:water-polo", ["gear:swim-goggles"], "trophy:cup", GOLD],
  diving: [undefined, ["gear:diving-board"], "trophy:cup", GOLD],
  artisticswimming: [undefined, ["gear:swim-goggles"], "trophy:cup", GOLD],
  lacrosse: ["ball:lacrosse", ["gear:lacrosse-stick"], "trophy:cup", GOLD],
  rugby: ["ball:rugby", ["gear:goalposts"], "trophy:rugby-cup", GOLD],
  afl: ["ball:afl", ["gear:goalposts"], "trophy:cup"],
  gaelic: ["ball:sliotar", ["gear:hurley", "gear:goalposts"], "trophy:cup"],
  cricket: ["ball:cricket-red", ["gear:cricket-bat", "gear:wicket"], "trophy:cricket-urn", GOLD],
  fieldhockey: ["ball:field-hockey", ["gear:field-hockey-stick", "gear:goal-net"], "trophy:cup", GOLD],
  handball: ["ball:handball", ["gear:goal-net"], "trophy:cup", GOLD],
  athletics: ["ball:shot", ["gear:starting-blocks", "gear:relay-baton", "gear:javelin", "gear:hurdles"], "trophy:laurel", GOLD],
  skating: [undefined, ["gear:figure-skate", "gear:speed-skate"], "trophy:cup", GOLD],
};

/**
 * What a sport is played and won with, as ids of the registry: `sportEquipment("nhl")` is the puck, a stick, a skate, a goalie's mask and a net, and the hockey cup. The arrays are new each call. An unknown sport is an error.
 * @example
 * ```ts
 * import { sportEquipment } from "@johnmorrisdotca/dougu-sports/emblems";
 * const nhl = sportEquipment("nhl");
 * console.log(nhl.ball, nhl.trophy);
 * // ball:puck trophy:hockey-cup
 * ```
 */
export function sportEquipment(sport: SportName): SportEquipment {
  if (!Object.hasOwn(TABLE, sport)) throw new Error(`Unknown sport "${String(sport).slice(0, 40)}": the equipment is for the names in SPORT_NAMES.`);
  const [ball, gear, trophy, medal] = TABLE[sport];
  return { sport, ...(ball === undefined ? {} : { ball }), gear: [...gear], trophy, ...(medal === undefined ? {} : { medal }) };
}
