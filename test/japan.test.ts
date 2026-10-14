import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

import * as D from "../src/index.ts";
import { wellFormed } from "./helpers.ts";

const JAPANESE = /^[぀-ヿ一-鿿々ー・（）()0-9A-Za-z]+$/;
const GEAR = ["gear:gunbai", "gear:mawashi", "gear:shinai", "gear:kendo-men", "gear:judogi", "gear:obi", "gear:yumi", "gear:ya", "gear:karate-gi"] as const;
const LONG_JA = ["trophy:basketball", "ball:squash", "ball:football-ifaf", "sport:afl"];
const SPORTS = ["sumo", "kendo", "judo", "kyudo", "karate"] as const;

test("the Japanese sports and their items are in the lists, with the kinds they turn as", () => {
  for (const sport of SPORTS) {
    assert.ok(D.SPORT_NAMES.includes(sport), sport);
    assert.equal(D.emblemInfo(`sport:${sport}`).kind, "icon");
  }
  for (const id of GEAR) {
    assert.ok(D.GEAR_IDS.includes(id), id);
    assert.equal(D.emblemInfo(id).kind, "gear");
    assert.equal(D.emblemInfo(id).source, "drawn");
  }
  assert.equal(D.emblemInfo("trophy:sumo-cup").kind, "lathe");
  assert.equal(D.emblemInfo("trophy:championship-banner").kind, "flat");
  assert.equal(D.renderEmblem("sumo-cup"), D.renderEmblem("trophy:sumo-cup"), "a trophy has a short name");
  assert.equal(D.renderEmblem("championship-banner"), D.renderEmblem("trophy:championship-banner"));
});

test("the Japanese names are the words the governing bodies use, and short enough to be read out as a label", () => {
  const expected: Record<string, string> = {
    "sport:sumo": "相撲", "sport:kendo": "剣道", "sport:judo": "柔道", "sport:kyudo": "弓道", "sport:karate": "空手",
    "gear:gunbai": "軍配", "gear:mawashi": "廻し", "gear:shinai": "竹刀", "gear:kendo-men": "剣道の面", "gear:judogi": "柔道衣", "gear:obi": "武道の帯", "gear:yumi": "弓道の弓", "gear:ya": "弓道の矢", "gear:karate-gi": "空手衣",
    "trophy:championship-banner": "優勝旗", "trophy:sumo-cup": "鳳凰飾りの銀杯",
  };
  for (const [id, ja] of Object.entries(expected)) assert.equal(D.emblemName(id as D.EmblemId, "ja"), ja, id);
  for (const id of GEAR) assert.ok(D.emblemInfo(id).description !== undefined && /[぀-ヿ一-鿿]/.test(D.emblemInfo(id).description?.ja ?? ""), id);
});

test("every emblem has a short accessible name, and the longer description is kept apart", () => {
  for (const id of D.EMBLEM_IDS) {
    const info = D.emblemInfo(id);
    assert.ok(info.en.length <= 26, `${id}: "${info.en}" is ${info.en.length} characters`);
    // A few names are allowed to run over: the established words are longer than the limit.
    assert.ok([...info.ja].length <= 12 || LONG_JA.includes(id), `${id}: "${info.ja}" is ${[...info.ja].length} characters`);
    assert.match(info.ja, JAPANESE, id);
    assert.ok(D.renderEmblem(id).includes(`<title>${info.en}</title>`), id);
    if (info.description !== undefined) assert.ok(info.description.en.length > 0 && info.description.ja.length > 0, id);
  }
  for (const id of Object.keys(D.EMBLEM_DESCRIPTIONS)) assert.ok(D.isEmblemId(id), id);
  assert.equal(D.emblemInfo("trophy:tennis-cup").description?.en, "Two-handled cup with a pineapple");
});

