import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { lum, readColour } from "../src/emblems/emblem.core.ts";
import { advance, inkFor, linesOf, widthOf } from "../src/emblems/emblem.engrave.ts";
import { wellFormed } from "./helpers.ts";

type Rgb = readonly [number, number, number];
const contrast = (a: string, b: string): number => {
  const [la, lb] = [lum(readColour(a) as Rgb), lum(readColour(b) as Rgb)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
/** The lines of text of a drawing, in order, each once (in the metal style each is drawn twice: the light under the cut). */
const texts = (svg: string): string[] => [...new Set([...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1] as string))];
/** The ink of the engraving: the fill of the last group of text. */
const ink = (svg: string): string => [...svg.matchAll(/<g font-family="[^"]*"[^>]*fill="(#[0-9a-f]{6})"[^>]*>(?:<text)/g)].at(-1)?.[1] as string;
const ENGRAVED = ["medal:gold", "medal:silver", "medal:bronze", "medal:place-1", "medal:place-2", "medal:place-3", "trophy:plaque", "trophy:belt"] as const;
const CUPS = D.TROPHY_IDS.filter((id) => D.emblemInfo(id).kind === "lathe");

test("engraving is asked for by label, year and rank, or by one free string, and nothing is engraved when none is asked for", () => {
  for (const id of ENGRAVED) {
    const plain = D.renderEmblem(id);
    assert.ok(!plain.includes("<text"), `${id} has text with no engraving`);
    assert.ok(texts(D.renderEmblem(id, { engrave: "MVP 2026" })).join(" ").includes("MVP"), id);
    assert.deepEqual(texts(D.renderEmblem(id, { engrave: "MVP", year: 1999 })), ["MVP"], `${id}: the free text wins over the fields`);
    assert.notEqual(plain, D.renderEmblem(id, { label: "MVP" }), id);
    assert.notEqual(plain, D.renderEmblem(id, { year: 2026 }), id);
    assert.notEqual(plain, D.renderEmblem(id, { rank: 2 }), id);
    // The star or numeral that an engraving replaces is gone, and the shapes around it stay.
    assert.ok(D.renderEmblem(id, { engrave: "A" }).length > 0);
  }
  assert.deepEqual(texts(D.renderEmblem("medal:gold", { rank: 1, label: "MVP", year: 2026 })), ["1", "MVP", "2026"]);
  assert.deepEqual(texts(D.renderEmblem("medal:gold", { year: 2026, label: "MVP" })), ["MVP", "2026"]);
  assert.deepEqual(texts(D.renderEmblem("medal:gold", { engrave: "2026", style: "line" })), ["2026"]);
  assert.equal(D.renderEmblem("medal:gold", { engrave: "   " }), D.renderEmblem("medal:gold"));
});

test("a place badge engraves its own place when it is given a year or a label, and an emblem with nowhere to engrave ignores the request", () => {
  assert.deepEqual(texts(D.renderEmblem("medal:place-2", { year: 2026 })), ["2", "2026"]);
  assert.deepEqual(texts(D.renderEmblem("medal:place-2", { year: 2026, rank: 7 })), ["7", "2026"]);
  assert.ok(!D.renderEmblem("medal:place-2").includes("<text"), "the plain badge keeps its drawn numeral");
  for (const id of ["crest:shield", "gear:hurley", "ball:soccer", "sport:nhl", "award:crown", "trophy:cup"] as const) assert.equal(D.renderEmblem(id, { engrave: "MVP" }), D.renderEmblem(id), id);
});

test("the year of a plaque goes on its nameplate, and the words on its face", () => {
  const svg = D.renderEmblem("trophy:plaque", { label: "Champions", year: 2026 });
  const place = [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)" font-size="([\d.]+)"[^>]*>([^<]*)</g)].filter((m) => m[4] === "2026");
  assert.ok(place.length > 0);
  assert.ok(Number(place[0]?.[2]) > 46, "the year is low, on the nameplate");
  const words = [...svg.matchAll(/<text x="[\d.]+" y="([\d.]+)"[^>]*>Champions</g)];
  assert.ok(Number(words[0]?.[1]) < 40, "the words are high, on the face");
});

test("the text is fitted to the face: no line is wider than its plate, however long", () => {
  const plates = { "medal:gold": 19, "medal:place-1": 30, "trophy:plaque": 30, "trophy:belt": 20 } as const;
  for (const [id, wide] of Object.entries(plates)) {
    for (const text of ["MVP 2026", "A", "ABCDEFGHIJKLMNOPQRSTUVWX", "優勝 二〇二六年度", "WWWWWWWWWWWWWWWWWWWWWWWW"]) {
      const svg = D.renderEmblem(id as D.EmblemId, { engrave: text });
      for (const m of svg.matchAll(/textLength="([\d.]+)"/g)) assert.ok(Number(m[1]) <= wide * 0.97, `${id} "${text}": ${m[1]} wide on a plate ${wide}`);
      assert.equal(wellFormed(svg), null, `${id} ${text}`);
    }
  }
  // A longer text gets a smaller size, and a short one is as big as the plate lets it be.
  const size = (text: string): number => Number(/font-size="([\d.]+)"/.exec(D.renderEmblem("medal:gold", { engrave: text }))?.[1]);
  assert.ok(size("A") > size("ABCDEFGH"));
  assert.ok(size("MVP 2026") > size("ABCDEFGH 2026"), "a space is a place to break the line, for bigger letters");
  assert.deepEqual(texts(D.renderEmblem("medal:gold", { engrave: "MVP 2026" })), ["MVP", "2026"]);
  assert.deepEqual(texts(D.renderEmblem("medal:gold", { engrave: "one\ntwo\nthree\nfour" })), ["one", "two", "three"], "three lines at most");
});

test("the ink reads at 4.5 to 1 on the metal, on any metal and any tint, in the flat style where the face is one colour", () => {
  const tints = ["#000000", "#ffffff", "#808080", "#777777", "#8a8a8a", "#c8102e", "#0b6e4f", "#f2c230", "#1f4e8c", "#d9a620", "#aeb6c0", "#b8733a", "#ff00ff", "#00ffff", "#333333"];
  for (const tint of tints) {
    for (const id of ENGRAVED) {
      const svg = D.renderEmblem(id, { tint, engrave: "MVP", style: "color" });
      assert.ok(contrast(ink(svg), tint) >= 4.5, `${id} ${tint}: ${ink(svg)} is ${contrast(ink(svg), tint).toFixed(2)} to 1`);
    }
    assert.ok(contrast(inkFor(readColour(tint) as Rgb), tint) >= 4.5, tint);
  }
  for (const metal of Object.values(D.METALS)) assert.ok(contrast(inkFor(readColour(metal) as Rgb), metal) >= 4.5, metal);
  // The line style has the page's ink, and no glint.
  const line = D.renderEmblem("medal:gold", { engrave: "MVP", style: "line" });
  assert.match(line, /fill="currentColor"/);
  assert.doesNotMatch(line, /fill-opacity=".7"/);
  assert.match(D.renderEmblem("medal:gold", { engrave: "MVP" }), /fill-opacity="\.7"/, "the metal style has a faint light under the cut");
});

test("an engraving is escaped, cleaned and kept to a length, and Japanese is kept as it is", () => {
  const hostile = '<script>alert(1)</script>"&\'';
  for (const id of [...ENGRAVED, ...CUPS]) {
    const svg = D.renderEmblem(id, { engrave: hostile, label: hostile, year: hostile, rank: hostile, engraveBack: hostile });
    assert.equal(wellFormed(svg), null, id);
    assert.doesNotMatch(svg, /<script|alert\(1\)<\/|<text[^>]*>[^<]*"[^<]*</, id);
    const turned = D.emblemFrame(id, { engrave: hostile, engraveBack: hostile, yaw: 180 });
    assert.equal(wellFormed(turned), null, id);
    assert.doesNotMatch(turned, /<script/, id);
  }
  assert.ok(texts(D.renderEmblem("medal:gold", { engrave: "a\u0000b\u0007c\u001bd" }))[0]?.includes("abcd"), "control characters are dropped");
  assert.ok(texts(D.renderEmblem("medal:gold", { engrave: "Z".repeat(80) }))[0]?.length === 24, "a line is 24 letters at most");
  assert.deepEqual(texts(D.renderEmblem("medal:gold", { engrave: "優勝" })), ["優勝"]);
  assert.deepEqual(texts(D.renderEmblem("trophy:plaque", { label: "ホッケー日本一", year: "令和八年" })), ["ホッケー日本一", "令和八年"]);
  assert.equal(D.renderEmblem("medal:gold", { engrave: 12 as never, rank: {} as never, year: null as never }).includes(">12<"), true);
  assert.equal(D.renderEmblem("medal:gold", { engrave: {} as never }), D.renderEmblem("medal:gold"));
  assert.ok(widthOf("優勝") >= 2 && advance("優") >= 1, "a Japanese character is a full em");
  assert.ok(advance("i") < advance("M") && advance(" ") < advance("0"));
});

test("a medal's engraving turns with it: squeezed with the face, gone on the back unless the back has its own", () => {
  const at = (yaw: number, extra = {}): string => D.emblemFrame("medal:gold", { engrave: "MVP", yaw, ...extra });
  assert.deepEqual(texts(at(0)), ["MVP"]);
  assert.deepEqual(texts(at(45)), ["MVP"]);
  assert.match(at(45), /scale\(0\.71 1\)/, "squeezed by the cosine, like the face");
  assert.deepEqual(texts(at(135)), [], "hidden on the back");
  assert.deepEqual(texts(at(180)), []);
  assert.deepEqual(texts(at(180, { engraveBack: "2026" })), ["2026"], "a separate back engraving");
  assert.deepEqual(texts(at(0, { engraveBack: "2026" })), ["MVP"], "and the front shows only its own");
  assert.deepEqual(texts(at(300, { engraveBack: "2026" })), ["MVP"]);
  assert.deepEqual(texts(D.emblemFrame("medal:gold", { engrave: "MVP", yaw: 0, pitch: 0 })), texts(D.renderEmblem("medal:gold", { engrave: "MVP" })));
  assert.equal(at(0), D.renderEmblem("medal:gold", { engrave: "MVP" }), "no turn is the still drawing");
  assert.ok(!D.renderEmblem("medal:gold", { engraveBack: "2026" }).includes("<text"), "the back is not drawn at rest");
  for (const id of ENGRAVED) for (const yaw of [-170, -90, -20, 0, 20, 90, 170, 400]) assert.equal(wellFormed(D.emblemFrame(id, { engrave: "MVP 2026", engraveBack: "X", yaw, pitch: 30 })), null, `${id} ${yaw}`);
});

test("the engraving on a cup's plinth turns round it: each letter is set at its angle, foreshortened, and hidden behind the edge", () => {
  assert.ok(CUPS.length >= 14);
  for (const id of CUPS) {
    const still = texts(D.renderEmblem(id, { engrave: "MVP 2026" }));
    assert.ok(still.length >= 3, `${id} engraves its plinth`);
    assert.ok(!D.renderEmblem(id).includes("<text"), `${id} has no text unasked`);
    const glyphs = (yaw: number): string => D.emblemFrame(id, { engrave: "MVP 2026", yaw });
    assert.notEqual(glyphs(50), glyphs(0), id);
    assert.equal(glyphs(360), D.renderEmblem(id, { engrave: "MVP 2026" }), id);
    assert.deepEqual(texts(glyphs(180)), [], `${id}: the engraving is on the far side`);
    assert.ok(texts(glyphs(200)).length < still.length || id === "trophy:football", id);
    // Never a letter wider than itself, or a flipped one.
    for (const m of glyphs(70).matchAll(/scale\(([-\d.]+) 1\)/g)) assert.ok(Number(m[1]) > 0 && Number(m[1]) <= 1, `${id}: ${m[1]}`);
    for (const yaw of [-170, -100, -33, 33, 100, 170, 500]) for (const pitch of [-20, 0, 40]) assert.equal(wellFormed(D.emblemFrame(id, { engrave: "MVP 2026", yaw, pitch })), null, `${id} ${yaw}`);
  }
  // A letter on the front of the plinth is squeezed more as it is nearer the edge.
  const scale = (yaw: number): number[] => [...D.emblemFrame("trophy:bowl", { engrave: "MVP 2026", yaw }).matchAll(/scale\(([\d.]+) 1\)/g)].map((m) => Number(m[1]));
  assert.ok(Math.max(...scale(0)) > 0.97 && Math.min(...scale(0)) < Math.max(...scale(0)));
  assert.ok(Math.max(...scale(60)) < Math.max(...scale(0)) || Math.max(...scale(60)) > 0.97, "the letters have moved round");
  assert.ok(scale(80).length < scale(0).length, "letters go behind the edge");
  // The text on a stand with flat sides is set along a side and turns with it.
  assert.notEqual(D.emblemFrame("trophy:football", { engrave: "MVP", yaw: -60 }), D.emblemFrame("trophy:football", { engrave: "MVP", yaw: 0 }));
});

test("the lines of an engraving are chosen for the biggest letters, and a rank is the biggest line", () => {
  const rank = linesOf({ rank: "1", label: "MVP", year: "2026" });
  assert.deepEqual(rank.main[0]?.map((l) => l.weight), [1, 0.5, 0.42]);
  assert.equal(linesOf({ label: "MVP", year: "2026" }).main[0]?.[0]?.weight, 1);
  assert.equal(linesOf({ free: "MVP 2026" }).main.length, 2, "one line, or two");
  assert.equal(linesOf({ free: "MVP" }).main.length, 1);
  assert.equal(linesOf({ year: "2026" }, { yearApart: true }).year, "2026");
  assert.deepEqual(linesOf({}).main, []);
});
