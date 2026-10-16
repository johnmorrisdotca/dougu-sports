import assert from "node:assert/strict";
import { test } from "node:test";

import * as B from "../src/brands-entry.ts";
import { renderEmblem } from "../src/index.ts";
import { wellFormed } from "./helpers.ts";
import { overflowOf } from "./svgbox.ts";

const LAYOUTS: B.LogoLayout[] = ["mark", "wordmark", "horizontal", "stacked"];

/** Real sportswear, equipment and club-kit names the invented ones must not be, or be within two letters of. */
const REAL = ["nike", "adidas", "puma", "reebok", "asics", "mizuno", "umbro", "hummel", "kappa", "fila", "lotto", "diadora", "joma", "macron", "mitre", "slazenger", "dunlop", "wilson", "spalding", "rawlings", "easton", "bauer", "warrior", "ccm", "molten", "mikasa", "yonex", "babolat", "head", "prince", "penn", "titleist", "callaway", "brooks", "saucony", "hoka", "salomon", "converse", "champion", "lacoste", "ellesse", "kelme", "errea", "uhlsport", "select", "canterbury", "gilbert", "kooga", "newbalance", "underarmour", "russell", "starter", "everlast", "jordan", "vans", "patagonia", "columbia", "quiksilver", "billabong", "oakley", "fox", "orca", "arena", "speedo", "tyr", "zoot", "zamst", "kswiss", "karhu", "craft", "odlo", "peak", "li-ning", "anta", "xtep", "erima", "jako", "kipsta", "decathlon", "wielder", "marucci", "louisville", "akadema", "nokona", "mueller", "evoshield", "franklin", "sklz", "hurley", "ripit"];

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = keep;
    }
  }
  return row[b.length];
}

test("there are twelve makers and ten teams, each with a note, a name and parts, and none with another's name", () => {
  assert.equal(B.MAKER_IDS.length, 12);
  assert.equal(B.TEAM_IDS.length, 10);
  assert.deepEqual(Object.keys(B.MAKERS).sort(), [...B.MAKER_IDS].sort());
  assert.deepEqual(Object.keys(B.TEAMS).sort(), [...B.TEAM_IDS].sort());
  const names = new Set<string>();
  for (const id of B.MAKER_IDS) {
    const maker = B.MAKERS[id];
    assert.equal(maker.id, id);
    assert.ok(maker.note.startsWith("Nearest: "), `${id} says what it is nearest to`);
    assert.ok(maker.note.length > 80 && maker.note.length < 420, `${id}'s note is a sentence or two`);
    assert.ok(maker.parts.length >= 1);
    names.add(maker.name.toLowerCase());
  }
  for (const id of B.TEAM_IDS) {
    const team = B.TEAMS[id];
    assert.equal(team.id, id);
    assert.ok(team.note.startsWith("Nearest: "));
    names.add(`${team.city} ${team.nickname}`.toLowerCase());
  }
  assert.equal(names.size, 22, "no two share a name");
  assert.equal(new Set(B.MAKER_IDS.map((id) => B.MAKERS[id].parts.map((p) => p.d).join("|"))).size, 12, "no two makers share a mark");
  assert.equal(new Set(B.TEAM_IDS.map((id) => B.TEAMS[id].parts.map((p) => p.d).join("|"))).size, 10, "no two teams share a logo");
  assert.equal(new Set(B.MAKER_IDS.map((id) => `${B.MAKERS[id].light.a}${B.MAKERS[id].light.b}`)).size, 12, "no two makers share a colour pair");
});

test("no maker is named, or nearly named, for a real brand, and nothing carries the owner's own marks", () => {
  for (const id of B.MAKER_IDS) {
    const name = B.MAKERS[id].name.toLowerCase();
    for (const real of REAL) assert.ok(distance(name, real) > 2 && !name.includes(real) && !real.includes(name), `${name} is too close to ${real}`);
  }
  const all = JSON.stringify([B.MAKERS, B.TEAMS]).toLowerCase();
  for (const word of ["spx", "sportsinteractive", "spxn", "spxis"]) assert.ok(!all.includes(word), `${word} is not in the set`);
});

