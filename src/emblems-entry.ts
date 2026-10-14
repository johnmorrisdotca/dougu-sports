// The emblems entry point: `renderEmblem(id, options)` draws any emblem from its id, and the ids and types say which there are. Nothing here imports a single drawing's module directly, so for one
// emblem and nothing else import its own module (`@johnmorrisdotca/dougu-sports/ball/soccer`).
export { EMBLEM_DESCRIPTIONS } from "./emblems/emblem.descriptions.ts";
export type { EmblemDescription } from "./emblems/emblem.descriptions.ts";
export { EMBLEMS, crest, emblemInfo, emblemModel, emblemName, emblemOf, emblemSvg, isBallId, isEmblemId, medal, parseEmblem, renderEmblem, sportIcon } from "./emblems/emblem.api.ts";
export type { CrestOptions, EmblemInfo, EmblemRef } from "./emblems/emblem.api.ts";
export { AWARD_IDS, BALL_IDS, CREST_IDS, CREST_SHAPES, EMBLEM_ALIASES, EMBLEM_FOLDERS, EMBLEM_GROUPS, EMBLEM_IDS, GEAR_IDS, JAPANESE_IDS, MEDAL_IDS, MEDAL_KINDS, SPORT_IDS, SPORT_NAMES, TROPHY_IDS } from "./emblems/emblem.ids.ts";
export type { AwardId, BallId, CrestId, CrestShape, EmblemGroup, EmblemId, GearId, JapaneseId, MedalId, MedalKind, SportEmblemId, SportName, TrophyId } from "./emblems/emblem.ids.ts";
export { EMBLEM_INK, EMBLEM_PAGE, EMBLEM_STYLES, METALS } from "./emblems/emblem.core.ts";
export type { Emblem, EmblemKind, EmblemOptions, EmblemSource, EmblemStyle, EmblemTheme, FrameOptions } from "./emblems/emblem.core.ts";
export { lineup } from "./emblems/ball/ball.index.ts";
export type { LineupOptions } from "./emblems/ball/ball.index.ts";
export type { PieceSize } from "./emblems/ball/ball.core.ts";
export type { Ball, BallKind, Decor, Handle, LatheModel, Poles, Pt, Solid } from "./emblems/emblem.lathe.ts";
export type { FlatModel, Role, Shape } from "./emblems/emblem.shapes.ts";
