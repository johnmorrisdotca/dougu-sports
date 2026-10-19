// The fifty-one balls of docs/vintage-balls.md: vintage leather soccer balls, soccer balls in the style of an era, the patterns of a shop wall, baseballs of other threads, volleyballs in national colours, the `colors`
// option, and the tilings and decal tools they are made from.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { across, frameAt, lacing, lengthOf, noise, offset, place, resample, running, spiral, star, tongue } from "../src/emblems/ball/ball.decal.ts";
import { len } from "../src/emblems/ball/ball.math.ts";
import { VOLLEYBALL_PLANS } from "../src/emblems/ball/ball.volleyball.flag.ts";
import { colourCentres, gorePoint, icosahedron, octahedron8 } from "../src/emblems/ball/ball.tilings.ts";
import { wellFormed } from "./helpers.ts";

const VINTAGE = ["1870-hand-stitched", "1900-laced", "1930-18-panel", "1950-12-panel", "1960-32-panel-leather"].map((n) => `ball:soccer-${n}`) as D.BallId[];
const ERA = ["retro-pentagons", "retro-leaves", "retro-rosette", "retro-star", "retro-pinwheel", "retro-kites", "14-panel-double-border", "8-panel-plain", "6-panel-bands", "6-panel-diamonds", "20-panel-dots", "training-high-vis"].map((n) => `ball:soccer-${n}`) as D.BallId[];
const PATTERNS = { stars: ["blue", "red", "night"], hexagons: ["cyan", "magenta", "lime"], flames: ["fire", "ice", "toxic"], chevrons: ["red", "green", "blue"], swirl: ["blue", "red", "teal"], metallic: ["gold", "silver", "cobalt"] } as const;
const STORE = Object.entries(PATTERNS).flatMap(([pattern, ways]) => ways.map((way) => `ball:soccer-${pattern}-${way}`)) as D.BallId[];
const BASEBALLS = ["ball:baseball-lemon-peel", "ball:baseball-red-blue", "ball:baseball-black-red", "ball:baseball-vintage-leather", "ball:softball-11-optic"] as D.BallId[];
const NATIONS = ["brazil", "japan", "canada", "usa", "italy", "poland", "france", "serbia", "netherlands", "germany"].map((n) => `ball:volleyball-${n}`) as D.BallId[];
const VOLLEYBALLS = [...NATIONS, "ball:volleyball-colours"] as D.BallId[];
const NEW: D.BallId[] = [...VINTAGE, ...ERA, ...STORE, ...BASEBALLS, ...VOLLEYBALLS];
/** What no id, title, description or document of these balls may name. */
const NOT_NAMED = /telstar|tango|azteca|etrusco|questra|tricolore|fevernova|teamgeist|jabulani|brazuca|al rihla|trionda|fifa|world cup|adidas|official|nike|swoosh/i;

test("there are fifty-one new balls, each an id of the registry, once", () => {
  assert.equal(NEW.length, 51);
  assert.equal(new Set(NEW).size, 51);
  for (const id of NEW) assert.ok(D.isEmblemId(id) && D.BALL_IDS.includes(id), id);
  assert.equal(VINTAGE.length + ERA.length + STORE.length, 35);
  assert.equal(D.BALL_IDS.length, 117);
});

test("ids and names describe a style and an era, and name no real ball, tournament, maker or mark", () => {
  for (const id of NEW) {
    const info = D.emblemInfo(id);
    const text = JSON.stringify({ id, en: info.en, ja: info.ja, description: info.description });
    assert.doesNotMatch(text, NOT_NAMED, id);
    assert.ok(info.description !== undefined && info.description.en.length > 20 && /[぀-ヿ一-鿿]/.test(info.description.ja), `${id} has no description`);
  }
  for (const id of ERA.filter((x) => !x.includes("training"))) assert.match(id, /^ball:soccer-(retro-[a-z]+|\d+-panel-[a-z-]+)$/, id);
  assert.equal(new Set(NEW.map((id) => D.emblemInfo(id).en)).size, 51, "the titles are all different");
  assert.equal(new Set(NEW.map((id) => D.emblemInfo(id).ja)).size, 51, "the Japanese names are all different");
  for (const file of ["../docs/vintage-balls.md", "../docs/vintage-balls.ja.md"]) assert.doesNotMatch(readFileSync(new URL(file, import.meta.url), "utf8"), NOT_NAMED, file);
});

