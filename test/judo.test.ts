import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { wellFormed } from "./helpers.ts";
import { path, strip } from "../src/emblems/gear/gear.budo.ts";
import { rect } from "../src/emblems/gear/gear.core.ts";
import { type Box, inkBox, pathPoints } from "./svgbox.ts";

const SUITS = ["gear:judogi", "gear:judogi-blue", "gear:judogi-folded", "gear:judogi-blue-folded"] as const;
const BELTS = ["gear:obi", "gear:obi-white", "gear:obi-yellow", "gear:obi-orange", "gear:obi-green", "gear:obi-blue", "gear:obi-brown", "gear:obi-kohaku", "gear:obi-red", "gear:obi-women"] as const;
const SPLITS = ["gear:obi-white-yellow", "gear:obi-yellow-orange", "gear:obi-orange-green", "gear:obi-green-blue", "gear:obi-blue-brown"] as const;
/** The text of a drawing without the ids its gradients are given from a hash. */
const bare = (svg: string): string => svg.replace(/g[0-9a-z]{4,8}c?\b/g, "G");

test("the judogi is white or blue as the IJF colour rule says (C1.9), in a flat-lay and folded", () => {
  assert.equal(D.JUDOGI_WHITE, "#f6f4ee");
  assert.equal(D.JUDOGI_BLUE, "#1456b6");
  for (const id of SUITS) {
    const svg = D.renderEmblem(id, { style: "color" });
    assert.equal(wellFormed(svg), null, id);
    assert.ok(svg.includes(id.includes("blue") ? D.JUDOGI_BLUE : D.JUDOGI_WHITE), id);
    assert.equal(svg.includes(id.includes("blue") ? D.JUDOGI_WHITE : D.JUDOGI_BLUE), false, `${id} is one colour`);
    assert.ok(svg.includes(D.OBI_RANKS.black), `${id} has a black belt by default`);
    assert.ok(D.renderEmblem(id, { accent: "#2b64c8" }).includes("#2b64c8"), `${id}: the belt takes an accent`);
  }
  assert.equal(new Set(SUITS.map((id) => D.renderEmblem(id))).size, 4, "four drawings");
  assert.deepEqual(D.emblemInfo("gear:judogi-folded").kind, "gear");
  assert.match(D.emblemName("gear:judogi-blue-folded"), /Folded blue judo suit/);
  assert.equal(D.emblemName("gear:judogi-blue-folded", "ja"), "畳んだ青い柔道衣");
});

test("the judogi has its quilting, lapel stitching and side vents, and reads in line at 16 pixels", () => {
  for (const id of SUITS) {
    const color = D.renderEmblem(id, { style: "color" });
    assert.ok((color.match(/stroke-opacity|opacity="0\.\d+"/g) ?? []).length > 10, `${id} has cloth lines`);
    const line = D.renderEmblem(id, { style: "line", size: 16 });
    assert.match(line, /currentColor/);
    assert.equal(wellFormed(line), null);
    assert.ok(line.length < 3000, `${id} line drawing stays small (${line.length})`);
  }
});

test("every belt is its own drawing in each style and theme, and turns", () => {
  const seen = new Set<string>();
  for (const id of [...BELTS, ...SPLITS]) {
    for (const style of D.EMBLEM_STYLES) for (const theme of ["inherit", "dark"] as const) assert.equal(wellFormed(D.renderEmblem(id, { style, theme })), null, `${id} ${style} ${theme}`);
    seen.add(D.renderEmblem(id));
    assert.equal(D.emblemFrame(id, { yaw: 0 }), D.renderEmblem(id), id);
    assert.notEqual(D.emblemFrame(id, { yaw: 60 }), D.renderEmblem(id), id);
  }
  assert.equal(seen.size, BELTS.length + SPLITS.length);
});

