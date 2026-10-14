// The bundle-size test: esbuild bundles one named item, and the result stays small. This is what `sideEffects: false` and the `@__PURE__` marks are for: an item's own module takes the item and
// the small renderer it needs, and nothing else, so a page that wants one ball does not pay for every emblem.
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { test } from "node:test";

import { build } from "esbuild";

const root = new URL("..", import.meta.url).pathname;

async function bundle(contents: string): Promise<{ text: string; bytes: number; gzip: number }> {
  const result = await build({ stdin: { contents, resolveDir: root, loader: "ts" }, bundle: true, minify: true, format: "esm", write: false, treeShaking: true, logLevel: "silent" });
  const text = result.outputFiles[0]?.text ?? "";
  return { text, bytes: Buffer.byteLength(text), gzip: gzipSync(text).length };
}
const one = (constant: string, path: string): Promise<{ text: string; bytes: number; gzip: number }> => bundle(`import { ${constant} } from "./src/emblems/${path}.ts"; console.log(${constant}.svg());`);

// Measured 2026-10-14 (esbuild 0.25, minified, gzipped). A limit has room for an edit and not for a regression: when art is added, an item may grow, and the limit is raised on purpose.
// Each kind of emblem has a renderer, and the renderer is most of an item's weight: the ball's is small, the flat renderer (medals, crests, plaques) is about 3 kB, and the body of revolution that turns
// (a cup) is about 5 kB, which is the price of its metal, its handles, its balls and its seams. A pictogram or an icon is a few hundred bytes of art on a small renderer.
// Measured again 2026-10-14 with engraving and the coin-flip turn in: a medal or a plaque 4.5 kB (was 3.2), a cup 6.9 kB (was 5.6), a pictogram 2.7 to 3.6 kB (was 1.8 to 2.7), a pennant 3.4 kB.
const LIMITS = { ball: 6.8 * 1024, flat: 4.6 * 1024, lathe: 7.1 * 1024, icon: 3.8 * 1024, pennant: 3.6 * 1024 };

test("one named ball, bundled by itself, stays small and leaves the other emblems out", async () => {
  const b = await one("BALL_SOCCER", "ball/ball.soccer");
  assert.ok(b.gzip < LIMITS.ball, `${b.gzip} bytes gzipped`);
  assert.ok(b.text.includes("ball:soccer"));
  assert.ok(!b.text.includes("medal:gold") && !b.text.includes("Gold medal"), "the medal came along");
});

test("one medal, one crest and one plaque, each bundled by itself, stay small and leave the ball and the cups out", async () => {
  for (const [constant, path] of [["MEDAL_GOLD", "medal/gold"], ["MEDAL_PLACE_1", "medal/place-1"], ["CREST_SHIELD", "crest/shield"], ["TROPHY_LAUREL", "trophy/laurel"]] as const) {
    const b = await one(constant, path);
    assert.ok(b.gzip < LIMITS.flat, `${constant}: ${b.gzip} bytes gzipped`);
    assert.ok(!b.text.includes("ball:soccer") && !b.text.includes("trophy:hockey-cup"), `${constant}: another emblem came along`);
  }
});

test("one cup, bundled by itself, stays under the limit of a body of revolution and leaves the rest out", async () => {
  for (const [constant, path] of [["TROPHY_HOCKEY_CUP", "trophy/hockey-cup"], ["TROPHY_BASEBALL", "trophy/baseball"], ["TROPHY_TENNIS_CUP", "trophy/tennis-cup"]] as const) {
    const b = await one(constant, path);
    assert.ok(b.gzip < LIMITS.lathe, `${constant}: ${b.gzip} bytes gzipped`);
    assert.ok(!b.text.includes("ball:soccer") && !b.text.includes("Gold medal"), `${constant}: another emblem came along`);
  }
  const hockey = await one("TROPHY_HOCKEY_CUP", "trophy/hockey-cup");
  assert.ok(!hockey.text.includes("trophy:baseball"), "another cup came along");
});

test("one icon and one pictogram, bundled by themselves, take only their own drawing", async () => {
  const cup = await one("TROPHY_CUP", "trophy/cup");
  const nhl = await one("SPORT_NHL", "sport/nhl");
  const stone = await one("SPORT_CURLING", "sport/curling");
  const crown = await one("AWARD_CROWN", "award/crown");
  for (const b of [cup, nhl, stone, crown]) assert.ok(b.gzip < LIMITS.icon, `${b.gzip} bytes gzipped`);
  // A pictogram carries its own name and none of the other sports'.
  assert.ok(nhl.text.includes("sport:nhl") && !nhl.text.includes("sport:curling") && !nhl.text.includes("trophy:cup"), "the hockey pictogram took another drawing");
  assert.ok(nhl.bytes < 8800, `${nhl.bytes} bytes`);
});

test("one pennant, bundled by itself, stays small and leaves the other emblems out", async () => {
  const pennant = await one("PENNANT_CHAMPIONSHIP", "pennant/championship");
  assert.ok(pennant.gzip < LIMITS.pennant, `pennant: ${pennant.gzip} bytes gzipped`);
  for (const b of [pennant]) assert.ok(!b.text.includes("ball:soccer") && !b.text.includes("trophy:hockey-cup") && !b.text.includes("Gold medal"), "another emblem came along");
});

test("a medal with no engraving asked for still carries the engraving code, and an icon carries none of it", async () => {
  const medal = await one("MEDAL_GOLD", "medal/gold");
  const icon = await one("SPORT_NHL", "sport/nhl");
  assert.ok(medal.text.includes("textLength"), "the medal engraves");
  assert.ok(!icon.text.includes("textLength") && !icon.text.includes("Segoe"), "the icon took the engraving code");
});

test("an item imported from the main entry is still dropped when it is not used", async () => {
  const unused = await bundle(`import { BALL_SOCCER, MEDAL_GOLD } from "./src/index.ts"; console.log(MEDAL_GOLD.svg()); void BALL_SOCCER;`);
  const only = await bundle(`import { MEDAL_GOLD } from "./src/index.ts"; console.log(MEDAL_GOLD.svg());`);
  // Importing a name and not calling it adds only what the name needs; the whole registry is not part of it.
  assert.ok(unused.gzip - only.gzip < 1200, `${unused.gzip - only.gzip} bytes more`);
  assert.ok(only.gzip < LIMITS.flat + 1024, `${only.gzip} bytes gzipped`);
});

test("the full registry is bigger than one item, and the bundle of one item is a fraction of it", async () => {
  const all = await bundle(`import * as D from "./src/index.ts"; console.log(D.renderEmblem("medal:gold"), D.EMBLEMS);`);
  const single = await one("BALL_SOCCER", "ball/ball.soccer");
  assert.ok(all.bytes > 8 * single.bytes);
  assert.ok(all.text.includes("ball:soccer") && all.text.includes("medal:gold") && all.text.includes("trophy:hockey-cup"));
});
