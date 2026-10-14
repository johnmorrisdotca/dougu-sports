import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

import * as D from "../src/index.ts";

test("there are thirty-eight sports, named once, in lower case", () => {
  assert.equal(D.SPORT_NAMES.length, 38);
  assert.equal(new Set(D.SPORT_NAMES).size, 38);
  for (const name of D.SPORT_NAMES) assert.match(name, /^[a-z]+$/);
});

test("the groups are award, trophy, medal, crest, ball, gear, sport, and pennant, and every id is <group>:<name> in its group", () => {
  assert.deepEqual(Object.keys(D.EMBLEM_GROUPS), ["award", "trophy", "medal", "crest", "ball", "gear", "sport", "pennant"]);
  assert.deepEqual(Object.keys(D.EMBLEM_FOLDERS), Object.keys(D.EMBLEM_GROUPS));
  for (const [group, ids] of Object.entries(D.EMBLEM_GROUPS)) for (const id of ids) assert.match(id, new RegExp(`^${group}:[a-z0-9-]+$`), id);
  assert.equal(new Set(D.EMBLEM_IDS).size, D.EMBLEM_IDS.length, "an id is in one group, once");
  assert.deepEqual([...D.EMBLEM_IDS].sort(), Object.keys(D.EMBLEM_TABLE).sort(), "the registry has exactly the ids");
});

const constantOf = (id: string): string => id.replace(":", "_").replaceAll("-", "_").toUpperCase();

// A group has a folder of its own, so two ids never share a file name. An id's module is the file named by the last part of the id (`trophy:hockey-cup` is trophy/hockey-cup.ts) and exports the constant
// the id names in capitals (`TROPHY_HOCKEY_CUP`). The balls and the gear are drawn in families (the five squash balls, the three crickets), one module for each family named `ball.<family>.ts` or `gear.<family>.ts`.
test("each emblem has a module in its group's folder that exports its constant, and the main entry exports it too", () => {
  for (const id of D.EMBLEM_IDS) {
    const [group, name] = id.split(":") as [keyof typeof D.EMBLEM_FOLDERS, string];
    const folder = new URL(`../src/emblems/${D.EMBLEM_FOLDERS[group]}/`, import.meta.url);
    const own = new URL(`${name}.ts`, folder);
    const sources = existsSync(own) ? [readFileSync(own, "utf8")] : readdirSync(folder).filter((f) => f.endsWith(".ts")).map((f) => readFileSync(new URL(f, folder), "utf8"));
    if (group === "ball" || group === "gear") {
      // A ball or a piece of gear is named by its family (`ball:squash` is `BALL_SQUASH_DOUBLE_YELLOW` in ball.squash.ts): what is held is that some constant of the main entry is the emblem with the id.
      assert.ok(Object.values(D).some((value) => (value as { id?: string } | null)?.id === id), `${id} is not exported from the main entry`);
      continue;
    }
    assert.ok(sources.some((text) => new RegExp(`export const ${constantOf(id)}\\b`).test(text)), `${id} has no module that exports ${constantOf(id)}`);
    assert.ok(constantOf(id) in D, `${constantOf(id)} is not exported from the main entry`);
    assert.equal((D as unknown as Record<string, { id: string }>)[constantOf(id)]?.id, id);
  }
  for (const folder of Object.values(D.EMBLEM_FOLDERS)) assert.ok(existsSync(new URL(`../src/emblems/${folder}`, import.meta.url)), folder);
});

test("a module in a group's folder is an emblem of that group, so the folder is the exports map", () => {
  for (const [group, folderName] of Object.entries(D.EMBLEM_FOLDERS)) {
    const files = readdirSync(new URL(`../src/emblems/${folderName}/`, import.meta.url)).filter((f) => f.endsWith(".ts"));
    for (const file of files) {
      const text = readFileSync(new URL(`../src/emblems/${folderName}/${file}`, import.meta.url), "utf8");
      const made = [...text.matchAll(/export const ([A-Z0-9_]+) =/g)].map((m) => m[1]);
      // The ball and gear folders also hold the engines their families are drawn with, which export no emblem.
      if (made.length === 0 && (group === "ball" || group === "gear")) continue;
      assert.ok(made.length > 0, `${folderName}/${file} exports no emblem`);
      if (group === "ball" || group === "gear") continue;
      for (const constant of made) assert.ok(constant?.startsWith(`${group.toUpperCase()}_`), `${folderName}/${file}: ${constant}`);
    }
  }
});
