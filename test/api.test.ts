// The composing API: labels, data addresses, sprite sheets, the equipment of a sport, the podium and the award case.
import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { encodeSvg } from "../src/emblems/emblem.uri.ts";
import { safeImage } from "../src/emblems/emblem.display.ts";
import { wellFormed } from "./helpers.ts";

const tags = (svg: string): number => (svg.match(/<[A-Za-z]/g) ?? []).length;
const decode = (uri: string): string => decodeURIComponent(uri.slice("data:image/svg+xml;utf8,".length));
const HOSTILE = `</title><script>alert(1)</script>"&'<`;
const UNSAFE = /<script|<foreignObject|\son[a-z]+\s*=|javascript:|<iframe|<a[\s>]/i;

test("locale writes the Japanese name and title writes, or drops, the title, in every kind of emblem", () => {
  for (const id of ["medal:gold", "trophy:hockey-cup", "trophy:cup", "crest:shield", "sport:nhl", "award:crown", "ball:soccer", "gear:hurley", "gear:cricket-bat"] as const) {
    const ja = D.renderEmblem(id, { locale: "ja" });
    assert.ok(ja.includes(`<title>${D.emblemName(id, "ja")}</title>`), id);
    assert.ok(ja.includes(' lang="ja"'), id);
    assert.equal(D.renderEmblem(id, { locale: "en" }), D.renderEmblem(id), id);
    const own = D.renderEmblem(id, { title: "Champions & 'friends' <3" });
    assert.ok(own.includes("<title>Champions &amp; 'friends' &lt;3</title>"), id);
    assert.equal(own.match(/<title>/g)?.length, 1, id);
    const none = D.renderEmblem(id, { title: false });
    assert.ok(!none.includes("<title>") && none.includes(' aria-hidden="true"') && !none.includes('role="img"'), id);
    assert.equal(wellFormed(none), null, id);
    assert.equal(wellFormed(own), null, id);
    // A title of the caller's own beats the locale.
    assert.ok(D.renderEmblem(id, { title: "Mine", locale: "ja" }).includes("<title>Mine</title>"), id);
    // Every style and the turning view carry it.
    assert.ok(D.emblemFrame(id, { yaw: 40, title: "Turned" }).includes("<title>Turned</title>"), id);
    assert.ok(D.renderEmblem(id, { style: "line", locale: "ja" }).includes("<title>"), id);
  }
  assert.ok(D.crest({ locale: "ja" }).includes("<title>盾形のエンブレム</title>"));
  assert.ok(D.medal("gold", { title: false }).includes("aria-hidden"));
  assert.ok(D.TROPHY_HOCKEY_CUP.svg({ locale: "ja" }).includes("<title>帯を何段も重ねた背の高い銀のカップ</title>"));
});

test("a hostile title cannot reach the markup, and an empty one is the emblem's own name", () => {
  const svg = D.renderEmblem("medal:gold", { title: HOSTILE });
  assert.doesNotMatch(svg, UNSAFE);
  assert.equal(wellFormed(svg), null);
  assert.ok(svg.includes("&lt;script&gt;"));
  assert.equal(D.renderEmblem("medal:gold", { title: "   " }), D.renderEmblem("medal:gold"));
  assert.ok(D.renderEmblem("medal:gold", { title: "$&$1" }).includes("<title>$&amp;$1</title>"));
  assert.equal(D.renderEmblem("medal:gold", { title: "x".repeat(900) }).match(/<title>(x*)<\/title>/)?.[1]?.length, 300);
});

