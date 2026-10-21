import assert from "node:assert/strict";
import { test } from "node:test";

import * as D from "../src/index.ts";

const COMBAT = ["mma", "boxing", "wrestling", "prowrestling"] as const;
const NAMES: Record<(typeof COMBAT)[number], [en: string, ja: string]> = {
  mma: ["MMA", "総合格闘技"], boxing: ["Boxing", "ボクシング"], wrestling: ["Wrestling", "レスリング"], prowrestling: ["Pro wrestling", "プロレス"],
};

test("the four combat sports are sports, each with a pictogram of its own named for it", () => {
  for (const sport of COMBAT) {
    assert.ok(D.SPORT_NAMES.includes(sport), sport);
    const id = `sport:${sport}` as const;
    assert.ok(D.isEmblemId(id), id);
    const info = D.emblemInfo(id);
    assert.equal(info.kind, "icon");
    assert.equal(info.en, NAMES[sport][0]);
    assert.equal(info.ja, NAMES[sport][1]);
    assert.ok((info.description?.en ?? "").length > 20 && (info.description?.ja ?? "").length > 5, `${id} is described in both languages`);
    assert.ok((D as unknown as Record<string, { id: string }>)[`SPORT_${sport.toUpperCase()}`]?.id === id);
  }
});

test("each combat pictogram reads in the three styles and every theme, and differs from the others and from the karate and judo suits", () => {
  const drawn = new Set<string>();
  for (const sport of [...COMBAT, "karate", "judo"] as const) {
    for (const style of D.EMBLEM_STYLES) {
      for (const theme of ["inherit", "auto", "light", "dark"] as const) {
        const svg = D.sportIcon(sport, { style, theme, size: 16 });
        assert.match(svg, /^<svg [^>]*viewBox="0 0 64 64"/, `${sport} ${style}`);
        assert.match(svg, /<path /, `${sport} ${style}`);
        assert.doesNotMatch(svg, /<text|<image|<use\b/i, `${sport} ${style}: no lettering and no outside picture`);
      }
      drawn.add(D.sportIcon(sport, { style }));
    }
  }
  assert.equal(drawn.size, 6 * D.EMBLEM_STYLES.length, "no two sports draw the same");
});

test("the combat sports carry no promotion's name or mark", () => {
  const text = COMBAT.map((s) => `${D.emblemInfo(`sport:${s}`).en} ${D.emblemInfo(`sport:${s}`).description?.en ?? ""} ${D.sportIcon(s)}`).join(" ");
  for (const real of [/octagon/i, /\bufc\b/i, /\bwwe\b/i, /\bwwf\b/i, /\baew\b/i, /bellator/i, /\bone championship\b/i, /\bpfl\b/i, /\bwba\b|\bwbc\b|\bibf\b|\bwbo\b/i, /\buww\b|\bfila\b/i]) assert.doesNotMatch(text, real);
});

test("the combat sports have equipment: a trophy, no ball, no gear yet, and a gold medal for the Games' two", () => {
  for (const sport of COMBAT) {
    const e = D.sportEquipment(sport);
    assert.equal(e.ball, undefined, sport);
    assert.deepEqual(e.gear, [], sport);
    assert.ok(D.TROPHY_IDS.includes(e.trophy), sport);
  }
  assert.equal(D.sportEquipment("boxing").medal, "medal:gold");
  assert.equal(D.sportEquipment("wrestling").medal, "medal:gold");
  assert.equal(D.sportEquipment("mma").medal, undefined);
  assert.equal(D.sportEquipment("prowrestling").medal, undefined);
  assert.equal(D.sportEquipment("boxing").trophy, "trophy:belt");
});
