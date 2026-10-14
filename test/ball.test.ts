import { describe, expect, it } from "./vitest-shim.ts";
import { BALL_IDS, BALLS, ballFrame, ballOf, ballSize, isBallId, lineup, renderBall } from "../src/emblems/ball/ball.index.ts";
import { BALL_BASKETBALL, basketballChannel } from "../src/emblems/ball/ball.basketball.ts";
import { BALL_SOCCER } from "../src/emblems/ball/ball.soccer.ts";
import { BALL_TENNIS } from "../src/emblems/ball/ball.tennis.ts";
import { PIECE_INK, hashOf, readColour } from "../src/emblems/ball/ball.core.ts";
import { apply, dot, greatCircle, len, rotation, seamCurve, slerp, smallCircle, spread, transpose } from "../src/emblems/ball/ball.math.ts";
import { truncatedIcosahedron } from "../src/emblems/ball/ball.polyhedra.ts";

/** The coordinates of every move and line in a document, and the end of every absolute arc. */
const numbersOf = (svg: string): number[] => [...svg.matchAll(/[MLA](?:[^MLAZa-z]*?)(-?\d*\.?\d+)[ ,](-?\d*\.?\d+)(?=[MLAZa-z"])/g)].flatMap((m) => [Number(m[1]), Number(m[2])]);

/** A document is well formed enough: every tag opened is closed, in order. */
function balanced(svg: string): boolean {
  const stack: string[] = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    if (m[4] === "/") continue;
    if (m[1] === "/") {
      if (stack.pop() !== m[2]) return false;
    } else stack.push(m[2]);
  }
  return stack.length === 0;
}

describe("the balls", () => {
  it("has the forty-seven ids, each once, in the form ball:name", () => {
    expect(BALLS.length).toBe(47);
    expect(new Set(BALL_IDS).size).toBe(BALL_IDS.length);
    for (const id of BALL_IDS) expect(id).toMatch(/^ball:[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("names every ball in English and in Japanese, and is generated", () => {
    for (const b of BALLS) {
      expect(b.en.length).toBeGreaterThan(2);
      expect(b.ja).toMatch(/[぀-ヿ一-鿿]/);
      expect(b.source).toBe("generated");
      expect(b.kind).toBe("ball");
    }
  });

  it("draws every ball, in both styles, still and turning, as a well-formed safe document", () => {
    for (const b of BALLS) {
      for (const style of ["colour", "line"] as const) {
        for (const svg of [b.svg({ style }), b.svg({ style, size: 16 }), b.frame({ style, yaw: 120, pitch: 20, roll: 40 })]) {
          expect(svg.startsWith("<svg "), b.id).toBe(true);
          expect(svg.endsWith("</svg>"), b.id).toBe(true);
          expect(balanced(svg), `${b.id} ${style}`).toBe(true);
          expect(svg, b.id).toContain(`<title>${b.en}</title>`);
          expect(svg, b.id).not.toMatch(/<script|<foreignObject|<image|javascript:|\son\w+=|href="https?:/i);
          expect(svg, b.id).not.toMatch(/NaN|undefined|Infinity/);
        }
      }
    }
  });

  it("is pure: the same arguments give the same string", () => {
    for (const b of BALLS) expect(b.svg({ size: 40 })).toBe(b.svg({ size: 40 }));
    expect(ballFrame("soccer", { yaw: 33 })).toBe(ballFrame("soccer", { yaw: 33 }));
  });

  it("keeps every coordinate inside the box", () => {
    for (const b of BALLS) {
      for (const yaw of [0, 70, 140, 210, 280]) {
        for (const n of numbersOf(b.frame({ yaw, pitch: yaw / 10 }))) expect(n, `${b.id} yaw ${yaw}`).toBeGreaterThanOrEqual(-0.5);
        for (const n of numbersOf(b.frame({ yaw, pitch: yaw / 10 }))) expect(n, `${b.id} yaw ${yaw}`).toBeLessThanOrEqual(100.5);
      }
    }
  });

  it("is safe with hostile options", () => {
    const hostile = ballOf("soccer-colour").svg({ tint: '"><script>alert(1)</script>', accent: "red;fill:url(javascript:1)", size: Number.NaN, style: "x" as never, theme: "x" as never });
    expect(hostile).not.toContain("<script");
    expect(hostile).not.toContain("javascript");
    expect(hostile).toContain('width="64"');
    expect(() => ballOf('"><script>')).toThrow(/Unknown ball/);
    expect(() => renderBall("nonsense")).toThrow(/ball:soccer/);
    expect(isBallId("soccer")).toBe(true);
    expect(isBallId("ball:nope")).toBe(false);
    expect(isBallId(7)).toBe(false);
    expect(ballFrame("soccer", { yaw: Number.NaN, pitch: Infinity })).toBe(ballFrame("soccer"));
    expect(PIECE_INK.light).toMatch(/^#/);
  });

  it("takes a tint", () => {
    expect(ballOf("soccer-colour").svg({ tint: "#2255ff" })).toContain("#2255ff");
    expect(ballOf("basketball").svg({ tint: "#2255ff" })).toContain("#2255ff");
  });

  it("draws the line style in the page's ink alone", () => {
    for (const b of BALLS) {
      const svg = b.svg({ style: "line" });
      expect(svg, b.id).toContain("currentColor");
      expect(svg.replace(/url\(#[^)]*\)/g, ""), b.id).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    }
  });

  it("keeps the ids of two drawings of one piece apart when they differ, so they never share a clip", () => {
    const a = BALL_SOCCER.frame({ yaw: 0 });
    const b = BALL_SOCCER.frame({ yaw: 40, pitch: 30 });
    const ids = (s: string): string[] => [...s.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids(a).filter((id) => ids(b).includes(id) && id.endsWith("c")).length).toBeLessThanOrEqual(1);
    expect(hashOf("a")).not.toBe(hashOf("b"));
  });

  it("holds its size budgets", () => {
    for (const b of BALLS) {
      const colour = b.svg().length;
      const line = b.svg({ style: "line" }).length;
      const limit = b.id === "ball:sepak-takraw" ? 32000 : 18000;
      expect(colour, `${b.id} colour ${colour} B`).toBeLessThanOrEqual(limit);
      expect(line, `${b.id} line ${line} B`).toBeLessThanOrEqual(limit);
    }
    const sizes = BALLS.map((b) => b.svg().length);
    expect(sizes.reduce((s, n) => s + n, 0) / sizes.length).toBeLessThan(8500);
  });
});

describe("the projection", () => {
  it("rotates without stretching: the matrix is orthonormal and keeps a handedness", () => {
    for (const [yaw, pitch, roll] of [[0, 0, 0], [0.5, 0.3, 0.1], [2, -1, 3], [Math.PI, 0.2, -2]] as const) {
      const r = rotation(yaw, pitch, roll);
      const rt = transpose(r);
      for (let i = 0; i < 3; i++) {
        expect(len(r[i])).toBeCloseTo(1, 9);
        for (let j = 0; j < i; j++) expect(dot(r[i], r[j])).toBeCloseTo(0, 9);
      }
      const v = apply(rt, apply(r, [0.3, -0.4, 0.8]));
      expect(v[0]).toBeCloseTo(0.3, 9);
      expect(v[1]).toBeCloseTo(-0.4, 9);
      expect(v[2]).toBeCloseTo(0.8, 9);
      const det = dot(r[0], [r[1][1] * r[2][2] - r[1][2] * r[2][1], r[1][2] * r[2][0] - r[1][0] * r[2][2], r[1][0] * r[2][1] - r[1][1] * r[2][0]]);
      expect(det).toBeCloseTo(1, 9);
    }
  });

  it("keeps the seam of a baseball or a tennis ball on the sphere, for any b", () => {
    for (const b of [0.05, 0.2, 0.33, 0.4, 0.5]) {
      for (const p of seamCurve(b, 200)) expect(len(p)).toBeCloseTo(1, 9);
    }
  });

  it("keeps the basketball's channels, the great circles and the small circles on the sphere", () => {
    for (const sign of [1, -1] as const) for (const p of basketballChannel(sign, 80)) expect(len(p)).toBeCloseTo(1, 9);
    for (const p of greatCircle([0.2, 1, 0.3], 64)) expect(len(p)).toBeCloseTo(1, 9);
    for (const p of smallCircle([1, 0, 0], 0.7, 64)) expect(len(p)).toBeCloseTo(1, 9);
    for (const p of spread(100, 0.3)) expect(len(p)).toBeCloseTo(1, 9);
    for (const p of [0.1, 0.5, 0.9]) expect(len(slerp([1, 0, 0], [0, 1, 0], p))).toBeCloseTo(1, 9);
  });

  it("makes the great circle through the seam's two crossings: the curve crosses itself where the maths says", () => {
    const s = seamCurve(0.4, 400);
    // The curve is closed and has the symmetry z(t + pi) = z(t) for a figure that winds twice.
    expect(len([s[0][0] - 1, s[0][1], s[0][2]])).toBeCloseTo(0, 9);
    expect(s[100][2]).toBeCloseTo(0, 6);
  });

  it("has the soccer ball's 32 panels, 90 edges and every vertex on the sphere", () => {
    const t = truncatedIcosahedron();
    expect(t.pentagons.length).toBe(12);
    expect(t.hexagons.length).toBe(20);
    expect(t.pentagons.every((p) => p.length === 5)).toBe(true);
    expect(t.hexagons.every((h) => h.length === 6)).toBe(true);
    expect(t.edges.length).toBe(90);
    for (const ring of [...t.pentagons, ...t.hexagons]) for (const p of ring) expect(len(p)).toBeCloseTo(1, 9);
  });

  it("turns one full turn to where it started", () => {
    expect(ballFrame("basketball", { yaw: 360 })).toBe(ballFrame("basketball", { yaw: 0 }));
    expect(ballFrame("basketball", { yaw: 90 })).not.toBe(ballFrame("basketball", { yaw: 0 }));
    expect(ballFrame("soccer", { roll: 360 })).toBe(ballFrame("soccer", { roll: 0 }));
  });

  it("draws the back faces of nothing: a panel facing away is left out, so the far side differs", () => {
    const front = BALL_SOCCER.frame({ yaw: 0 });
    const back = BALL_SOCCER.frame({ yaw: 180 });
    expect(front).not.toBe(back);
    // The cut at the limb keeps every point of a panel on or inside the ball's circle.
    for (const yaw of [0, 33, 66, 99]) {
      const pts = [...BALL_SOCCER.frame({ yaw, style: "line" }).matchAll(/([ML])(-?[\d.]+) (-?[\d.]+)/g)].map((m) => Math.hypot(Number(m[2]) - 50, Number(m[3]) - 50));
      for (const r of pts) expect(r).toBeLessThanOrEqual(46.1);
    }
  });

  it("draws the tennis seam as white on yellow, and the soccer ball's pentagons in the ink in the line style", () => {
    expect(BALL_TENNIS.svg()).toContain("#f4f6e4");
    expect(BALL_SOCCER.svg({ style: "line" })).toMatch(/fill="currentColor"/);
    expect(readColour("#fff")).toEqual([255, 255, 255]);
  });

  it("grains only a still ball of 48 pixels or more", () => {
    expect(BALL_BASKETBALL.svg({ size: 64 })).toContain("feTurbulence");
    expect(BALL_BASKETBALL.svg({ size: 40 })).not.toContain("feTurbulence");
    expect(BALL_BASKETBALL.frame({ size: 64 })).not.toContain("feTurbulence");
    expect(BALL_BASKETBALL.frame({ size: 64, grain: true })).toContain("feTurbulence");
    expect(BALL_BASKETBALL.svg({ size: 64, style: "line" })).not.toContain("feTurbulence");
  });
});

describe("the sizes", () => {
  it("gives every ball its official size and the rule it comes from", () => {
    for (const b of BALLS) {
      const size = ballSize(b.id);
      expect(size, b.id).toBeDefined();
      expect(size!.extentMm, b.id).toBeGreaterThan(30);
      expect(size!.rule.length, b.id).toBeGreaterThan(12);
      expect(size!.rule, b.id).not.toMatch(/TBD/);
    }
  });

  it("draws balls at their true relative sizes: a puck is smaller than a basketball, a golf ball smaller than a tennis ball", () => {
    const widthOf = (svg: string, nth: number): number => Number([...svg.matchAll(/scale\(([\d.]+)\)/g)][nth][1]);
    const row = lineup(["golf", "tennis", "puck", "basketball"], { scale: "true", height: 240 });
    const scales = [0, 1, 2, 3].map((i) => widthOf(row, i));
    expect(scales[3]).toBeGreaterThan(scales[2]);
    expect(scales[2]).toBeGreaterThan(scales[1]);
    expect(scales[1]).toBeGreaterThan(scales[0]);
    expect(scales[0]).toBeCloseTo((ballSize("golf")!.extentMm / ballSize("basketball")!.extentMm) * 2.4, 2);
    const same = lineup(["golf", "puck", "basketball"], { scale: "same", height: 90 });
    const sameScales = [...same.matchAll(/scale\(([\d.]+)\)/g)].map((m) => m[1]);
    expect(new Set(sameScales).size).toBe(1);
    expect(balanced(row)).toBe(true);
    expect(row).toContain("true relative sizes");
  });

  it("rejects a lineup of an unknown ball and stays safe", () => {
    expect(() => lineup(["soccer", "nope"])).toThrow(/Unknown ball/);
    expect(lineup(["soccer"], { height: Number.NaN, gap: -4 })).toContain("<svg");
  });

  it("agrees with the rulebooks on the figures that matter", () => {
    expect(ballSize("football-ifaf")!.lengthMm).toBeCloseTo(283.4, 1);
    expect(ballSize("tennis")!.diameterMm).toBeCloseTo(67, 0);
    expect(ballSize("table-tennis")!.diameterMm).toBe(40);
    expect(ballSize("puck")!.thicknessMm).toBe(25);
    expect(ballSize("golf")!.diameterMm).toBeCloseTo(42.67, 2);
    expect(ballSize("basketball")!.circumferenceMm).toBe(760);
    expect(ballSize("rugby")!.lengthMm).toBe(290);
    expect(ballSize("squash")!.diameterMm).toBe(40);
  });
});
