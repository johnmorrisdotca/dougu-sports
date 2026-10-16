// The lettering of the maker wordmarks: our own alphabet of capitals, drawn as strokes. Each letter is a few polylines on a unit box (x across, y down, 0 to 1); a style sets the weight, how the corners are
// treated (sharp, rounded or cut), the width, the spacing, the slant and the line ends, so that each maker's wordmark has a lettering of its own from one set of skeletons. It is not a copy of any typeface.

/** How a wordmark is lettered. */
export interface LetterStyle {
  /** Stroke weight, in units of a letter 100 high. */
  weight: number;
  /** Corner treatment: `round` (a curve), `cut` (a straight cut) or `sharp`. */
  corner: "round" | "cut" | "sharp";
  /** The size of the corner, in the same units. */
  radius: number;
  /** Width of a letter, 1 being 60 units across. */
  width: number;
  /** Space between letters, in the same units. */
  gap: number;
  /** Lean to the right, in degrees (negative leans left). */
  slant: number;
  /** The ends of a stroke. */
  cap: "butt" | "round" | "square";
}

type Pt = readonly [number, number];
type Stroke = readonly Pt[];
interface Skeleton {
  strokes: readonly Stroke[];
  /** The closed outline of a letter, as one of the strokes: its index. */
  closed?: readonly number[];
  /** Width of this letter against the usual one. */
  wide?: number;
}

const BOX: readonly Pt[] = [[0, 0], [1, 0], [1, 1], [0, 1]];

const SKELETONS: Readonly<Record<string, Skeleton>> = {
  A: { strokes: [[[0, 1], [0.5, 0], [1, 1]], [[0.2, 0.68], [0.8, 0.68]]], wide: 1.1 },
  B: { strokes: [[[0, 0], [0, 1]], [[0, 0], [0.88, 0], [0.88, 0.5], [0, 0.5]], [[0.88, 0.5], [1, 0.5], [1, 1], [0, 1]]] },
  C: { strokes: [[[1, 0], [0, 0], [0, 1], [1, 1]]] },
  D: { strokes: [[[0, 0], [0.62, 0], [1, 0.34], [1, 0.66], [0.62, 1], [0, 1]]], closed: [0] },
  E: { strokes: [[[1, 0], [0, 0], [0, 1], [1, 1]], [[0, 0.5], [0.8, 0.5]]] },
  F: { strokes: [[[1, 0], [0, 0], [0, 1]], [[0, 0.5], [0.8, 0.5]]] },
  G: { strokes: [[[1, 0.16], [1, 0], [0, 0], [0, 1], [1, 1], [1, 0.55], [0.55, 0.55]]] },
  H: { strokes: [[[0, 0], [0, 1]], [[1, 0], [1, 1]], [[0, 0.5], [1, 0.5]]] },
  I: { strokes: [[[0.5, 0], [0.5, 1]]], wide: 0 },
  J: { strokes: [[[1, 0], [1, 0.78], [0.78, 1], [0.22, 1], [0, 0.78]]] },
  K: { strokes: [[[0, 0], [0, 1]], [[1, 0], [0.08, 0.56], [1, 1]]] },
  L: { strokes: [[[0, 0], [0, 1], [1, 1]]] },
  M: { strokes: [[[0, 1], [0, 0], [0.5, 0.62], [1, 0], [1, 1]]], wide: 1.3 },
  N: { strokes: [[[0, 1], [0, 0], [1, 1], [1, 0]]] },
  O: { strokes: [BOX], closed: [0] },
  P: { strokes: [[[0, 1], [0, 0], [1, 0], [1, 0.55], [0, 0.55]]] },
  Q: { strokes: [BOX, [[0.6, 0.62], [1, 1]]], closed: [0] },
  R: { strokes: [[[0, 1], [0, 0], [1, 0], [1, 0.5], [0, 0.5]], [[0.44, 0.5], [1, 1]]] },
  S: { strokes: [[[1, 0], [0, 0], [0, 0.5], [1, 0.5], [1, 1], [0, 1]]] },
  T: { strokes: [[[0, 0], [1, 0]], [[0.5, 0], [0.5, 1]]] },
  U: { strokes: [[[0, 0], [0, 1], [1, 1], [1, 0]]] },
  V: { strokes: [[[0, 0], [0.5, 1], [1, 0]]], wide: 1.1 },
  W: { strokes: [[[0, 0], [0.25, 1], [0.5, 0.3], [0.75, 1], [1, 0]]], wide: 1.5 },
  X: { strokes: [[[0, 0], [1, 1]], [[1, 0], [0, 1]]], wide: 1.05 },
  Y: { strokes: [[[0, 0], [0.5, 0.5], [1, 0]], [[0.5, 0.5], [0.5, 1]]] },
  Z: { strokes: [[[0, 0], [1, 0], [0, 1], [1, 1]]] },
};

