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
  {
    id: "trophy:stanley-cup",
    name: "Stanley Cup",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "champion",
    honours: "The champion of the National Hockey League's playoffs (first given in 1893 as the Dominion Hockey Challenge Cup).",
    first: "1893",
    reference: "File:Stanley Cup, 2015.jpg (Wikimedia Commons, CC BY-SA 4.0) for the profile, with File:Stanley Cup Hockey Hall of Fame Toronto.jpg (CC BY-SA 3.0)",
  },
  {
    id: "trophy:hart-trophy",
    name: "Hart Memorial Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The player judged most valuable to his team.",
    first: "1923-24",
    reference: "File:Hhof hart.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:vezina-trophy",
    name: "Vezina Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The goaltender judged the best.",
    first: "1926-27",
    reference: "File:Hhof vezina.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:norris-trophy",
    name: "James Norris Memorial Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The defenceman who showed the greatest all-round ability.",
    first: "1953-54",
    reference: "File:Hhof norris.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:calder-trophy",
    name: "Calder Memorial Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The best first-year player.",
    first: "1932-33",
    reference: "File:Hhof calder.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:art-ross-trophy",
    name: "Art Ross Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The player who leads the league in points.",
    first: "1947-48",
    reference: "File:Artrosstrophy.jpg (Wikimedia Commons, attribution licence)",
  },
  {
    id: "trophy:conn-smythe-trophy",
    name: "Conn Smythe Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The most valuable player of the playoffs.",
    first: "1964-65",
    reference: "File:Conn Smythe Trophy 2010-04-03.JPG (Wikimedia Commons, CC BY-SA 3.0)",
  },
  {
    id: "trophy:lady-byng-trophy",
    name: "Lady Byng Memorial Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The player who combined the best sportsmanship with a high standard of play.",
    first: "1924-25",
    reference: "File:Lady Byng trophy hhof.jpg (Wikimedia Commons, public domain)",
  },
  {
    id: "trophy:selke-trophy",
    name: "Frank J. Selke Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The forward who is best at defensive play.",
    first: "1977-78",
    reference: "File:Frank Selke Trophy.jpg (Wikimedia Commons, CC BY 3.0) and File:Hhof selke.jpg (CC BY-SA 2.5)",
  },
  {
    id: "trophy:jennings-trophy",
    name: "William M. Jennings Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "team",
    honours: "The goaltender or goaltenders of the team that allowed the fewest goals.",
    first: "1981-82",
    reference: "File:William Jennings Trophy.jpg (Wikimedia Commons, CC BY 3.0) and File:William M. Jennings Trophy (Hockey Hall of Fame, Toronto).jpg (CC BY-SA 2.5)",
  },
  {
    id: "trophy:masterton-trophy",
    name: "Bill Masterton Memorial Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The player who best shows perseverance, sportsmanship and dedication to hockey.",
    first: "1967-68",
    reference: "File:Hhof masterton.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:king-clancy-trophy",
    name: "King Clancy Memorial Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The player who best shows leadership on and off the ice and has made a humanitarian contribution.",
    first: "1987-88",
    reference: "File:King Clancy Trophy.jpg (Wikimedia Commons, CC BY 3.0)",
  },
  {
    id: "trophy:jack-adams-trophy",
    name: "Jack Adams Award",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "coach",
    honours: "The coach judged to have contributed the most to his team's success.",
    first: "1973-74",
    reference: "File:Hhof jack adams.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:presidents-trophy",
    name: "Presidents' Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "team",
    honours: "The team with the best record in the regular season.",
    first: "1985-86",
    reference: "File:Presidents' Trophy.jpg (Wikimedia Commons, CC BY 3.0)",
  },
  {
    id: "trophy:prince-of-wales-trophy",
    name: "Prince of Wales Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "team",
    honours: "The champion of the Eastern Conference (first given in 1925 to the league champion).",
    first: "1925-26",
    reference: "File:Hhof prince of wales.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:campbell-bowl",
    name: "Clarence S. Campbell Bowl",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "team",
    honours: "The champion of the Western Conference.",
    first: "1967-68",
    reference: "File:Hhof campbell.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:rocket-richard-trophy",
    name: "Maurice Richard Trophy",
    sport: "hockey",
    competition: "National Hockey League",
    kind: "player",
    honours: "The player who scores the most goals in the regular season.",
    first: "1998-99",
    reference: "File:Hhof maurice richard.jpg (Wikimedia Commons, CC BY-SA 2.5)",
  },
  {
    id: "trophy:ted-lindsay-award",
    name: "Ted Lindsay Award",
    sport: "hockey",
    competition: "National Hockey League Players' Association",
    kind: "player",
    honours: "The most outstanding player, chosen by the players (first given as the Lester B. Pearson Award).",
    first: "1970-71",
    reference: "File:Ted-lindsay-award.jpg (Wikimedia Commons, CC BY-SA 4.0)",
  },
  {
    id: "trophy:lester-patrick-trophy",
    name: "Lester Patrick Trophy",
    sport: "hockey",
    competition: "National Hockey League and USA Hockey",
    kind: "other",
    honours: "Outstanding service to hockey in the United States.",
    first: "1966-67",
    reference: "File:Lester Patrick Trophy2.jpg (Wikimedia Commons, CC BY 3.0)",
  },
];

/** The facts of a named trophy by its emblem id, or `undefined` for a generic trophy. */
export function namedTrophy(id: string): NamedTrophy | undefined {
  return NAMED_TROPHIES.find((t) => t.id === id);
}
