// A made-up signature: a squiggle drawn by a seeded pen, so the same seed always gives the same stroke and no seed is anyone's real hand. It is a first name and a surname, each a tall capital with a loop and a run
// of humps, joined by a smooth curve, and a flourish under the whole. The path lies in a box 1 wide and about 0.4 tall about the origin; the face scales, turns and inks it. Imports nothing.

/** A small seeded random generator (mulberry32) over any seed: a number, or text hashed first. */
export function seeded(seed: number | string): () => number {
  let h = 2166136261;
  for (const ch of String(seed)) h = Math.imul(h ^ (ch.codePointAt(0) as number), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = readonly [number, number];
const f = (v: number): string => (Math.round(v * 1000) / 1000 + 0).toString();

/** A smooth curve through the points (Catmull-Rom turned into cubic Beziers). */
function smooth(pts: readonly Pt[]): string {
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)] as Pt, p1 = pts[i] as Pt, p2 = pts[i + 1] as Pt, p3 = pts[Math.min(pts.length - 1, i + 2)] as Pt;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** One word of a signature as a cursive run: a pen that goes round in loops while it moves right, so the strokes are the looped humps of joined writing. The first loop (the capital) is the tallest. */
function word(rand: () => number, x0: number, width: number, humps: number): Pt[] {
  const pts: Pt[] = [];
  const per = 9;
  const steps = (humps + 1) * per;
  let env = 1;
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const phase = (i / per) * Math.PI * 2;
    const hump = Math.floor(i / per);
    if (i % per === 0) env = hump === 0 ? 1.7 : 0.35 + rand() * 0.75;
    // The loop: x is pushed back as y rises, so the pen doubles back on itself at the top.
    const rise = (1 - Math.cos(phase)) / 2;
    const x = x0 + width * u - Math.sin(phase) * 0.045 * env;
    const y = -rise * 0.17 * env + 0.03 * Math.sin(phase * 0.5);
    pts.push([x, y]);
  }
  // A short upward tail.
  const last = pts[pts.length - 1] as Pt;
  pts.push([last[0] + width * 0.12, last[1] - 0.06 - rand() * 0.04]);
  return pts;
}

/** The path of a signature for a seed: a first name, a surname and an underline, in a box about 1 wide, centred on the origin. */
export function signaturePath(seed: number | string): string {
  const rand = seeded(seed);
  const first = word(rand, -0.5, 0.28, 2 + Math.floor(rand() * 2));
  const second = word(rand, -0.12, 0.5, 3 + Math.floor(rand() * 3));
  const end = second[second.length - 1] as Pt;
  const under: Pt[] = [[end[0] - 0.05, end[1] + 0.13 + rand() * 0.03], [-0.05, 0.15 + rand() * 0.03], [-0.38, 0.12 + rand() * 0.04]];
  const lift = (list: readonly Pt[]): Pt[] => list.map(([x, y]) => [x, y - 0.02] as Pt);
  return smooth(lift(first)) + smooth(lift(second)) + smooth(lift([end, ...under]));
}
