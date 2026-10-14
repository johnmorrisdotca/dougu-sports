// The ids of the emblems, in their groups, and the types they make. Nothing is imported: this file is only names, so it costs nothing to read. An id is `<group>:<name>`.
// Each list below holds the emblems that exist. The art for the rest arrives group by group (docs/layout.md), and each arrival adds its names here and its entry to emblem.registry.ts.

/** The thirty-eight sports the emblems are made for (the five Japanese ones, sumo, kendo, judo, kyudo and karate, have a pictogram and their gear, and no ball): the names that `ball:<sport>`, `gear:<sport>` and `sport:<sport>` use. */
export const SPORT_NAMES = [
  "nfl", "cfl", "ifaf", "nhl", "nba", "mlb", "soccer", "curling", "tennis", "volleyball", "badminton", "pickleball", "tabletennis", "padel", "squash", "racquetball", "sepaktakraw", "teqball", "roundnet", "netball",
  "swimming", "waterpolo", "diving", "artisticswimming", "lacrosse", "rugby", "afl", "gaelic", "cricket", "fieldhockey", "handball", "athletics", "skating",
  "sumo", "kendo", "judo", "kyudo", "karate",
] as const;
export type SportName = (typeof SPORT_NAMES)[number];

/** The awards: a medal on a ribbon, a badge, a crown, a star and a shield. */
export const AWARD_IDS = ["award:medal", "award:badge", "award:crown", "award:star", "award:shield"] as const;
export type AwardId = (typeof AWARD_IDS)[number];

/** The trophies: a cup for each league's champion in a descriptive, generic form, the plain cups and dishes, and the flat plaque, belt, wreath and rosette. */
export const TROPHY_IDS = [
  "trophy:cup", "trophy:lidded-cup", "trophy:bowl", "trophy:salver", "trophy:globe",
  "trophy:hockey-cup", "trophy:basketball", "trophy:baseball", "trophy:football", "trophy:canadian-bowl", "trophy:soccer-ball", "trophy:soccer-globe",
  "trophy:tennis-plate", "trophy:tennis-cup", "trophy:cricket-urn", "trophy:rugby-cup",
  "trophy:plaque", "trophy:belt", "trophy:laurel", "trophy:rosette",
  "trophy:sumo-cup", "trophy:championship-banner",
] as const;
export type TrophyId = (typeof TROPHY_IDS)[number];

/** The medals on a ribbon, and the badges for the first three places. */
export const MEDAL_KINDS = ["gold", "silver", "bronze"] as const;
export type MedalKind = (typeof MEDAL_KINDS)[number];
export const MEDAL_IDS = ["medal:gold", "medal:silver", "medal:bronze", "medal:place-1", "medal:place-2", "medal:place-3"] as const;
export type MedalId = (typeof MEDAL_IDS)[number];

/** The generic crests: tinted by a team's colours, with the team's letters on them when it has any. */
export const CREST_SHAPES = ["shield", "roundel", "diamond", "pennant"] as const;
export type CrestShape = (typeof CREST_SHAPES)[number];
export const CREST_IDS = ["crest:shield", "crest:roundel", "crest:diamond", "crest:pennant"] as const;
export type CrestId = (typeof CREST_IDS)[number];

/** The balls: one for each ball and implement the sports use, in 3D, with the official size it comes from. The balls of one family (the three crickets, the five squash balls) share a module. */
export const BALL_IDS = [
  "ball:soccer", "ball:soccer-colour", "ball:teqball", "ball:basketball", "ball:basketball-6", "ball:basketball-3x3", "ball:baseball", "ball:softball", "ball:tennis", "ball:padel",
  "ball:sliotar", "ball:volleyball", "ball:volleyball-8", "ball:beach-volleyball", "ball:cricket-red", "ball:cricket-white", "ball:cricket-pink", "ball:football", "ball:football-cfl",
  "ball:football-ifaf", "ball:rugby", "ball:afl", "ball:gaelic-football", "ball:netball", "ball:pickleball-outdoor", "ball:pickleball-indoor", "ball:squash", "ball:squash-yellow",
  "ball:squash-green", "ball:squash-red", "ball:squash-blue", "ball:racquetball", "ball:lacrosse", "ball:field-hockey", "ball:table-tennis", "ball:handball", "ball:water-polo", "ball:golf",
  "ball:puck", "ball:curling-stone", "ball:shot", "ball:discus", "ball:hammer", "ball:sepak-takraw", "ball:roundnet", "ball:shuttlecock-feather", "ball:shuttlecock-nylon"
] as const;
export type BallId = (typeof BALL_IDS)[number];