test("the kyu and dan belts have their colours: white to brown, black, red and white panels, solid red", () => {
  for (const rank of ["white", "yellow", "orange", "green", "blue", "brown", "red"] as const) {
    const svg = D.renderEmblem(`gear:obi-${rank}`, { style: "color" });
    assert.ok(svg.includes(D.OBI_RANKS[rank]), rank);
    assert.equal(bare(svg), bare(D.obi(rank, { style: "color" })), `obi(${rank}) is the same drawing`);
  }
  const kohaku = D.renderEmblem("gear:obi-kohaku", { style: "color" });
  assert.ok(kohaku.includes(D.OBI_RANKS.kohaku) && kohaku.includes("#f6f4ee"), "red and white");
  assert.equal(D.OBI_RANKS.kohaku, D.OBI_RANKS.red, "the red of the panels is the red of the 9th dan");
  assert.equal(D.renderEmblem("gear:obi-red", { style: "color" }).includes("#f6f4ee"), false, "the red belt has no white");
  assert.notEqual(kohaku, D.renderEmblem("gear:obi-red", { style: "color" }));
  assert.equal(bare(D.obi("kohaku", { style: "color" })), bare(kohaku));
});

test("the women's black belt has a white stripe down its middle, and only the black belt takes it", () => {
  const women = D.obi("black", { women: true, style: "color" });
  assert.equal(bare(women), bare(D.renderEmblem("gear:obi-women", { style: "color" })));
  assert.ok(women.includes("#f6f4ee"));
  assert.equal(D.renderEmblem("gear:obi", { style: "color" }).includes("#f6f4ee"), false, "the men's belt has none");
  for (const rank of ["white", "yellow", "brown", "red", "kohaku"] as const) assert.equal(D.obi(rank, { women: true }), D.obi(rank), `${rank} ignores women`);
  assert.equal(bare(D.obi("black", { women: false })), bare(D.obi("black")));
});

test("a two-colour belt is half one colour and half the other, from a pair of ranks or a pair of colours", () => {
  for (const id of SPLITS) {
    const [a, b] = id.slice("gear:obi-".length).split("-") as [D.ObiRank, D.ObiRank];
    const svg = D.renderEmblem(id, { style: "color" });
    assert.ok(svg.includes(D.OBI_RANKS[a]) && svg.includes(D.OBI_RANKS[b]), id);
    assert.notEqual(svg, D.renderEmblem(`gear:obi-${a}`, { style: "color" }), id);
    assert.equal(bare(D.obi([a, b], { style: "color" })).replace(/<title>[^<]*<\/title>/, ""), bare(svg).replace(/<title>[^<]*<\/title>/, ""), `obi([${a}, ${b}]) is the same belt`);
  }
  const custom = D.obi("white", { tint: ["#112233", "#445566"], style: "color" });
  assert.ok(custom.includes("#112233") && custom.includes("#445566"), "a pair of colours");
  assert.equal(wellFormed(custom), null);
  assert.equal(D.obi("white", { tint: ['"><script>', "x"] }).includes("<script"), false, "a hostile pair does nothing");
  assert.equal(D.obi("yellow", { tint: "#112233", style: "color" }).includes("#112233"), true, "one colour still tints");
  assert.equal(D.obi(["nope", "yellow"] as never, { style: "color" }).includes(D.OBI_RANKS.black), true, "an unknown rank is the black belt");
});

