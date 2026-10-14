// The emblems entry point: `renderEmblem(id, options)` draws any emblem from its id, and the ids and types say which there are. Nothing here imports a single drawing's module directly, so for one
// emblem and nothing else import its own module (`@johnmorrisdotca/dougu-sports/ball/soccer`).
export { EMBLEMS, emblemInfo, emblemModel, emblemName, emblemOf, emblemSvg, isBallId, isEmblemId, parseEmblem, renderEmblem } from "./emblems/emblem.api.ts";
export type { EmblemInfo, EmblemRef } from "./emblems/emblem.api.ts";
export { AWARD_IDS, BALL_IDS, CREST_IDS, EMBLEM_FOLDERS, EMBLEM_GROUPS, EMBLEM_IDS, GEAR_IDS, MEDAL_IDS, SPORT_IDS, SPORT_NAMES, TROPHY_IDS } from "./emblems/emblem.ids.ts";
export type { AwardId, BallId, CrestId, EmblemGroup, EmblemId, GearId, MedalId, SportEmblemId, SportName, TrophyId } from "./emblems/emblem.ids.ts";
export { EMBLEM_INK, EMBLEM_PAGE, EMBLEM_STYLES, METALS } from "./emblems/emblem.core.ts";
export type { Emblem, EmblemKind, EmblemOptions, EmblemSource, EmblemStyle, EmblemTheme, FrameOptions } from "./emblems/emblem.core.ts";
export type { BallModel, Mark } from "./emblems/emblem.ball.ts";
export type { FlatModel, Shape } from "./emblems/emblem.shapes.ts";
