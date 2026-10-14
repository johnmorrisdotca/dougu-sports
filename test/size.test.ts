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

// Measured 2026-10-14 (esbuild 0.25, minified, gzipped). A limit has room for an edit and not for a regression: when art is added, an item may grow, and the limit is raised on purpose.
const ONE_ITEM_GZIP_LIMIT = 3 * 1024;

test("one named ball, bundled by itself, stays small and leaves the other emblems out", async () => {
  const one = await bundle(`import { BALL_SOCCER } from "./src/emblems/ball/soccer.ts"; console.log(BALL_SOCCER.svg());`);
  assert.ok(one.gzip < ONE_ITEM_GZIP_LIMIT, `${one.gzip} bytes gzipped`);
  assert.ok(one.text.includes("ball:soccer"));
  assert.ok(!one.text.includes("award:medal"), "the medal came along");
  assert.ok(!one.text.includes("Medal"), "the medal's name came along");
});

test("one named award, bundled by itself, stays small and leaves the ball out", async () => {
  const one = await bundle(`import { AWARD_MEDAL } from "./src/emblems/award/medal.ts"; console.log(AWARD_MEDAL.svg());`);
  assert.ok(one.gzip < ONE_ITEM_GZIP_LIMIT, `${one.gzip} bytes gzipped`);
  assert.ok(!one.text.includes("ball:soccer"), "the ball came along");
  assert.ok(!one.text.includes("Soccer ball"), "the ball's name came along");
});

test("an item imported from the main entry is still dropped when it is not used", async () => {
  const unused = await bundle(`import { BALL_SOCCER, AWARD_MEDAL } from "./src/index.ts"; console.log(AWARD_MEDAL.svg()); void BALL_SOCCER;`);
  const only = await bundle(`import { AWARD_MEDAL } from "./src/index.ts"; console.log(AWARD_MEDAL.svg());`);
  // Importing a name and not calling it adds only what the name needs; the whole registry is not part of it.
  assert.ok(unused.gzip - only.gzip < 1200, `${unused.gzip - only.gzip} bytes more`);
  assert.ok(only.gzip < ONE_ITEM_GZIP_LIMIT + 1024, `${only.gzip} bytes gzipped`);
});

test("the full registry is bigger than one item, and the bundle of one item is a fraction of it", async () => {
  const all = await bundle(`import * as D from "./src/index.ts"; console.log(D.renderEmblem("award:medal"), D.EMBLEMS);`);
  const one = await bundle(`import { BALL_SOCCER } from "./src/emblems/ball/soccer.ts"; console.log(BALL_SOCCER.svg());`);
  assert.ok(all.bytes > one.bytes);
  assert.ok(all.text.includes("ball:soccer") && all.text.includes("award:medal"));
});