test("the belt is wrapped twice and tied in a flat knot with two equal ends hanging apart", () => {
  // Two wraps (each in its own band path), a knot that is a rounded rectangle, and two ends of one length: measured from the model's own parts.
  const parts = (D.GEAR_OBI.model as { parts: ReadonlyArray<{ d: string; fill?: string }> }).parts.filter((p) => p.fill === "$main");
  const rects = parts.filter((p) => /^M[\d. ]+L[\d. L]+z$/.test(p.d) && (p.d.match(/L/g) ?? []).length >= 7);
  assert.ok(rects.length >= 2, "two wraps");
  const tails = parts.filter((p) => /^M[\d. ]+L[\d. ]+L[\d. ]+L[\d. ]+z$/.test(p.d));
  assert.equal(tails.length, 2, "two ends");
  const length = (d: string): number => {
    const pts = [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
    return Math.hypot(pts[1]![0] - pts[0]![0], pts[1]![1] - pts[0]![1]);
  };
  assert.ok(Math.abs(length(tails[0]!.d) - length(tails[1]!.d)) < 0.2, "the ends are as long as each other");
  const xs = tails.map((t) => [...t.d.matchAll(/(-?\d+(?:\.\d+)?) -?\d+(?:\.\d+)?/g)].map((m) => Number(m[1])));
  assert.ok(Math.max(...xs[0]!) < Math.max(...xs[1]!) && Math.min(...xs[0]!) < Math.min(...xs[1]!), "left end and right end");
});

test("the karate-gi is its own cut: white, a red belt, shorter than the judogi's and without its quilting", () => {
  const karate = D.renderEmblem("gear:karate-gi", { style: "color" });
  const judo = D.renderEmblem("gear:judogi", { style: "color" });
  assert.ok(karate.includes("#fbfaf6") && karate.includes("#c4202e"));
  assert.ok(karate.length < judo.length, "lighter, with fewer lines");
  assert.ok(D.renderEmblem("gear:karate-gi", { accent: "#2b64c8" }).includes("#2b64c8"), "a blue belt (AO)");
});

test("the judo and karate pictograms are suits, and read in the three styles at 16 pixels", () => {
  for (const sport of ["judo", "karate"] as const) {
    for (const style of D.EMBLEM_STYLES) {
      const svg = D.sportIcon(sport, { style, size: 16 });
      assert.equal(wellFormed(svg), null, `${sport} ${style}`);
      assert.match(svg, /width="16" height="16"/);
    }
    assert.match(D.sportIcon(sport, { style: "line" }), /currentColor/);
  }
  assert.notEqual(D.sportIcon("judo"), D.sportIcon("karate"));
  assert.match(D.emblemInfo("sport:karate").description?.en ?? "", /karate suit/);
});

test("the American football pictograms are the balls: laces on all three, the CFL's stripes round both ends, the IFAF's on the laces' side only, the NFL's none", () => {
  const stripes = (id: D.EmblemId): number => (D.renderEmblem(id, { style: "color" }).match(/fill="#f4f0e6"/g) ?? []).length;
  assert.equal(stripes("sport:nfl"), 0, "none in the NFL");
  assert.equal(stripes("sport:cfl"), 1, "one stripe path, two stripes (a ring near each end)");
  assert.equal(stripes("sport:ifaf"), 1);
  const pathOf = (id: D.EmblemId): string => D.renderEmblem(id, { style: "color" }).match(/<path d="([^"]*)" fill="#f4f0e6"/)![1]!;
  assert.equal((pathOf("sport:cfl").match(/M/g) ?? []).length, 2, "a stripe at each end");
  assert.equal((pathOf("sport:ifaf").match(/M/g) ?? []).length, 2);
  assert.notEqual(pathOf("sport:cfl"), pathOf("sport:ifaf"), "the IFAF's stripes are half the width of the ball");
  const box = (d: string): number => { const ys = [...d.matchAll(/ (-?\d+(?:\.\d+)?)(?=[LMz])/g)].map((m) => Number(m[1])); return Math.max(...ys) - Math.min(...ys); };
  assert.ok(box(pathOf("sport:ifaf")) < box(pathOf("sport:cfl")), "the IFAF's stripes are shorter across the ball");
  for (const id of ["sport:nfl", "sport:cfl", "sport:ifaf"] as const) {
    const line = D.renderEmblem(id, { style: "line", size: 16 });
    assert.equal(wellFormed(line), null, id);
    assert.match(line, /currentColor/);
    assert.ok((D.renderEmblem(id).match(/<path/g) ?? []).length >= 2, `${id} has laces`);
    assert.doesNotMatch(D.renderEmblem(id), /NaN|undefined/);
  }
  assert.equal(new Set(["sport:nfl", "sport:cfl", "sport:ifaf"].map((id) => D.renderEmblem(id as D.EmblemId))).size, 3);
});

// ───────────────────────────── sleeves: judo has no short ones ─────────────────────────────

