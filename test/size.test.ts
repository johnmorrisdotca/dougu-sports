// The bundle-size test: esbuild bundles one named item, and the result stays small. This is what `sideEffects: false` and the `@__PURE__` marks are for: an item's own module takes the item and
// the small renderer it needs, and nothing else, so a page that wants one ball does not pay for every emblem.
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { test } from "node:test";

import { build } from "esbuild";

const root = new URL("..", import.meta.url).pathname;

async function bundle(contents: string, external: string[] = []): Promise<{ text: string; bytes: number; gzip: number }> {
  const result = await build({ stdin: { contents, resolveDir: root, loader: "ts" }, bundle: true, minify: true, format: "esm", write: false, treeShaking: true, logLevel: "silent", external });
  const text = result.outputFiles[0]?.text ?? "";
  return { text, bytes: Buffer.byteLength(text), gzip: gzipSync(text).length };
}
const one = (constant: string, path: string): Promise<{ text: string; bytes: number; gzip: number }> => bundle(`import { ${constant} } from "./src/emblems/${path}.ts"; console.log(${constant}.svg());`);

// Measured 2026-10-14 (esbuild 0.25, minified, gzipped). A limit has room for an edit and not for a regression: when art is added, an item may grow, and the limit is raised on purpose.
// Each kind of emblem has a renderer, and the renderer is most of an item's weight: the ball's is small, the flat renderer (medals, crests, plaques) is about 3 kB, and the body of revolution that turns
// (a cup) is about 5 kB, which is the price of its metal, its handles, its balls and its seams. A pictogram or an icon is a few hundred bytes of art on a small renderer.
// Measured again 2026-10-14 with engraving and the one coin-flip turn in: a medal or a plaque 4.5 kB (was 3.2), a cup 6.9 kB (was 5.6), a pictogram 3.7 to 4.1 kB (was 1.8 to 2.7; the sumo and the handball hand are outlines of many points), a pennant 3.3 kB.
// The turning (`bindTurn`) is about 2.5 kB on top of the emblem: measured 2026-10-14 at 9.4 kB with a cup (6.9 kB of it the cup), 2.5 kB with no emblem.
// Measured 2026-10-15 with the printing hooks in the engine (a surface can fill its disc and carry a label area, the draw hook takes the paint and the printer): a ball 7.3 kB (was 6.5), so the limit is 7.6 kB.
// The printing itself (the warp onto the sphere, the cursive script, the block lettering, the sanitiser) is its own module, taken by `printed(ball)`: a printed baseball 19.5 kB, held to 21 kB; the balls' own modules carry none of it.
// Measured 2026-10-21 with the slab turn in (a medal, a crest or a plaque now turns through the one `flipSvg`: a solid edge, a back of its own): a medal 5.6 kB (was 4.6), held to 5.8 kB; an icon or a pictogram grew by about 0.2 kB.
// Measured 2026-10-30 with the hook for a body's own framed 3D parts (`lathe.framed.ts`), the elevation cap and the thin edge in the engine: a cup 7.3 kB (was 6.9), held to 7.5 kB; the parts themselves are in a module of their own, taken only by a model that has them.
// Measured 2026-10-21 with the pickleball's real holes in (ball.holes.ts, taken by the pickleballs alone): a pickleball 8.0 kB, held to 8.6 kB; the other balls did not change.
// Measured 2026-10-30 with the hook for cut-outs and ribbons in the body of revolution (its drawing is `lathe.sculpt.ts`, taken only by a model that has parts): a cup 7.3 kB (was 7.1), held to 7.3 kB.
// Measured 2026-10-30 with the NBA balls' hook in the body of revolution (a ball set forward from the axis and handed to the model's own `ballExtras`, which the cups do not carry): a cup 7.2 to 7.3 kB (was 7.1 to 7.2), held to 7.4 kB.
const LIMITS = { holed: 8.6 * 1024, puck: 12.5 * 1024, ball: 7.6 * 1024, printed: 21 * 1024, twoTone: 9.6 * 1024, flat: 5.8 * 1024, lathe: 7.5 * 1024, icon: 4.3 * 1024, pennant: 3.6 * 1024, turn: 3 * 1024, turned: 10 * 1024 };

