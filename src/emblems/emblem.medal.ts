// The medals and place badges: a gold, silver or bronze disc with a bevelled rim and a star, on a ribbon of five stripes, and a plain badge with a numeral. Shared by the medal modules, which each call it once;
// the drawing comes from the flat renderer. Imports only the flat renderer and the core.
import type { Emblem, Metal } from "./emblem.core.ts";
import { type FlatModel, type Shape, circlePath, defineFlat, starPath } from "./emblem.shapes.ts";

/** The colours of the ribbon's stripes, in the order of the five colours a games uses; the ribbon carries no rings. */
const STRIPES = ["#0085c7", "#f4c300", "#1b1b1b", "#009f3d", "#df0024"] as const;

const lerp = (a: number, b: number, t: number): number => Math.round((a + (b - a) * t) * 10) / 10;

/** The two straps of the ribbon, crossing above the clasp, each cut into the five stripes. */
function ribbon(): Shape[] {
  const out: Shape[] = [];
  STRIPES.forEach((colour, k) => {
    const [t0, t1] = [k / 5, (k + 1) / 5];
    // The left strap runs from the top left to the clasp, the right one the other way.
    out.push(["f", `M${lerp(10, 25, t0)} 2L${lerp(10, 25, t1)} 2L${lerp(26, 38, t1)} 28L${lerp(26, 38, t0)} 28z`, colour]);
    out.push(["f", `M${lerp(54, 39, t0)} 2L${lerp(54, 39, t1)} 2L${lerp(38, 26, t1)} 28L${lerp(38, 26, t0)} 28z`, colour]);
  });
  return out;
}

/** A medal on a ribbon. */
export function defineMedal(id: string, en: string, ja: string, metal: Extract<Metal, "gold" | "silver" | "bronze">): Emblem<FlatModel> {
  const disc: Shape[] = [
    ["m", "M27.5 23h9v8h-9z"],
    ["o", circlePath(32, 43, 17.5)],
    ["e", circlePath(32, 43, 15.2), "1.8"],
  ];
  const front: readonly Shape[] = [
    ...ribbon(),
    ...disc,
    ["m", starPath(32, 43, 9, 3.9)],
    ["l", "M19.2 40a13.4 13.4 0 0 1 9.4-10.4 14 14 0 0 0-6.6 12.6z"],
  ];
  const back: readonly Shape[] = [...disc, ["e", circlePath(32, 43, 8.4), "1.4"]];
  return defineFlat(id, en, ja, "ours", { metal, front, back, rim: 3 });
}

/** The numerals 1, 2 and 3 as strokes. */
const NUMERALS = { 1: "M26 28l7-5v20", 2: "M25 28c1-9 15-9 15 0 0 6-14 9-15 15h16", 3: "M25 26c4-6 14-4 13 2-1 5-6 6-9 6 3 0 9 1 9 7 0 8-14 9-16 2" } as const;

/** A plain badge for a place: a bevelled disc with its numeral. */
export function definePlace(id: string, en: string, ja: string, place: 1 | 2 | 3, metal: Extract<Metal, "gold" | "silver" | "bronze">): Emblem<FlatModel> {
  const base: Shape[] = [["o", circlePath(32, 32, 27.5)], ["e", circlePath(32, 32, 24.2), "2.2"]];
  return defineFlat(id, en, ja, "ours", { metal, front: [...base, ["d", NUMERALS[place]], ["l", "M10.4 28a22 22 0 0 1 16.6-17 24 24 0 0 0-11 22z"]], back: [...base, ["e", circlePath(32, 32, 14), "1.6"]], rim: 3 });
}
