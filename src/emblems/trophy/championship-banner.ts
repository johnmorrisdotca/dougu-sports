// A championship banner: a broad, softly waving cloth hung from a pole with a gilt finial, an embroidered border and a short fringe along the bottom. No lettering unless some is given (up to three letters);
// the blank cloth has a ring and a star. Drawn for this package; a generic banner that carries no name, mark or lettering of any event. `tint` is the cloth, `accent` the gold of the trim.
import { circlePath, defineFlat, starPath } from "../emblem.shapes.ts";

const CLOTH = "M11 10C21 6 29 14 39 10S52 8 58 11V46C52 43 46 50 39 47S21 51 11 47Z";
const BORDER = "M14.6 13.6C22 10.6 29 17.4 39 13.8S50 12.4 54.4 14.4V42.6C50 41 46 46 39 43.6S22 47 14.6 44.4Z";
/** The bottom edge of the cloth at `x`: the two cubic curves of CLOTH from the right to the left, sampled. */
const edgeAt = (x: number): number => {
  const cubic = (p: readonly number[], t: number): [number, number] => {
    const u = 1 - t;
    return [u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6], u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7]];
  };
  let best = 47;
  let gap = Infinity;
  for (const c of [[58, 46, 52, 43, 46, 50, 39, 47], [39, 47, 32, 44, 21, 51, 11, 47]]) {
    for (let i = 0; i <= 40; i++) {
      const [px, py] = cubic(c, i / 40);
      if (Math.abs(px - x) < gap) [gap, best] = [Math.abs(px - x), py];
    }
  }
  return best;
};
/** The fringe along the bottom edge, following the cloth's wave. */
const FRINGE = ((): string => {
  let d = "";
  for (let i = 0; i < 12; i++) {
    const x = 12.4 + i * 3.8;
    d += `M${x.toFixed(1)} ${(edgeAt(x + 0.7) - 0.6).toFixed(1)}h1.4v4.6h-1.4z`;
  }
  return d;
})();

const POLE = ["r", "M7 8h4.4v54H7z"] as const;
const FINIAL = ["r", "M9.2 1.4L12.4 8.4H6z"] as const;

/** A fringed banner on a pole. */
export const TROPHY_CHAMPIONSHIP_BANNER = /* @__PURE__ */ defineFlat("trophy:championship-banner", "Championship banner", "優勝旗", "ours", {
  metal: "flat",
  color: "#4b2a6b",
  ribbon: "#d9a620",
  front: [
    ["r", FRINGE],
    ["m", CLOTH],
    ["s", "M11 40C21 44 28 44 39 41S52 40 58 41V46C52 43 46 50 39 47S21 51 11 47Z"],
    ["e", BORDER, "1.8"],
    ["l", "M14 12C20 11 24 13 28 15L14 22z"],
    POLE,
    ["f", "M7.8 10h1v50h-1z", "#f6dc7a"],
    ["r", "M5.2 6.6h8.4v3H5.2z"],
    FINIAL,
    ["f", "M9.2 3.6l1.4 3H8z", "#f6dc7a"],
    ["r", circlePath(9.2, 2.2, 1.7)],
  ],
  back: [
    ["r", FRINGE],
    ["m", CLOTH],
    ["s", "M11 40C21 44 28 44 39 41S52 40 58 41V46C52 43 46 50 39 47S21 51 11 47Z"],
    ["e", BORDER, "1.8"],
    POLE,
    ["r", "M5.2 6.6h8.4v3H5.2z"],
    FINIAL,
  ],
  blank: [
    ["e", circlePath(36, 29, 9.6), "1.6"],
    ["r", starPath(36, 29, 6.4, 2.8)],
  ],
  letters: [36, 29, 17],
  rim: 2,
});
