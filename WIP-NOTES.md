# WIP notes for work/art

Done (all in this branch; pnpm check, test:readme, lint and typecheck were green at the last run):
- Engraving (`engrave`, `label`, `year`, `rank`, `engraveBack`) on medals, place badges, plaque, belt, ring, banner, pennant and the plinth of the 15 body-of-revolution cups; ink picked for 4.5:1; turns with the face (hidden on a medal's back, own back text, letter-by-letter round a plinth). Code: `src/emblems/emblem.engrave.ts`, hooks in `emblem.shapes.ts` and `emblem.lathe.ts`, models carry `engrave` plates / a `plate` band.
- Every group turns: `src/emblems/emblem.flip.ts` (coin flip with mirrored dimmed back and filter rim) used by `defineIcon`, `defineMaterial`, gear (`defineGear`, `copied`). Test over all ids in `test/turn.test.ts`.
- `pennant()` / `pennant:championship`, `trophy:ring`, `trophy:banner`, new group `pennant`, `./pennant/*` export, docs (README, docs/emblems.md, turning.md, layout.md), CHANGELOG Unreleased, gallery.md, playground Engrave field, gallery engraved examples, e2e test for them.
- Jerseys were built, then removed on John's change of scope (commit "revert: take the jerseys out"); the code is saved in scratchpad/jersey-handoff/ (HANDOFF.txt lists it).
- Japanese reviewed: ring is now 優勝リング, banner 優勝バナー (pennant 優勝ペナント kept). Sample texts in tests changed to アイスホッケー日本一 and 全国優勝.

Left:
- `pnpm test:demo` has not been run (Playwright config uses port 7201; John's rule for this task was 7220-7229, so run it with the port changed or when 7201 is free; the new e2e test "the engrave field engraves a medal..." is unrun).
- Final contact sheets (engraved medals and plaque, pennants, a turn row of gear, ring and banner) still to render into scratchpad/dougu-art/ and look at; earlier sheets: eng-flat.png, eng-lathe.png, eng-zoom.png, pen1.png, rb.png (ring and banner). Gear turn row was not rendered yet.
- Optional polish: the salver and tennis-plate plinth text is small; line-style cup engraving is cluttered; README mentions 151 emblems (other branches change the counts, expect merge conflicts in test counts, README line 34, ids/registry/index/entry).
- Japanese: reviewer suggested 二〇二六年度 優勝 order and a mincho font fallback; not applied.

Decisions: size limits raised on purpose (flat 4.6 kB, cup 7.1 kB, icon 3.8 kB; pennant 3.4 kB), recorded in test/size.test.ts and CHANGELOG. Engraving code is tree-shaken out of icon bundles. Pennant lettering margin 3 units inside the felt edge.