test("one named ball, bundled by itself, stays small and leaves the other emblems out", async () => {
  const b = await one("BALL_SOCCER", "ball/ball.soccer");
  assert.ok(b.gzip < LIMITS.ball, `${b.gzip} bytes gzipped`);
  assert.ok(b.text.includes("ball:soccer"));
  assert.ok(!b.text.includes("medal:gold") && !b.text.includes("Gold medal"), "the medal came along");
});

test("a pickleball carries the code of its holes and every other ball carries none of it", async () => {
  const b = await one("BALL_PICKLEBALL_OUTDOOR", "ball/ball.pickleball");
  assert.ok(b.gzip < LIMITS.holed, `${b.gzip} bytes gzipped`);
  assert.ok(b.text.includes("evenodd") && b.text.includes("<mask"), "the holes are not in the pickleball");
  const golf = await one("BALL_GOLF", "ball/ball.golf");
  assert.ok(golf.gzip < LIMITS.ball, `${golf.gzip} bytes gzipped`);
  assert.ok(!golf.text.includes("<mask"), "the golf ball took the holes");
});

test("a ball bundled by itself carries none of the printing code, and printed() takes it with the ball", async () => {
  const plain = await one("BALL_SOCCER", "ball/ball.soccer");
  assert.ok(!plain.text.includes("data:image") && !plain.text.includes("evenodd"), "the plain ball took the printing");
  const seamed = await one("BALL_BASEBALL", "ball/ball.baseball");
  assert.ok(seamed.gzip < LIMITS.twoTone, `${seamed.gzip} bytes gzipped`);
  const printed = await bundle(`import { BALL_BASEBALL } from "./src/emblems/ball/ball.baseball.ts"; import { printed } from "./src/emblems/ball/ball.print.ts"; console.log(printed(BALL_BASEBALL).svg({ stamp: true }));`);
  assert.ok(printed.gzip < LIMITS.printed, `${printed.gzip} bytes gzipped`);
  assert.ok(!printed.text.includes("ball:soccer") && !printed.text.includes("medal:gold"), "another emblem came along");
});

test("one printed puck, bundled by itself, carries its lettering and face and no other emblem, and the plain puck carries none of it", async () => {
  const printed = await one("PUCK_CANADA", "ball/ball.puck.print");
  assert.ok(printed.gzip < LIMITS.puck, `${printed.gzip} bytes gzipped`);
  assert.ok(printed.text.includes("puck:canada"));
  assert.ok(!printed.text.includes("ball:soccer") && !printed.text.includes("medal:gold") && !printed.text.includes("Gold medal"), "another emblem came along");
  const plain = await one("BALL_PUCK", "ball/ball.puck");
  assert.ok(plain.gzip < LIMITS.ball, `${plain.gzip} bytes gzipped`);
  assert.ok(!plain.text.includes("clipPath") && !plain.text.includes("puck:canada"), "the plain puck took the print");
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
  assert.ok(!hockey.text.includes("\"mesh\"") && !hockey.text.includes("\"patch\""), "the extra decorations came along with a cup that uses none");
  const russell = await one("TROPHY_BILL_RUSSELL_TROPHY", "trophy/bill-russell-trophy");
  assert.ok(russell.text.includes("\"mesh\""), "the net of the Bill Russell Trophy is missing");
});

