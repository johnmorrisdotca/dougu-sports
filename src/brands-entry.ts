// The brands entry point: twelve fictional maker marks, ten fictional team logos, and the functions that draw them, place them in another drawing or print them on a ball. The set is the data in `MAKERS` and `TEAMS`.
export { MAKERS, MAKER_IDS, TEAMS, TEAM_IDS } from "./brands/brand.data.ts";
export type { LogoPart, MakerData, MakerId, MakerPalette, PartRole, TeamData, TeamId, TeamPalette } from "./brands/brand.data.ts";
export { makerLogo, makerLogoGroup, teamLogo, teamLogoGroup } from "./brands/brand.render.ts";
export type { LogoLayout, LogoOptions, LogoPlace, MakerLogoOptions } from "./brands/brand.render.ts";
export { makerBall, renderMakerBall } from "./brands/brand.ball.ts";
export type { MakerBallOptions } from "./brands/brand.ball.ts";
export { LETTERS, lettering } from "./brands/brand.letters.ts";
export type { LetterStyle, Lettering } from "./brands/brand.letters.ts";