test("football is never a bare フットボール where American football is meant, and bare ホッケー is field hockey", () => {
  for (const id of ["ball:football", "ball:football-ifaf", "trophy:football", "gear:football-helmet", "sport:ifaf"] as const) assert.match(D.emblemName(id, "ja"), /アメフト/, id);
  assert.equal(D.emblemName("ball:football-cfl", "ja"), "フットボール（CFL）");
  for (const id of ["gear:hockey-stick", "gear:goalie-stick", "gear:hockey-skate", "sport:nhl", "trophy:hockey-cup"] as const) assert.ok(!/(^|[^イ])ホッケー/.test(D.emblemName(id, "ja")) || /アイスホッケー/.test(D.emblemName(id, "ja")), id);
  assert.equal(D.emblemName("gear:field-hockey-stick", "ja"), "ホッケーのスティック");
  assert.equal(D.emblemName("gear:hurley", "ja"), "ハーリングのスティック");
  assert.equal(D.emblemInfo("gear:goalie-stick").description?.ja, "アイスホッケーのゴーリーのスティック");
});

test("Gaelic football is spelled one way, on the ball and on the pictogram", () => {
  assert.equal(D.emblemName("sport:gaelic", "ja"), "ゲーリックフットボール");
  assert.equal(D.emblemName("ball:gaelic-football", "ja"), D.emblemName("sport:gaelic", "ja"));
  for (const id of D.EMBLEM_IDS) assert.doesNotMatch(D.emblemName(id, "ja"), /ゲーリック・/, id);
});

test("nothing carries a real trophy's, event's or federation's name, in an id, a name, a description or a drawing", () => {
  const text = JSON.stringify(D.EMBLEM_IDS.map((id) => [D.emblemInfo(id), D.renderEmblem(id)]));
  for (const real of [/天皇杯/, /甲子園/, /koshien/i, /emperor/i, /japan sumo/i, /日本相撲協会/, /全日本剣道連盟/, /全日本柔道連盟/, /全日本弓道連盟/, /all japan/i, /\bijf\b/i, /\bwkf\b/i, /高野連/, /朝日/, /毎日新聞/]) assert.doesNotMatch(text, real);
});