type Pt = readonly [number, number];
const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
const filled = (svg: string): string[] => [...svg.matchAll(/<path d="([^"]+)" fill="#(?!none)[0-9a-f]{3,6}"/g)].map((m) => m[1] as string);
/** The left sleeve of a drawn suit, read off the finished drawing (never the numbers it was made from): where its cuff ends, how wide the cuff is, how long the jacket is. */
function sleeveOf(id: D.EmblemId): { cuffMid: Pt; cuffWidth: number; outer: number; hem: number; jacket: number } {
  const svg = D.renderEmblem(id, { style: "color" });
  const subpaths = filled(svg).flatMap((d) => d.split(/(?=M)/).map((sub) => pathPoints(sub) as Pt[]));
  const left = (pts: Pt[]): boolean => Math.min(...pts.map((p) => p[0])) < 10 && pts.some((p) => p[0] > 16);
  const sleeve = subpaths.find((pts) => left(pts) && Math.min(...pts.map((p) => p[1])) < 12)!;
  assert.ok(sleeve !== undefined, `${id} has a sleeve out to the left`);
  // A sleeve stands out past the body's left edge (x = 17); the cuff is its two lowest corners out there.
  const cuff = sleeve.filter((p) => p[0] < 14).sort((a, b) => b[1] - a[1]).slice(0, 2) as [Pt, Pt];
  const shoulder = sleeve.filter((p) => p[0] > 16 && p[0] < 22).sort((a, b) => a[1] - b[1])[0] as Pt;
  // The jacket: the tallest filled shape whose left edge is the body's, from its top to the line where its sides end.
  const body = subpaths.filter((pts) => Math.min(...pts.map((p) => p[0])) >= 16 && Math.max(...pts.map((p) => p[1])) < 41);
  const jacketPts = (id.startsWith("sport:") ? subpaths.find((pts) => left(pts))! : body.sort((a, b) => Math.max(...b.map((p) => p[1])) - Math.min(...b.map((p) => p[1])) - (Math.max(...a.map((p) => p[1])) - Math.min(...a.map((p) => p[1]))))[0]!) as Pt[];
  const top = Math.min(...jacketPts.map((p) => p[1]));
  const hem = Math.max(...jacketPts.filter((p) => p[0] >= 17 && p[0] <= 47).map((p) => p[1]));
  return { cuffMid: [(cuff[0][0] + cuff[1][0]) / 2, (cuff[0][1] + cuff[1][1]) / 2], cuffWidth: dist(cuff[0], cuff[1]), outer: dist(shoulder, cuff.sort((a, b) => a[0] - b[0])[0]), hem, jacket: hem - top };
}

test("a judogi has no short sleeves: they hang to the wrist, at the level of the hem, and the cuff is loose (IJF C1.10)", () => {
  // With the arms hanging, the wrist bone is at the hip, where the skirt of the jacket ends. The sleeve must cover it, at most 5 cm short, so its cuff is at the hem or below, and it is as long as the jacket.
  for (const id of ["sport:judo", "gear:judogi", "gear:judogi-blue", "gear:judogi-back", "gear:judogi-blue-back"] as const) {
    const s = sleeveOf(id);
    assert.ok(s.cuffMid[1] >= s.hem - 0.05 * s.jacket, `${id}: the cuff is at y ${s.cuffMid[1].toFixed(1)}, the hem at ${s.hem}`);
    assert.ok(s.outer >= 0.95 * s.jacket, `${id}: the sleeve's outer edge is ${s.outer.toFixed(1)} long, the jacket ${s.jacket.toFixed(1)}`);
    // Loose: the cuff is wide enough for the forearm and a hand's width of room (a cuff 20% as wide as the jacket is long, about 15 cm on a 75 cm jacket).
    assert.ok(s.cuffWidth >= 0.2 * s.jacket, `${id}: the cuff is ${s.cuffWidth.toFixed(1)} wide`);
  }
  // The old pictogram's sleeves ended at the elbow (about 12 units above the hem).
  assert.ok(sleeveOf("sport:judo").cuffMid[1] > 38, "the pictogram's cuff is down at the hip");
});

