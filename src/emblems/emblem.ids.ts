// The ids of the emblems, in their groups, and the types they make. Nothing is imported: this file is only names, so it costs nothing to read. An id is `<group>:<name>`.
// Each list below holds the emblems that exist. The art for the rest arrives group by group (docs/layout.md), and each arrival adds its names here and its entry to emblem.registry.ts.

/** The forty-two sports the emblems are made for (the five Japanese ones, sumo, kendo, judo, kyudo and karate, have a pictogram and their gear, and no ball; the four combat sports, MMA, boxing, wrestling and professional wrestling, have a pictogram and no ball or gear yet): the names that `ball:<sport>`, `gear:<sport>` and `sport:<sport>` use. */
export const SPORT_NAMES = [
  "nfl", "cfl", "ifaf", "nhl", "nba", "mlb", "soccer", "curling", "tennis", "volleyball", "badminton", "pickleball", "tabletennis", "padel", "squash", "racquetball", "sepaktakraw", "teqball", "roundnet", "netball",
  "swimming", "waterpolo", "diving", "artisticswimming", "lacrosse", "rugby", "afl", "gaelic", "cricket", "fieldhockey", "handball", "athletics", "skating",
  "sumo", "kendo", "judo", "kyudo", "karate",
  "mma", "boxing", "wrestling", "prowrestling",
] as const;
export type SportName = (typeof SPORT_NAMES)[number];

/** The awards: a medal on a ribbon, a badge, a crown, a star and a shield. */
export const AWARD_IDS = ["award:medal", "award:badge", "award:crown", "award:star", "award:shield", "award:ribbon"] as const;
export type AwardId = (typeof AWARD_IDS)[number];