test("the Japanese gear draws in every style and theme as well-formed, safe SVG", () => {
  for (const id of GEAR) {
    for (const style of D.EMBLEM_STYLES) {
      for (const theme of ["inherit", "auto", "light", "dark"] as const) {
        const svg = D.renderEmblem(id, { style, theme, size: 40 });
        assert.equal(wellFormed(svg), null, `${id} ${style} ${theme}`);
        assert.doesNotMatch(svg, /<script|<image|<foreignObject|javascript:|NaN|undefined/, id);
        assert.match(svg, /width="40" height="40"/);
      }
    }
    assert.match(D.renderEmblem(id, { style: "line" }), /currentColor/, id);
    assert.doesNotMatch(D.renderEmblem(id, { style: "line" }).replace(/<title>.*<\/title>/, ""), /#[0-9a-f]{6}/i, id);
  }
});

test("each flat item flips like a coin, and the cup is a lathe that keeps its outline", () => {
  for (const id of [...GEAR, "trophy:championship-banner"] as const) {
    assert.equal(D.emblemFrame(id, { yaw: 0 }), D.renderEmblem(id), id);
    assert.notEqual(D.emblemFrame(id, { yaw: 60 }), D.renderEmblem(id), id);
    assert.match(D.emblemFrame(id, { yaw: 60 }), /scale\(|transform=/, id);
    assert.equal(D.emblemFrame(id, { yaw: 360 }), D.renderEmblem(id), id);
  }
  assert.notEqual(D.emblemFrame("trophy:sumo-cup", { yaw: 90 }), D.renderEmblem("trophy:sumo-cup"));
  assert.equal(D.emblemFrame("trophy:sumo-cup", { yaw: 360 }), D.renderEmblem("trophy:sumo-cup", { turnBox: true }));
  const body = (svg: string): string => [...svg.matchAll(/<path d="(M[^"]*Q[^"]*z)" fill="url\(#dgsc/g)].map((m) => m[1]).join("|");
  assert.equal(body(D.emblemFrame("trophy:sumo-cup", { yaw: 120 })), body(D.renderEmblem("trophy:sumo-cup")));
  // A flag's back shows the cloth without its star or its letters.
  assert.ok(D.renderEmblem("trophy:championship-banner").includes("<path"), "front");
  assert.notEqual(D.emblemFrame("trophy:championship-banner", { yaw: 180 }), D.renderEmblem("trophy:championship-banner"));
});

test("the championship banner has no lettering unless some is given, takes up to three letters, and escapes them", () => {
  const id = "trophy:championship-banner";
  assert.doesNotMatch(D.renderEmblem(id), /<text/);
  assert.match(D.renderEmblem(id, { initials: "vic" }), />VIC</);
  assert.match(D.renderEmblem(id, { initials: "abcdef" }), />ABC</);
  assert.doesNotMatch(D.renderEmblem(id, { initials: "<b>" }), /<b>/);
  assert.doesNotMatch(D.renderEmblem(id, { initials: "VIC" }), /<path[^>]*L[^>]*fill="#d9a620"[^>]*\/><\/g>$/, "no blank-cloth star under letters");
  assert.ok(D.renderEmblem(id, { tint: "#8f1d2c", style: "color" }).includes("#8f1d2c"), "the cloth takes a tint");
  assert.ok(D.renderEmblem(id, { accent: "#c0c0c0", style: "color" }).includes("#c0c0c0"), "the trim takes an accent");
  assert.ok(D.renderEmblem(id, { style: "color" }).includes("#4b2a6b"), "purple by default");
});

test("the belt takes the colour of each rank, white to red", () => {
  assert.deepEqual(Object.keys(D.OBI_RANKS), ["white", "yellow", "orange", "green", "blue", "brown", "black", "kohaku", "red"]);
  const seen = new Set<string>();
  for (const rank of Object.keys(D.OBI_RANKS) as D.ObiRank[]) {
    const svg = D.obi(rank, { size: 32 });
    assert.ok(svg.includes(D.OBI_RANKS[rank]), rank);
    assert.match(svg, /width="32"/);
    seen.add(svg);
  }
  assert.equal(seen.size, 9);
  const ids = (svg: string): string => svg.replace(/g[0-9a-z]{4,8}c?\b/g, "G");
  assert.equal(ids(D.obi("black")), ids(D.renderEmblem("gear:obi")), "black is the default");
  assert.equal(ids(D.obi("nope" as never)), ids(D.renderEmblem("gear:obi")));
  assert.notEqual(D.renderEmblem("gear:obi", { tint: "#2b64c8", accent: "#ffffff" }), D.renderEmblem("gear:obi", { tint: "#2b64c8" }), "a stripe takes an accent");
  assert.equal(D.renderEmblem("gear:obi", { tint: '"><script>' }), D.renderEmblem("gear:obi"), "a hostile tint does nothing");
  assert.ok(D.renderEmblem("gear:judogi", { accent: "#2b64c8" }).includes("#2b64c8"), "the belt of a suit takes an accent");
});

test("the sports' pictograms draw in the page's ink in the line style and each is its own drawing", () => {
  const seen = new Set<string>();
  for (const sport of SPORTS) {
    const line = D.sportIcon(sport, { style: "line", size: 16 });
    assert.match(line, /currentColor/);
    assert.match(line, /width="16"/);
    seen.add(D.sportIcon(sport));
  }
  assert.equal(seen.size, 5);
});

test("nothing from another project is left: every emblem is ours, and no third-party licence or fetch script is shipped", () => {
  for (const id of D.EMBLEM_IDS) assert.ok(["ours", "generated", "drawn"].includes(D.emblemInfo(id).source), id);
  assert.deepEqual(readdirSync(new URL("../LICENSES", import.meta.url)).sort(), ["MIT.txt", "README.md"]);
  const scripts = readdirSync(new URL("../scripts", import.meta.url));
  assert.ok(!scripts.some((f) => /material|fetch-gear/.test(f)));
  assert.ok(!readdirSync(new URL("../scripts/dougu", import.meta.url)).some((f) => /fetch|build-gear|svgmin|assets/.test(f)));
  const src = readdirSync(new URL("../src/emblems", import.meta.url));
  assert.ok(!src.some((f) => /material/.test(f)));
  const notice = readFileSync(new URL("../NOTICE.md", import.meta.url), "utf8");
  assert.doesNotMatch(notice, /Apache|CC BY|Noto|game-icons|Pictogrammers|Wikimedia/);
});
