// A skater with a stick, for the trophies that carry a figure (docs/likeness.md). The lathe draws bodies of revolution, so the figure is made of them: a torso, two legs, a head and a stick, simplified to the mass they
// add to the silhouette. Placed by the height of its top and of its feet, and coloured by two tones the model names (and `dark`, for the skates and the stick). Imports only the lathe's types.
import type { Ball, Handle, Solid } from "./emblem.lathe.ts";

/** The parts of a skater that stands from `top` to `foot` (heights in the 64 unit box), in the tones `body` and `skin` (names of the model's `tones`), `wide` times as wide as usual, with a stick unless `stick` is false (a figure standing at ease). */
export function skater(top: number, foot: number, body: string, skin: string, wide = 1, stick = true): { solids: Solid[]; handles: Handle[]; balls: Ball[] } {
  const h = foot - top;
  const round = (n: number): number => Math.round(n * 10) / 10;
  const y = (t: number): number => round(top + t * h);
  const w = (t: number): number => round(t * h * 0.01 * wide);
  const torso: Solid = { p: [[y(0.17), w(8), 1, body], [y(0.22), w(17)], [y(0.35), w(19)], [y(0.5), w(16)], [y(0.62), w(13)], [y(0.7), w(12), 1, body]] };
  const leg = (at: readonly [number, number]): Solid => ({ at, p: [[y(0.66), w(6.5), 1, body], [y(0.8), w(5.4)], [y(0.92), w(5)], [y(1), w(7.5), 1, "dark"]] });
  return {
    solids: [torso, leg([w(7), -90]), leg([w(7), 90])],
    handles: stick
      ? [
          { a: 90, w: w(4), tone: body, pts: [[w(14), y(0.3)], [-w(3), y(0.45)], [-w(10), y(0.5)]] },
          { a: 90, w: w(3), tone: "dark", pts: [[-w(30), y(1)], [-w(8), y(0.62)], [w(14), y(0.34)]] },
        ]
      : [],
    balls: [{ kind: "plain", cy: y(0.09), r: w(9), tone: skin }],
  };
}
