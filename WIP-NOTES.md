# WIP notes: work/native

Ticket cmv7vyks30002jm06spm860hc (claimed, not done). Paused on request; tests are not all green.

## Done

- All third-party art is gone. The 11 gear pieces (hockey-stick, field-hockey-stick, lacrosse-stick, cricket-bat, table-tennis-paddle, badminton-racket, tennis-racket, goal-net, football-helmet, goalie-mask, baseball-glove) are redrawn natively in `src/emblems/gear/`; the 6 award/cup icons (`award:*`, `trophy:cup`) and the 12 Material `sport:*` pictograms are redrawn with `defineIcon` (`sport/nfl.ts` holds the football shared by cfl and ifaf; helpers `polygon`, `tiltedEllipse`, `bar` are in `emblem.shapes.ts`).
- Removed: `emblem.material.*`, `scripts/fetch-material-symbols.mjs`, `scripts/dougu/{fetch-gear,build-gear,svgmin}.mjs`, `gear-assets.json`, `LICENSES/{Apache-2.0,CC-BY-3.0}.txt`, `LICENSES/upstream/`, their tests. `EmblemSource` is now `ours | generated | drawn`. NOTICE.md rewritten (rulebook table kept).
- Gear engine (`gear.core.ts`): `cyl` (shade across a part), `fx` (highlight, metal only), a flat `color` style, `swell()` for tapering shapes, and every gear piece now flips like a coin when turned (`frame`).
- New Japanese items: `trophy:sumo-cup` (lathe), `trophy:championship-banner` (flat, optional `initials`), `gear:gunbai`, `mawashi`, `shinai`, `kendo-men`, `judogi`, `obi` (+ `OBI_RANKS`, `obi()`), `yumi`, `ya`, `karate-gi`; sports `sumo kendo judo kyudo karate` (38 sports, 164 emblems). `JAPANESE_IDS` lists them.
- Coordinator's two fixes: one spelling ゲーリックフットボール on `sport:gaelic` and `ball:gaelic-football`; every emblem now has a short name (en <= 26 chars, ja <= 12), with the old long text moved to `src/emblems/emblem.descriptions.ts` (`emblemInfo(id).description`).
- Tests: `test/japan.test.ts` added, `gear`, `emblem`, `ids`, `size`, `turn` tests updated. Last full run before the doc edits: all green except the judogi name check (see below).
- Docs updated: README, NOTICE, CONTRIBUTING, docs/{emblems,layout,references,turning}.md, src/emblems/README.md, demo gallery (Japanese sports section, gear turns, description lines), make-gallery description column.

## Left

1. A japanese-reviewer run (agent a9020ea4d241fa24b) was started on `scratchpad/dougu-native/review-names.md` (all shortened names, descriptions and Japanese item terms). Its report was not read yet. Apply its fixes. Open questions: 柔道衣 vs 柔道着 (test/japan.test.ts expects 柔道衣, the code currently has 柔道着), 空手衣, 廻し, the short names for AFL (豪式フットボール), field hockey stick, squash dots.
2. Write `docs/japanese-sports.md` (the "Japanese sports" section; link it from README, docs index) with runnable `js` examples.
3. CHANGELOG `[Unreleased]` entry: third-party art removed (list what and the sizes), new items, short names, gaelic spelling, gear flips, `JAPANESE_IDS`/`OBI_RANKS`/`obi`/`EMBLEM_DESCRIPTIONS`.
4. `pnpm gallery` (rewrites docs/gallery.md), `pnpm screenshots` / regenerate `docs/pieces/gear-*.webp` (`scripts/dougu/contact-sheet.mjs`), then `pnpm check`, `pnpm test:readme`, `pnpm test:demo` until green; e2e count assertions in `e2e/demo.demo.mjs` may need a look.
5. Contact sheets: before/after gear done (`scratchpad/dougu-native/before-after-gear.png`); still to render and look at the Japanese items and the 18 redrawn icons/pictograms, polish (volleyball and rugby pictograms, karate fist, hockey stick blade are the weakest), and the sizes report.
6. Update `test/japan.test.ts` if the reviewer changes any name.

## Sizes (gzipped svg, metal / line)

Before, 11 gear: 28212 / 16955 bytes. After: 7496 / 4407. Before, 18 Material items (awards, cup, 12 sports): 7510 / 7812. After: not yet measured (`scratchpad/dougu-native/measure.mjs`, ids in `mat-ids.txt`).
Before: source of the 11 gear modules 82829 bytes (29176 gz); Material data+renderer 15692 (5426 gz); `dist` tarball 158246 gz.

## Decisions

- Gear stays kind `gear` (drawn with `drawn()`), and turns by flipping; the cup is a lathe, the banner a flat emblem.
- Japanese names use the governing bodies' words as far as known; the reviewer has the last word.
- Description file instead of a new constructor argument, to keep the other branches' edits to emblem modules small.
- `drawGear` gives the `color` style flat fills for all gear (the old pieces had the diagonal sheen in both).
