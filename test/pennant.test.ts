import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { wellFormed } from "./helpers.ts";

interface Line {
  text: string;
  x: number;
  y: number;
  size: number;
  width: number;
}
const lines = (svg: string): Line[] =>
  [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)" font-size="([\d.]+)" textLength="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].map((m) => ({ text: m[5] as string, x: Number(m[1]), y: Number(m[2]), size: Number(m[3]), width: Number(m[4]) }));
/** Half the height of the felt at x: its edges run from 15 and 49 at the dowel to the point at 60. */
const half = (x: number): number => 17 - ((x - 8) * 17) / 52;

test("pennant() letters the words and the year in capitals, and it is the one pennant emblem", () => {
  assert.deepEqual(D.PENNANT_IDS, ["pennant:championship"]);
  assert.equal(D.emblemInfo("pennant:championship").kind, "flat");
  const svg = D.pennant({ colors: ["#1f4e8c", "#f2c230"], text: "Champions", year: 2026 });
  assert.deepEqual(lines(svg).map((l) => l.text), ["CHAMPIONS", "2026"]);
  assert.ok(svg.includes("#1f4e8c") && svg.includes("#f2c230"));
  assert.ok(svg.includes("<title>Championship pennant</title>"));
  assert.equal(D.pennant(), D.renderEmblem("pennant:championship"));
  assert.equal(D.pennant({ colors: "#1f4e8c" }), D.pennant({ colors: ["#1f4e8c"] }));
  assert.equal(D.pennant({ colors: ["nope"] }), D.pennant());
  assert.deepEqual(lines(D.pennant()), [], "no words, no lettering");
});

test("a pennant is lettered with the engraving options too: text, label and rank, and year", () => {
  assert.deepEqual(lines(D.renderEmblem("pennant:championship", { engrave: "MVP", year: 1999 })).map((l) => l.text), ["MVP", "1999"]);
  assert.deepEqual(lines(D.renderEmblem("pennant:championship", { label: "Champs", year: 2026 })).map((l) => l.text), ["CHAMPS", "2026"]);
  assert.deepEqual(lines(D.renderEmblem("pennant:championship", { rank: 1, label: "Place" })).map((l) => l.text), ["1 PLACE"]);
  assert.deepEqual(lines(D.renderEmblem("pennant:championship", { engrave: "State\nChampions" })).map((l) => l.text), ["STATE", "CHAMPIONS"], "a line break is a new line");
  assert.deepEqual(lines(D.pennant({ label: "Cup", rank: 2 })).map((l) => l.text), ["2 CUP"]);
  assert.deepEqual(lines(D.renderEmblem("pennant:championship", { engrave: "優勝", year: "令和八年" })).map((l) => l.text), ["優勝", "令和八年"], "Japanese is kept");
});

test("the lettering is fitted inside the triangle, however long the words, and gets smaller as they grow", () => {
  for (const text of ["MVP", "Champions", "State Champions", "WWWWWWWWWWWW", "優勝記念大会", "a", "ABCDEFGHIJKLMNOPQRSTUVWX"]) {
    for (const year of [undefined, 2026]) {
      const rows = lines(D.pennant({ text, year }));
      assert.ok(rows.length > 0, text);
      for (const row of rows) {
        const end = row.x + row.width;
        assert.ok(end <= 56.01, `${text}: ends at ${end}`);
        assert.ok(row.size >= (0.8), `${text}: size ${row.size}`);
        assert.ok(row.y - row.size * 0.8 >= 32 - half(end) + 3 - 0.01 && row.y <= 32 + half(end) - 3 + 0.01 + row.size * 0.04, `${text}: ${row.text} is inside the edge at its end`);
      }
    }
  }
  const size = (text: string): number => lines(D.pennant({ text }))[0]?.size as number;
  assert.ok(size("MVP") > size("Champions") && size("Champions") > size("State Champions"));
});

test("a pennant is felt in metal (a speckle of fibres and a soft light), flat in colour, an outline in line, and always stitched", () => {
  const metal = D.pennant({ text: "A" });
  assert.match(metal, /<pattern id="dgpf[0-9a-f]{6}"/);
  assert.match(metal, /id="dgsp"/);
  const color = D.pennant({ text: "A", style: "color" });
  assert.doesNotMatch(color, /pattern|Gradient/);
  const line = D.pennant({ text: "A", style: "line" });
  assert.doesNotMatch(line, /pattern|Gradient|#[0-9a-f]{6}/i);
  for (const svg of [metal, color, line]) assert.match(svg, /stroke-dasharray="1\.9 1\.5"/, "stitched");
  assert.notEqual(D.pennant({ colors: ["#1f4e8c"] }), D.pennant({ colors: ["#c8102e"] }));
  assert.ok(D.pennant({ colors: ["#1f4e8c"] }).includes('id="dgpf1f4e8c"'), "the felt pattern is named for its colour, so two in a page agree");
});

test("the back of a pennant is plain felt with the dowel on the other side, and the front can be asked for the back", () => {
  const back = D.pennant({ text: "Champions", year: 2026, view: "back" });
  assert.deepEqual(lines(back), []);
  assert.match(back, /translate\(64 0\) scale\(-1 1\)/);
  assert.notEqual(back, D.pennant({ text: "Champions" }));
  assert.equal(D.emblemFrame("pennant:championship", { view: "back", yaw: 0 }), D.renderEmblem("pennant:championship", { view: "back" }));
  assert.deepEqual(lines(D.pennant({ text: "Champions", yaw: 180 })), [], "turned over, it shows its back");
  assert.deepEqual(lines(D.pennant({ text: "Champions", yaw: 20 })).map((l) => l.text), ["CHAMPIONS"]);
  assert.deepEqual(lines(D.pennant({ text: "Champions", yaw: 180, view: "back" })).map((l) => l.text), ["CHAMPIONS"], "a pennant that starts on its back turns to its front");
});

test("pennant text is escaped and cleaned", () => {
  const hostile = D.pennant({ text: '<script>alert(1)</script>"&', year: "<b>2026</b>" });
  assert.doesNotMatch(hostile, /<script|<b>/);
  assert.equal(wellFormed(hostile), null);
  assert.equal(wellFormed(D.pennant({ text: "A\u0000B\u0007", year: "\u001b" })), null);
  assert.deepEqual(lines(D.pennant({ text: "x".repeat(60) })).map((l) => l.text.length), [24], "24 letters at most");
});
