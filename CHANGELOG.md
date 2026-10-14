# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Engraving.** Text cut into a face, from `engrave` (one string, up to three lines of 24 letters, Japanese included) or `label`, `year` and `rank`, with `engraveBack` for a back: on the medals and place badges (replacing the star or the numeral), `trophy:plaque` (the words on the plate, the year on the nameplate), `trophy:belt`, `trophy:ring`, `trophy:banner`, `pennant:championship`, and the plinth of each of the 15 cups and stands that are bodies of revolution. The lines are fitted to the plate (the biggest size that fits, a space may break a line), escaped, and cut in the ink that reads at 4.5 to 1 on the metal (a tone of it, black or white; the page's ink in the line style). Turned, the text goes with its face: squeezed on a medal, hidden on its back or another text there, and set letter by letter round a plinth so that it foreshortens and goes behind the edge.
- **`pennant()` and `pennant:championship`**: a felt championship pennant on a dowel with a stitched edge, lettered with its words and its year, in metal (felt fibres), color and line; its back is plain felt with the dowel on the other side. The new group `pennant`, and the `./pennant/*` export.
- **`trophy:ring`** (a championship ring: a band, a wide faceted head with a gem, the team and the year on its shoulders) and **`trophy:banner`** (a rafter banner on a rod, in the tint and accent, with its words and year). The `trophy` group has 22 emblems.
- **Every emblem turns.** Gear, the Material awards and the sport pictograms flip like a coin (`src/emblems/emblem.flip.ts`): squeezed by the cosine, mirrored and a little darker on the back, with a thin rim that is widest edge on. `test/turn.test.ts` holds every id to a finite, well-formed frame at every yaw and pitch, and every flat one to a turn that differs, repeats at 360 and has a back.
- Options `engrave`, `label`, `year`, `rank`, `engraveBack`, `numberColor` (a pennant's lettering) and `view`; the playground has an Engrave field, and the gallery shows an engraved example, turned and from behind, for each emblem that takes one.

### Changed

- The playground and the gallery turn every emblem (the gear and the icons had no turn controls).
- Item sizes grew with the new code (gzipped, one item bundled by itself): a medal 3.2 to 4.5 kB, a flat emblem 3.0 to 4.3 kB, a cup 5.6 to 6.9 kB, a pictogram or Material icon 1.8 to 3.6 kB, a piece of gear 2.6 to 3.5 kB, the pennant 3.4 kB; the limits in `test/size.test.ts` are 4.6, 7.1 and 3.8 kB for a flat emblem, a cup and an icon. The engraving code is left out of a bundle that does not draw a medal, a plaque or a cup, and the turn code is the only addition to an icon's.

## [0.1.0] - 2026-10-14

The art arrives: 148 emblems (the trophies, awards, medals, crests, the pictogram of each of the 33 sports, the balls and the gear), moved here from Kyogijo Stadiums and, for the trophies, medals and crests, redrawn.

### Added

- **Trophies (20).** Ten stand for the cup of a league or a sport in a generic, descriptive form drawn for this package (never traced, with no name, mark or engraving): `trophy:hockey-cup` (a tall silver cup with a flared bowl, a collar and a barrel of widening bands), `trophy:baseball` (thirty gold pennants on poles, their tops stepping up once round, standing round a silver baseball), `trophy:football` (a football leaning on a tapered three-sided stand), `trophy:basketball` (a gold ball over a rim and a net, on a tapered column), `trophy:canadian-bowl` (a wide two-handled bowl on a tall conical base), `trophy:soccer-globe` (a globe held up by spiral figures over green bands), `trophy:tennis-plate` (a salver with a gilt pattern), `trophy:tennis-cup` (a lidded two-handled cup with a pineapple), `trophy:cricket-urn` (a small terracotta urn) and `trophy:rugby-cup` (a gilded lidded cup). The others are `trophy:cup` (Material Symbols), `lidded-cup`, `bowl`, `salver`, `globe`, `soccer-ball`, `plaque`, `belt`, `laurel` and `rosette`.
- **Awards (5)**, from Material Symbols (Apache 2.0, pinned to a commit by `scripts/fetch-material-symbols.mjs`, with its notice): `award:medal`, `badge`, `crown`, `star` and `shield`.
- **Medals (6):** `medal:gold`, `silver` and `bronze` on a ribbon of five stripes (and no rings), which flip like a coin and show a plain back, and `medal:place-1` to `place-3`. **Crests (4):** `crest:shield`, `roundel`, `diamond` and `pennant`, tinted by a team's colours, with its letters. **Pictograms (33):** `sport:*`, one for each sport. **Balls (47)** and **gear (33)** from Kyogijo's engines: true 3D balls with their official sizes and the rules they come from, flat gear drawn here or copied from open icon sets, with their licences in `LICENSES/` and `NOTICE.md`.
- **A new renderer, the body of revolution (`lathe`)**: a profile with handles, balls, a ring of poles, grooves, a net, beads and a pattern on a dish, shaded as polished metal; it keeps its outline when turned and moves its light, handles and seams, and a stand with flat faces shows the faces that look toward the eye.
- **The API**: short names (`"cup"` for `"trophy:cup"`), the `crest`, `medal` and `sportIcon` helpers, `lineup` for balls at their true relative sizes, `emblemInfo(id).size`, and the options `accent` (a second colour), `initials` (a crest's letters), `grain` and `roll` (a ball). `emblemName(id, "ja")` gives the Japanese name of each, read by a Japanese reader.
- **The gallery page** lists every emblem with its id, in each style and turned, with buttons that copy the id and the call, and a filter; `docs/emblems.md`, `docs/references.md`, and a `Constant` column in `docs/gallery.md`.
- `scripts/emblem-sheet.mjs` draws a contact sheet of any emblems at 256, 64 and 16 pixels, light and dark, in a real browser.

### Changed

- **The metal style has no heavy black outline.** An emblem is edged by a darker tone of its own metal, shaded across each round part, with a highlight and a soft reflected rim; the line style is one clean outline in the page's ink, with the small details left out so that it reads at 14 pixels.
- **Each group has a folder of its own** (`award/`, `trophy/`, `medal/`, `crest/`, `sport/`, `ball/`, `gear/`), so no two ids share a file name, and there is an `exports` wildcard for each. The balls and the gear are one module per family (`ball/ball.squash.ts`).
- `award:medal` is the Material Symbols icon, not the sample flat medal; the flipping medals are `medal:gold`, `silver` and `bronze`. `ball:soccer` is the 3D soccer ball.
- The American, Canadian and IFAF footballs and the rugby ball are drawn to a point at their ends (a `point` shape in the ball engine), the rugby ball is white with two bands of colour on each side and a pebbled grip, and the water polo ball is yellow with dark grip channels along its panel seams.
- The size limits of `test/size.test.ts` are per kind of emblem (a ball 6.8 kB, a medal or a crest 3.6 kB, a cup 6.2 kB gzipped), and the tests of the balls and the gear run on `node:test` through a small Vitest-shaped shim.

## [0.0.1] - 2026-10-14

First preview: the name, the API and two sample emblems. The full set of trophies, medals, crests, balls and gear follows.

### Added

- The scaffold: `renderEmblem(id, { style, size, tint, theme })` with the three styles `metal`, `line` and `color`; `emblemFrame` and `ballFrame` for turning; the `EmblemId` union and the groups `award`, `trophy`, `medal`, `crest`, `ball`, `gear` and `sport`; the thirty-three sports' names; one module per item under `./award/*`, `./ball/*` and `./gear/*`, so a bundler takes one emblem and leaves the rest.
- Two sample emblems that stand in for the art: `award:medal` (a flat emblem that flips like a coin) and `ball:soccer` (a ball that rolls).
- Tests for the drawing, the ids, the turns and the bundle size of one item; a package check that installs the packed tarball and bundles one item from it.
- The demo (a playground with a turn slider, and a gallery page), `docs/layout.md`, `docs/turning.md`, `docs/gallery.md`, the family header and footer, the CI, Pages and Release workflows, and `LICENSES/` and `NOTICE.md` ready for third-party art.

[Unreleased]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/johnmorrisdotca/dougu-sports/releases/tag/v0.0.1