test("one icon and one pictogram, bundled by themselves, take only their own drawing", async () => {
  const cup = await one("TROPHY_CUP", "trophy/cup");
  const nhl = await one("SPORT_NHL", "sport/nhl");
  const stone = await one("SPORT_CURLING", "sport/curling");
  const crown = await one("AWARD_CROWN", "award/crown");
  // The two pictograms drawn as one outline each from many points (two wrestlers, a hand) are the biggest, and are held to the same limit.
  const sumo = await one("SPORT_SUMO", "sport/sumo");
  const handball = await one("SPORT_HANDBALL", "sport/handball");
  for (const b of [cup, nhl, stone, crown, sumo, handball]) assert.ok(b.gzip < LIMITS.icon, `${b.gzip} bytes gzipped`);
  // A pictogram carries its own name and none of the other sports'.
  assert.ok(nhl.text.includes("sport:nhl") && !nhl.text.includes("sport:curling") && !nhl.text.includes("trophy:cup"), "the hockey pictogram took another drawing");
  assert.ok(nhl.bytes < 8900, `${nhl.bytes} bytes`);
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

// What a page downloads first: the registry that `bindTurn` loads for an id is a dynamic import, which a bundler makes a chunk of its own, loaded only when an id is bound. It is left out here (as `external`)
// so that the size is the initial one whatever the bundler does with the chunk.
const REGISTRY_CHUNK = [`${root}src/turn-registry.ts`];
const turned = (constant: string, path: string): Promise<{ text: string; bytes: number; gzip: number }> =>
  bundle(`import { bindTurn } from "./src/turn-entry.ts"; import { ${constant} } from "./src/emblems/${path}.ts"; bindTurn(document.body, ${constant}, { size: 96 });`, REGISTRY_CHUNK);

test("bindTurn and one cup, bundled from the turn entry, stay under 10 kB gzipped and leave the registry and every other emblem out", async () => {
  for (const [constant, path] of [["TROPHY_HOCKEY_CUP", "trophy/hockey-cup"], ["TROPHY_BASEBALL", "trophy/baseball"], ["TROPHY_TENNIS_CUP", "trophy/tennis-cup"]] as const) {
    const b = await turned(constant, path);
    assert.ok(b.gzip < LIMITS.turned, `${constant}: ${b.gzip} bytes gzipped`);
    assert.ok(!b.text.includes("ball:soccer") && !b.text.includes("Gold medal") && !b.text.includes("trophy:cup"), `${constant}: another emblem came along`);
    assert.ok(!b.text.includes("Unknown emblem"), `${constant}: the registry's functions came along`);
  }
  const hockey = await turned("TROPHY_HOCKEY_CUP", "trophy/hockey-cup");
  assert.ok(!hockey.text.includes("trophy:baseball"), "another cup came along");
  assert.ok(!hockey.text.includes("\"mesh\"") && !hockey.text.includes("\"patch\""), "the extra decorations came along with a cup that uses none");
  const russell = await one("TROPHY_BILL_RUSSELL_TROPHY", "trophy/bill-russell-trophy");
  assert.ok(russell.text.includes("\"mesh\""), "the net of the Bill Russell Trophy is missing");
  assert.ok(hockey.text.includes("trophy:hockey-cup"), "the cup is not in the bundle");
});

test("bindTurn by itself, with the registry loaded on demand, is a few kilobytes", async () => {
  const b = await bundle(`import { bindTurn } from "./src/turn-entry.ts"; bindTurn(document.body, "trophy:cup", { size: 96 });`, REGISTRY_CHUNK);
  assert.ok(b.gzip < LIMITS.turn, `${b.gzip} bytes gzipped`);
  assert.ok(!b.text.includes("Gold medal") && !b.text.includes("ball:soccer"), "an emblem came along");
  assert.ok(b.text.includes("turn-registry"), "the registry is not a dynamic import");
});

test("the main entry's bindTurn takes the registry with it, and the turn entry's takes none of it", async () => {
  const full = await bundle(`import { bindTurn } from "./src/index.ts"; bindTurn(document.body, "trophy:cup", {});`);
  const light = await bundle(`import { bindTurn } from "./src/turn-entry.ts"; bindTurn(document.body, "trophy:cup", {});`, REGISTRY_CHUNK);
  assert.ok(full.gzip > 20 * light.gzip, `${full.gzip} against ${light.gzip} bytes gzipped`);
});
