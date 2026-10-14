// Every emblem by id. A table keyed by the id union, so a missing or extra emblem is a type error. Importing this file pulls in every drawing; importing one drawing's module does not.
import type { Emblem } from "./emblem.core.ts";
import type { EmblemId } from "./emblem.ids.ts";
import { AWARD_MEDAL } from "./award/medal.ts";
import { BALL_SOCCER } from "./ball/soccer.ts";

/** Every emblem, by id. */
export const EMBLEM_TABLE: Readonly<Record<EmblemId, Emblem>> = {
  "award:medal": AWARD_MEDAL,
  "ball:soccer": BALL_SOCCER,
};
