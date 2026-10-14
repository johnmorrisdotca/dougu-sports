# Layout: where the art goes

[Back to the README](../README.md). This page says where each kind of emblem lives in the source, how one is added, and what the tests hold it to.

## The folders

```text
src/
  index.ts                   the full registry (every emblem, the functions, each emblem as a constant)
  emblems-entry.ts           ./emblems: renderEmblem and the ids, with no single drawing imported
  turn-entry.ts              ./turn: emblemFrame and ballFrame
  emblems/
    emblem.core.ts           options, colours, paint, the wrapper, the Emblem type (imports nothing)
    emblem.ids.ts            the ids, the groups, the sports, and which folder each group's art is in
    emblem.registry.ts       every emblem by id (a table keyed by the id union)
    emblem.api.ts            renderEmblem, emblemFrame, ballFrame, parseEmblem, emblemInfo and the rest
    emblem.shapes.ts         the renderer for a flat emblem (a front and a back, to flip)
    emblem.ball.ts           the renderer for a ball (marks on a sphere, to roll)
    award/                   awards, trophies, medals, crests and sport emblems: one module per item
    ball/                    one module per ball
    gear/                    one module per piece of gear
```

A group's folder is set in `EMBLEM_FOLDERS` (`src/emblems/emblem.ids.ts`): `award`, `trophy`, `medal`, `crest` and `sport` ids all live in `src/emblems/award/`, `ball` ids in `src/emblems/ball/` and `gear` ids in `src/emblems/gear/`.

## One module per item

An item is one file named by the last part of its id, which exports one constant named by the whole id in capitals:

| Id | File | Export | Import one alone |
| --- | --- | --- | --- |
| `award:medal` | `src/emblems/award/medal.ts` | `AWARD_MEDAL` | `@johnmorrisdotca/dougu-sports/award/medal` |
| `ball:soccer` | `src/emblems/ball/soccer.ts` | `BALL_SOCCER` | `@johnmorrisdotca/dougu-sports/ball/soccer` |
| `gear:<name>` | `src/emblems/gear/<name>.ts` | `GEAR_<NAME>` | `@johnmorrisdotca/dougu-sports/gear/<name>` |

The `exports` map in `package.json` has one wildcard for each folder (`./award/*`, `./ball/*`, `./gear/*`), so a new file needs no change there. The constant is made with `/* @__PURE__ */ defineFlat(…)` or `defineBall(…)`, and the package says `"sideEffects": false`, so a bundler that imports one module takes that item and the small renderer it uses, and nothing else. `test/size.test.ts` bundles one item with esbuild and holds it under 3 kB gzipped.

## Adding an emblem

1. Write `src/emblems/<folder>/<name>.ts`.
2. Add the id to its list in `src/emblems/emblem.ids.ts` (`AWARD_IDS`, `BALL_IDS`, …); the `EmblemId` union follows.
3. Add the constant to `EMBLEM_TABLE` in `src/emblems/emblem.registry.ts` (a missing or extra entry is a type error) and to `src/index.ts`.
4. Write its test, in `test/`. Every emblem is already drawn in all three styles and checked for well-formed SVG by `test/emblem.test.ts`; a test of its own says what is particular to it.
5. If the art comes from a source, add the source to `NOTICE.md` and its licence text to `LICENSES/`.
6. `pnpm gallery` rewrites [gallery.md](gallery.md); `pnpm check` runs everything.

## The three styles

`metal` is full colour with a gradient, `line` is one outline in `currentColor`, and `color` is flat fills. In every style the outline takes the page's text colour unless `theme` says otherwise, so an emblem follows light and dark mode with no extra work.
