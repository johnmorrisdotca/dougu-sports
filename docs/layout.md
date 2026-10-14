# Layout: where the art goes

[Back to the README](../README.md). This page says where each kind of emblem lives in the source, how one is added, and what the tests hold it to.

## The folders

```text
src/
  index.ts                   the full registry (every emblem, the functions, each emblem as a constant)
  emblems-entry.ts           ./emblems: renderEmblem, the helpers and the ids, with no single drawing imported by name
  turn-entry.ts              ./turn: emblemFrame, ballFrame and bindTurn
  turn-control.ts            bindTurn (a module of its own, so importing an emblem never pulls it in)
  emblems/
    emblem.core.ts           options, colours, gradients, the wrapper, the Emblem type (imports nothing)
    emblem.ids.ts            the ids, the groups, the sports, the short names, and the folder of each group
    emblem.registry.ts       every emblem by id (a table keyed by the id union)
    emblem.api.ts            renderEmblem, emblemFrame, ballFrame, crest, medal, sportIcon, parseEmblem and the rest
    emblem.lathe.ts          the renderer for a body of revolution (a cup, an urn, a column with a ball on it)
    emblem.shapes.ts         the renderer for a flat object (a medal, a crest: a front and a back, to flip) and for an icon
    emblem.material.ts       the renderer for a Material Symbols icon; emblem.material.data.ts holds the paths
    emblem.medal.ts          the builders the medals and place badges share
    emblem.compose.ts        an emblem taken apart and put into another document with unique ids (sprite, podium, award case)
    emblem.uri.ts            emblemDataUri
    emblem.sprite.ts         emblemSprite
    emblem.equipment.ts      sportEquipment
    emblem.display.ts        podium and awardCase
    award/                   five awards (Material Symbols)
    trophy/                  twenty trophies
    medal/                   gold, silver and bronze, and the badges for the first three places
    crest/                   the four generic crests
    sport/                   one pictogram for each of the thirty-three sports
    ball/                    the balls, drawn in 3D by their own engine (ball.engine.ts), one module per family
    gear/                    the gear, one module per piece or family
```

Each group has a folder of its own (`EMBLEM_FOLDERS` in `src/emblems/emblem.ids.ts`), so no two ids share a file name: `crest:shield` and `award:shield` are `crest/shield.ts` and `award/shield.ts`.

## One module per item

An item is one file named by the last part of its id, which exports one constant named by the whole id in capitals:

| Id | File | Export | Import one alone |
| --- | --- | --- | --- |
| `trophy:hockey-cup` | `src/emblems/trophy/hockey-cup.ts` | `TROPHY_HOCKEY_CUP` | `@johnmorrisdotca/dougu-sports/trophy/hockey-cup` |
| `medal:gold` | `src/emblems/medal/gold.ts` | `MEDAL_GOLD` | `@johnmorrisdotca/dougu-sports/medal/gold` |
| `crest:shield` | `src/emblems/crest/shield.ts` | `CREST_SHIELD` | `@johnmorrisdotca/dougu-sports/crest/shield` |
| `sport:nhl` | `src/emblems/sport/nhl.ts` | `SPORT_NHL` | `@johnmorrisdotca/dougu-sports/sport/nhl` |
| `award:crown` | `src/emblems/award/crown.ts` | `AWARD_CROWN` | `@johnmorrisdotca/dougu-sports/award/crown` |

The balls and the gear are drawn in families by engines of their own, so a family is one module, named `ball.<family>.ts` or `gear.<family>.ts`, that exports a constant for each member: `ball:squash`, `ball:squash-yellow` and the other squash balls are in `ball/ball.squash.ts` (`BALL_SQUASH_DOUBLE_YELLOW`, `BALL_SQUASH_YELLOW`...), and `gear:hurley` is `GEAR_HURLEY` in `gear/gear.sticks.ts`. The folders also hold the engines (`ball.engine.ts`, `ball.math.ts`, `gear.core.ts`...) and an index of each (`ball.index.ts`, `gear.index.ts`), which the registry reads.

The `exports` map in `package.json` has one wildcard for each folder (`./award/*`, `./trophy/*`, `./medal/*`, `./crest/*`, `./sport/*`, `./ball/*`, `./gear/*`), so a new file needs no change there. The constant is made with `/* @__PURE__ */ defineLathe(…)`, `defineFlat(…)`, `defineIcon(…)`, `defineMaterial(…)` or `defineBall(…)`, and the package says `"sideEffects": false`, so a bundler that imports one module takes that item and the renderer it uses, and nothing else. `test/size.test.ts` bundles one item of each kind with esbuild and holds it to a limit for its kind.

## Adding an emblem

1. Write `src/emblems/<folder>/<name>.ts` (for a ball or a piece of gear, add it to a family module or write one, and list it in the folder's index).
2. Add the id to its list in `src/emblems/emblem.ids.ts` (`TROPHY_IDS`, `MEDAL_IDS`, …); the `EmblemId` union follows.
3. Add the constant to `OWN` in `src/emblems/emblem.registry.ts` (a missing or extra entry is a type error; balls and gear come from their indexes) and an export to `src/index.ts`.
4. Name it in English and in Japanese (the English is the drawing's `<title>`), and have the Japanese read by someone who reads it.
5. Look at it: `node scripts/emblem-sheet.mjs sheet.png trophy/<name>` draws a contact sheet at 256, 64 and 16 pixels in light and dark, and with `--turn` five yaws. Compare it with what it stands for, and keep a trophy generic (no real name, mark or engraving).
6. Write its test, in `test/`. Every emblem is already drawn in all three styles and every theme and checked for well-formed, safe SVG, a size limit and a turn at every angle by `test/emblem.test.ts` and `test/turn.test.ts`; a test of its own says what is particular to it.
7. If the art comes from a source, add the source to `NOTICE.md` and its licence text to `LICENSES/`.
8. `pnpm gallery` rewrites [gallery.md](gallery.md); `pnpm check` runs everything.

## The three styles

`metal` is polished metal: a gradient across each round part (a dark edge, a bright band, the metal, a darker side and a faint light from the rim), a highlight, and an edge that is a darker tone of the metal itself. `line` is one clean outline in `currentColor`, with the small details left out so that it reads at 14 pixels. `color` is flat fills of the same tones, with no gradient. A tint recolours the main part, and the `theme` sets the ink of the line style and of a pictogram for light, dark or either.
