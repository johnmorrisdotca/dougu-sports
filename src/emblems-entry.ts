// The emblems entry point: `renderEmblem(id, options)` draws any emblem from its id, and the ids and types say which there are. Nothing here imports a single drawing's module directly, so for one
// emblem and nothing else import its own module (`@johnmorrisdotca/dougu-sports/ball/soccer`).
export { EMBLEM_DESCRIPTIONS } from "./emblems/emblem.descriptions.ts";
export type { EmblemDescription } from "./emblems/emblem.descriptions.ts";
export { EMBLEMS, crest, emblemInfo, emblemModel, emblemName, emblemOf, emblemSvg, isBallId, isEmblemId, medal, parseEmblem, pennant, renderEmblem, sportIcon } from "./emblems/emblem.api.ts";
export type { CrestOptions, EmblemInfo, EmblemRef, PennantOptions } from "./emblems/emblem.api.ts";
export { AWARD_IDS, BALL_IDS, CREST_IDS, CREST_SHAPES, EMBLEM_ALIASES, EMBLEM_FOLDERS, EMBLEM_GROUPS, EMBLEM_IDS, GEAR_IDS, JAPANESE_IDS, MEDAL_IDS, MEDAL_KINDS, PENNANT_IDS, PUCK_IDS, SPORT_IDS, SPORT_NAMES, TROPHY_IDS } from "./emblems/emblem.ids.ts";
export type { AwardId, BallId, CrestId, CrestShape, EmblemGroup, EmblemId, GearId, JapaneseId, MedalId, MedalKind, PennantId, PuckId, SportEmblemId, SportName, TrophyId } from "./emblems/emblem.ids.ts";
export { EMBLEM_INK, EMBLEM_PAGE, EMBLEM_STYLES, METALS } from "./emblems/emblem.core.ts";
export type { Emblem, EmblemKind, EmblemLocale, EmblemOptions, EmblemSource, EmblemStyle, EmblemTheme, FrameOptions } from "./emblems/emblem.core.ts";
export { lineup } from "./emblems/ball/ball.index.ts";
export type { LineupOptions } from "./emblems/ball/ball.index.ts";
export type { Backnumber, PieceSize } from "./emblems/ball/ball.core.ts";
export type { Ball, BallKind, Decor, Handle, LatheModel, Poles, Pt, Solid } from "./emblems/emblem.lathe.ts";
export type { FlatModel, Role, Shape } from "./emblems/emblem.shapes.ts";
export { emblemSprite } from "./emblems/emblem.sprite.ts";
export type { Sprite, SpriteOptions, UseOptions } from "./emblems/emblem.sprite.ts";
export { emblemDataUri } from "./emblems/emblem.uri.ts";
export type { DataUriOptions } from "./emblems/emblem.uri.ts";
export { sportEquipment } from "./emblems/emblem.equipment.ts";
export type { SportEquipment } from "./emblems/emblem.equipment.ts";
export { awardCase, podium } from "./emblems/emblem.display.ts";
export type { AwardCaseOptions, AwardItem, DisplayOptions, PodiumOptions, PodiumPlace } from "./emblems/emblem.display.ts";
export type { BallDecal, BallMark, BallPaint, BallScript, BallSpots, BallStamp, Spot } from "./emblems/ball/ball.print.ts";
export type { FaceColors, FlagRenderer, FlagRequest, FlagShape, PuckDesign, PuckFace } from "./emblems/ball/ball.face.ts";