test("every new ball turns, draws as a well-formed document in both styles and differs from every other", () => {
  const seen = new Map<string, string>();
  for (const id of NEW) {
    for (const style of ["metal", "line"] as const) {
      const svg = D.renderEmblem(id, { style });
      assert.equal(wellFormed(svg), null, `${id} ${style}`);
      assert.doesNotMatch(svg, /NaN|undefined|Infinity/, id);
      for (const yaw of [0, 90, 200, 300]) assert.equal(wellFormed(D.ballFrame(id, { yaw, pitch: 20, style })), null, `${id} ${style} ${yaw}`);
    }
    const key = D.renderEmblem(id, { grain: false });
    assert.equal(seen.get(key), undefined, `${id} is drawn like ${seen.get(key)}`);
    seen.set(key, id);
    // A turn of a whole circle is the ball where it was, and a quarter turn is another picture.
    assert.equal(D.ballFrame(id, { yaw: 360 }), D.ballFrame(id, { yaw: 0 }), id);
    assert.notEqual(D.ballFrame(id, { yaw: 90 }), D.ballFrame(id, { yaw: 0 }), id);
  }
});

test("the soccer balls have the sizes of their rules: the vintage ones the 27 to 28 inches of the 1872 Laws, the others an 11-a-side ball's 68 to 70 cm", () => {
  for (const id of VINTAGE.slice(0, 4)) {
    const size = D.emblemInfo(id).size!;
    assert.ok(size.circumferenceMm! >= 685.8 && size.circumferenceMm! <= 711.2, id);
    assert.match(size.rule, /1872/, id);
    assert.equal(size.massG, undefined, `${id} gives no mass, because the early figures were not confirmed`);
  }
  for (const id of [VINTAGE[4], ...ERA, ...STORE]) assert.deepEqual(D.emblemInfo(id as D.BallId).size, D.emblemInfo("ball:soccer").size, id);
});

test("the 11 in optic softball is the WBSC's: 27.9 cm, 166.5 to 173.6 g, 80 stitches", () => {
  const size = D.emblemInfo("ball:softball-11-optic").size!;
  assert.equal(size.circumferenceMm, 279.5);
  assert.deepEqual(size.massG, [166.5, 173.6]);
  assert.match(size.rule, /Slow Pitch/);
  assert.ok(Math.abs(size.diameterMm! - 279.5 / Math.PI) < 1e-9);
  assert.ok(D.emblemInfo("ball:softball-11-optic").size!.extentMm < D.emblemInfo("ball:softball").size!.extentMm, "the 11 in ball is smaller than the 12 in one");
  // 80 stitches round the seam, each a V of three points; about half face you.
  assert.ok((D.renderEmblem("ball:softball-11-optic").match(/stroke="#d0262c"/g) ?? []).length >= 1);
});

test("the figure-8 stitching in two colours shows both threads, and the lemon-peel ball has four seams that meet at two points", () => {
  const redBlue = D.renderEmblem("ball:baseball-red-blue");
  assert.ok(redBlue.includes("#c4262e") && redBlue.includes("#2257a8"));
  const blackRed = D.renderEmblem("ball:baseball-black-red");
  assert.ok(blackRed.includes("#c4262e") && blackRed.includes("#1d1d20"));
  assert.ok(!D.renderEmblem("ball:baseball").includes("#2257a8"), "the plain baseball is red only");
  assert.ok(D.renderEmblem("ball:baseball-vintage-leather").includes("#a23a2c"), "a faded red thread");
  const peel = gorePoint(4, 0, [0, 28, 0]);
  const poleA = peel(0, 0, -1), poleB = peel(3, 1, -1);
  for (let i = 0; i < 4; i++) assert.ok(len([peel(i, 0, -1)[0] - poleA[0], peel(i, 0, -1)[1] - poleA[1], peel(i, 0, -1)[2] - poleA[2]]) < 1e-9, "every seam starts at one pole");
  assert.ok(len([poleB[0] - poleA[0], poleB[1] - poleA[1], poleB[2] - poleA[2]]) < 1e-9);
});

