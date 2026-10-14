// Every emblem by id. A table keyed by the id union, so a missing or extra emblem is a type error. Importing this file pulls in every drawing; importing one drawing's module does not.
import type { Emblem } from "./emblem.core.ts";
import type { EmblemId } from "./emblem.ids.ts";
import { AWARD_MEDAL } from "./award/medal.ts";
import { AWARD_BADGE } from "./award/badge.ts";
import { AWARD_CROWN } from "./award/crown.ts";
import { AWARD_STAR } from "./award/star.ts";
import { AWARD_SHIELD } from "./award/shield.ts";
import { TROPHY_CUP } from "./trophy/cup.ts";
import { TROPHY_LIDDED_CUP } from "./trophy/lidded-cup.ts";
import { TROPHY_BOWL } from "./trophy/bowl.ts";
import { TROPHY_SALVER } from "./trophy/salver.ts";
import { TROPHY_GLOBE } from "./trophy/globe.ts";
import { TROPHY_HOCKEY_CUP } from "./trophy/hockey-cup.ts";
import { TROPHY_BASKETBALL } from "./trophy/basketball.ts";
import { TROPHY_BASEBALL } from "./trophy/baseball.ts";
import { TROPHY_FOOTBALL } from "./trophy/football.ts";
import { TROPHY_CANADIAN_BOWL } from "./trophy/canadian-bowl.ts";
import { TROPHY_SOCCER_BALL } from "./trophy/soccer-ball.ts";
import { TROPHY_SOCCER_GLOBE } from "./trophy/soccer-globe.ts";
import { TROPHY_TENNIS_PLATE } from "./trophy/tennis-plate.ts";
import { TROPHY_TENNIS_CUP } from "./trophy/tennis-cup.ts";
import { TROPHY_CRICKET_URN } from "./trophy/cricket-urn.ts";
import { TROPHY_RUGBY_CUP } from "./trophy/rugby-cup.ts";
import { TROPHY_PLAQUE } from "./trophy/plaque.ts";
import { TROPHY_BELT } from "./trophy/belt.ts";
import { TROPHY_LAUREL } from "./trophy/laurel.ts";
import { TROPHY_ROSETTE } from "./trophy/rosette.ts";
import { TROPHY_RING } from "./trophy/ring.ts";
import { TROPHY_BANNER } from "./trophy/banner.ts";
import { MEDAL_GOLD } from "./medal/gold.ts";
import { MEDAL_SILVER } from "./medal/silver.ts";
import { MEDAL_BRONZE } from "./medal/bronze.ts";
import { MEDAL_PLACE_1 } from "./medal/place-1.ts";
import { MEDAL_PLACE_2 } from "./medal/place-2.ts";
import { MEDAL_PLACE_3 } from "./medal/place-3.ts";
import { CREST_SHIELD } from "./crest/shield.ts";
import { CREST_ROUNDEL } from "./crest/roundel.ts";
import { CREST_DIAMOND } from "./crest/diamond.ts";
import { CREST_PENNANT } from "./crest/pennant.ts";
import { JERSEY_HOCKEY } from "./jersey/hockey.ts";
import { JERSEY_BASKETBALL } from "./jersey/basketball.ts";
import { JERSEY_SOCCER } from "./jersey/soccer.ts";
import { JERSEY_BASEBALL } from "./jersey/baseball.ts";
import { JERSEY_FOOTBALL } from "./jersey/football.ts";
import { PENNANT_CHAMPIONSHIP } from "./pennant/championship.ts";
import { BALLS } from "./ball/ball.index.ts";
import { GEARS } from "./gear/gear.index.ts";
import { SPORT_NFL } from "./sport/nfl.ts";
import { SPORT_CFL } from "./sport/cfl.ts";
import { SPORT_IFAF } from "./sport/ifaf.ts";
import { SPORT_NHL } from "./sport/nhl.ts";
import { SPORT_NBA } from "./sport/nba.ts";
import { SPORT_MLB } from "./sport/mlb.ts";
import { SPORT_SOCCER } from "./sport/soccer.ts";
import { SPORT_CURLING } from "./sport/curling.ts";
import { SPORT_TENNIS } from "./sport/tennis.ts";
import { SPORT_VOLLEYBALL } from "./sport/volleyball.ts";
import { SPORT_BADMINTON } from "./sport/badminton.ts";
import { SPORT_PICKLEBALL } from "./sport/pickleball.ts";
import { SPORT_TABLETENNIS } from "./sport/tabletennis.ts";
import { SPORT_PADEL } from "./sport/padel.ts";
import { SPORT_SQUASH } from "./sport/squash.ts";
import { SPORT_RACQUETBALL } from "./sport/racquetball.ts";
import { SPORT_SEPAKTAKRAW } from "./sport/sepaktakraw.ts";
import { SPORT_TEQBALL } from "./sport/teqball.ts";
import { SPORT_ROUNDNET } from "./sport/roundnet.ts";
import { SPORT_NETBALL } from "./sport/netball.ts";
import { SPORT_SWIMMING } from "./sport/swimming.ts";
import { SPORT_WATERPOLO } from "./sport/waterpolo.ts";
import { SPORT_DIVING } from "./sport/diving.ts";
import { SPORT_ARTISTICSWIMMING } from "./sport/artisticswimming.ts";
import { SPORT_LACROSSE } from "./sport/lacrosse.ts";
import { SPORT_RUGBY } from "./sport/rugby.ts";
import { SPORT_AFL } from "./sport/afl.ts";
import { SPORT_GAELIC } from "./sport/gaelic.ts";
import { SPORT_CRICKET } from "./sport/cricket.ts";
import { SPORT_FIELDHOCKEY } from "./sport/fieldhockey.ts";
import { SPORT_HANDBALL } from "./sport/handball.ts";
import { SPORT_ATHLETICS } from "./sport/athletics.ts";
import { SPORT_SKATING } from "./sport/skating.ts";

