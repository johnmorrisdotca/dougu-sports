# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Japanese sports and budō** ([docs/japanese-sports.md](docs/japanese-sports.md)), all original drawings with generic ids and no real trophy's name: `trophy:sumo-cup` (a tall silver cup on a tall stepped stand with phoenix-crested handles, a body of revolution), `trophy:championship-banner` (a fringed banner on a pole with a gilt finial and an embroidered border, no lettering unless `initials` gives up to three letters; `tint` is the cloth, `accent` the trim), and the gear `gear:gunbai` (the referee's war fan with its tassel), `gear:mawashi`, `gear:shinai`, `gear:kendo-men`, `gear:judogi`, `gear:obi` (with `OBI_RANKS`, white to black, and `obi(rank, options)`), `gear:yumi`, `gear:ya` and `gear:karate-gi`. Five sports are added to `SPORT_NAMES` (now 38) with a pictogram each: `sumo`, `kendo`, `judo`, `kyudo`, `karate`. `JAPANESE_IDS` lists the 16 together, and the gallery page shows them in a section of their own. Every emblem is now 164 (22 trophies, 42 gear, 38 sports).
- **Japanese names are first-class**, read by a reviewer and using the governing bodies' words (柔道衣, 空手衣, 廻し, 軍配, 竹刀, 剣道の面, 優勝旗, 弓, 矢); `emblemInfo(id).description` and `EMBLEM_DESCRIPTIONS` hold a longer description in English and Japanese for the docs and the gallery.
- A piece of gear flips like a coin when it is turned (`emblemFrame`, `frame`): squeezed by the cosine of the yaw, mirrored on its back, squeezed from the top by a tilt. The demo and the gallery turn gear now. Gear has the `color` style (flat fills) as well as `metal` and `line`, and a part can be shaded across its width (`cyl`) as a round shaft is.

### Changed

- **No third-party art is left.** The 11 gear pieces that were copied (`gear:hockey-stick`, `field-hockey-stick`, `lacrosse-stick`, `cricket-bat`, `table-tennis-paddle`, `badminton-racket`, `tennis-racket`, `goal-net`, `football-helmet`, `goalie-mask`, `baseball-glove`; from Noto Emoji, Wikimedia Commons and game-icons.net) and the 18 Material Symbols items (`trophy:cup`, the five `award:*` and the twelve pictograms `sport:nfl`, `cfl`, `ifaf`, `nhl`, `nba`, `mlb`, `soccer`, `tennis`, `volleyball`, `cricket`, `rugby`, `handball`) are redrawn as clean vector geometry in the package's own style (metal, color and line, light and dark), and the third-party art is removed with the scripts that only served it (`scripts/fetch-material-symbols.mjs`, `scripts/dougu/fetch-gear.mjs`, `build-gear.mjs`, `svgmin.mjs`, `gear-assets.json`), `LICENSES/Apache-2.0.txt`, `LICENSES/CC-BY-3.0.txt`, `LICENSES/upstream/` and every NOTICE entry for them. `NOTICE.md` keeps the rulebook table the balls' sizes come from; `LICENSES/` holds the MIT text. The `material`, `noto`, `mdi`, `commons` and `gameicons` values of `EmblemSource` and `PieceSource` are gone (every emblem is `ours`, `generated` or `drawn`), and so is the `MaterialModel` type.
- **Sizes.** The 11 gear pieces are 7.5 kB gzipped in the metal style and 4.4 kB as lines, from 28.2 kB and 17.0 kB (27% and 26%), and their modules 14.5 kB from 82.8 kB (4.3 kB from 29.2 kB gzipped). The 18 Material items are 8.5 kB in metal (from 7.5 kB, because they now have bevels, glints and a second colour) and 5.8 kB as lines (from 7.8 kB), and their sources 12.8 kB from 23.1 kB (3.7 kB from 6.5 kB gzipped). The built `dist` is 137 kB gzipped as a tarball, from 158 kB, with 16 emblems more.
- **Every emblem has a short accessible name** (the `<title>`): English 26 characters at most and Japanese 12 or a little over where the established word is longer (`ダブルイエロー`, `バスケットボールのトロフィー`); the longer text moved to the descriptions. 41 names were shortened, among them `trophy:tennis-cup` (`Pineapple cup`), `trophy:hockey-cup`, `sport:ifaf`, the squash balls, `gear:badminton-racket`, `gear:hurley` (`ハーリングのスティック`). Football in Japanese is `アメフト…` for American football and bare `ホッケー` means field hockey (ice hockey is always `アイスホッケー`).
- **Gaelic football is spelled `ゲーリックフットボール`** on both `sport:gaelic` and `ball:gaelic-football` (the pictogram had a middle dot).
- The rugby, volleyball, baseball, basketball, soccer, tennis, cricket and handball pictograms now show the equipment, with a grey sheet in the metal style like the other pictograms, instead of a solid glyph.
- `playwright.config.mjs` takes `TEST_PORT` (default 7201), so a worktree can test on its own port.

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
