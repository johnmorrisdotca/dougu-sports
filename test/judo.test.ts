import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { wellFormed } from "./helpers.ts";

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