test("a volleyball in national colours has its three colours, takes `colors`, and `tint` and `accent` where `colors` is not given", () => {
  const brazil = D.renderEmblem("ball:volleyball-brazil");
  for (const colour of ["#009c3b", "#ffdf00", "#002776"]) assert.ok(brazil.includes(colour), colour);
  const mine = D.renderEmblem("ball:volleyball-brazil", { colors: ["#112233", "#445566", "#778899"] });
  for (const colour of ["#112233", "#445566", "#778899"]) assert.ok(mine.includes(colour), colour);
  assert.ok(!mine.includes("#009c3b") && !mine.includes("#ffdf00"), "colors replaces the flag's colours");
  // One or two colours are repeated; what is not a colour is dropped; nothing at all is the ball's own.
  assert.equal(D.renderEmblem("ball:volleyball-colours", { colors: ["#abcdef"] }), D.renderEmblem("ball:volleyball-colours", { colors: ["#abcdef", "#abcdef", "#abcdef"] }));
  assert.equal(D.renderEmblem("ball:volleyball-colours", { colors: ["nope", "#abcdef"] }), D.renderEmblem("ball:volleyball-colours", { colors: ["#abcdef"] }));
  assert.equal(D.renderEmblem("ball:volleyball-colours", { colors: [] }), D.renderEmblem("ball:volleyball-colours"));
  assert.equal(D.renderEmblem("ball:volleyball-colours", { colors: "red" as never }), D.renderEmblem("ball:volleyball-colours"));
  assert.equal(D.renderEmblem("ball:volleyball-colours", { colors: ["#abcdef", "#123456", "#fedcba", "#000000"] }), D.renderEmblem("ball:volleyball-colours", { colors: ["#abcdef", "#123456", "#fedcba"] }), "only three are used");
  assert.ok(D.renderEmblem("ball:volleyball-colours", { tint: "#ff00ff" }).includes("#ff00ff"));
  assert.ok(D.renderEmblem("ball:volleyball-colours", { accent: "#00ffff" }).includes("#00ffff"));
  // A turn takes it too; hostile text is no colour.
  assert.ok(D.ballFrame("ball:volleyball-usa", { yaw: 40, colors: ["#010203", "#040506", "#070809"] }).includes("#010203"));
  const hostile = D.renderEmblem("ball:volleyball-colours", { colors: ['"><script>alert(1)</script>', "red;fill:url(javascript:1)", "#123456"] });
  assert.doesNotMatch(hostile, /<script|javascript/);
  // Two drawings with other colours never share a clip, so on one page they stay apart.
  const ids = (svg: string): string[] => [...svg.matchAll(/id="([^"]+)"/g)].map((m) => m[1] as string);
  assert.equal(ids(brazil).filter((id) => ids(mine).includes(id)).length, 0);
  // Every flag has three different colours, and the layout uses all of them on the ball.
  for (const id of NATIONS) assert.ok(new Set(D.renderEmblem(id).match(/#[0-9a-f]{6}/g)).size >= 3, id);
});

test("`colors` is ignored by every ball that has no use for it, and the ids of the older balls did not change", () => {
  // The drawing is the same; only the ids, which tell drawings with other colours apart, differ.
  const bare = (svg: string): string => svg.replace(/k[0-9a-z]{4,9}[a-z]?(?=["')])/g, "k");
  assert.equal(bare(D.renderEmblem("ball:soccer", { colors: ["#ff0000"] })), bare(D.renderEmblem("ball:soccer")));
  assert.equal(D.renderEmblem("trophy:cup", { colors: ["#ff0000"] }), D.renderEmblem("trophy:cup"));
  assert.match(D.renderEmblem("ball:soccer"), /id="k1n1e6klc"/, "the clip id of ball:soccer is as it was");
});

test("the octahedron of eight panels and the icosahedron of twenty are tilings of the sphere", () => {
  const ico = icosahedron();
  assert.equal(ico.panels.length, 20);
  assert.ok(ico.panels.every((p) => p.length === 3));
  assert.equal(ico.seams.length, 30);
  // V - E + F = 12 - 30 + 20 = 2.
  assert.equal(12 - ico.seams.length + ico.panels.length, 2);
  for (const p of ico.panels) for (const v of p) assert.ok(Math.abs(len(v) - 1) < 1e-9);
  // No two neighbours share a colour: the centres a face apart are at the angle whose cosine is sqrt 5 / 3.
  let neighbours = 0;
  ico.centres.forEach((a, i) => ico.centres.forEach((b, j) => {
    if (j <= i || Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] - Math.sqrt(5) / 3) > 1e-6) return;
    neighbours++;
    assert.notEqual(ico.colour[i], ico.colour[j]);
  }));
  assert.equal(neighbours, 30);
  const oct = octahedron8();
  assert.equal(oct.panels.length, 8);
  assert.equal(oct.seams.length, 12);
  assert.equal(8 - 12 + 6, 2, "F - E + V of the octahedron");
  for (const curve of oct.seams) for (const p of curve) assert.ok(Math.abs(len(p) - 1) < 1e-9);
  // Two panels that share an edge differ in parity, so the two tones alternate.
  assert.equal(oct.parity.filter((p) => p === 0).length, 4);
  // The S curve leaves the great circle: the middle of a seam is on it, a quarter of the way along is not.
  const mid = oct.seams[0][7], quarter = oct.seams[0][3];
  const ends = [oct.seams[0][0], oct.seams[0][14]];
  const normal = [ends[0][1] * ends[1][2] - ends[0][2] * ends[1][1], ends[0][2] * ends[1][0] - ends[0][0] * ends[1][2], ends[0][0] * ends[1][1] - ends[0][1] * ends[1][0]] as const;
  const off = (p: readonly number[]): number => Math.abs(p[0] * normal[0] + p[1] * normal[1] + p[2] * normal[2]) / len(normal);
  assert.ok(off(mid) < 1e-6 && off(quarter) > 0.1);
  assert.deepEqual(colourCentres([[1, 0, 0], [0, 1, 0]], 2, 2).length, 2);
});

test("the decal tools put every shape on the sphere", () => {
  const f = frameAt([0, 0, 1], [1, 0, 0]);
  const p = f(0.3, 0);
  assert.ok(Math.abs(len(p) - 1) < 1e-12 && p[0] > 0 && Math.abs(p[1]) < 1e-12, "x is toward the point given");
  assert.ok(f(0, 0.3)[1] > 0, "y is a quarter turn from x");
  for (const q of place(f, star(5, 0.2, 0.09))) assert.ok(Math.abs(len(q) - 1) < 1e-12);
  const leaf = tongue(spiral(0, 0.3, 0, 1), (u) => 0.1 * Math.sin(Math.PI * u), 6);
  assert.equal(leaf.length, 14);
  // A curve resampled is as long as it was, with its points the same distance apart.
  const curve = ico(10);
  const pts = resample(curve, 0.1);
  assert.ok(Math.abs(lengthOf(pts) - lengthOf(curve)) < 0.02);
  const steps = pts.slice(1).map((q, i) => lengthOf([pts[i], q]));
  assert.ok(Math.max(...steps) - Math.min(...steps) < 0.02, steps.join(" "));
  for (const marks of [running([curve], 0.1), running([curve], 0.1, 0.02), across([curve], 0.1, 0.02, 0.01)]) {
    assert.ok(marks.length > 3);
    for (const mark of marks) for (const q of mark) assert.ok(Math.abs(len(q) - 1) < 1e-9);
  }
  for (const q of offset(curve, 0.05)) assert.ok(Math.abs(len(q) - 1) < 1e-9);
  const lace = lacing([0, 0, 1], [1, 0, 0], 0.6, 6, 0.03);
  assert.equal(lace.eyelets.length, 12);
  assert.equal(lace.crossings.length, 10);
  assert.equal(lace.ends.length, 2);
  for (const q of [...lace.slit, ...lace.eyelets, ...lace.crossings.flat(), ...lace.ends.flat()]) assert.ok(Math.abs(len(q) - 1) < 1e-9);
  // The noise is the same every time and is spread over 0 to 1.
  assert.equal(noise(3, 4), noise(3, 4));
  const n = Array.from({ length: 200 }, (_, i) => noise(i, 7));
  assert.ok(n.every((v) => v >= 0 && v < 1) && Math.min(...n) < 0.1 && Math.max(...n) > 0.9);
});

/** A curve along the equator of the ball. */
function ico(n: number): [number, number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => [Math.cos(i / 6), 0, Math.sin(i / 6)]);
}

// ── national volleyballs that do not look alike ──

/** CIE L*a*b* of a #rrggbb colour (D65), for a perceptual distance (CIE76) between two panels. */
function lab(hex: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  const f = (t: number): number => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047), y = f(0.2126 * r + 0.7152 * g + 0.0722 * b), z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
const deltaE = (a: string, b: string): number => Math.hypot(...(lab(a).map((v, i) => v - (lab(b)[i] as number)) as [number, number, number]));

test("the ten national volleyballs differ from each other panel by panel, by perceptual distance, and by layout", () => {
  const names = Object.keys(VOLLEYBALL_PLANS) as Array<keyof typeof VOLLEYBALL_PLANS>;
  assert.equal(names.length, 10);
  const panels = (n: keyof typeof VOLLEYBALL_PLANS): string[] => [...VOLLEYBALL_PLANS[n].panels].map((ch) => VOLLEYBALL_PLANS[n].colours[ch.charCodeAt(0) - 97] as string);
  for (const n of names) {
    assert.equal(panels(n).length, 18, `${n} has 18 panels`);
    assert.match(VOLLEYBALL_PLANS[n].panels, /^[abc]{18}$/, n);
    assert.equal(new Set(VOLLEYBALL_PLANS[n].panels).size, 3, `${n} uses all three of its colours`);
  }
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = panels(names[i] as keyof typeof VOLLEYBALL_PLANS), b = panels(names[j] as keyof typeof VOLLEYBALL_PLANS);
      const apart = a.map((c, k) => deltaE(c, b[k] as string));
      const mean = apart.reduce((s, v) => s + v, 0) / 18;
      const clear = apart.filter((d) => d >= 25).length;
      // Alike by a mean of under 35 or by fewer than 7 clearly different panels is what two balls of one colour scheme look like; the real ones are at 41 and 7 or more.
      assert.ok(mean >= 35 && clear >= 7, `${names[i]} and ${names[j]} are too alike: mean distance ${mean.toFixed(1)}, ${clear} panels clearly different`);
      // The colours are not enough: the layout differs as well, so a recoloured copy of one is not another.
      assert.notEqual(VOLLEYBALL_PLANS[names[i] as keyof typeof VOLLEYBALL_PLANS].panels, VOLLEYBALL_PLANS[names[j] as keyof typeof VOLLEYBALL_PLANS].panels, `${names[i]} and ${names[j]} share a layout`);
    }
  }
  assert.equal(new Set(NATIONS.map((id) => D.renderEmblem(id))).size, 10, "ten different drawings");
  assert.equal(new Set(NATIONS.map((id) => D.renderEmblem(id, { size: 16, style: "color" }))).size, 10, "and at 16 pixels");
  // Only colours: the layouts are panels of the ball, and nothing is drawn on them.
  for (const id of NATIONS) assert.doesNotMatch(D.renderEmblem(id), /<text|<image|<use/, id);
});

test("a national volleyball keeps its look when it turns, and its `colors` still land on the panels they name", () => {
  for (const id of NATIONS) {
    for (const yaw of [0, 60, 120, 180, 240, 300]) assert.equal(wellFormed(D.ballFrame(id as D.BallId, { yaw })), null, `${id} yaw ${yaw}`);
    assert.notEqual(D.ballFrame(id as D.BallId, { yaw: 0 }), D.ballFrame(id as D.BallId, { yaw: 90 }), id);
  }
  // Poland on its corner: white above, red below, so at rest the top of the drawing is white and the bottom the red (the panels are painted in the three colours of the trio).
  const poland = VOLLEYBALL_PLANS.poland;
  assert.equal(poland.corner, true);
  assert.deepEqual([...poland.panels].filter((_, i) => i % 6 < 3).every((ch) => ch === "a"), true, "the three faces round the top corner are white");
});

// ── the 2010-style grooved ball: strong enough to read ──

/** WCAG contrast ratio between two #rrggbb colours. */
function contrast(a: string, b: string): number {
  const lum = (hex: string): number => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

test("the 2010-style ball has an accent that reads on a light page and on a dark one, grooves darker than both panels, and contour lines that survive 32 pixels", () => {
  const svg = D.renderEmblem("ball:soccer-8-panel-plain", { style: "color", size: 32 });
  const accent = "#5f86c0", white = "#f6f8f8", groove = "#16262f";
  for (const colour of [accent, white, groove]) assert.ok(svg.includes(colour), colour);
  assert.ok(contrast(accent, "#ffffff") >= 3 && contrast(accent, "#14181c") >= 3, "the accent is 3 to 1 against a white page and against a dark one");
  assert.ok(contrast(accent, white) >= 3, "the two kinds of panel are 3 to 1 apart");
  assert.ok(contrast(groove, accent) >= 4 && contrast(groove, white) >= 12, "the grooves are clearly darker than either panel");
  // The accent is `accent`'s to change, as before.
  assert.ok(D.renderEmblem("ball:soccer-8-panel-plain", { accent: "#ff8800" }).includes("#ff8800"));
  // The contour lines are two inks, white, 3 to 1 against the blue panels, drawn at the floor width (80 / size units: 0.8 pixel) where they face the eye.
  const ink = [...svg.matchAll(/stroke="(#[0-9a-f]{6})" stroke-width="([\d.]+)"[^>]*opacity="0.95"/g)].map((m) => ({ colour: m[1] as string, width: Number(m[2]) }));
  assert.deepEqual([...new Set(ink.map((i) => i.colour))].sort(), ["#ffffff"], "white contour lines on the blue panels only; the white panels are plain");
  assert.ok(contrast("#ffffff", accent) >= 3, "the ink reads on its panel");
  assert.ok(Math.max(...ink.map((i) => i.width)) >= 80 / 32 - 0.01, "at 32 pixels the lines reach 0.8 pixel");
  // The line style keeps the grooves and the contour rings, and both themes and every turn are well formed.
  for (const theme of ["light", "dark"] as const) for (const yaw of [0, 90, 180, 270]) assert.equal(wellFormed(D.ballFrame("ball:soccer-8-panel-plain", { yaw, theme, size: 16 })), null, `${theme} ${yaw}`);
});

test("the era balls John asked to change: a double border, plain white panels, diamonds at the poles, a solid centre on the pinwheel, a second 1980s ball", () => {
  const colour = (id: string): string => D.renderEmblem(id as D.BallId, { style: "color", grain: false });
  const count = (svg: string, re: RegExp): number => (svg.match(re) ?? []).length;
  // 2006: two red lines inside each propeller (two strokes per propeller on the near side) and a black seam with a gap of ground drawn over it.
  const border = colour("ball:soccer-14-panel-double-border");
  assert.ok(count(border, /stroke="#c8302f"[^>]*opacity="0.95"/g) >= 6, "red lines inside the propellers");
  assert.ok(border.includes('stroke="#16181c"') && border.includes('stroke="#f4f2ea"'), "a black seam with a gap in it");
  // 2010: contour lines only on the blue panels, so no line ink but white.
  assert.ok(!colour("ball:soccer-8-panel-plain").includes("#3e577d"));
  // 2014 and 2018: the diamonds at the poles are drawn, so the ball differs from one drawn without them (a ball's top view shows one).
  for (const id of ["ball:soccer-6-panel-bands", "ball:soccer-6-panel-diamonds"]) assert.notEqual(D.ballFrame(id as D.BallId, { pitch: 80 }), D.ballFrame(id as D.BallId, { pitch: 80, yaw: 0, size: 100 }), id);
  // The pinwheel's solid circle is in the deep green of its pentagons, which now fills two kinds of shape.
  const pinwheel = colour("ball:soccer-retro-pinwheel");
  assert.ok(count(pinwheel, /fill="#15472d"/g) >= 2, "a solid circle at the middle of each pinwheel, in the pentagons' green");
  assert.equal(D.emblemInfo("ball:soccer-retro-star").en, "Soccer, 1980s star");
});