test("every logo in every layout, colour and look is well-formed, safe, and inside its box", () => {
  for (const id of B.MAKER_IDS) {
    for (const layout of LAYOUTS) {
      for (const color of ["full", "mono"] as const) {
        for (const theme of ["light", "dark"] as const) {
          const svg = B.makerLogo(id, { layout, color, theme });
          assert.equal(wellFormed(svg), null, `${id} ${layout} ${color} ${theme}`);
          assert.ok(svg.startsWith("<svg xmlns="), svg.slice(0, 40));
          assert.ok(!/<script|<style|href=|url\(|\sid=|on\w+=|<text|<image|<use|filter/.test(svg), `${id} ${layout}: nothing that is not a shape`);
          assert.ok(overflowOf(svg) < 0.005, `${id} ${layout} ${color}: ink stays in the box (${overflowOf(svg)})`);
        }
      }
    }
  }
  for (const id of B.TEAM_IDS) {
    for (const color of ["full", "mono"] as const) {
      for (const theme of ["light", "dark"] as const) {
        const svg = B.teamLogo(id, { color, theme });
        assert.equal(wellFormed(svg), null);
        assert.ok(!/<script|<style|href=|url\(|\sid=|<text|<image|<use|filter/.test(svg));
        assert.ok(overflowOf(svg) < 0.005, `${id}: ink stays in the box (${overflowOf(svg)})`);
      }
    }
  }
});

test("the same call gives the same string, in any order, and a fresh copy of the data would give it too", () => {
  const first = B.MAKER_IDS.map((id) => B.makerLogo(id, { layout: "horizontal", theme: "dark" }));
  const second = [...B.MAKER_IDS].reverse().map((id) => B.makerLogo(id, { layout: "horizontal", theme: "dark" })).reverse();
  assert.deepEqual(first, second);
  assert.equal(B.teamLogo("larkmoor"), B.teamLogo("larkmoor"));
  assert.equal(B.lettering("Arvane", B.MAKERS.arvane.lettering).d, B.lettering("ARVANE", B.MAKERS.arvane.lettering).d);
  assert.equal(B.makerBall("arvane").decal.svg, B.makerBall("arvane").decal.svg);
  assert.equal(B.renderMakerBall("ball:baseball", "arvane"), B.renderMakerBall("ball:baseball", "arvane"));
});

test("a logo is the mark alone by default, and the name is a part you ask for", () => {
  const mark = B.makerLogo("arvane");
  assert.equal(mark, B.makerLogo("arvane", { layout: "mark" }));
  assert.ok(mark.includes('viewBox="0 0 100 100"'));
  assert.ok(!mark.includes("stroke-width"), "no lettering in the mark");
  for (const layout of ["wordmark", "horizontal", "stacked"] as const) assert.ok(B.makerLogo("arvane", { layout }).includes("stroke-width"), layout);
  const horizontal = B.makerLogo("arvane", { layout: "horizontal" });
  const stacked = B.makerLogo("arvane", { layout: "stacked" });
  const box = (svg: string) => (/viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg) as RegExpExecArray).slice(1).map(Number);
  assert.ok(box(horizontal)[0] > box(horizontal)[1] * 2, "side by side is wide");
  assert.ok(box(stacked)[1] > box(stacked)[0], "stacked is tall");
  assert.ok(box(B.makerLogo("arvane", { layout: "wordmark" }))[0] > 100);
});

test("mono is one colour, ink is checked, full takes the palette of the look", () => {
  for (const id of B.MAKER_IDS) {
    const mono = B.makerLogo(id, { color: "mono", layout: "horizontal" });
    assert.deepEqual([...new Set([...mono.matchAll(/(?:fill|stroke)="(#[0-9a-f]+|currentColor)"/g)].map((m) => m[1]))], ["currentColor"], `${id} mono follows the text colour`);
    const ink = B.makerLogo(id, { color: "mono", ink: "#112233", layout: "horizontal" });
    assert.deepEqual([...new Set([...ink.matchAll(/(?:fill|stroke)="(#[0-9a-f]+|currentColor)"/g)].map((m) => m[1]))], ["#112233"]);
    assert.equal(B.makerLogo(id, { color: "mono", ink: 'red"><script>' }), B.makerLogo(id, { color: "mono" }), "a hostile ink is ignored");
    assert.ok(B.makerLogo(id, { theme: "light" }).includes(B.MAKERS[id].light.a));
    assert.ok(B.makerLogo(id, { theme: "dark" }).includes(B.MAKERS[id].dark.a));
    if (B.MAKERS[id].light.a !== B.MAKERS[id].dark.a) assert.notEqual(B.makerLogo(id, { theme: "light" }), B.makerLogo(id, { theme: "dark" }));
  }
  for (const id of B.TEAM_IDS) {
    const mono = B.teamLogo(id, { color: "mono", ink: "rgb(1, 2, 3)" });
    assert.deepEqual([...new Set([...mono.matchAll(/fill="([^"]+)"/g)].map((m) => m[1]))], ["#010203"]);
  }
});

test("title, size and unknown ids", () => {
  assert.ok(B.makerLogo("tarsin").includes("<title>Tarsin</title>"));
  assert.ok(B.teamLogo("saltmere").includes("<title>Saltmere Gulls</title>"));
  assert.ok(B.makerLogo("tarsin", { title: "A <b> & \"co\"" }).includes("<title>A &lt;b&gt; &amp; &quot;co&quot;</title>"));
  const quiet = B.makerLogo("tarsin", { title: false });
  assert.ok(quiet.includes('aria-hidden="true"') && !quiet.includes("<title>") && !quiet.includes("role="));
  assert.ok(B.makerLogo("tarsin", { size: 24 }).includes('width="24" height="24"'));
  assert.ok(B.makerLogo("tarsin", { size: -3 }).includes('height="64"'));
  assert.ok(B.makerLogo("tarsin", { size: Number.NaN }).includes('height="64"'));
  assert.ok(B.makerLogo("tarsin", { size: 1e9 }).includes('height="4096"'));
  assert.ok(B.makerLogo("tarsin", { layout: "nope" as B.LogoLayout }) === B.makerLogo("tarsin"));
  assert.throws(() => B.makerLogo("nobody" as B.MakerId), /Unknown maker "nobody"/);
  assert.throws(() => B.teamLogo("__proto__" as B.TeamId), /Unknown team/);
  assert.throws(() => B.makerLogo("constructor" as B.MakerId), /Unknown maker/);
});

test("a group sits inside another drawing: no id, no title, placed and scaled by its box", () => {
  const group = B.makerLogoGroup("kovreth", { x: 10, y: 20, size: 50 });
  assert.ok(group.startsWith('<g transform="translate(10 20) scale(0.5)">') && group.endsWith("</g>"));
  assert.ok(!/<svg|<title|\sid=/.test(group));
  assert.equal(B.makerLogoGroup("kovreth"), B.makerLogoGroup("kovreth", { x: 0, y: 0, size: 100 }));
  assert.ok(B.makerLogoGroup("kovreth", { x: Number.NaN, y: Infinity }).includes("translate(0 0)"));
  assert.ok(B.teamLogoGroup("tarn", { size: 20 }).includes("scale(0.2)"));
  const tall = B.makerLogoGroup("arvane", { size: 100 }, { layout: "stacked" });
  assert.ok(/scale\(0\.[5-9]/.test(tall), "a stacked logo is scaled to its own height");
  const page = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">${group}${B.teamLogoGroup("tarn")}</svg>`;
  assert.equal(wellFormed(page), null);
});

test("the alphabet draws every letter of every name, leaves out what it does not have, and leans and cuts as asked", () => {
  for (const id of B.MAKER_IDS) for (const char of B.MAKERS[id].name.toUpperCase()) assert.ok(B.LETTERS.includes(char), `${char} of ${id}`);
  assert.equal(B.LETTERS.length, 26);
  const style = B.MAKERS.arvane.lettering;
  assert.equal(B.lettering("", style).d, "");
  assert.equal(B.lettering("1!?", style).d, "");
  assert.equal(B.lettering("A1", style).d, B.lettering("A", style).d);
  const plain = B.lettering("HOLD", { ...style, slant: 0, corner: "sharp" });
  const leaning = B.lettering("HOLD", { ...style, slant: 12, corner: "sharp" });
  assert.notEqual(plain.d, leaning.d);
  assert.ok(leaning.width > plain.width, "a lean needs room");
  const round = B.lettering("O", { ...style, corner: "round", radius: 20 });
  const cut = B.lettering("O", { ...style, corner: "cut", radius: 20 });
  assert.ok(round.d.includes("Q") && !cut.d.includes("Q"));
  assert.ok(!B.lettering("O", { ...style, corner: "sharp", radius: 20 }).d.includes("Q"));
  assert.ok(B.lettering("LV", style).width < B.lettering("LH", style).width + 1, "the open L sits closer to a leaning letter");
});

test("a maker's mark goes on a ball as a decal, wrapped onto it, and a ball that takes no print is left alone", () => {
  const options = B.makerBall("quillan");
  assert.equal(options.decal.size, 50);
  assert.equal(options.decal.turn, 0);
  assert.ok(options.decal.svg.includes('viewBox="0 0 100 100"') && options.decal.svg.includes('aria-hidden="true"'));
  assert.equal(B.makerBall("quillan", { layout: "horizontal" }).decal.size, 74);
  assert.equal(B.makerBall("quillan", { width: 9999 }).decal.size, 120);
  assert.equal(B.makerBall("quillan", { width: 1 }).decal.size, 8);
  assert.equal(B.makerBall("quillan", { turn: 30 }).decal.turn, 30);
  const plain = renderEmblem("ball:baseball", { size: 200 });
  const printed = B.renderMakerBall("ball:baseball", "quillan", {}, { size: 200 });
  assert.notEqual(printed, plain);
  assert.equal(wellFormed(printed), null);
  assert.ok(printed.includes(B.MAKERS.quillan.light.a), "the mark's colour is on the ball");
  assert.equal(printed, renderEmblem("ball:baseball", { size: 200, ...B.makerBall("quillan") }));
  for (const id of B.MAKER_IDS) for (const ball of ["ball:baseball", "ball:softball", "ball:soccer"] as const) assert.notEqual(B.renderMakerBall(ball, id), renderEmblem(ball), `${id} on ${ball}`);
  assert.equal(B.renderMakerBall("ball:basketball", "quillan"), renderEmblem("ball:basketball"), "a basketball takes no print");
  assert.notEqual(B.renderMakerBall("ball:baseball", "quillan", { turn: 40 }), printed);
});

test("the docs carry each note, so the page and the data cannot drift apart", async () => {
  const { readFileSync } = await import("node:fs");
  const page = readFileSync("docs/brands.md", "utf8");
  for (const id of B.MAKER_IDS) assert.ok(page.includes(B.MAKERS[id].note.replace(/^Nearest: /, "")), `${id}'s note is in docs/brands.md`);
  for (const id of B.TEAM_IDS) assert.ok(page.includes(B.TEAMS[id].note.replace(/^Nearest: /, "")), `${id}'s note is in docs/brands.md`);
});
