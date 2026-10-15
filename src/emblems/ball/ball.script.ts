// An original cursive script, drawn for this package: a pen's centre line through hand-placed waypoints, joined letter to letter at the baseline, with the pen's thick down strokes and hairline up
// strokes made by the caller from each segment's direction (`tier`). No font file, no licensed outline and no maker's lettering: every waypoint below was placed by hand, in a grid where the x-height is 10,
// the ascender 20 and the descender -10, with y up. A glyph enters at (0, 0) and leaves at (adv, 0), so the next one starts where it stops. Imports nothing.

type Pt = readonly [number, number];

/** One letter: the advance to the next one and the strokes, each a list of waypoints the pen passes through ("x,y x,y ..."). The first stroke carries the joining. A `;` starts a new stroke (a lifted pen). */
interface Letter {
  adv: number;
  d: string;
}

const LOWER: Readonly<Record<string, Letter>> = {
  a: { adv: 8.4, d: "0,0 1.6,2.6 3.6,6.2 5.2,8.6 6.4,9.6 4.6,10.4 2.4,9.2 1.2,6 1.5,2.4 3.4,0.5 5.2,1.4 6.3,4.4 6.7,9.4 6.7,5 6.8,1.4 7.6,0.2 8.4,0" },
  b: { adv: 8.6, d: "0,0 1.6,3.5 3.4,9 4.6,15.5 4.6,19.5 3.8,20.8 2.8,19.4 2.9,15 3.6,9 4,3.5 4.2,0.8 4.8,3.2 6.5,6.6 7.8,5.6 7.6,2.2 5.8,0.4 3.8,1.4 3.3,3.4 4.3,0.3 7.2,0 8.6,0" },
  c: { adv: 7.4, d: "0,0 1.8,2.8 3.8,7 5.8,9.4 4.8,10.2 2.6,9 1.2,5.8 1.6,2.2 3.4,0.3 5.4,0.8 6.6,1.8 7.4,0" },
  d: { adv: 9, d: "0,0 1.6,2.6 3.6,6.2 5.2,8.6 6.4,9.6 4.6,10.4 2.4,9.2 1.2,6 1.5,2.4 3.4,0.5 5.2,1.4 6.4,4.4 7.2,11 8,17.5 8,20.2 7.1,20.8 6.5,19.3 6.7,13 7,6 7.1,1.4 8,0.2 9,0" },
  e: { adv: 7.6, d: "0,0 0.9,2.4 1.7,5 3.2,5.8 4.9,5.7 5.4,8.2 4.2,10.1 2.6,9.8 1.2,7.6 1.1,3.8 2.1,1.2 3.8,0.2 5.6,0.9 7,0.2 7.6,0" },
  f: { adv: 6.4, d: "0,0 1.4,3.5 3.2,9.5 4.8,16.5 5.4,19.6 4.4,20.8 3.2,19 3.5,14 3.6,6 3.4,-2.4 2.2,-8.4 1,-9.6 0,-8 1,-5.2 3.6,-3 5.4,0.4 6.4,0 ; 0.6,10.2 4.4,10.8 7.2,10.2" },
  g: { adv: 8.6, d: "0,0 1.6,2.6 3.6,6.2 5.2,8.6 6.4,9.6 4.6,10.4 2.4,9.2 1.2,6 1.5,2.4 3.4,0.5 5.2,1.4 6.4,4.4 6.8,9.6 6.4,3 6.2,-4.6 4.8,-9 2.4,-9.8 1,-8.2 2,-6.8 5,-6 7,-3.6 8,-0.5 8.6,0" },
  h: { adv: 8.6, d: "0,0 1.6,3.5 3.4,9 4.6,15.5 4.6,19.5 3.8,20.8 2.8,19.4 2.9,15 3.6,9 4,3.5 4.1,0.4 4.6,3.6 6,7.8 7.2,8 7.5,5 7.1,1.4 7.6,0.2 8.6,0" },
  i: { adv: 4.8, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.8,4.4 2.6,1 3.2,0.2 4.8,0 ; 3.2,12.8 3.2,13.4" },
  j: { adv: 4.8, d: "0,0 1.4,3.4 2.4,8.2 3,9.6 3.2,3 3,-4.6 1.6,-9 0.2,-9.8 -0.8,-8.4 0.6,-6.8 2.6,-4 3.8,-0.5 4.8,0 ; 3.6,12.8 3.6,13.4" },
  k: { adv: 8.2, d: "0,0 1.6,3.5 3.4,9 4.6,15.5 4.6,19.5 3.8,20.8 2.8,19.4 2.9,15 3.6,9 4,3.5 4.1,0.4 4.4,3.2 5,6.2 6.6,8 7,6.4 5.8,4.2 4.4,3.6 5.6,2.6 6.8,0.4 8.2,0" },
  l: { adv: 4.8, d: "0,0 1.6,3.5 3.2,9.5 4.2,15.5 4.4,19.4 3.6,20.8 2.6,19.4 2.7,15 3.2,9 3.5,3.5 3.6,0.6 4.1,0.2 4.8,0" },
  m: { adv: 12.8, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.9,5.5 2.8,1 3.2,3.6 4.4,8 5.6,8.4 6.1,5.2 6,1 6.4,3.6 7.6,8 8.8,8.4 9.4,5.2 9.2,1.2 9.9,0.2 10.8,0.6 12.8,0" },
  n: { adv: 8.4, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.9,5.5 2.8,1 3.2,3.6 4.4,8 5.6,8.4 6.2,5.2 6,1.2 6.8,0.2 8.4,0" },
  o: { adv: 7.6, d: "0,0 1.8,2.8 3.4,6.4 4.4,8.8 3.4,10.2 1.8,8.4 1.2,5.2 1.9,1.8 3.8,0.3 5.6,1.8 5.7,5.4 4.8,8.6 5.2,10 6.4,9.4 7.6,8.5" },
  p: { adv: 8.6, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.9,2 2.4,-4.6 1.8,-9.6 ; 2.8,5 3.4,8.6 5.2,10.2 7.2,9 7.6,5.4 6.4,2 4.2,0.4 2.8,1.4 2.5,3.4 4.4,0.4 6.8,0 8.6,0" },
  q: { adv: 8.4, d: "0,0 1.6,2.6 3.6,6.2 5.2,8.6 6.4,9.6 4.6,10.4 2.4,9.2 1.2,6 1.5,2.4 3.4,0.5 5.2,1.4 6.4,4.4 6.8,9.6 6.6,2 6.2,-5 6.4,-9.4 7.2,-9.8 8.4,-8.4" },
  r: { adv: 7, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.9,5.5 2.8,1.6 3.4,4.6 4.6,8.4 5.8,9.6 6.4,8.4 5.4,7.6 6.2,8.4 7,8" },
  s: { adv: 6.6, d: "0,0 1.2,2.4 2.8,6 4,8.6 4.6,9.8 3.6,9.8 3.5,7.6 4.8,5.8 5,3.6 4.2,1.4 2.8,0.4 1.5,0.8 1.6,1.8 3.2,1.4 5,0.5 6.6,0" },
  t: { adv: 6.4, d: "0,0 1.4,3.4 2.6,8.5 3.2,13 3.4,16.8 3,16.4 3,10 2.8,3.2 3.4,0.6 4.6,0.4 6.4,0 ; 0.6,9.4 3,9.8 5.8,9.2" },
  u: { adv: 8.4, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.7,5.5 2.6,2.2 3.4,0.4 5,0.6 6.4,3.6 7,9.6 6.8,4.6 6.8,1.2 7.6,0.2 8.4,0" },
  v: { adv: 7.6, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.7,5.5 3,2.2 4,0.4 5.2,1.6 6.4,6 7,9 6.4,10 7.6,8.4" },
  w: { adv: 10.4, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.7,5.5 3,2.2 4,0.4 5,2.4 5.4,6 5.5,2.2 6.6,0.4 7.8,2.4 8.6,6 9.2,9 8.8,10 10.4,8.4" },
  x: { adv: 7.4, d: "0,0 1.6,3 3.4,7 5,9.6 4.2,10.4 3,9 3.6,5.6 4.4,2.4 4,0.4 2.6,0.2 2,1.4 3.4,2.2 5.2,4.6 6.4,8.6 6.8,10 7.4,9" },
  y: { adv: 8.2, d: "0,0 1.4,3.4 2.4,8.2 2.8,9.6 2.7,5.5 3,2.2 4,0.4 5.4,2.4 6.4,6 6.8,9.6 6.4,2.6 5.6,-4.6 4,-9 2,-9.8 0.8,-8.4 2,-7 4.6,-5.6 7,-3.4 8.2,0" },
  z: { adv: 7, d: "0,0 1.4,2.6 2.6,6.6 3.4,9 4.4,10 5.8,9.4 3.8,6.4 2.2,3.4 2,0.4 3,-1.6 4.8,-3.6 4.2,-6 2.8,-6.6 2,-5.4 3.4,-4 5.6,-2.2 6.4,0 7,0" },
};

/** Capitals drawn for their own: the rest of the capitals are the small letter set tall (see `scriptStrokes`). */
const UPPER: Readonly<Record<string, Letter>> = {
  B: { adv: 14, d: "0,0 1.6,6 3.2,12 5,18 6.2,22.4 7,20 6.2,12 5.4,5 4.6,0.4 6,6.6 9.6,12 13,13.6 13.6,10.6 11,7.6 7,6.4 6,6.2 9,5.6 12.2,3.4 12.8,0.6 11,-1.4 7.8,-1.6 4,0.2 1.4,1 0,0" },
  S: { adv: 11, d: "0,0 2.4,5 5,10 7.6,14.4 9.4,17 8.2,18.8 6,17.2 6.2,14 8.4,11 9.6,7.2 8.4,3 5.8,0.8 3,0.4 1.8,2 3.4,3 6.6,1.6 9,0.4 11,0" },
};

/** One piece of a word's centre line: its points in the grid, and `tier` 0 (hairline), 1 (medium) or 2 (down stroke), for each segment. */
export interface ScriptRun {
  pts: Pt[];
  /** One entry per segment (`pts.length - 1`). */
  tier: number[];
}

const SLANT = 0.3;

/** A smooth curve through waypoints (a Catmull-Rom spline), as points about 0.8 apart. */
function through(wp: readonly Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i + 1 < wp.length; i++) {
    const p0 = wp[Math.max(0, i - 1)] as Pt, p1 = wp[i] as Pt, p2 = wp[i + 1] as Pt, p3 = wp[Math.min(wp.length - 1, i + 2)] as Pt;
    const n = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 0.8));
    for (let j = 0; j < n; j++) {
      const t = j / n, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(wp[wp.length - 1] as Pt);
  return out;
}

/** The letter for a character: a drawn capital, a small letter (a capital with no drawing of its own is that letter set 1.7 times as tall), or `undefined`. */
function letterOf(ch: string): { letter: Letter; k: number } | undefined {
  if (Object.hasOwn(UPPER, ch)) return { letter: UPPER[ch] as Letter, k: 1 };
  const low = ch.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (low.length !== 1 || !Object.hasOwn(LOWER, low)) return undefined;
  return { letter: LOWER[low] as Letter, k: ch === ch.toUpperCase() && ch !== ch.toLowerCase() ? 1.7 : 1 };
}

/** The width of a word in the grid. */
export function scriptWidth(text: string): number {
  let x = 0;
  for (const ch of [...text]) {
    if (ch === " ") x += 5;
    else {
      const l = letterOf(ch);
      if (l !== undefined) x += l.letter.adv * l.k;
    }
  }
  return x;
}

/**
 * A word as pen runs in the grid (y up, the baseline at 0, the left end of the first letter at 0), leaning right, each run with the thickness tier of its segments. Characters with no letter are left out;
 * a space is a gap.
 */
export function scriptRuns(text: string): ScriptRun[] {
  const runs: ScriptRun[] = [];
  let x = 0;
  for (const ch of [...text]) {
    if (ch === " ") {
      x += 5;
      continue;
    }
    const l = letterOf(ch);
    if (l === undefined) continue;
    for (const stroke of l.letter.d.split(";")) {
      const wp = stroke.trim().split(/\s+/).map((p) => p.split(",").map(Number) as unknown as Pt);
      const pts = through(wp).map(([px, py]): Pt => [x + px * l.k + SLANT * py * l.k, py * l.k]);
      const tier = pts.slice(1).map((p, i) => {
        const a = pts[i] as Pt;
        const dx = p[0] - a[0], dy = p[1] - a[1];
        const down = Math.max(0, -dy / (Math.hypot(dx, dy) || 1));
        return down > 0.62 ? 2 : down > 0.2 ? 1 : 0;
      });
      runs.push({ pts, tier });
    }
    x += l.letter.adv * l.k;
  }
  return runs;
}
