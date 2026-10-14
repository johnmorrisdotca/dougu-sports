# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Labels.** `EmblemOptions` takes `locale` (`"en"` or `"ja"`: the `<title>` is the emblem's Japanese name, with `lang="ja"` on the drawing) and `title` (a string is written, escaped; `false` drops the `<title>` and marks the drawing `aria-hidden="true"`). Both work for every emblem in every style, still and turned, and in `crest()` and `medal()`.
- **`emblemDataUri(ref, options)`**: a percent-encoded `data:image/svg+xml;utf8,…` address for an `<img>`, a CSS background or a canvas, with `currentColor` made a concrete colour (`color` for the line, else the theme's ink; the default is dark ink), and a browser test that loads it in an `<img>` and on a canvas.
- **`emblemSprite(ids, options)`**: one hidden `<svg>` of `<symbol>`s with the definitions shared and every id unique across the sheet, and `use(id, { size, class, title })` for the markup of each use. Sixty-four soccer balls are 2,304 nodes and 530 kB inline and 228 nodes and 15 kB from a sheet; sixty-four medals 1,792 nodes and 115 kB against 220 and 8.7 kB.
- **`sportEquipment(sport)`**: `{ sport, ball?, gear[], trophy, medal? }` for each of the 33 sports, typed, with every id an id of the registry, and a test that every id exists and every sport is covered.
- **`podium(places, options)`** and **`awardCase(items, options)`**: a podium of first, second and third on tiered steps, with medals or trophies, names, flags (SVG markup or a URL, drawn as an inert image) and lines of text; and a team's trophies on a shelf or in a row with `×N` badges, wrapping into rows. Both are one SVG string in the page's text colour, light and dark, with `role="img"`, a title and a description, in English and Japanese.
- **`bindTurn(element, ref, options)`** in the `./turn` entry, in a module of its own: a drag, the arrow keys, Home and Space turn an emblem drawn with `emblemFrame`, with `sensitivity`, `pitchRange`, `keyStep` and `onTurn`; a controller with `angles`, `setAngles`, `update` and `destroy`. An emblem that cannot turn (read from the registry's frames) is drawn as it is. An auto-turn (`autoPlay`, `speed`, `pauseOnInteract`, `onPlayChange`, `play`, `pause`, `togglePlay`, `playing`) runs on `requestAnimationFrame` with a clamped time step, stops while the page is hidden, and only starts when asked: under `prefers-reduced-motion` `autoPlay: true` starts paused unless it is `"force"`.
- The demo's playground turns its emblem with `bindTurn`, synced with the yaw, tilt and roll sliders, with an auto-turn button and speed choice and a hint in English and Japanese, and has a trophy case of turnable emblems; a new compose page draws the podium, the award case, a sprite sheet, a data address and a sport's equipment, each with a copy button.
- `docs/compose.md`, a `bindTurn` section in `docs/turning.md`, README examples, and tests (`test/api.test.ts`, `test/turn-control.test.ts`, `e2e/turn.demo.mjs`, `e2e/compose.demo.mjs`).

### Changed

- The demo's playground keeps the turn when the emblem, style, tint or look changes, instead of putting the emblem back at rest.
- The test server's port can be set with `TEST_PORT` (7201 by default), so a worktree does not meet another's.

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