test("the karate-gi's sleeves are three-quarter length: past halfway down the forearm and never beyond the wrist (WKF 2.2.1 j), so longer than the elbow and shorter than a judogi's", () => {
  for (const [karate, judo] of [["gear:karate-gi", "gear:judogi"], ["sport:karate", "sport:judo"]] as const) {
    const k = sleeveOf(karate), j = sleeveOf(judo);
    const reach = (k.hem - k.cuffMid[1]) / k.jacket;
    assert.ok(reach <= 0.2, `${karate}: the cuff is ${(reach * 100).toFixed(0)}% of the jacket's length above the hem (an elbow-length sleeve is 35% and more)`);
    assert.ok(k.outer / k.jacket >= 0.8 && k.outer / k.jacket < j.outer / j.jacket, `${karate}: the sleeve is ${(k.outer / k.jacket).toFixed(2)} of the jacket, the judogi's ${(j.outer / j.jacket).toFixed(2)}`);
    assert.ok(k.cuffWidth >= 0.2 * k.jacket, `${karate}: a wide cuff`);
  }
});

// ───────────────────────────── the back number ─────────────────────────────

/** The path that is lettering of a colour (a stroked path with no fill), read off the finished drawing. */
const lettersOf = (svg: string, stroke: string): { d: string; w: number } | undefined => {
  const m = new RegExp(`<path d="([^"]+)" fill="none" stroke="${stroke}" stroke-width="([\\d.]+)"`).exec(svg);
  return m === null ? undefined : { d: m[1] as string, w: Number(m[2]) };
};
const inkOf = (letters: { d: string; w: number }, stroke: string) => inkBox(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="${letters.d}" fill="none" stroke="${stroke}" stroke-width="${letters.w}"/></svg>`)!;
/** The patch: the rectangle of the back number, read off the drawing. */
const patchOf = (svg: string): { x0: number; y0: number; x1: number; y1: number } => {
  const d = [...svg.matchAll(/<path d="([^"]+)" fill="#fcfcf9"/g)][0]?.[1] as string;
  const pts = pathPoints(d);
  return { x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) };
};

test("the back view carries the back number: the family name on the band, the country code under it, on a white patch the size of the IJF's large one", () => {
  const svg = D.renderEmblem("gear:judogi-blue-back", { style: "color", backnumber: { name: "TREMBLAY", code: "CAN" } });
  assert.equal(wellFormed(svg), null);
  assert.match(svg, /<title>Blue judo suit, back view, TREMBLAY CAN<\/title>/);
  const patch = patchOf(svg);
  // 38 cm wide and 39 cm high (the IJF partner's manual): the patch is as wide as it is high, within 3%.
  assert.ok(Math.abs((patch.x1 - patch.x0) / (patch.y1 - patch.y0) / (38 / 39) - 1) < 0.03, "38 by 39");
  const name = lettersOf(svg, "#fefefe");
  const code = lettersOf(svg, "#26318f");
  assert.ok(name !== undefined && code !== undefined, "the name and the code are lettering");
  const nameInk = inkOf(name!, "#fefefe"), codeInk = inkOf(code!, "#26318f");
  const centre = (patch.x0 + patch.x1) / 2;
  for (const [what, ink] of [["name", nameInk], ["code", codeInk]] as const) {
    assert.ok(ink.x0 >= patch.x0 + 0.5 && ink.x1 <= patch.x1 - 0.5, `the ${what} is inside the patch`);
    assert.ok(Math.abs((ink.x0 + ink.x1) / 2 - centre) < 0.8, `the ${what} is centred`);
  }
  assert.ok(nameInk.y1 < codeInk.y0, "the name is above the code");
  assert.ok(nameInk.y0 >= patch.y0 && nameInk.y1 <= patch.y0 + 5, "the name is on the band across the top");
  assert.ok(codeInk.y1 < patch.y0 + (patch.y1 - patch.y0) * 0.6, "the sponsor's room under the code is left blank");
  // A longer name is set smaller to fit, a shorter one larger; the lettering is the name's own.
  const tall = (n: string): number => { const l = lettersOf(D.renderEmblem("gear:judogi-back", { style: "color", backnumber: { name: n, code: "JPN" } }), "#fefefe")!; const b = inkOf(l, "#fefefe"); return b.y1 - b.y0; };
  assert.ok(tall("LEE") > tall("TREMBLAYSMITHSON"), "a long name is smaller");
  assert.notEqual(name!.d, lettersOf(D.renderEmblem("gear:judogi-blue-back", { style: "color", backnumber: { name: "TANAKA", code: "CAN" } }), "#fefefe")!.d, "another name, other letters");
  assert.notEqual(code!.d, lettersOf(D.renderEmblem("gear:judogi-blue-back", { style: "color", backnumber: { name: "TREMBLAY", code: "JPN" } }), "#26318f")!.d, "another code, other letters");
});

test("the back number is taken as a family name in capitals and three letters, and nothing else gets on it", () => {
  const draw = (backnumber: D.Backnumber): string => D.renderEmblem("gear:judogi-back", { style: "color", backnumber });
  assert.equal(draw({ name: "Müller", code: "ger" }), draw({ name: "MULLER", code: "GER" }), "accents are the plain letter, lower case is capitals");
  assert.equal(draw({ code: "CANADA" }), draw({ code: "CAN" }), "three letters");
  assert.equal(draw({ name: "A".repeat(40) }), draw({ name: "A".repeat(16) }), "sixteen characters");
  for (const hostile of ['"><script>alert(1)</script>', "<svg onload=x>", "&amp;"]) {
    const svg = draw({ name: hostile, code: hostile });
    assert.equal(wellFormed(svg), null);
    assert.doesNotMatch(svg, /<script|onload/);
  }
  assert.equal(lettersOf(draw({ name: "" }), "#fefefe"), undefined, "an empty name draws no lettering");
  assert.match(D.renderEmblem("gear:judogi-back", { style: "color", locale: "ja", backnumber: { name: "SMITH", code: "USA" } }), /<title>柔道衣の背面<\/title>/);
  assert.match(D.renderEmblem("gear:judogi-back", { title: "my own", backnumber: { name: "SMITH" } }), /<title>my own<\/title>/);
  assert.equal(D.renderEmblem("gear:judogi-back"), D.renderEmblem("gear:judogi-back", { backnumber: {} }).replace("<title>Judo suit, back view, TANAKA JPN</title>", "<title>Judo suit, back view</title>"), "no back number given reads TANAKA JPN");
});

test("the band is blue, or gold for an Olympic champion and red for a world champion; the suit is white or blue, with a black belt", () => {
  const band = (b: "blue" | "gold" | "red" | undefined): string => D.renderEmblem("gear:judogi-back", { style: "color", backnumber: { band: b } });
  assert.ok(band(undefined).includes("#26318f") && band("blue").includes("#26318f"));
  assert.ok(band("gold").includes("#d8a31a") && !band("gold").includes("#26318f"));
  assert.ok(band("red").includes("#c4202e") && !band("red").includes("#26318f"));
  assert.equal(band(undefined), band("nonsense" as never), "an unknown band is blue");
  for (const id of ["gear:judogi-back", "gear:judogi-blue-back"] as const) {
    const svg = D.renderEmblem(id, { style: "color" });
    assert.ok(svg.includes(id.includes("blue") ? D.JUDOGI_BLUE : D.JUDOGI_WHITE), id);
    assert.equal(svg.includes(id.includes("blue") ? D.JUDOGI_WHITE : D.JUDOGI_BLUE), false, `${id} is one colour`);
    assert.ok(svg.includes(D.OBI_RANKS.black), `${id} has a black belt`);
    assert.ok(D.renderEmblem(id, { style: "color", accent: "#2b64c8" }).includes("#2b64c8"), `${id}: the belt takes an accent`);
  }
  assert.equal(D.emblemName("gear:judogi-blue-back", "ja"), "青い柔道衣の背面");
});

test("the back view has no flag and no logo: nothing of the IJF's, the partner's or a sponsor's is drawn", () => {
  for (const id of ["gear:judogi-back", "gear:judogi-blue-back"] as const) {
    const svg = D.renderEmblem(id, { backnumber: { name: "SMITH", code: "USA" }, flags: () => "<svg><circle r='3' fill='#f0f'/></svg>" });
    assert.doesNotMatch(svg, /ijf|mybacknumber|logo|#f0f|<image|<text/i, id);
  }
});

test("the back view reads in the three styles and at 16 pixels, and turns like the other suits", () => {
  for (const id of ["gear:judogi-back", "gear:judogi-blue-back"] as const) {
    for (const style of D.EMBLEM_STYLES) for (const size of [16, 64, 256]) assert.equal(wellFormed(D.renderEmblem(id, { style, size, backnumber: { name: "TANAKA", code: "JPN" } })), null, `${id} ${style} ${size}`);
    const line = D.renderEmblem(id, { style: "line", size: 16 });
    assert.match(line, /currentColor/);
    assert.ok(line.length < 7000, `${id} line drawing stays small (${line.length})`);
    assert.equal(D.emblemFrame(id, { yaw: 0 }), D.renderEmblem(id), id);
    assert.notEqual(D.emblemFrame(id, { yaw: 60 }), D.renderEmblem(id), id);
    assert.match(D.emblemFrame(id, { yaw: 60, backnumber: { name: "SMITH", code: "USA" } }), /stroke="#fefefe"/, "a turned frame carries the back number it was given");
  }
  assert.deepEqual(D.emblemInfo("gear:judogi-back").kind, "gear");
  assert.ok(D.JAPANESE_IDS.includes("gear:judogi-back") && D.JAPANESE_IDS.includes("gear:judogi-blue-back"));
});

// ── how the belt is tied: gear:obi-step-1 to gear:obi-step-6 ──

const STEP_IDS = ["gear:obi-step-1", "gear:obi-step-2", "gear:obi-step-3", "gear:obi-step-4", "gear:obi-step-5", "gear:obi-step-6"] as const;

test("the six belt steps are six drawings, in order, each with its number, a name and a caption in both languages", () => {
  assert.equal(new Set(STEP_IDS.map((id) => D.renderEmblem(id))).size, 6, "six different drawings");
  STEP_IDS.forEach((id, i) => {
    const info = D.emblemInfo(id);
    assert.equal(info.kind, "gear");
    assert.ok(D.GEAR_IDS.includes(id) && D.JAPANESE_IDS.includes(id as D.JapaneseId), id);
    assert.ok(info.description !== undefined && info.description.en.includes(`Step ${i + 1} `) && info.description.ja.includes(`手順${i + 1}。`), `${id}: the caption says which step it is`);
    assert.match(info.ja, new RegExp(`^帯の結び方（${i + 1}）`), id);
    assert.equal(D.obiStep((i + 1) as D.ObiStep), D.renderEmblem(id), `obiStep(${i + 1})`);
  });
  assert.equal(D.obiStep(0 as never), D.renderEmblem("gear:obi-step-6"), "a number that is no step draws the last one");
  assert.match(D.emblemInfo("gear:obi-step-5").description?.ja ?? "", /本結び/, "the knot has its Japanese name");
  assert.match(D.emblemInfo("gear:obi-step-1").description?.ja ?? "", /柔道衣/, "the suit has its Japanese name");
});

test("every step is the jacket of gear:judogi, lapels crossed left over right, with the belt in the belt's colour and the suit in the suit's", () => {
  const lapel = path(strip([37, 4.8], [24.4, 35], 3.9));
  const under = path(strip([26.8, 5.4], [33.8, 14.4], 2.9));
  const whole = D.renderEmblem("gear:judogi", { style: "color" });
  assert.ok(whole.includes(lapel) && whole.includes(under), "the judogi has the left front over the right");
  for (const id of STEP_IDS) {
    const svg = D.renderEmblem(id, { style: "color" });
    assert.equal(wellFormed(svg), null, id);
    const at = (d: string): number => svg.indexOf(`d="${d}"`);
    assert.ok(at(under) > 0 && at(lapel) > at(under), `${id}: the right front under and the left front over it, as on gear:judogi`);
    assert.ok(svg.includes(D.JUDOGI_WHITE) && svg.includes(D.OBI_RANKS.black), `${id}: a white suit and a black belt`);
    assert.ok(D.renderEmblem(id, { style: "color", tint: "#1456b6", accent: "#2b64c8" }).includes("#2b64c8"), `${id}: the belt takes accent`);
    assert.ok(D.renderEmblem(id, { style: "color", tint: "#123456" }).includes("#123456"), `${id}: the suit takes tint`);
    assert.doesNotMatch(svg, /<sleeve|<text/, id);
  }
});

test("the belt goes through the steps in order: one wrap, two with the ends, the ends crossed, one end under both wraps, the knot, the even ends", () => {
  const svgOf = (n: number): string => D.renderEmblem(`gear:obi-step-${n}` as D.EmblemId, { style: "color" });
  const belt = (n: number): number => (svgOf(n).match(/fill="#1f2228"/g) ?? []).length;
  assert.ok(belt(2) > belt(1), "two wraps and two ends are more belt than one wrap");
  assert.equal(belt(3), belt(2), "crossing the ends changes where they lie, not how many pieces there are");
  assert.ok(belt(5) > belt(3) && belt(6) > belt(3), "the knot is more belt than the loose ends");
  const upper = rect(18.2, 25.2, 27.6, 2.5), lower = rect(18.2, 27.4, 27.6, 2.5);
  const at = (svg: string, d: string): number => svg.indexOf(`d="${d}"`);
  assert.ok(at(svgOf(1), upper) < 0 && at(svgOf(1), rect(18.2, 26.3, 27.6, 2.5)) > 0, "step 1 has the one wrap, between the places of the two");
  for (const n of [2, 3, 4]) assert.ok(at(svgOf(n), lower) > 0 && at(svgOf(n), upper) > at(svgOf(n), lower), `step ${n}: two wraps, the upper one over the lower`);
  // Step 3: both ends are laid over the wraps, the wearer's left end (the right of the picture) on top of the other.
  const crossing = [path(strip([29.6, 28.2], [35.6, 37.1], 2.55)), path(strip([34.4, 28.2], [28.4, 37.1], 2.55))] as const;
  const s3 = svgOf(3);
  assert.ok(at(s3, crossing[0]) > at(s3, upper) && at(s3, crossing[1]) > at(s3, crossing[0]), "step 3: the ends over the wraps, the second over the first");
  // Step 4: the end that goes under is drawn before the wraps, which hide the middle of it, and is the same strip above and below them.
  const tucked = path(strip([30.2, 21], [30.2, 34.2], 2.55));
  const s4 = svgOf(4);
  assert.ok(at(s4, tucked) > 0 && at(s4, tucked) < at(s4, lower), "step 4: the end passes under both wraps");
  assert.ok(s4.includes("#d8342c"), "step 4 marks the way up");
  // Steps 5 and 6: the knot over both wraps; just tied the ends differ in length, finished they are even and marked.
  assert.notEqual(svgOf(5), svgOf(6));
  assert.ok(svgOf(6).includes("#d8342c") && svgOf(1).includes("#d8342c"), "the red marks are on steps 1, 4, 5 and 6");
});

test("the steps read in the three styles at 16 pixels, stay small, and turn like the other suits without clipping", () => {
  for (const id of STEP_IDS) {
    for (const style of D.EMBLEM_STYLES) for (const size of [16, 32, 64, 256]) assert.equal(wellFormed(D.renderEmblem(id, { style, size })), null, `${id} ${style} ${size}`);
    const line = D.renderEmblem(id, { style: "line", size: 16 });
    assert.match(line, /currentColor/);
    assert.ok(line.length < 12000, `${id} line drawing stays small (${line.length})`);
    assert.equal(D.emblemFrame(id, { yaw: 0 }), D.renderEmblem(id), id);
    assert.notEqual(D.emblemFrame(id, { yaw: 60 }), D.renderEmblem(id), id);
    // The close-up and its marks stay inside the picture: the ink is measured from the paths, with every transform.
    const box = inkBox(D.renderEmblem(id, { style: "metal" })) as Box;
    assert.ok(box.x0 >= -0.5 && box.y0 >= -0.5 && box.x1 <= 64.5 && box.y1 <= 64.5, `${id}: ink ${JSON.stringify(box)}`);
  }
});