/** The balls and the gear are drawn by families, each family in a module of its own, and listed in order by their own indexes. */
const PIECES: Readonly<Record<string, Emblem>> = Object.fromEntries([...BALLS, ...GEARS].map((piece) => [piece.id, piece]));

/** The emblems drawn one to a module: every id but the balls and the gear. A missing or extra entry is a type error. */
const OWN: Readonly<Record<Exclude<EmblemId, `ball:${string}` | `gear:${string}`>, Emblem>> = {
  "award:medal": AWARD_MEDAL,
  "award:badge": AWARD_BADGE,
  "award:crown": AWARD_CROWN,
  "award:star": AWARD_STAR,
  "award:shield": AWARD_SHIELD,
  "trophy:cup": TROPHY_CUP,
  "trophy:lidded-cup": TROPHY_LIDDED_CUP,
  "trophy:bowl": TROPHY_BOWL,
  "trophy:salver": TROPHY_SALVER,
  "trophy:globe": TROPHY_GLOBE,
  "trophy:hockey-cup": TROPHY_HOCKEY_CUP,
  "trophy:basketball": TROPHY_BASKETBALL,
  "trophy:baseball": TROPHY_BASEBALL,
  "trophy:football": TROPHY_FOOTBALL,
  "trophy:canadian-bowl": TROPHY_CANADIAN_BOWL,
  "trophy:soccer-ball": TROPHY_SOCCER_BALL,
  "trophy:soccer-globe": TROPHY_SOCCER_GLOBE,
  "trophy:tennis-plate": TROPHY_TENNIS_PLATE,
  "trophy:tennis-cup": TROPHY_TENNIS_CUP,
  "trophy:cricket-urn": TROPHY_CRICKET_URN,
  "trophy:rugby-cup": TROPHY_RUGBY_CUP,
  "trophy:plaque": TROPHY_PLAQUE,
  "trophy:belt": TROPHY_BELT,
  "trophy:laurel": TROPHY_LAUREL,
  "trophy:rosette": TROPHY_ROSETTE,
  "trophy:ring": TROPHY_RING,
  "trophy:banner": TROPHY_BANNER,
  "medal:gold": MEDAL_GOLD,
  "medal:silver": MEDAL_SILVER,
  "medal:bronze": MEDAL_BRONZE,
  "medal:place-1": MEDAL_PLACE_1,
  "medal:place-2": MEDAL_PLACE_2,
  "medal:place-3": MEDAL_PLACE_3,
  "crest:shield": CREST_SHIELD,
  "crest:roundel": CREST_ROUNDEL,
  "crest:diamond": CREST_DIAMOND,
  "crest:pennant": CREST_PENNANT,
  "jersey:hockey": JERSEY_HOCKEY,
  "jersey:basketball": JERSEY_BASKETBALL,
  "jersey:soccer": JERSEY_SOCCER,
  "jersey:baseball": JERSEY_BASEBALL,
  "jersey:football": JERSEY_FOOTBALL,
  "pennant:championship": PENNANT_CHAMPIONSHIP,
  "sport:nfl": SPORT_NFL,
  "sport:cfl": SPORT_CFL,
  "sport:ifaf": SPORT_IFAF,
  "sport:nhl": SPORT_NHL,
  "sport:nba": SPORT_NBA,
  "sport:mlb": SPORT_MLB,
  "sport:soccer": SPORT_SOCCER,
  "sport:curling": SPORT_CURLING,
  "sport:tennis": SPORT_TENNIS,
  "sport:volleyball": SPORT_VOLLEYBALL,
  "sport:badminton": SPORT_BADMINTON,
  "sport:pickleball": SPORT_PICKLEBALL,
  "sport:tabletennis": SPORT_TABLETENNIS,
  "sport:padel": SPORT_PADEL,
  "sport:squash": SPORT_SQUASH,
  "sport:racquetball": SPORT_RACQUETBALL,
  "sport:sepaktakraw": SPORT_SEPAKTAKRAW,
  "sport:teqball": SPORT_TEQBALL,
  "sport:roundnet": SPORT_ROUNDNET,
  "sport:netball": SPORT_NETBALL,
  "sport:swimming": SPORT_SWIMMING,
  "sport:waterpolo": SPORT_WATERPOLO,
  "sport:diving": SPORT_DIVING,
  "sport:artisticswimming": SPORT_ARTISTICSWIMMING,
  "sport:lacrosse": SPORT_LACROSSE,
  "sport:rugby": SPORT_RUGBY,
  "sport:afl": SPORT_AFL,
  "sport:gaelic": SPORT_GAELIC,
  "sport:cricket": SPORT_CRICKET,
  "sport:fieldhockey": SPORT_FIELDHOCKEY,
  "sport:handball": SPORT_HANDBALL,
  "sport:athletics": SPORT_ATHLETICS,
  "sport:skating": SPORT_SKATING,
};

/** Every emblem, by id. */
export const EMBLEM_TABLE: Readonly<Record<EmblemId, Emblem>> = { ...OWN, ...PIECES } as Readonly<Record<EmblemId, Emblem>>;
