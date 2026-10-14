// The full registry: every emblem by id, the functions that draw and turn them, and each emblem as a named constant (`AWARD_MEDAL`, `BALL_SOCCER`). Importing this pulls in every drawing; for one emblem import
// its own module (`@johnmorrisdotca/dougu-sports/ball/soccer`), and for the functions alone `@johnmorrisdotca/dougu-sports/emblems`.
export * from "./emblems-entry.ts";
export { ballFrame, emblemFrame } from "./emblems/emblem.api.ts";
export { EMBLEM_TABLE } from "./emblems/emblem.registry.ts";
export { AWARD_MEDAL } from "./emblems/award/medal.ts";
export { BALL_SOCCER } from "./emblems/ball/soccer.ts";
export { VERSION } from "./version.ts";