/** The trophies: a cup for each league's champion in a descriptive, generic form, the plain cups and dishes, and the flat plaque, belt, wreath and rosette. */
export const TROPHY_IDS = [
  "trophy:cup", "trophy:lidded-cup", "trophy:bowl", "trophy:salver", "trophy:globe",
  "trophy:hockey-cup", "trophy:basketball", "trophy:baseball", "trophy:football", "trophy:canadian-bowl", "trophy:soccer-ball", "trophy:soccer-globe",
  "trophy:tennis-plate", "trophy:tennis-cup", "trophy:cricket-urn", "trophy:rugby-cup",
  "trophy:plaque", "trophy:belt", "trophy:laurel", "trophy:rosette", "trophy:ring", "trophy:banner",
  "trophy:sumo-cup", "trophy:championship-banner",
  "trophy:paterson-cup",
  "trophy:stanley-cup",
  "trophy:hart-trophy",
  "trophy:vezina-trophy",
  "trophy:norris-trophy",
  "trophy:calder-trophy",
  "trophy:presidents-trophy",
  "trophy:art-ross-trophy",
  "trophy:lady-byng-trophy",
  "trophy:jennings-trophy",
  "trophy:selke-trophy",
  "trophy:king-clancy-trophy",
  "trophy:masterton-trophy",
  "trophy:jack-adams-trophy",
  "trophy:prince-of-wales-trophy",
  "trophy:campbell-bowl",
  "trophy:rocket-richard-trophy",
  "trophy:conn-smythe-trophy",
  "trophy:ted-lindsay-award",
  "trophy:lester-patrick-trophy",
  "trophy:lombardi-trophy",
  "trophy:larry-obrien-trophy",
  "trophy:commissioners-trophy",
  "trophy:grey-cup",
  "trophy:cy-young-award",
  "trophy:mlb-mvp-award",
  "trophy:relief-man-award",
  "trophy:hank-aaron-award",
  "trophy:bill-russell-trophy",
  "trophy:nba-western-conference-2001",
  "trophy:nba-eastern-conference-2001",
  "trophy:oscar-robertson-trophy",
  "trophy:bob-cousy-trophy",
  "trophy:magic-johnson-trophy",
  "trophy:larry-bird-trophy",
  "trophy:larry-obrien-trophy-1977",
  "trophy:walter-cup",
  "trophy:wnba-championship-trophy",
  "trophy:lamar-hunt-trophy",
  "trophy:george-halas-trophy",
  "trophy:silver-slugger-award",
  "trophy:world-series-mvp-trophy",
  "trophy:avco-world-trophy",
  "trophy:obrien-cup",
  "trophy:gold-glove-award",
  "trophy:fifa-world-cup",
  "trophy:woodlawn-vase",
  "trophy:dfb-pokal",
  "trophy:champions-league-trophy",
  "trophy:webb-ellis-cup",
  "trophy:fa-cup",
  "trophy:cricket-world-cup",
  "trophy:wimbledon-gentlemens-trophy",
  "trophy:venus-rosewater-dish",
  "trophy:ballon-dor",
  "trophy:ashes-urn",
  "trophy:borg-warner-trophy",
  "trophy:americas-cup",
  "trophy:calder-cup",
  "trophy:kelly-cup",
  "trophy:cfp-trophy",
  "trophy:mls-cup",
  "trophy:foundation-player-award",
  "trophy:willie-oree-award",
  "trophy:messier-leadership-award",
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
  "ball:soccer", "ball:soccer-colour", "ball:soccer-26", "ball:soccer-18", "ball:soccer-14", "ball:soccer-12", "ball:soccer-6", "ball:soccer-orange", "ball:soccer-26-orange", "ball:soccer-18-orange", "ball:soccer-14-orange", "ball:soccer-12-orange", "ball:soccer-6-orange", "ball:soccer-yellow", "ball:soccer-26-yellow", "ball:soccer-18-yellow", "ball:soccer-14-yellow", "ball:soccer-12-yellow", "ball:soccer-6-yellow", "ball:futsal", "ball:beach-soccer",
  "ball:soccer-1870-hand-stitched", "ball:soccer-1900-laced", "ball:soccer-1930-18-panel", "ball:soccer-1950-12-panel", "ball:soccer-1960-32-panel-leather", "ball:soccer-retro-pentagons", "ball:soccer-retro-leaves", "ball:soccer-retro-rosette", "ball:soccer-retro-star", "ball:soccer-retro-pinwheel", "ball:soccer-retro-kites", "ball:soccer-14-panel-double-border", "ball:soccer-8-panel-plain", "ball:soccer-6-panel-bands", "ball:soccer-6-panel-diamonds", "ball:soccer-20-panel-dots", "ball:soccer-training-high-vis", "ball:soccer-stars-blue", "ball:soccer-stars-red", "ball:soccer-stars-night", "ball:soccer-hexagons-cyan", "ball:soccer-hexagons-magenta", "ball:soccer-hexagons-lime", "ball:soccer-flames-fire", "ball:soccer-flames-ice", "ball:soccer-flames-toxic", "ball:soccer-chevrons-red", "ball:soccer-chevrons-green", "ball:soccer-chevrons-blue", "ball:soccer-swirl-blue", "ball:soccer-swirl-red", "ball:soccer-swirl-teal", "ball:soccer-metallic-gold", "ball:soccer-metallic-silver", "ball:soccer-metallic-cobalt", "ball:teqball", "ball:basketball", "ball:basketball-6", "ball:basketball-3x3", "ball:baseball", "ball:softball", "ball:baseball-lemon-peel", "ball:baseball-red-blue", "ball:baseball-black-red", "ball:baseball-vintage-leather", "ball:softball-11-optic", "ball:tennis", "ball:padel",
  "ball:sliotar", "ball:volleyball", "ball:volleyball-8", "ball:beach-volleyball", "ball:volleyball-colours", "ball:volleyball-brazil", "ball:volleyball-japan", "ball:volleyball-canada", "ball:volleyball-usa", "ball:volleyball-italy", "ball:volleyball-poland", "ball:volleyball-france", "ball:volleyball-serbia", "ball:volleyball-netherlands", "ball:volleyball-germany", "ball:cricket-red", "ball:cricket-white", "ball:cricket-pink", "ball:football", "ball:football-cfl",
  "ball:football-ifaf", "ball:rugby", "ball:afl", "ball:gaelic-football", "ball:netball", "ball:pickleball-outdoor", "ball:pickleball-indoor", "ball:plastic-baseball-slotted", "ball:squash", "ball:squash-yellow",
  "ball:squash-green", "ball:squash-red", "ball:squash-blue", "ball:racquetball", "ball:lacrosse", "ball:field-hockey", "ball:table-tennis", "ball:handball", "ball:water-polo", "ball:golf",
  "ball:puck", "ball:curling-stone", "ball:shot", "ball:discus", "ball:hammer", "ball:sepak-takraw", "ball:roundnet", "ball:shuttlecock-feather", "ball:shuttlecock-nylon"
] as const;
export type BallId = (typeof BALL_IDS)[number];

