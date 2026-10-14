// The emblems entry point: `renderEmblem(id, options)` draws any emblem from its id, and the ids and types say which there are. Nothing here imports a single drawing's module directly, so for one
// emblem and nothing else import its own module (`@johnmorrisdotca/dougu-sports/ball/soccer`).
export { EMBLEMS, crest, emblemInfo, emblemModel, emblemName, emblemOf, emblemSvg, isBallId, isEmblemId, jersey, medal, parseEmblem, pennant, renderEmblem, sportIcon } from "./emblems/emblem.api.ts";
export type { CrestOptions, EmblemInfo, EmblemRef, JerseyOptions, PennantOptions } from "./emblems/emblem.api.ts";
export { AWARD_IDS, BALL_IDS, CREST_IDS, CREST_SHAPES, EMBLEM_ALIASES, EMBLEM_FOLDERS, EMBLEM_GROUPS, EMBLEM_IDS, GEAR_IDS, JERSEY_CUTS, JERSEY_IDS, MEDAL_IDS, MEDAL_KINDS, PENNANT_IDS, SPORT_IDS, SPORT_NAMES, TROPHY_IDS } from "./emblems/emblem.ids.ts";
export type { AwardId, BallId, CrestId, CrestShape, EmblemGroup, EmblemId, GearId, JerseyCut, JerseyId, MedalId, MedalKind, PennantId, SportEmblemId, SportName, TrophyId } from "./emblems/emblem.ids.ts";
export { EMBLEM_INK, EMBLEM_PAGE, EMBLEM_STYLES, METALS } from "./emblems/emblem.core.ts";
export type { Emblem, EmblemKind, EmblemOptions, EmblemSource, EmblemStyle, EmblemTheme, FrameOptions } from "./emblems/emblem.core.ts";
export { lineup } from "./emblems/ball/ball.index.ts";
export type { LineupOptions } from "./emblems/ball/ball.index.ts";
export type { PieceSize } from "./emblems/ball/ball.core.ts";
export type { Ball, BallKind, Decor, Handle, LatheModel, Poles, Pt, Solid } from "./emblems/emblem.lathe.ts";
export type { MaterialModel } from "./emblems/emblem.material.ts";
export type { FlatModel, Role, Shape } from "./emblems/emblem.shapes.ts";
export { JERSEY_PATTERNS } from "./emblems/emblem.jersey.ts";
export type { JerseyPattern } from "./emblems/emblem.jersey.ts";
