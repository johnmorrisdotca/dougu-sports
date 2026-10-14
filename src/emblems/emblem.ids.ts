// The ids of the emblems, in their groups, and the types they make. Nothing is imported: this file is only names, so it costs nothing to read. An id is `<group>:<name>`.
// Each list below holds the emblems that exist. The art for the rest arrives group by group (docs/layout.md), and each arrival adds its names here and its entry to emblem.registry.ts.

/** The thirty-three sports the emblems are made for: the names that `ball:<sport>`, `gear:<sport>` and `sport:<sport>` use. */
export const SPORT_NAMES = [
  "nfl", "cfl", "ifaf", "nhl", "nba", "mlb", "soccer", "curling", "tennis", "volleyball", "badminton", "pickleball", "tabletennis", "padel", "squash", "racquetball", "sepaktakraw", "teqball", "roundnet", "netball",
  "swimming", "waterpolo", "diving", "artisticswimming", "lacrosse", "rugby", "afl", "gaelic", "cricket", "fieldhockey", "handball", "athletics", "skating",
] as const;
export type SportName = (typeof SPORT_NAMES)[number];

/** The awards: a medal on a ribbon, and the rest as they arrive. */
export const AWARD_IDS = ["award:medal"] as const;
export type AwardId = (typeof AWARD_IDS)[number];

/** The trophies. */
export const TROPHY_IDS = [] as const satisfies readonly `trophy:${string}`[];
export type TrophyId = (typeof TROPHY_IDS)[number];

/** The medals by place. */
export const MEDAL_IDS = [] as const satisfies readonly `medal:${string}`[];
export type MedalId = (typeof MEDAL_IDS)[number];

/** The crests. */
export const CREST_IDS = [] as const satisfies readonly `crest:${string}`[];
export type CrestId = (typeof CREST_IDS)[number];

/** The balls. */
export const BALL_IDS = ["ball:soccer"] as const;
export type BallId = (typeof BALL_IDS)[number];

/** The pieces of gear. */
export const GEAR_IDS = [] as const satisfies readonly `gear:${string}`[];
export type GearId = (typeof GEAR_IDS)[number];

/** The sports' own emblems. */
export const SPORT_IDS = [] as const satisfies readonly `sport:${string}`[];
export type SportEmblemId = (typeof SPORT_IDS)[number];

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

/** The folder under `src/emblems/` that holds a group's art, one module per item named by the id's last part: `ball:soccer` is `ball/soccer.ts`. Trophies, medals, crests and sports share the award folder. */
export const EMBLEM_FOLDERS = { award: "award", trophy: "award", medal: "award", crest: "award", ball: "ball", gear: "gear", sport: "award" } as const satisfies Record<EmblemGroup, "award" | "ball" | "gear">;