/** The printed pucks: the same puck as `ball:puck` with a print on its top face (a flag, a leaf, stars and stripes, a player's name and number, a made-up signature, a souvenir's ring of words). All drawn here, none a team's or a league's own. */
export const PUCK_IDS = ["puck:canada", "puck:canada-red", "puck:canada-white", "puck:usa", "puck:usa-navy", "puck:player", "puck:signed", "puck:souvenir"] as const;
export type PuckId = (typeof PUCK_IDS)[number];

/** The pieces of gear: a piece of equipment for each sport, flat, drawn for this package, turning like a coin. */
export const GEAR_IDS = [
  "gear:hockey-stick", "gear:goalie-stick", "gear:hockey-skate", "gear:goalie-mask", "gear:goal-net", "gear:field-hockey-stick", "gear:lacrosse-stick", "gear:cricket-bat", "gear:wicket",
  "gear:table-tennis-paddle", "gear:badminton-racket", "gear:tennis-racket", "gear:squash-racket", "gear:racquetball-racket", "gear:padel-racket", "gear:pickleball-paddle",
  "gear:roundnet-set", "gear:takraw-net", "gear:netball-post", "gear:teqball-table", "gear:volleyball-net", "gear:basketball-hoop", "gear:baseball-bat", "gear:baseball-glove", "gear:baseball-cap", "gear:football-helmet", "gear:goalposts", "gear:hurley",
  "gear:curling-broom", "gear:figure-skate", "gear:speed-skate", "gear:diving-board", "gear:swim-goggles", "gear:starting-blocks", "gear:relay-baton", "gear:javelin", "gear:hurdles",
  "gear:gunbai", "gear:mawashi", "gear:shinai", "gear:kendo-men", "gear:judogi", "gear:judogi-blue", "gear:judogi-folded", "gear:judogi-blue-folded", "gear:judogi-back", "gear:judogi-blue-back",
  "gear:obi", "gear:obi-white", "gear:obi-yellow", "gear:obi-orange", "gear:obi-green", "gear:obi-blue", "gear:obi-brown", "gear:obi-kohaku", "gear:obi-red", "gear:obi-women", "gear:obi-white-yellow", "gear:obi-yellow-orange", "gear:obi-orange-green", "gear:obi-green-blue", "gear:obi-blue-brown", "gear:obi-step-1", "gear:obi-step-2", "gear:obi-step-3", "gear:obi-step-4", "gear:obi-step-5", "gear:obi-step-6",
  "gear:yumi", "gear:ya", "gear:karate-gi"
] as const;
export type GearId = (typeof GEAR_IDS)[number];

