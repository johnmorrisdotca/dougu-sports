import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";

import * as D from "../src/index.ts";

test("there are thirty-three sports, named once, in lower case", () => {
  assert.equal(D.SPORT_NAMES.length, 33);
  assert.equal(new Set(D.SPORT_NAMES).size, 33);
  for (const name of D.SPORT_NAMES) assert.match(name, /^[a-z]+$/);
});

test("the groups are award, trophy, medal, crest, ball, gear and sport, and every id is <group>:<name> in its group", () => {
  assert.deepEqual(Object.keys(D.EMBLEM_GROUPS), ["award", "trophy", "medal", "crest", "ball", "gear", "sport"]);
  assert.deepEqual(Object.keys(D.EMBLEM_FOLDERS), Object.keys(D.EMBLEM_GROUPS));
  for (const [group, ids] of Object.entries(D.EMBLEM_GROUPS)) for (const id of ids) assert.match(id, new RegExp(`^${group}:[a-z0-9-]+$`), id);
  assert.equal(new Set(D.EMBLEM_IDS).size, D.EMBLEM_IDS.length, "an id is in one group, once");
  assert.deepEqual([...D.EMBLEM_IDS].sort(), Object.keys(D.EMBLEM_TABLE).sort(), "the registry has exactly the ids");
});

test("each emblem has its own module, where its group's folder says: ball:soccer is src/emblems/ball/soccer.ts", () => {
  for (const id of D.EMBLEM_IDS) {
    const [group, name] = id.split(":") as [keyof typeof D.EMBLEM_FOLDERS, string];
    assert.ok(existsSync(new URL(`../src/emblems/${D.EMBLEM_FOLDERS[group]}/${name}.ts`, import.meta.url)), id);
  }
  for (const folder of ["award", "ball", "gear"]) assert.ok(existsSync(new URL(`../src/emblems/${folder}`, import.meta.url)), folder);
});