test("emblemDataUri is a properly encoded data address that holds the same drawing", () => {
  for (const id of D.EMBLEM_IDS.filter((_, i) => i % 7 === 0)) {
    const uri = D.emblemDataUri(id, { size: 48 });
    assert.ok(uri.startsWith("data:image/svg+xml;utf8,%3Csvg"), id);
    // Nothing in it can end an attribute, a quoted or an unquoted url(), or start a character reference.
    assert.doesNotMatch(uri, /["'()<>&\s#]/, id);
    const svg = decode(uri);
    assert.equal(wellFormed(svg), null, id);
    assert.doesNotMatch(svg, /currentColor/, id);
    assert.equal(uri, D.emblemDataUri(id, { size: 48 }), id);
  }
  // Japanese and hostile titles survive the round trip.
  const svg = decode(D.emblemDataUri("medal:gold", { locale: "ja" }));
  assert.ok(svg.includes("<title>金メダル</title>"));
  const bad = decode(D.emblemDataUri("medal:gold", { title: HOSTILE }));
  assert.equal(wellFormed(bad), null);
  assert.equal(encodeSvg("a b#c%d'e(f)g\"h<i>j&k"), "a%20b%23c%25d%27e%28f%29g%22h%3Ci%3Ej%26k");
});

test("emblemDataUri settles the ink: color wins, then the theme, and light is the default", () => {
  const ink = (o: D.DataUriOptions): string => decode(D.emblemDataUri("sport:nhl", o));
  assert.ok(ink({ color: "#ff0000" }).includes('stroke="#ff0000"'));
  assert.ok(ink({ color: "rgb(0, 128, 0)" }).includes("#008000"));
  assert.ok(ink({ color: "#ff0000", theme: "dark" }).includes("#ff0000"));
  assert.ok(ink({ color: "red; x" }).includes(D.EMBLEM_INK.light), "an unreadable colour is ignored");
  assert.ok(ink({}).includes(D.EMBLEM_INK.light));
  assert.ok(ink({ theme: "light" }).includes(D.EMBLEM_INK.light));
  assert.ok(ink({ theme: "dark" }).includes(D.EMBLEM_INK.dark));
  const auto = ink({ theme: "auto" });
  assert.ok(auto.includes("prefers-color-scheme:dark") && auto.includes(`svg{color:${D.EMBLEM_INK.light}}`));
  assert.ok(ink({ style: "line", color: "#123456" }).split("#123456").length > 2);
  // A metal medal is not drawn in the ink, and a hostile colour does not reach the markup.
  assert.doesNotMatch(ink({ color: `#fff"/><script>` }), UNSAFE);
});

test("a sprite holds each emblem once, with unique ids, and its uses are small", () => {
  const ids = ["ball:soccer", "medal:gold", "trophy:hockey-cup", "gear:hurley", "ball:basketball", "medal:silver"] as const;
  const sprite = D.emblemSprite(ids);
  assert.equal(wellFormed(sprite.sheet), null);
  assert.ok(sprite.sheet.includes('aria-hidden="true"') && !sprite.sheet.includes("display:none"));
  assert.equal(sprite.sheet.match(/<symbol /g)?.length, ids.length);
  assert.ok(!sprite.sheet.includes("<title>"));
  const defined = [...sprite.sheet.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(defined).size, defined.length, "every id in the sheet is unique");
  // Every reference points at an id the sheet defines.
  for (const m of sprite.sheet.matchAll(/(?:url\(#|href="#)([^")]+)/g)) assert.ok(defined.includes(m[1]), `${m[1]} is not defined`);
  const use = sprite.use("ball:soccer", { size: 24, class: "tiny", title: "Ball <1>" });
  assert.equal(wellFormed(use), null);
  assert.match(use, /^<svg width="24" height="24" role="img" class="tiny"><title>Ball &lt;1&gt;<\/title><use href="#[^"]+"\/><\/svg>$/);
  assert.ok(defined.includes(/href="#([^"]+)"/.exec(use)?.[1] ?? ""));
  assert.ok(sprite.use("medal:gold", { title: false }).includes('aria-hidden="true"') && !sprite.use("medal:gold", { title: false }).includes("<title>"));
  assert.ok(sprite.use("medal:gold", { locale: "ja" }).includes("<title>金メダル</title>"));
  assert.ok(sprite.use("gear:hurley", { size: 99999 }).includes('width="4096"'));
  assert.throws(() => sprite.use("ball:golf"), /not in this sprite/);
  assert.throws(() => D.emblemSprite(["ball:nonesuch"]), /Unknown emblem/);
  assert.equal(sprite.sheet, D.emblemSprite(ids).sheet, "the same call gives the same sheet");
  assert.doesNotMatch(sprite.sheet + use, UNSAFE);
});

test("two sprites in one page cannot meet: their ids differ", () => {
  const a = D.emblemSprite(["ball:soccer"], { tint: "#c8102e" });
  const b = D.emblemSprite(["ball:soccer"], { tint: "#1f4e9c" });
  const idsOf = (s: string): string[] => [...s.matchAll(/ id="([^"]+)"/g)].map((m) => m[1] as string);
  assert.equal(idsOf(a.sheet).filter((id) => idsOf(b.sheet).includes(id)).length, 0);
  assert.ok(D.emblemSprite(["medal:gold"], { prefix: "bracket" }).sheet.includes('id="bracket-medal-gold"'));
  assert.doesNotMatch(D.emblemSprite(["medal:gold"], { prefix: 'x"><script>' }).sheet, UNSAFE);
});

test("a sprite's theme is on the use, a style in an id, and the sprite agrees with the inline drawing in shape", () => {
  const dark = D.emblemSprite(["sport:nhl"], { theme: "dark" });
  assert.ok(dark.use("sport:nhl").includes(`color="${D.EMBLEM_INK.dark}"`));
  const auto = D.emblemSprite(["sport:nhl"], { theme: "auto" });
  assert.ok(auto.sheet.includes("prefers-color-scheme:dark") && /class="dgs/.test(auto.use("sport:nhl")));
  const mixed = D.emblemSprite(["medal:gold", "medal:gold/line"]);
  assert.equal(mixed.sheet.match(/<symbol /g)?.length, 2);
  assert.ok(mixed.use("medal:gold/line").includes("-medal-gold-line"));
  assert.equal(D.emblemSprite(["cup", "trophy:cup"]).sheet.match(/<symbol /g)?.length, 1, "a short name and its id are one symbol");
});

test("sixty-four uses of a ball and of a medal cost a fraction of the nodes and the bytes", () => {
  for (const ids of [["ball:soccer"], ["medal:gold"], ["ball:soccer", "medal:gold"]] as const) {
    const sprite = D.emblemSprite(ids);
    const list = Array.from({ length: 64 }, (_, i) => ids[i % ids.length] as D.EmblemId);
    const inline = list.map((id) => D.renderEmblem(id, { size: 24 })).join("");
    const used = sprite.sheet + list.map((id) => sprite.use(id, { size: 24 })).join("");
    assert.ok(tags(used) * 5 < tags(inline), `${ids}: ${tags(used)} nodes against ${tags(inline)}`);
    assert.ok(used.length * 5 < inline.length, `${ids}: ${used.length} bytes against ${inline.length}`);
  }
});

test("every sport has equipment, and every id in it is in the registry", () => {
  assert.equal(D.SPORT_NAMES.length, 33);
  const noBall: string[] = [];
  for (const sport of D.SPORT_NAMES) {
    const e = D.sportEquipment(sport);
    assert.equal(e.sport, sport);
    if (e.ball === undefined) noBall.push(sport);
    else {
      assert.ok(D.isEmblemId(e.ball) && D.isBallId(e.ball), `${sport} ball ${e.ball}`);
    }
    for (const g of e.gear) assert.ok(D.GEAR_IDS.includes(g), `${sport} gear ${g}`);
    assert.equal(new Set(e.gear).size, e.gear.length, sport);
    assert.ok(D.TROPHY_IDS.includes(e.trophy), `${sport} trophy ${e.trophy}`);
    if (e.medal !== undefined) assert.ok(D.MEDAL_IDS.includes(e.medal), `${sport} medal`);
    // And every id draws.
    for (const id of [e.ball, ...e.gear, e.trophy, e.medal]) if (id !== undefined) assert.ok(D.renderEmblem(id).startsWith("<svg"), id);
  }
  assert.deepEqual(noBall.sort(), ["artisticswimming", "diving", "skating", "swimming"]);
  assert.deepEqual(D.sportEquipment("nhl"), { sport: "nhl", ball: "ball:puck", gear: ["gear:hockey-stick", "gear:hockey-skate", "gear:goalie-mask", "gear:goal-net"], trophy: "trophy:hockey-cup" });
  // The ball of a sport is the one its own sport icon names, wherever the ball is named for the sport.
  assert.equal(D.sportEquipment("soccer").ball, "ball:soccer");
  const e = D.sportEquipment("nhl");
  e.gear.push("gear:hurley");
  assert.equal(D.sportEquipment("nhl").gear.length, 4, "the arrays are new each time");
  assert.throws(() => D.sportEquipment("chess" as D.SportName), /Unknown sport/);
  assert.throws(() => D.sportEquipment("__proto__" as D.SportName), /Unknown sport/);
});

test("a podium has three steps, titled and described, in every style, theme and language", () => {
  const places = [{ name: "Aoki", label: "9.80 s" }, { name: "Brown" }, { name: "Chen", emblem: "trophy:hockey-cup" }] as const;
  for (const style of D.EMBLEM_STYLES) {
    for (const theme of ["inherit", "auto", "light", "dark"] as const) {
      const svg = D.podium(places, { style, theme });
      const where = `${style} ${theme}`;
      assert.equal(wellFormed(svg), null, where);
      assert.match(svg, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="[\d. -]+" width="320" height="[\d.]+" role="img"/, where);
      assert.ok(svg.includes("<title>Podium</title>") && svg.includes("<desc>1st: Aoki (9.80 s); 2nd: Brown; 3rd: Chen</desc>"), where);
      assert.doesNotMatch(svg, UNSAFE, where);
      assert.doesNotMatch(svg, /NaN|undefined|Infinity|null/, where);
      const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
      assert.equal(new Set(ids).size, ids.length, `${where}: unique ids`);
      for (const m of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(m[1]), `${where}: ${m[1]}`);
      assert.equal(svg, D.podium(places, { style, theme }), where);
      assert.ok(svg.length < 24_000, `${where}: ${svg.length} bytes`);
    }
  }
  assert.ok(D.podium(places, { theme: "dark" }).includes(`color="${D.EMBLEM_INK.dark}"`));
  assert.ok(D.podium(places, { theme: "auto" }).includes("prefers-color-scheme:dark"));
  const ja = D.podium(places, { locale: "ja" });
  assert.ok(ja.includes("<title>表彰台</title>") && ja.includes("1位：Aoki") && ja.includes(' lang="ja"'));
  assert.ok(D.podium(places, { title: false }).includes('aria-hidden="true"') && !D.podium(places, { title: false }).includes("<title>"));
  assert.ok(D.podium(places, { title: "Final", desc: "Men's final" }).includes("<desc>Men's final</desc>"));
  assert.ok(D.podium(places, { width: 640 }).includes('width="640"'));
  // The emblems inside have no titles of their own, so a screen reader is not told twice.
  assert.equal(D.podium(places).match(/<title>/g)?.length, 1);
});

test("a podium with places left out still has three steps, and a place without a name says its emblem", () => {
  assert.equal(wellFormed(D.podium([])), null);
  assert.equal(D.podium([]).match(/>[123]</g)?.length, 3);
  const two = D.podium([{ emblem: "medal:gold" }, null]);
  assert.ok(two.includes("<desc>1st: Gold medal</desc>"));
  assert.equal(wellFormed(two), null);
  assert.ok(D.podium([{ emblem: "medal:gold" }], { locale: "ja" }).includes("1位：金メダル"));
});

test("a podium's text is escaped and cut, and a hostile name or label cannot reach the markup", () => {
  const svg = D.podium([{ name: HOSTILE, label: HOSTILE }, { name: "A very long name that cannot fit on the step" }, { name: "日本語の長い名前がとても長い場合です" }]);
  assert.equal(wellFormed(svg), null);
  assert.doesNotMatch(svg, UNSAFE);
  assert.ok(svg.includes("…"));
  assert.doesNotMatch(svg.replace(/<desc>.*?<\/desc>/, ""), /cannot fit on the step/);
  assert.ok(!D.podium([{ emblem: "medal:gold" }, { name: "x" }], { title: HOSTILE, desc: HOSTILE }).match(UNSAFE));
  assert.throws(() => D.podium([{ emblem: "nonesuch" }]), /Unknown emblem/);
});

test("a flag is an image: SVG markup becomes an inert data address, and a URL must be safe", () => {
  const flag = '<svg viewBox="0 0 3 2" onload="alert(1)"><script>alert(2)</script><rect width="3" height="2" fill="#bc002d"/></svg>';
  const uri = safeImage(flag) as string;
  assert.ok(uri.startsWith("data:image/svg+xml;utf8,%3Csvg%20xmlns"), "a namespace is added when the flag has none");
  assert.doesNotMatch(uri, /["'()<>&\s#]/);
  const svg = D.podium([{ name: "Japan", flag }, { flag: "https://example.com/flags/ca.svg?v=1&w=2" }, { flag: "/flags/fr.svg" }]);
  assert.equal(wellFormed(svg), null);
  // The hostile markup is only inside a data address (percent-encoded), never in the document.
  assert.doesNotMatch(svg, /<script|onload=|alert\(/);
  assert.equal(svg.match(/<image /g)?.length, 3);
  assert.ok(svg.includes('href="https://example.com/flags/ca.svg?v=1&amp;w=2"'));
  assert.ok(svg.includes('href="/flags/fr.svg"'));
  for (const bad of ["javascript:alert(1)", "http://example.com/a.svg", "//evil.com/a.svg", "https://user:pw@x.com/a.svg", "https://x.com/a b.svg", 'https://x.com/"onload="x', "data:text/html,<script>", "data:image/svg+xml,<svg/>\"x", "file:///etc/passwd", "../../../etc/passwd\"", "", "   ", 5, null, {}]) {
    assert.equal(safeImage(bad), undefined, String(bad));
  }
  assert.equal(safeImage("./f.svg"), "./f.svg");
  assert.equal(safeImage("data:image/png;base64,iVBORw0KGgo="), "data:image/png;base64,iVBORw0KGgo=");
  assert.equal(D.podium([{ flag: "javascript:alert(1)" }]).match(/<image /g), null);
});

test("an award case draws each trophy once with a count badge, wraps into rows, and describes itself", () => {
  const items = [
    { emblem: "trophy:hockey-cup", count: 3, label: "2001, 2004, 2011" },
    { emblem: "medal:gold" },
    { emblem: "trophy:cup", count: 12 },
    { emblem: "ball:soccer", count: 1000 },
    { emblem: "crest:shield" },
    { emblem: "trophy:cup", count: 2 },
    { emblem: "award:star", count: 0 },
    { emblem: "award:crown", count: -4 },
  ] as const;
  for (const layout of ["shelf", "row"] as const) {
    for (const style of D.EMBLEM_STYLES) {
      for (const theme of ["inherit", "auto", "light", "dark"] as const) {
        const svg = D.awardCase(items, { layout, style, theme });
        const where = `${layout} ${style} ${theme}`;
        assert.equal(wellFormed(svg), null, where);
        assert.ok(svg.includes("<title>Award case</title>"), where);
        assert.ok(svg.includes("×3") && svg.includes("×12") && svg.includes("×999") && svg.includes("×2"), where);
        assert.ok(!svg.includes("×1<") && !svg.includes("×0") && !svg.includes("×-"), where);
        assert.doesNotMatch(svg, UNSAFE, where);
        assert.doesNotMatch(svg, /NaN|undefined|Infinity|null/, where);
        const ids = [...svg.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
        assert.equal(new Set(ids).size, ids.length, `${where}: unique ids`);
        assert.equal(svg, D.awardCase(items, { layout, style, theme }), where);
        assert.equal(svg.match(/<title>/g)?.length, 1, where);
      }
    }
  }
  const svg = D.awardCase(items);
  assert.ok(svg.includes("<desc>Tall banded silver cup ×3 (2001, 2004, 2011), Gold medal, Cup ×12, Soccer ball ×999, Shield crest, Cup ×2</desc>"));
  const shelves = svg.match(/<rect x="8" y="[\d.]+" width="\d+" height="6"/g) ?? [];
  assert.equal(shelves.length, 2, "six items at five a row are two shelves");
  assert.equal(D.awardCase(items, { perRow: 3 }).match(/<rect x="8" y="[\d.]+" width="\d+" height="6"/g)?.length, 2);
  assert.equal(D.awardCase(items, { perRow: 2 }).match(/<rect x="8" y="[\d.]+" width="\d+" height="6"/g)?.length, 3);
  assert.equal(D.awardCase(items, { layout: "row" }).match(/height="6" rx="2"/g), null);
  assert.ok(D.awardCase(items, { locale: "ja" }).includes("<title>トロフィーケース</title>") && D.awardCase(items, { locale: "ja" }).includes("金メダル"));
  assert.ok(D.awardCase(items, { width: 300 }).includes('width="300"'));
  assert.ok(D.awardCase(items, { locale: "ja" }).includes("<desc>帯を何段も重ねた背の高い銀のカップ 3回（2001, 2004, 2011）、金メダル、"));
  // The same trophy twice shares its definitions.
  const twice = D.awardCase([{ emblem: "trophy:hockey-cup" }, { emblem: "trophy:hockey-cup", count: 2 }]);
  const gradients = [...twice.matchAll(/<linearGradient id="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(gradients).size, gradients.length);
});

test("an award case with nothing in it, or too much, or hostile text, is still safe", () => {
  assert.equal(wellFormed(D.awardCase([])), null);
  assert.equal(wellFormed(D.awardCase([{ emblem: "medal:gold", count: Number.NaN }, { emblem: "medal:gold", count: Infinity }])), null);
  const many = D.awardCase(Array.from({ length: 200 }, () => ({ emblem: "medal:gold" })));
  assert.equal(wellFormed(many), null);
  assert.equal(many.match(/<desc>.*<\/desc>/)?.[0].split("Gold medal").length, 61);
  const hostile = D.awardCase([{ emblem: "medal:gold", label: HOSTILE, count: 2 }], { title: HOSTILE, desc: HOSTILE, perRow: Number.NaN, size: Number.NaN });
  assert.doesNotMatch(hostile, UNSAFE);
  assert.equal(wellFormed(hostile), null);
  assert.ok(D.awardCase([{ emblem: "medal:gold" }], { size: 5000 }).includes("viewBox"));
  assert.throws(() => D.awardCase([{ emblem: "nonesuch" }]), /Unknown emblem/);
});

test("a podium and an award case are small", () => {
  const places = [{ name: "Aoki" }, { name: "Brown" }, { name: "Chen" }];
  assert.ok(D.podium(places).length < 9_000, `${D.podium(places).length}`);
  assert.ok(D.awardCase([{ emblem: "medal:gold", count: 2 }, { emblem: "medal:silver" }, { emblem: "medal:bronze" }]).length < 8_000);
});
