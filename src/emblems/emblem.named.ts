// The trophies that are drawn as a likeness of one real trophy (docs/likeness.md): which trophy each is, what it honours, when it was first given and what the drawing was measured on. Names and facts only; the drawings are
// in `src/emblems/trophy/` and carry no lettering, mark or logo. Imports only the ids, so a page that wants the facts and one drawing takes no other drawing.
import type { TrophyId } from "./emblem.ids.ts";

/** What a named trophy is given for: the winner of a competition, a player, a coach or manager, a team, an executive, or something else. */
export type NamedKind = "champion" | "player" | "coach" | "team" | "executive" | "other";

/** One real trophy that an emblem is a likeness of. */
export interface NamedTrophy {
  /** The emblem that draws it. */
  readonly id: TrophyId;
  /** The trophy's own name, in English, as it is usually written. */
  readonly name: string;
  /** The sport, in lower case: `hockey`, `basketball`, `baseball`, `football`, `soccer`... */
  readonly sport: string;
  /** The competition or league that gives it, as plain words, and no mark or logo. */
  readonly competition: string;
  readonly kind: NamedKind;
  /** What it honours, in a sentence. */
  readonly honours: string;
  /** When it was first awarded: a year, or a season (`1917-18`). */
  readonly first: string;
  /** What the drawing was measured on: a photograph (or a few) looked at and never copied, with its licence status. */
  readonly reference: string;
}

/** Every named trophy, in the order they were drawn. */
export const NAMED_TROPHIES: readonly NamedTrophy[] = [
  {
    id: "trophy:paterson-cup",
    name: "Paterson Cup",
    sport: "hockey",
    competition: "Pacific Coast Hockey Association",
    kind: "champion",
    honours: "The champion of the Pacific Coast Hockey Association, 1912 to 1924.",
    first: "1912",
    reference: "A 1912 studio photograph of the cup on its base (hockeygods.com, image 10889), looked at and measured; licence not ours, so nothing of it is kept.",
  },
];

/** The facts of a named trophy by its emblem id, or `undefined` for a generic trophy. */
export function namedTrophy(id: string): NamedTrophy | undefined {
  return NAMED_TROPHIES.find((t) => t.id === id);
}
