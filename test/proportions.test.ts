// The proportions of every ball and implement that has an official size, measured from the drawing. Each piece is drawn with its default view undone (a puck edge-on, a rugby ball lying across the
// page), in a box where 92 units are its `extentMm` (the scale `lineup` draws at), and what comes out is read off the drawn geometry: the clip outline of a ball, the side faces of a puck or a stone, the
// feathers of a shuttlecock. It is held to the rulebook's figures in `size`, so a drawing cannot drift from the rule the way a constant that only agreed with itself could (the puck was drawn one sixth as
// thick as it is wide, not one third, while its metadata was right).
import { describe, expect, it } from "./vitest-shim.ts";
import { BALLS, lineup } from "../src/emblems/ball/ball.index.ts";
import { EMBLEM_IDS, emblemInfo } from "../src/index.ts";
import { expected, measure } from "./measure.ts";

const TOLERANCE = 0.02;
const within = (drawn: number, rule: number): boolean => Math.abs(drawn / rule - 1) <= TOLERANCE;
const sized = BALLS.filter((b) => b.size !== undefined);

describe("the proportions of the balls and implements", () => {
  it("measures every ball and implement", () => {
    expect(sized.length).toBe(BALLS.length);
    expect(BALLS.length).toBeGreaterThan(65);
  });

  for (const piece of sized) {
    const size = piece.size!;
    it(`${piece.id}: drawn ratio and size match the rule within 2%`, () => {
      const drawn = measure(piece);
      const rule = expected(size);
      const note = `${piece.id}: drawn ${drawn.widthMm.toFixed(1)} x ${drawn.heightMm.toFixed(1)} mm, rule ${rule.widthMm.toFixed(1)} x ${rule.heightMm.toFixed(1)} mm`;
      expect(within(drawn.heightMm / drawn.widthMm, rule.heightMm / rule.widthMm), `ratio (${note})`).toBe(true);
      expect(within(drawn.widthMm, rule.widthMm), `width (${note})`).toBe(true);
      expect(within(drawn.heightMm, rule.heightMm), `height (${note})`).toBe(true);
      // A pointed ball is also held to the long way round: the outline, tip to tip, is the long girth.
      if (rule.outlineMm !== undefined) expect(within(drawn.outlineMm ?? NaN, rule.outlineMm), `outline ${drawn.outlineMm?.toFixed(0)} mm, rule ${rule.outlineMm} mm`).toBe(true);
    });

    it(`${piece.id}: its figures agree with each other`, () => {
      // The diameter or the width across the middle is the circumference over pi.
      if (size.circumferenceMm !== undefined && size.diameterMm !== undefined) expect(within(size.circumferenceMm / Math.PI, size.diameterMm), "circumference over pi").toBe(true);
    });
  }

  it("draws the new soccer balls as spheres of their rules' sizes: the 11-a-side constructions and colourways at 68 to 70 cm, futsal at 62 to 64 cm (size 4), beach soccer at 68 to 70 cm", () => {
    const soccer = BALLS.filter((b) => /^ball:(soccer|futsal|beach-soccer)/.test(b.id));
    expect(soccer.length).toBe(21);
    for (const b of soccer) {
      const m = measure(b);
      const circumference = b.size!.circumferenceMm!;
      // A sphere: as high as it is wide, and its width is the circumference over pi.
      expect(within(m.heightMm / m.widthMm, 1), `${b.id} is round`).toBe(true);
      expect(within(m.widthMm, circumference / Math.PI), `${b.id} width ${m.widthMm.toFixed(1)} mm`).toBe(true);
      const [low, high] = b.id === "ball:futsal" ? [620, 640] : [680, 700];
      expect(circumference >= low && circumference <= high, b.id).toBe(true);
    }
    // Futsal is the smaller ball: the width in the true-scale lineup is its millimetres.
    expect(within(measure(BALLS.find((b) => b.id === "ball:futsal")!).widthMm / measure(BALLS.find((b) => b.id === "ball:soccer")!).widthMm, 200.5 / 219.6)).toBe(true);
  });

  it("draws the puck one third as thick as it is wide (IIHF Rule 13: 25.4 mm by 76.2 mm)", () => {
    const puck = BALLS.find((b) => b.id === "ball:puck")!;
    const m = measure(puck);
    expect(Math.abs(m.heightMm / m.widthMm - 25.4 / 76.2) < 0.01 * (25.4 / 76.2)).toBe(true);
  });

  it("draws the curling stone's body at 114 mm over 291 mm (the handle is not part of its height)", () => {
    const m = measure(BALLS.find((b) => b.id === "ball:curling-stone")!);
    expect(within(m.heightMm / m.widthMm, 114 / (914 / Math.PI))).toBe(true);
  });

  it("lines up at the true scale: each drawing's width in the lineup is its millimetres", () => {
    const ids = ["ball:golf", "ball:puck", "ball:curling-stone", "ball:football", "ball:shuttlecock-feather", "ball:basketball"];
    const row = lineup(ids, { scale: "true", height: 400, gap: 0 });
    // Each piece sits in a group `scale(box / 100)`.
    const scales = [...row.matchAll(/scale\(([\d.]+)\)/g)].map((m) => Number(m[1]));
    expect(scales.length).toBe(ids.length);
    // A piece's box is 100 * scale px and its drawing fills 92 of the 100 units, which is `extentMm`: the same px per millimetre for every piece, or the lineup is not true.
    const pxPerMm = ids.map((id, i) => (92 / 100) * 100 * scales[i] / BALLS.find((b) => b.id === id)!.size!.extentMm);
    for (const v of pxPerMm) expect(Math.abs(v / pxPerMm[0] - 1) < 0.001).toBe(true);
  });
});

describe("what claims no real size", () => {
  it("gives a size to a ball or an implement only: not to a medal, a crest, a trophy, a pictogram, a pennant or a piece of gear", () => {
    const withSize = EMBLEM_IDS.filter((id) => emblemInfo(id).size !== undefined);
    expect(withSize.every((id) => id.startsWith("ball:")), `with a size: ${withSize.filter((id) => !id.startsWith("ball:")).join(", ")}`).toBe(true);
    expect(withSize.length).toBe(BALLS.length);
    for (const id of EMBLEM_IDS) if (!id.startsWith("ball:")) expect(emblemInfo(id).size, id).toBeUndefined();
  });
});