/** Letters whose right side is open at the top or the bottom, and letters whose sides lean in: a pair of the two is set closer. */
const OPEN = "LTFPYRVAW";
const LEAN = "AVWYT";

/** The letters the alphabet draws. */
export const LETTERS = Object.freeze(Object.keys(SKELETONS));

const round1 = (value: number): string => String(Math.round(value * 10) / 10 + 0);

/** One stroke as a path: corners rounded or cut by `radius`, never by more than half a side. */
function strokePath(points: readonly (readonly [number, number])[], closed: boolean, style: LetterStyle): string {
  const n = points.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const end = !closed && (i === 0 || i === n - 1);
    if (end || style.corner === "sharp" || style.radius <= 0) {
      d += `${i === 0 ? "M" : "L"}${round1(p[0])} ${round1(p[1])}`;
      continue;
    }
    const a = points[(i + n - 1) % n];
    const b = points[(i + 1) % n];
    const l1 = Math.hypot(a[0] - p[0], a[1] - p[1]);
    const l2 = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const t1 = Math.min(style.radius / l1, 0.5);
    const t2 = Math.min(style.radius / l2, 0.5);
    const s = [p[0] + (a[0] - p[0]) * t1, p[1] + (a[1] - p[1]) * t1];
    const e = [p[0] + (b[0] - p[0]) * t2, p[1] + (b[1] - p[1]) * t2];
    d += `${i === 0 ? "M" : "L"}${round1(s[0])} ${round1(s[1])}`;
    d += style.corner === "round" ? `Q${round1(p[0])} ${round1(p[1])} ${round1(e[0])} ${round1(e[1])}` : `L${round1(e[0])} ${round1(e[1])}`;
  }
  return closed ? `${d}Z` : d;
}

/** A word laid out: the path of all its letters (stroked, not filled) and the box it fills. */
export interface Lettering {
  d: string;
  width: number;
  height: number;
  /** The stroke weight the path is to be drawn with. */
  weight: number;
}

/** The unit height the lettering is drawn at. */
export const LETTER_HEIGHT = 100;

/** A word in capitals, in a style. A letter the alphabet does not have is left out. The box includes the stroke's half weight and the room a lean needs. */
export function lettering(word: string, style: LetterStyle): Lettering {
  const lean = Math.tan((style.slant * Math.PI) / 180);
  const half = style.weight / 2;
  const top = half + (style.cap === "square" ? half : 0);
  const pad = half + (style.cap === "square" ? half * 0.42 : 0) + Math.abs(lean) * (LETTER_HEIGHT / 2);
  let x = pad;
  let before = "";
  const parts: string[] = [];
  for (const char of word.toUpperCase()) {
    const skeleton = SKELETONS[char];
    if (skeleton === undefined) continue;
    const w = 60 * style.width * (skeleton.wide ?? 1);
    if (before !== "" && OPEN.includes(before) && LEAN.includes(char) && before !== char) x -= 0.3 * 60 * style.width;
    before = char;
    skeleton.strokes.forEach((stroke, index) => {
      const points = stroke.map(([u, v]) => [x + u * w + (LETTER_HEIGHT / 2 - v * LETTER_HEIGHT) * lean, top + v * LETTER_HEIGHT] as [number, number]);
      parts.push(strokePath(points, skeleton.closed?.includes(index) === true, style));
    });
    x += w + style.weight + style.gap;
  }
  return { d: parts.join(""), width: x - style.gap - style.weight + pad, height: LETTER_HEIGHT + 2 * top, weight: style.weight };
}
