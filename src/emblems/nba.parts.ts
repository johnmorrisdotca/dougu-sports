// The flared gold trumpet that stands under the ball of the NBA's conference finals MVP trophies and the Finals MVP trophy, and the ball and tones they share. Not an emblem: the trophies that use it import it.
// Measured on a photograph of the conference finals MVP trophies standing side by side (docs/likeness.md): the flange is wider than the body under it, the body narrows in a long smooth curve to a waist a little under
// half the flange's width, flares into a small dish, and stands on a black ring, a gold band and a black foot.
// The two bases and the cradle of the NBA's conference champions' trophies, shared by the 2022 pair (the Oscar Robertson and Bob Cousy trophies, gold and black) and the pair given from 2001 to 2021 (the same shapes, the
// bands of the base in polished silver). Not an emblem: the four trophies import it. Measured on a photograph of the 2022 pair standing side by side (docs/likeness.md), in the 64 unit box.
import type { Pt } from "./emblem.lathe.ts";

/** The tones the NBA's postseason trophies share: the ball's silver (and the frosted silver of the earlier conference balls), the black of the rings and feet, and the pale gold of the etched net. */
export const NBA_TONES = { silver: "#d3d8df", frost: "#e6e9ec", dark: "#16171b", etch: "#f0cf66" } as const;

/** The trumpet from its flange down to its foot, in the 64 unit box: the flange's rim is at 24.5 and the foot ends at 61.4. */
export const TRUMPET: readonly Pt[] = [
  [23, 10.3, 1], [23.2, 11.1], [24.3, 11.25, 1], [24.6, 11.2], [24.6, 9.95],
  [26, 9.7], [28, 9.15], [30, 8.65], [32, 8.15], [34, 7.65], [36, 7.1], [38, 6.55], [40, 6.05], [42, 5.6], [44, 5.15], [46, 4.8], [48, 4.5], [49.4, 4.4], [50.6, 4.55], [51.8, 5.15], [52.8, 6.3], [53.7, 7.6], [54.4, 8.4], [54.8, 8.6, 1],
  [54.8, 8.9, 1, "dark"], [56.4, 8.9, 1, "dark"], [56.4, 9.35, 1], [59.8, 9.4, 1], [59.8, 9.5, 1, "dark"], [61.4, 9.5, 1, "dark"],
];

/** The ball's ring of the Western trophy: four bands that cross under the ball and rise round its lower half (the real ones are two rings). */
export const WEST_BAND = [[0, 38.2], [4.2, 37.6], [8.4, 36.2], [12, 33.6], [14.6, 30.4], [15.5, 28.8]] as const;

/** The Western base from the gold dome down: a black ring, a thin band, a flared black drum, a tall flared skirt and a black foot. In the earlier pair the thin band is black and the skirt polished silver. */
export const westBase = (earlier: boolean): readonly Pt[] => [
  [38, 3, 1], [38.5, 8.6], [39.6, 11], [40, 11.4, 1],
  [40, 13.4, 1, "dark"], [42.2, 13.8, 1, "dark"],
  [42.2, 14.3, 1, earlier ? "dark" : "main"], [44.8, 14.6, 1, earlier ? "dark" : "main"],
  [44.8, 15.3, 1, "dark"], [46, 16], [48, 17.6], [50.4, 20, 1, "dark"],
  [50.4, 20.2, 1, earlier ? "silver" : "main"], [53, 21], [56, 22], [60.6, 23, 1, earlier ? "silver" : "main"],
  [60.6, 23.3, 1, "dark"], [62.4, 23.4, 1, "dark"],
];

/** The Eastern base from its plate down: a plate, three black tiers, a tall drum and a black foot. In the earlier pair the plate and the drum are polished silver. */
export const eastBase = (earlier: boolean): readonly Pt[] => {
  const light = earlier ? "silver" : "main";
  return [
    [40.6, 10.2, 1, light], [42.2, 10.4, 1, light],
    [42.2, 12.2, 1, "dark"], [43.8, 12.2, 1, "dark"], [43.8, 14, 1, "dark"], [45.4, 14, 1, "dark"], [45.4, 15.8, 1, "dark"], [47, 15.8, 1, "dark"],
    [47, 19.2, 1, light], [58.8, 19.5, 1, light],
    [58.8, 20, 1, "dark"], [60.4, 20.6, 1, "dark"], [62.5, 20.9, 1, "dark"],
  ];
};

/** One of the three posts of the Eastern trophy and its stem and dish, as solids (the posts stand at 0, 120 and 240 degrees). */
export const eastTop = () => {
  const post = (deg: number) => ({ at: [12.2, deg] as const, p: [[33.4, 0.9, 1], [40.6, 0.9, 1]] as const });
  return [{ p: [[37.6, 1.2, 1], [40.7, 1.4, 1]] as const }, { open: true, p: [[33.2, 10, 1], [34, 9.7], [36, 7.2], [37.6, 3.2], [38.2, 1.3, 1]] as const }, post(0), post(120), post(240)];
};