/** The pieces of gear: a piece of equipment for each sport, flat, drawn for this package, turning like a coin. */
export const GEAR_IDS = [
  "gear:hockey-stick", "gear:goalie-stick", "gear:hockey-skate", "gear:goalie-mask", "gear:goal-net", "gear:field-hockey-stick", "gear:lacrosse-stick", "gear:cricket-bat", "gear:wicket",
  "gear:table-tennis-paddle", "gear:badminton-racket", "gear:tennis-racket", "gear:squash-racket", "gear:racquetball-racket", "gear:padel-racket", "gear:pickleball-paddle",
  "gear:roundnet-set", "gear:volleyball-net", "gear:basketball-hoop", "gear:baseball-bat", "gear:baseball-glove", "gear:football-helmet", "gear:goalposts", "gear:hurley",
  "gear:curling-broom", "gear:figure-skate", "gear:speed-skate", "gear:diving-board", "gear:swim-goggles", "gear:starting-blocks", "gear:relay-baton", "gear:javelin", "gear:hurdles",
  "gear:gunbai", "gear:mawashi", "gear:shinai", "gear:kendo-men", "gear:judogi", "gear:obi", "gear:yumi", "gear:ya", "gear:karate-gi"
] as const;
export type GearId = (typeof GEAR_IDS)[number];

/** The Japanese sports and budo: sumo, kendo, judo, kyudo and karate, with the trophies and the gear that belong to them. Every one is also in its own group; this list is for showing them together. */
export const JAPANESE_IDS = [
  "sport:sumo", "trophy:sumo-cup", "gear:gunbai", "gear:mawashi",
  "trophy:championship-banner",
  "sport:kendo", "gear:shinai", "gear:kendo-men",
  "sport:judo", "gear:judogi", "gear:obi",
  "sport:kyudo", "gear:yumi", "gear:ya",
  "sport:karate", "gear:karate-gi",
] as const;
export type JapaneseId = (typeof JAPANESE_IDS)[number];

/** The sports' own emblems: one pictogram for each of the thirty-eight. */
export type SportEmblemId = `sport:${SportName}`;
export const SPORT_IDS: readonly SportEmblemId[] = SPORT_NAMES.map((name) => `sport:${name}` as const);

/** Every emblem id. */
export type EmblemId = AwardId | TrophyId | MedalId | CrestId | BallId | GearId | SportEmblemId;

/** The groups of ids, in the order a gallery shows them. */
export const EMBLEM_GROUPS = {
  award: AWARD_IDS,
  trophy: TROPHY_IDS,
  medal: MEDAL_IDS,
  crest: CREST_IDS,
  ball: BALL_IDS,
  gear: GEAR_IDS,
  sport: SPORT_IDS,
} as const satisfies Record<string, readonly EmblemId[]>;
export type EmblemGroup = keyof typeof EMBLEM_GROUPS;

/** Every id, in group order. */
export const EMBLEM_IDS: readonly EmblemId[] = Object.values(EMBLEM_GROUPS).flat();

/** The folder under `src/emblems/` that holds a group's art, one module per item named by the id's last part: `trophy:hockey-cup` is `trophy/hockey-cup.ts`, `ball:soccer` is `ball/soccer.ts`. Each group has a folder of its own, so no two ids share a file name. */
export const EMBLEM_FOLDERS = { award: "award", trophy: "trophy", medal: "medal", crest: "crest", ball: "ball", gear: "gear", sport: "sport" } as const satisfies Record<EmblemGroup, string>;

/** The short names of the trophies and awards that stand for a full id: `"cup"` is `"trophy:cup"` and `"crown"` is `"award:crown"`. */
export const EMBLEM_ALIASES: Readonly<Record<string, EmblemId>> = Object.fromEntries([...TROPHY_IDS, ...AWARD_IDS].map((id) => [id.slice(id.indexOf(":") + 1), id]));