/** The Japanese sports and budo: sumo, kendo, judo, kyudo and karate, with the trophies and the gear that belong to them. Every one is also in its own group; this list is for showing them together. */
export const JAPANESE_IDS = [
  "sport:sumo", "trophy:sumo-cup", "gear:gunbai", "gear:mawashi",
  "trophy:championship-banner",
  "sport:kendo", "gear:shinai", "gear:kendo-men",
  "sport:judo", "gear:judogi", "gear:judogi-blue", "gear:judogi-folded", "gear:judogi-blue-folded", "gear:judogi-back", "gear:judogi-blue-back",
  "gear:obi", "gear:obi-white", "gear:obi-yellow", "gear:obi-orange", "gear:obi-green", "gear:obi-blue", "gear:obi-brown", "gear:obi-kohaku", "gear:obi-red", "gear:obi-women", "gear:obi-white-yellow", "gear:obi-yellow-orange", "gear:obi-orange-green", "gear:obi-green-blue", "gear:obi-blue-brown", "gear:obi-step-1", "gear:obi-step-2", "gear:obi-step-3", "gear:obi-step-4", "gear:obi-step-5", "gear:obi-step-6",
  "sport:kyudo", "gear:yumi", "gear:ya",
  "sport:karate", "gear:karate-gi",
] as const;
export type JapaneseId = (typeof JAPANESE_IDS)[number];

/** The pennants: a felt championship pennant with a stitched edge. */
export const PENNANT_IDS = ["pennant:championship"] as const;
export type PennantId = (typeof PENNANT_IDS)[number];

/** The sports' own emblems: one pictogram for each of the forty-two. */
export type SportEmblemId = `sport:${SportName}`;
export const SPORT_IDS: readonly SportEmblemId[] = SPORT_NAMES.map((name) => `sport:${name}` as const);

/** Every emblem id. */
export type EmblemId = AwardId | TrophyId | MedalId | CrestId | BallId | PuckId | GearId | SportEmblemId | PennantId;

/** The groups of ids, in the order a gallery shows them. */
export const EMBLEM_GROUPS = {
  award: AWARD_IDS,
  trophy: TROPHY_IDS,
  medal: MEDAL_IDS,
  crest: CREST_IDS,
  ball: BALL_IDS,
  puck: PUCK_IDS,
  gear: GEAR_IDS,
  sport: SPORT_IDS,
  pennant: PENNANT_IDS,
} as const satisfies Record<string, readonly EmblemId[]>;
export type EmblemGroup = keyof typeof EMBLEM_GROUPS;

/** Every id, in group order. */
export const EMBLEM_IDS: readonly EmblemId[] = Object.values(EMBLEM_GROUPS).flat();

/** The folder under `src/emblems/` that holds a group's art, one module per item named by the id's last part: `trophy:hockey-cup` is `trophy/hockey-cup.ts`, `ball:soccer` is `ball/soccer.ts`. Each group has a folder of its own, so no two ids share a file name. */
export const EMBLEM_FOLDERS = { award: "award", trophy: "trophy", medal: "medal", crest: "crest", ball: "ball", puck: "ball", gear: "gear", sport: "sport", pennant: "pennant" } as const satisfies Record<EmblemGroup, string>;

/** The ids that early versions published for era balls, now under neutral names: each still reads as the ball that replaced it. */
const RENAMED_BALLS = {
  "ball:soccer-1970-black-white": "ball:soccer-retro-pentagons",
  "ball:soccer-1978-triad": "ball:soccer-retro-leaves",
  "ball:soccer-1986-decorated-triad": "ball:soccer-retro-rosette",
  "ball:soccer-1998-coloured-triad": "ball:soccer-retro-pinwheel",
  "ball:soccer-2002-triangle-sweep": "ball:soccer-retro-kites",
  "ball:soccer-2006-propeller": "ball:soccer-14-panel-double-border",
  "ball:soccer-2010-grooved": "ball:soccer-8-panel-plain",
  "ball:soccer-2014-ribbon": "ball:soccer-6-panel-bands",
  "ball:soccer-2018-pixel": "ball:soccer-6-panel-diamonds",
  "ball:soccer-2022-speed-shell": "ball:soccer-20-panel-dots",
} as const satisfies Record<string, EmblemId>;

/** The short names of the trophies and awards that stand for a full id (`"cup"` is `"trophy:cup"`, `"crown"` is `"award:crown"`), and the old ids of the era balls that were renamed. */
export const EMBLEM_ALIASES: Readonly<Record<string, EmblemId>> = { ...Object.fromEntries([...TROPHY_IDS, ...AWARD_IDS].map((id) => [id.slice(id.indexOf(":") + 1), id])), ...RENAMED_BALLS };
