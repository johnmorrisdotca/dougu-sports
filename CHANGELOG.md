# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.10.0] - 2026-10-19

### Added

- **`award:ribbon`**, a ribbon on its own (a band with two swallow-tailed ends folded behind it), drawn for this package, in metal, colour and line like the other awards. 273 emblems.
- **Nets and posts for three sports**, from their rulebooks' sizes (sources in NOTICE.md): `gear:takraw-net` (ISTAF Law of the Game, Regu: posts 1.55 m, net 0.7 m deep, 1.52 m at the centre), `gear:netball-post` (World Netball Rules of Netball 2024: a 3.05 m pole, a ring of 380 mm inside diameter) and `gear:teqball-table` (FITEQ Official Rules and Regulations of Teqball 2025: 3,000 mm long, surface 760 mm and 565 mm high, 900 mm with the net). They are the equipment of `sepaktakraw`, `netball` and `teqball` in `sportEquipment`. What is not to scale (a net drawn shorter, a rod drawn wider, the table's legs) is said in each file.
- **The demo's podium shows Hata's round flags** for Japan, France and Italy (`demo/flags-data.ts`, made by `pnpm flags`; Hata 1.5.0 is a development dependency of the demo only), in place of three flags drawn by hand. The package is unchanged.
- **Made-up maker and team logos (experimental, designs will change)**, in a new entry point `@johnmorrisdotca/dougu-sports/brands`: twelve fictional makers of balls and gear (`arvane`, `tarsin`, `ravelle`, `kovreth`, `dunmar`, `ostrel`, `vexlin`, `quillan`, `tenzar`, `marenko`, `halvane`, `solvik`) and ten fictional teams (`saltmere`, `greywick`, `brightwater`, `cinderfell`, `valmere`, `larkmoor`, `ironport`, `pinecrest`, `redfern`, `tarn`), as SVG. A mark stands alone and is what `makerLogo` draws by default; the name is optional (`layout: "wordmark" | "horizontal" | "stacked"`). Full colour or one colour, light or dark, with a note on the nearest real brand and how each differs. `makerLogoGroup` and `teamLogoGroup` return a `<g>` to place in another drawing; `makerBall` and `renderMakerBall` print a maker's mark on a baseball, a softball or a classic soccer ball. The set is data (`MAKERS`, `TEAMS`). The demo has a contact sheet (`brands.html`). See `docs/brands.md`.

## [0.9.0] - 2026-10-15

### Added

- **Custom balls.** The baseball, the softball and the classic soccer balls (`ball:baseball`, `ball:softball`, `ball:soccer`, `ball:soccer-orange`, `ball:soccer-yellow` and `ball:soccer-colour`) take six options, drawn on the sphere so that they curve with it, are foreshortened toward the edge, go round the limb and turn with the ball (`renderEmblem`, `emblemFrame`, `ballFrame` and `bindTurn` take them):
  - `paint`: a colour, or `{ body, second, split, angle, stitch }`. A solid ball takes the colour, and the stitches change to a thread that shows against it (red, cream, navy or near-black). Two colours make a two-tone ball, split along the figure-eight seam (each leather piece one colour, each stitch leg the thread that shows on its own side) or in halves. On a soccer ball `body` is the hexagons and `second` the pentagons.
  - `decal`: a logo of your own as an SVG string, a `data:` image URI or `{ svg, href, size, turn }`. An SVG is flattened and wrapped exactly (fills cut at the limb, strokes thinning as they turn away); a PNG, JPEG, GIF or WebP is laid on in small affine triangles. Made safe with an allow-list; an address on the network is refused.
  - `stamp`: bold condensed block lettering between small stars (`UNOFFICIAL` over `DIGITAL BASEBALL` by default, the ball's own word on each ball), your own lines, ink and an optional made-up signature line with a caption.
  - `script`: an original cursive script (waypoints drawn for this package, a thick down stroke and a hairline up stroke, a to z and our own `Baseball` and `Soccer`), where a maker's mark sits; with a small circled letter under it, or your own mark.
  - `mark`: a letter in a circle, or an SVG of your own drawn in its place (the slot for a mark this package must not carry).
  - `spots`: where the logo and the lettering go. The logo has the middle and the lettering the far side by default.
- **`printed(ball)`** (main entry) and the types `BallPaint`, `BallDecal`, `BallStamp`, `BallScript`, `BallMark`, `BallSpots` and `Spot`. The balls' own modules carry no printing code and ignore the options; the registry, `renderEmblem` and the main entry's constants are the printed ones, and `printed(BALL_BASEBALL)` gives a ball taken from its own module the printing (about 19 kB gzipped, against 8.6 kB for the plain baseball).
- **`docs/custom-balls.md`** and its Japanese page, the gallery's note about the options, and a "Custom ball" section in the demo: colour, two-tone, stamp lines, script word, mark and a logo picked from a file (read in the browser into a data URI), with the call that draws it.

### Changed

- The ball engine can fill the disc of a ball and a region of it, and a ball's draw hook takes its paint and print options. A plain soccer ball bundled alone is 7.3 kB gzipped (was 6.5), so the size test's limit for a ball is 7.6 kB.

## [0.8.0] - 2026-10-14

### Added

- **`bindTurn` takes an emblem object and is light.** `bindTurn(element, TROPHY_HOCKEY_CUP, options)` draws and turns the emblem it is given with its own `frame` and imports neither a drawing nor the registry, so a bundle of `bindTurn` and one cup is about 9.4 kB gzipped (the turning is about 2.5 kB of it), where it was about 81 kB. `test/size.test.ts` holds it to 10 kB, and the other emblems stay tree-shakeable.
- **`ready`** on the controller `bindTurn` returns: a promise that resolves when the emblem is drawn and bound (already, for an emblem object) and rejects for an id that names nothing.

### Changed

- **`bindTurn` of `./turn` loads the registry only for an id.** An id (`"trophy:tennis-cup"`) is read from the registry, which `bindTurn` now imports on demand (a dynamic import, a chunk of its own in a bundler) instead of at the top. The first id bound is drawn when `ready` resolves, not before; later ones at once. `bindTurn` of the main entry (`@johnmorrisdotca/dougu-sports`) has the registry already and draws an id at once, as before. New modules: `src/turn-registry.ts` (what is loaded) and `src/turn-full.ts` (the main entry's `bindTurn`).

## [0.7.3] - 2026-10-14

The repository's own tooling is TypeScript. No change to the package: the same files are published, and the pictures are byte for byte the same.

### Changed

- **The scripts, the browser tests, the test helpers and the demo's source are `.ts`.** `scripts/*.ts` (build, gallery, package check, README examples, release notes, contact sheets, the pictures script, the demo's server and page maker), `e2e/*.demo.ts`, `playwright.config.ts` and `test/pieces-gallery.test.ts` were `.mjs` or `.js`. They run with Node's own type stripping, with no `tsx` and no build step, so `package.json`'s scripts call the `.ts` files directly. The shared family files stay as they are, byte for byte: `scripts/family-template.mjs` and `scripts/family-readme.mjs` (plain JavaScript, with the types of the template written by hand in `scripts/family-template.d.mts`) and `scripts/family-backgrounds.ts`.
- **`pnpm typecheck` checks all of it.** `tsconfig.check.json` covers `src` and `test`, the new `tsconfig.tools.json` covers `scripts`, `e2e` and the Playwright config (with the browser's types, since the tests and the pictures script run code in the page), and the new `tsconfig.demo.json` covers `demo`. The syntax is the erasable kind only (`erasableSyntaxOnly` was already on), with `import type` and `.ts` extensions.
- **The demo's scripts are `demo/*.ts`, built with esbuild.** A browser cannot run TypeScript, so `scripts/page.ts` builds each one into `demo.js`, `compose.js` and `gallery.js` for the dev server (on each request) and for `pnpm site`. A script imports the package from `../src/index.ts`, so that it is type-checked against the real source; the build changes that one import to `./dist/index.js`, the built package, as before. The page is the same.
- **Node.** Working on the repository needs Node 22.18 or later (where type stripping is on by default); CI already runs 22 and 24. `engines` stays `>=22`, because the published package is plain JavaScript and needs no more. `CONTRIBUTING.md` says so.

### Fixed

- **The belts note counted the two-colour pairs wrong.** `docs/japanese-sports.md` and `docs/japanese-sports.ja.md` said the IJF names "these four pairs" under a table of five. The IJF's page names four (white-yellow, yellow-orange, orange-green, green-blue); blue-brown is drawn for completeness and no source found names it. Both pages now say that.

## [0.7.2] - 2026-10-14

The docs are one language to a page. No change to the pictures; the only change to the package is one English description.

### Changed

- **The docs are single-language.** `CONTRIBUTING.md` says so (one page per language, no mixed tables, the Japanese twin named `<name>.ja.md`), and a new test, `test/docs-language.test.ts`, fails when an English page holds Japanese outside code or a Japanese page holds English prose. The Japanese words that were in English pages are gone from them: [docs/japanese-sports.md](docs/japanese-sports.md) lost its Japanese column and its Japanese sentences to a new page in Japanese, [docs/japanese-sports.ja.md](docs/japanese-sports.ja.md); [docs/obi-steps.md](docs/obi-steps.md) lost its Japanese column, and [docs/obi-steps.ja.md](docs/obi-steps.ja.md) its English one; the glosses in [docs/references.md](docs/references.md) and the gallery's English description of `gear:obi-step-5` (it named the knot in kanji too) are English only. Three exceptions are named in the test with their reasons: the family list in the README, the package's own name (`道具`) in the README, and the titles of rulebooks cited in Japanese pages.

## [0.7.1] - 2026-10-14

Real countries in the examples instead of made-up teams. No change to the package's code or its pictures.

### Changed

- **The crest examples are Canada and Japan.** The README's crest example is a red-and-white roundel lettered CAN (it was a roundel lettered NO), and the one in docs/emblems.md is a shield in Japan's red and white lettered JPN (it was HC).
- **The "bring your own picture" puck example is our own red maple leaf with CANADA** (it was a green triangle and WOLVES, "NORTH DIVISION CLUB"). The JAPAN example, with our own red sun disc drawn through the `flags` option, stays.

## [0.7.0] - 2026-10-14

Ten national volleyballs that can be told apart, a 2010-style grooved ball that reads, and six pictures of how a judo belt is tied. 269 emblems.

### Changed

- **The national volleyballs have a layout of their own, not only their colours.** Japan, Poland, Canada, the USA, the Netherlands and Serbia were all a red with white and read alike at 16 pixels. Now each country lays its colours out differently (`VOLLEYBALL_PLANS` in `ball.volleyball.flag.ts`: 18 letters, one for each panel): Japan is white with one broad crimson band round one side, across the front and over the top; Canada is red with a white stripe down the front and the back, like the flag's pale; the USA has a navy field on two opposite sides and red and white stripes on the rest; Italy is green on one side, red on the other and striped across the front; Poland stands on a corner of the layout with white round the top and red round the bottom, as the flag is cut; France has three big fields, blue, white and red; Serbia has the flag's bands from the top down; the Netherlands has thin stripes of the three colours on every face; Germany has six big fields. Brazil and `ball:volleyball-colours` are as they were. Only colours: nothing is drawn on a ball. `colors`, `tint` and `accent` still replace the first, second and third colour wherever they sit.
- **`ball:soccer-2010-grooved` is stronger.** White and teal panels (`#0f9b8e`) instead of pale grey and mint, deep dark grooves for the seams with a lit lip, and two rings of contour lines in each panel, dark teal on the white panels and white on the teal ones. It reads on a light page, on a dark one, at 32 pixels and turned. `accent` still replaces the teal.

### Added

- **`gear:obi-step-1` to `gear:obi-step-6`, and `obiStep(step, options)`**: how a judo belt is tied, in six close-ups of the jacket of `gear:judogi` (lapels crossed left over right, `右前`) with the belt at each stage: 1 the middle of the belt against the belly, 2 wrapped twice round the waist, 3 the ends crossed in front, 4 one end tucked up under both wraps, 5 the flat square knot (`本結び`), 6 both ends hanging even. A red number and a few red marks say what to look at. `tint` is the jacket and `accent` the belt. Six ids rather than a `step` option, because this package makes a drawing that differs by more than a colour an id (the suits, the back views, the belts) and keeps options for colours and fill-ins. Names and captions in English and Japanese, the pages [docs/obi-steps.md](docs/obi-steps.md) and [in Japanese](docs/obi-steps.ja.md), and `JAPANESE_IDS` has 41 entries.
- Tests: every pair of national volleyballs differs by a mean CIE L\*a\*b\* distance of 35 or more with at least 7 panels clearly different, and no two share a layout; the grooved ball's contrast against a light and a dark page; the belt steps' order, their agreement with the judogi, their names and captions, and that they turn without clipping.

### Internal

- `paintEach18`, `panels18` and `ON_A_CORNER` in the panelled family (a colour for each of the 18 panels, and the layout stood on a corner of its cube); `judogiFlat(torso)` and `belt`'s `tail2` for the belt steps; and a piece's parts that share one transform are now drawn in one group, which makes a close-up smaller.

## [0.6.0] - 2026-10-14

A judogi has no short sleeves, and every judoka at an IJF event wears an official back number: the judo and karate drawings get their sleeves, and the judogi is drawn from behind with the back number sewn on. 263 emblems.

### Fixed

- **`sport:judo` drew elbow-length sleeves, and the flat `gear:judogi` sleeves stopped short of the hip.** The IJF's rule (C1.10) is that the sleeves cover the wrist bone completely, with room for the forearm all the way. The pictogram and the suit now hang their sleeves out and down to the hip, where the wrist is with the arms down, with a loose cuff and a stitched cuff hem, at every size (`sport:judo` still reads at 16 pixels). `test/judo.test.ts` measures it from the drawn paths: the cuff is at the hem or below, the outer edge as long as the jacket, the cuff at least a fifth as wide as the jacket is long.
- **`sport:karate` and `gear:karate-gi` drew elbow-length sleeves.** The WKF's rule (2.2.1 j) is half the forearm at least and the bend of the wrist at most, so they are now three-quarter length (longer than the elbow, a little shorter than a judogi's), with a wide cuff.

### Added

- **`gear:judogi-back` and `gear:judogi-blue-back`**: the white and the blue judogi laid flat and seen from behind, with the back number sewn on (large size, 38 by 39 cm, its top 3 cm under the collar): a white patch with the family name in white capitals on a band across the top, the three-letter country code under it, the rest blank for the sponsor, and a stitched edge. The belt is crossed behind the waist. They turn like the other suits.
- **The `backnumber` option**, `{ name, code, band }`, taken by `renderEmblem` and `emblemFrame` for the two back views (the type is `Backnumber`): the family name (capitals, 16 characters, accents are the plain letter), the country code (three letters) and the band (`blue`, `gold` for an Olympic champion, `red` for a world champion).
- The page [docs/judogi-back.md](docs/judogi-back.md) (and [in Japanese](docs/judogi-back.ja.md)), and the sources and what could not be confirmed in [docs/references.md](docs/references.md#the-ijf-back-number). No flag is drawn (the IJF's patch has none), and no logo of the IJF, of its supplier or of a sponsor.

### Changed

- The pictures of the gear and of the judo suits are redrawn, with a new picture of the suits from the front and the back (`judogi-light.webp`, `judogi-dark.webp`).

## [0.5.2] - 2026-10-14

The README's pictures are redone, because npm shows only the README that was published: every picture now stands on one of the family's shared backgrounds, and the demo can put one behind an emblem.

### Changed

- **Every README picture stands on a background** from the family's shared set (`scripts/family-backgrounds.ts`, version 1.0.0, copied byte for byte from taisen-brackets and held to its sha256 by `test/family-backgrounds.test.ts`): the balls under floodlights, the cups, medals and crests on royal purple, the gear on carbon fibre (dark) or a hardwood floor (light), the vintage balls on a warm sunburst, the printed pucks on the ice, the phone sheet on a glow and the turned emblems on a dark royal, each in a light and a dark twin where the README uses both. Labels take the ink the background returns, and every grid is full and runs edge to edge. The pictures stay webp (2.4 MB in all).
- The balls picture shows the 36 balls and pucks of the sports on four full rows; the vintage, baseball and era-style balls have a picture of their own (`vintage-desk-light.webp`, `vintage-desk-dark.webp`), the pucks have a dark twin (`pucks-dark.webp`), and the turned emblems are `turn-desk.webp` (it was `turn-desk-light.webp`).
- `pnpm screenshots` makes every picture, on port 7210 or `TEST_PORT`.

### Added

- **A background choice in the demo's preview**, off by default (`?background=ice`): one of the twenty-five, in the variant of the look, behind the stage, with the stage's text in the ink it returns. It is presentation only: the emblem the package draws is the same string with or without it, and the module is loaded only when a background is chosen. The package has no new code and still no dependency.

## [0.5.1] - 2026-10-14

The judo suit, the belt and the football pictograms were wrong, and are redrawn from the rules: the judogi is a real jacket and trousers (white or blue, flat and folded), the belt is tied in the flat square knot, and there is a belt for every grade. 261 emblems.

### Fixed

- **`gear:judogi` was not a judogi.** It was a robe with an X of two thin bands, sleeves like bat wings and a belt with a block for a buckle. It is now the jacket laid flat with long sleeves that cover the wrist bone, a thick stitched collar crossed left over right (the crossing under 10 cm below the top of the sternum), a quilted upper body, a skirt with side vents, and trousers with a drawstring waist and reinforced knees, from the IJF judogi rules (Sport and Organisation Rules, C1.9 and C1.10; [docs/references.md](docs/references.md#judo-and-karate-suits-and-belts)).
- **`gear:obi` is the belt as it is tied**: two layers round the waist, a flat square (reef) knot and two equal ends hanging a little apart; it was a strap with a buckle. The judogi, the folded judogi and the karate-gi wear the same knot.
- **`gear:karate-gi` is its own cut** from the WKF rules (2.2.1): lighter cloth with no quilting, a plain narrow collar, shorter sleeves and jacket than the judogi's, tie strings, straight trousers and a red (AKA) belt by default (`accent` takes a blue one).
- **`sport:judo` and `sport:karate` are suit pictograms** that read at 16 pixels in the metal, colour and line styles (the karate one was a fist that looked like a glove).
- **`sport:nfl`, `sport:cfl` and `sport:ifaf` are footballs** drawn from `ball:football`, `ball:football-cfl` and `ball:football-ifaf` (a prolate ball with laces; they were a thin pointed leaf): the CFL's has the white stripe round both ends, the IFAF's the stripes on the laces' side only, the NFL's none (CFL Rule 1 Section 2; IFAF Rule 1 Section 3).

### Added

- **`gear:judogi-blue`, `gear:judogi-folded` and `gear:judogi-blue-folded`**: the blue judogi (IJF colour rule C1.9, `JUDOGI_BLUE`), and both suits folded into a neat rectangle with the collar and lapel stitching on top and the belt tied round it. `JUDOGI_WHITE` and `JUDOGI_BLUE` are exported.
- **A belt for every grade**: `gear:obi-white`, `-yellow`, `-orange`, `-green`, `-blue`, `-brown`, `gear:obi-kohaku` (red and white panels, 6th to 8th dan), `gear:obi-red` (9th and 10th dan), `gear:obi-women` (the black belt with the white stripe women wear in Japan) and the two-colour belts `gear:obi-white-yellow`, `-yellow-orange`, `-orange-green`, `-green-blue` and `-blue-brown`. `OBI_RANKS` gains `kohaku` and `red`, and `obi(rank, options)` takes a grade or a pair of grades (`obi(["white", "yellow"])`), `tint` as one colour or a pair, and `women: true`.
- Japanese names and descriptions read by a Japanese reviewer (`右前` for the lapels, `本結び` for the knot; the two-colour belts are a European custom with no Japanese standard name, so they are `「A と B の二色帯」`), tests (`test/judo.test.ts`) for the colours, the belts and the football stripes, regenerated gallery pages and gear contact sheet.

### Changed

- The judo and karate suits and belts are layered drawings with a larger size budget (14000 characters) than the other gear (6000).

## [0.5.0] - 2026-10-14

Fifty balls in true 3D: vintage leather soccer balls, soccer balls in the style of an era, patterns of a shop wall, baseballs of other threads and volleyballs in national colours. 244 emblems.

### Added

- **Five vintage soccer balls** ([docs/vintage-balls.md](docs/vintage-balls.md), [日本語](docs/vintage-balls.ja.md)), in worn tan, brown and chestnut leather with scuffs and stitch lines, each on the construction of its period: `ball:soccer-1870-hand-stitched` (eight long panels, a button at each end, cross-stitched), `ball:soccer-1900-laced` (eight panels, a round cap at each end and a criss-crossed lace across a slit), `ball:soccer-1930-18-panel` (eighteen strips, six panels of three), `ball:soccer-1950-12-panel` (twelve pentagons in four tones) and `ball:soccer-1960-32-panel-leather`. The four older balls carry the 27 to 28 inch circumference of the 1872 Laws.
- **Eleven soccer balls in the style of an era**, with graphics of our own on the construction of the time and no real design, mark or name: `ball:soccer-1970-black-white`, `-1978-triad` (three curved triangles in a pinwheel on each hexagon), `-1986-decorated-triad`, `-1998-coloured-triad`, `-2002-triangle-sweep`, `-2006-propeller` (14 panels), `-2010-grooved` (8 panels), `-2014-ribbon` (6 panels), `-2018-pixel`, `-2022-speed-shell` (20 panels) and `ball:soccer-training-high-vis`.
- **Eighteen shop-wall soccer balls**, six generic patterns in three colourways each: stars (`-blue`, `-red`, `-night`), hexagon outlines (`-cyan`, `-magenta`, `-lime`), flames (`-fire`, `-ice`, `-toxic`), chevrons (`-red`, `-green`, `-blue`), a two-tone swirl (`-blue`, `-red`, `-teal`) and a metallic glossy finish (`-gold`, `-silver`, `-cobalt`), as `ball:soccer-stars-blue` and so on.
- **Five baseballs and softballs**: `ball:baseball-lemon-peel` (the early four-seam ball), `ball:baseball-red-blue` and `ball:baseball-black-red` (the figure-8 seam stitched in two colours, the laces of the two leagues in a 1930s player's account), `ball:baseball-vintage-leather` and `ball:softball-11-optic` (the 27.9 cm optic yellow ball of the WBSC Slow Pitch rules, 166.5 to 173.6 g). The red figure-8 stitch is the existing `ball:baseball`.
- **Eleven volleyballs in national colours**: `ball:volleyball-brazil`, `-japan`, `-canada`, `-usa`, `-italy`, `-poland`, `-france`, `-serbia`, `-netherlands` and `-germany`, the 18-panel indoor ball with its panels in three colours of the flag (colours only, no flag drawn), and `ball:volleyball-colours`. A new **`colors` option** (`renderEmblem`, `emblemFrame`, `ballFrame`) takes any three colours for any of them.
- **New tilings and tools**: `octahedron8` (an octahedron whose edges are bent into S curves), `icosahedron`, `gorePoint` and `colourCentres` in `ball.tilings.ts`; `ball.decal.ts` (shapes laid on the sphere with `frameAt`, `tongue` leaves and ribbons, rows of stitches, a lace, scuffs); `paint18` and `seams18` in the panelled family; `panels` on the engine's surface (several polygons of one fill as one path); `wear` and a second thread colour in the seamed balls.
- Tests (`test/vintage.test.ts`) for the new ids, names and descriptions, the sizes, the `colors` option, the new tilings and the decal tools. The contact sheets in `docs/pieces`, the README's ball picture (now with a row of vintage balls) and both gallery pages are redrawn and rewritten.

### Changed

- The `ball:soccer` family is now 55 balls in the proportions test (the 21 of 0.3.0, the five vintage, eleven era-style and eighteen patterned), and the balls hold their size budget (14 kB in colour, 13 kB as a line drawing; 8.5 kB on average).

## [0.4.1] - 2026-10-14

The printed pucks take the same flag renderer as taisen-brackets.

### Changed

- **The puck's flag renderer is the one taisen-brackets takes.** `flags` is now an option of the call (`renderEmblem`, `emblemFrame`, `ballFrame`), beside `face`, and no longer a field of `face`; it is called `flags(code, { shape: "round" | "square" | "rect", size, theme: "inherit" | "light" | "dark" })` (the puck asks for `"rect"`), may return `null` or `undefined` for a code it has no flag for, and is synchronous, so one adapter over hata serves every package. New types `FlagRequest` and `FlagShape`. `FlagRenderer` changed accordingly; the 0.4.0 form (`face.flags`, shapes `4:3`/`1:1`/`round`) is gone.

## [0.4.0] - 2026-10-14

Printed pucks: eight souvenir pucks with a print on the top face that turns with the puck, and a `face` option that takes any picture, emblem or flag code. 194 emblems.

### Added

- **Eight printed pucks** ([docs/pucks.md](docs/pucks.md), [日本語](docs/pucks.ja.md)), a new group `puck:*`: `puck:canada` (our own flag of the Canadian pattern with CANADA under it in wide letters, in a ring of words), `puck:canada-red` (a red face with a big white leaf), `puck:canada-white` (a white face with red bands and a red leaf), `puck:usa` (a disc of stars and stripes with USA lettered across it), `puck:usa-navy` (a navy face, a red ring between white hairlines, stars and USA), `puck:player` (a made-up surname and a big number, like a jersey), `puck:signed` (the navy puck with a made-up gold signature) and `puck:souvenir` (a generic one with ring text from the caller). Each is the same puck as `ball:puck` (76.2 by 25.4 mm), in true 3D: the print sits on the top face and turns with the puck, foreshortens as it tips, and is gone when the top is turned away; the grip shows on the rim. `ball:puck` itself stays plain.
- **A `face` option** on every puck (`renderEmblem`, `emblemFrame`, `ballFrame`): `design`, `image` (any SVG, made safe first), `emblem` (a dougu id), `flag` (`"ca"` and `"us"` are drawn here; any other code goes through the caller's `flags(code, { shape, size, theme })`, the shape of the renderer hata exports), `text`, `ringText`, `number`, `name`, `signature` (a seed, or `false`) and `colors`. `ball:puck` given a face is drawn as `puck:souvenir` with it. New exports: `PUCK_IDS`, the `PUCK_*` constants and the types `PuckFace`, `PuckDesign`, `FaceColors`, `FlagRenderer` and `PuckId`; `isBallId`, `ballFrame` and `lineup` take the puck ids.
- **Our own lettering**: a stroke alphabet (adapted from senshu-jerseys, no font file), wide, heavy and leaning a little, set on a line or on an arc for the ring, with a made-up signature drawn by a seeded pen (the same seed, the same stroke, never a real hand) and our own eleven-point maple leaf, flags and stars.
- **A safe image path**: an outside SVG is taken apart and put back through a strict allow-list (shapes, gradients and clip paths; no script, style, text, image, use, foreignObject, filter, link or event handler), with its ids renamed under the puck's own prefix.
- A "Print a puck" section in the demo, both gallery pages list the eight, and tests for the face, escaping, the signature, the safe image, the turn box and the proportions (the printed pucks are measured against the rule like the plain one).

### Changed

- The stack renderer has an `overlay` that is drawn over the grain when the top face is toward you, and the puck's drawing is shared (`puckSpec`), so the plain puck's output is unchanged.

## [0.3.2] - 2026-10-14

The README pictures fill their frames: balls first, then trophies, then gear, each a full grid.

### Changed

- **README pictures are full grids.** The opening picture is now thirty-six balls and pucks in four full rows of nine, followed by one of trophies, medals and crests and one of gear (each light and dark), then a turn strip of four rows of seven and a phone shot of twelve emblems. No row is ragged and there is no empty band. They are webp (made in the browser by `pnpm screenshots`, about 60 to 400 kB each) instead of png.

## [0.3.1] - 2026-10-14

Nothing is cut off when an emblem turns: every cup and the pieces that were clipped at rest now draw inside their box at every angle.

### Fixed

- **Tall and wide things were cut off by their own box as they turned, and a few were cut off at rest.** Every emblem is drawn in a fixed square box sized for the still drawing, and a turn grows the outline past it: tilted toward the eye by 60 degrees, the rim and the foot of all 16 cups (and the handles of the sumo cup, up to 17.6 of 64 units, a quarter of the picture) went out of the box. Each cup now has a `turnBox`, measured from its drawing over every yaw and tilt, and `emblemFrame`, `bindTurn` and `renderEmblem(id, { turnBox: true })` draw in it, so a turn is one size from the first frame to the last and the resting view of `bindTurn` is the same size too (the cup is drawn up to 30 percent smaller in its square while it can turn). A still drawing keeps its box and its size. Eleven pieces of flat art whose stroke ran past the 64 by 64 box at rest (the swim goggles, three skates, the diving board, the referee's fan, the running track and three pictograms, by up to 3.3 units) have a box that holds them. Balls, medals, crests and the other flat art needed nothing. `test/turnbox.test.ts` measures the ink of every emblem, still and turned, against its box. A frame at no turn is now the still in the box of the turn (`renderEmblem(id, { turnBox: true })`), which is the still itself for everything but those cups.

## [0.3.0] - 2026-10-14

Nineteen more soccer balls (26, 18, 14, 12 and 6 panels, winter orange and high-visibility yellow, futsal and beach soccer), 186 emblems in all.

### Added

- **Nineteen more soccer balls** ([docs/soccer-balls.md](docs/soccer-balls.md), [日本語](docs/soccer-balls.ja.md)), all in true 3D like `ball:soccer`, turning with `ballFrame`, with their seams on the sphere and every construction a generic derivation (no brand's or tournament's ball is used; the sources are in [docs/references.md](docs/references.md#soccer-balls)): `ball:soccer-26` (the rhombicuboctahedron: 8 triangles and 18 squares), `ball:soccer-18` (three strips on each face of a cube), `ball:soccer-14` (6 propellers and 8 triangles: a truncated cube whose 12 long edges are bent into S-curves), `ball:soccer-12` (the dodecahedron) and `ball:soccer-6` (thermobonded: six twisted gores with long curved seams, our own design).
- **Winter orange and high-visibility yellow** of the classic ball and of each new construction, as ids of their own (`ball:soccer-orange`, `ball:soccer-26-yellow`... twelve in all): `tint` replaces the colour and `accent` the dark panels.
- **Futsal and beach soccer**: `ball:futsal` (size 4, circumference 62 to 64 cm, 400 to 440 g, 0.6 to 0.9 atm, a 50 to 65 cm first bounce from 2 m: Futsal Laws of the Game 2025/26, Law 2) and `ball:beach-soccer` (size 5, 68 to 70 cm, 400 to 440 g, 0.4 to 0.6 atm: Beach Soccer Laws of the Game 2024-25, Law 2). Their rules are in `size.rule` and `size.note`, and `test/proportions.test.ts` holds every new ball to its rule's size.
- The package is now 186 emblems, 66 of them balls and implements.

## [0.2.1] - 2026-10-14

Eleven balls and implements drawn to the rulebook's proportions, flat emblems turning with the hand, and the gallery as one page per language.

### Fixed

- **Eleven balls and implements were drawn out of proportion to the rulebook, the puck by half.** The puck was drawn 1 : 6 (thickness to diameter) where IIHF Rule 13 makes it 1 : 3, because the half thickness was divided by two twice; the curling stone's body was 0.200 of its diameter where the rules (a 914 mm circumference, a height of at least 114 mm) make it 0.392, and its handle now stands on the taller body; the feather shuttlecocks' feathers were 50 mm long where the Law gives 62 to 70 mm (now 66 mm); the discus was 2.2% too thin; the American, Canadian and IFAF footballs were 9% too slim and the rugby ball 6% too slim, with their outlines 4 to 7% too short; the Australian football was 12% too fat. The footballs and the rugby ball now take their width from the girth (the circumference over pi) and their `point` from the long girth, and the Australian football is an ellipsoid of its two girths. Nothing in the `size` metadata changed. A new test, `test/proportions.test.ts`, draws every ball and implement edge-on, measures the drawing itself (not the constants it was made from) and holds its ratio, size and, for the pointed balls, outline to the figures in `size` within 2%; it also checks that only a ball or an implement claims a real size, and that `lineup` at the true scale gives every piece the same pixels per millimetre. The ball contact sheets in `docs/pieces` are redrawn.

- **A flat thing turned the other way from a ball and a cup.** A ball rolls and a cup slides its light so that a positive yaw carries the front toward the right (and a drag to the right, or the Right arrow, is a positive yaw), but the coin turn of a medal, a crest, a pictogram, a piece of gear and a pennant showed its rim on the right, as if the front went left, so that dragging a medal to the right turned it against the hand. The rim is now on the left for a positive yaw (and on the right for a negative one), the edge that comes toward the eye, in the still and the line style alike. Only the side of the rim changes: the squeeze, the back and every angle are as before, `yaw` and `setAngles` mean the same, and `bindTurn` keeps its signs (right is more yaw, up is more pitch). A unit test holds the rim's side for every flat emblem and the ball's roll, and the demo's tests drag a ball, a cup and a medal to the right and measure which way each goes.

### Changed

- **The gallery is two pages, one language each.** `docs/gallery.md` (English) and `docs/gallery.ja.md` (the Japanese) are both written by `scripts/make-gallery.mjs`, linked to each other at the top, with the columns Id, name, kind, source and description. The Constant and Import columns are gone (the long paths made GitHub squeeze the Japanese column to one character wide, so the names stacked): each page states once that the constant is the id in capitals (`trophy:lidded-cup` becomes `TROPHY_LIDDED_CUP`) and that it is imported from `@johnmorrisdotca/dougu-sports/trophy/lidded-cup`, and the generator stops if the rule fails for any emblem. `pnpm test:readme` checks both pages and accepts the rule as naming each emblem's constant.

## [0.2.0] - 2026-10-14

The package is now 167 emblems (24 trophies, 5 awards, 6 medals, 4 crests, 38 sports, 47 balls, 42 gear and a pennant) and every one is its own drawing: the copied art and its licences are gone, the five Japanese sports and budo (sumo, kendo, judo, kyudo, karate) are in, text can be engraved on medals, plaques, cups, a ring, a banner and a pennant, every emblem turns through one coin-flip turn, and there are labels in two languages, data addresses, sprites, a podium, an award case, `sportEquipment` for all 38 sports and `bindTurn` to turn an emblem with a drag, the keys or a clock.

### Added

- **Japanese sports and budō** ([docs/japanese-sports.md](docs/japanese-sports.md)), all original drawings with generic ids and no real trophy's name: `trophy:sumo-cup` (a tall silver cup on a tall stepped stand with phoenix-crested handles, a body of revolution), `trophy:championship-banner` (a fringed banner on a pole with a gilt finial and an embroidered border, no lettering unless `initials` gives up to three letters; `tint` is the cloth, `accent` the trim), and the gear `gear:gunbai` (the referee's war fan with its tassel), `gear:mawashi`, `gear:shinai`, `gear:kendo-men`, `gear:judogi`, `gear:obi` (with `OBI_RANKS`, white to black, and `obi(rank, options)`), `gear:yumi`, `gear:ya` and `gear:karate-gi`. Five sports are added to `SPORT_NAMES` (now 38) with a pictogram each: `sumo`, `kendo`, `judo`, `kyudo`, `karate`. `JAPANESE_IDS` lists the 16 together, and the gallery page shows them in a section of their own. 
- **Japanese names are first-class**, read by a reviewer and using the governing bodies' words (`柔道衣`, `空手衣`, `廻し`, `軍配`, `竹刀`, `剣道の面`, `優勝旗`, `弓`, `矢`); `emblemInfo(id).description` and `EMBLEM_DESCRIPTIONS` hold a longer description in English and Japanese for the docs and the gallery.
- Gear has the `color` style (flat fills) as well as `metal` and `line`, and a part can be shaded across its width (`cyl`) as a round shaft is.
- **Labels.** `EmblemOptions` takes `locale` (`"en"` or `"ja"`: the `<title>` is the emblem's Japanese name, with `lang="ja"` on the drawing) and `title` (a string is written, escaped; `false` drops the `<title>` and marks the drawing `aria-hidden="true"`). Both work for every emblem in every style, still and turned, and in `crest()` and `medal()`.
- **`emblemDataUri(ref, options)`**: a percent-encoded `data:image/svg+xml;utf8,…` address for an `<img>`, a CSS background or a canvas, with `currentColor` made a concrete colour (`color` for the line, else the theme's ink; the default is dark ink), and a browser test that loads it in an `<img>` and on a canvas.
- **`emblemSprite(ids, options)`**: one hidden `<svg>` of `<symbol>`s with the definitions shared and every id unique across the sheet, and `use(id, { size, class, title })` for the markup of each use. Sixty-four soccer balls are 2,304 nodes and 530 kB inline and 228 nodes and 15 kB from a sheet; sixty-four medals 1,792 nodes and 115 kB against 220 and 8.7 kB.
- **`sportEquipment(sport)`**: `{ sport, ball?, gear[], trophy, medal? }` for each of the 38 sports (the five Japanese ones with their gear and `trophy:sumo-cup`), typed, with every id an id of the registry, and a test that every id exists and every sport is covered.
- **`podium(places, options)`** and **`awardCase(items, options)`**: a podium of first, second and third on tiered steps, with medals or trophies, names, flags (SVG markup or a URL, drawn as an inert image) and lines of text; and a team's trophies on a shelf or in a row with `×N` badges, wrapping into rows. Both are one SVG string in the page's text colour, light and dark, with `role="img"`, a title and a description, in English and Japanese.
- **`bindTurn(element, ref, options)`** in the `./turn` entry, in a module of its own: a drag, the arrow keys, Home and Space turn an emblem drawn with `emblemFrame`, with `sensitivity`, `pitchRange`, `keyStep` and `onTurn`; a controller with `angles`, `setAngles`, `update` and `destroy`. An emblem that cannot turn (read from the registry's frames, or one that says `turnable: false`) is drawn as it is; every emblem of the package turns, so only a custom one is. An auto-turn (`autoPlay`, `speed`, `pauseOnInteract`, `onPlayChange`, `play`, `pause`, `togglePlay`, `playing`) runs on `requestAnimationFrame` with a clamped time step, stops while the page is hidden, and only starts when asked: under `prefers-reduced-motion` `autoPlay: true` starts paused unless it is `"force"`.
- The demo's playground turns its emblem with `bindTurn`, synced with the yaw, tilt and roll sliders, with an auto-turn button and speed choice and a hint in English and Japanese, and has a trophy case of turnable emblems; a new compose page draws the podium, the award case, a sprite sheet, a data address and a sport's equipment, each with a copy button.
- `docs/compose.md`, a `bindTurn` section in `docs/turning.md`, README examples, and tests (`test/api.test.ts`, `test/turn-control.test.ts`, `e2e/turn.demo.mjs`, `e2e/compose.demo.mjs`).
- **Engraving.** Text cut into a face, from `engrave` (one string, up to three lines of 24 letters, Japanese included) or `label`, `year` and `rank`, with `engraveBack` for a back: on the medals and place badges (replacing the star or the numeral), `trophy:plaque` (the words on the plate, the year on the nameplate), `trophy:belt`, `trophy:ring`, `trophy:banner`, `pennant:championship`, and the plinth of each of the 16 cups and stands that are bodies of revolution. The lines are fitted to the plate (the biggest size that fits, a space may break a line), escaped, and cut in the ink that reads at 4.5 to 1 on the metal (a tone of it, black or white; the page's ink in the line style). Turned, the text goes with its face: squeezed on a medal, hidden on its back or another text there, and set letter by letter round a plinth so that it foreshortens and goes behind the edge.
- **`pennant()` and `pennant:championship`**: a felt championship pennant on a dowel with a stitched edge, lettered with its words and its year, in metal (felt fibres), color and line; its back is plain felt with the dowel on the other side. The new group `pennant`, and the `./pennant/*` export.
- **`trophy:ring`** (a championship ring: a band, a wide faceted head with a gem, the team and the year on its shoulders) and **`trophy:banner`** (a rafter banner on a rod, in the tint and accent, with its words and year). With the sumo cup and the championship banner the `trophy` group has 24 emblems.
- **Every emblem turns, through one turn.** Gear, the awards and the sport pictograms flip like a coin (`src/emblems/emblem.flip.ts`, the only turn of flat drawings: it takes any finished drawing, squeezes it by the cosine, shows it mirrored and a little darker on the back, and gives it a thin rim that is widest edge on). The Japanese gear and pictograms use it too, so there is no second turn for gear. `test/turn.test.ts` holds every id to a finite, well-formed frame at every yaw and pitch, and every flat one to a turn that differs, repeats at 360 and has a back.
- **Two pictograms redrawn to read at 16 pixels.** `sport:sumo` is two rikishi in the shikiri crouch (the stance before the charge), belts on, facing each other on the edge of the ring (it was a war fan that read as a frying pan; the fan is `gear:gunbai`), and `sport:handball` is a hand throwing the ball, with lines of speed (it was a goal and a ball that read as basketball).
- Options `engrave`, `label`, `year`, `rank`, `engraveBack`, `numberColor` (a pennant's lettering) and `view`; the playground has an Engrave field, and the gallery shows an engraved example, turned and from behind, for each emblem that takes one.

### Changed

- **No third-party art is left.** The 11 gear pieces that were copied (`gear:hockey-stick`, `field-hockey-stick`, `lacrosse-stick`, `cricket-bat`, `table-tennis-paddle`, `badminton-racket`, `tennis-racket`, `goal-net`, `football-helmet`, `goalie-mask`, `baseball-glove`; from Noto Emoji, Wikimedia Commons and game-icons.net) and the 18 Material Symbols items (`trophy:cup`, the five `award:*` and the twelve pictograms `sport:nfl`, `cfl`, `ifaf`, `nhl`, `nba`, `mlb`, `soccer`, `tennis`, `volleyball`, `cricket`, `rugby`, `handball`) are redrawn as clean vector geometry in the package's own style (metal, color and line, light and dark), and the third-party art is removed with the scripts that only served it (`scripts/fetch-material-symbols.mjs`, `scripts/dougu/fetch-gear.mjs`, `build-gear.mjs`, `svgmin.mjs`, `gear-assets.json`), `LICENSES/Apache-2.0.txt`, `LICENSES/CC-BY-3.0.txt`, `LICENSES/upstream/` and every NOTICE entry for them. `NOTICE.md` keeps the rulebook table the balls' sizes come from; `LICENSES/` holds the MIT text. The `material`, `noto`, `mdi`, `commons` and `gameicons` values of `EmblemSource` and `PieceSource` are gone (every emblem is `ours`, `generated` or `drawn`), and so is the `MaterialModel` type.
- **Sizes.** The 11 gear pieces are 7.5 kB gzipped in the metal style and 4.4 kB as lines, from 28.2 kB and 17.0 kB (27% and 26%), and their modules 14.5 kB from 82.8 kB (4.3 kB from 29.2 kB gzipped). The 18 Material items are 8.5 kB in metal (from 7.5 kB, because they now have bevels, glints and a second colour) and 5.8 kB as lines (from 7.8 kB), and their sources 12.8 kB from 23.1 kB (3.7 kB from 6.5 kB gzipped). The built `dist` is 137 kB gzipped as a tarball, from 158 kB, with 16 emblems more.
- **Every emblem has a short accessible name** (the `<title>`): English 26 characters at most and Japanese 12 or a little over where the established word is longer (`ダブルイエロー`, `バスケットボールのトロフィー`); the longer text moved to the descriptions. 41 names were shortened, among them `trophy:tennis-cup` (`Pineapple cup`), `trophy:hockey-cup`, `sport:ifaf`, the squash balls, `gear:badminton-racket`, `gear:hurley` (`ハーリングのスティック`). Football in Japanese is `アメフト…` for American football and bare `ホッケー` means field hockey (ice hockey is always `アイスホッケー`).
- **Gaelic football is spelled `ゲーリックフットボール`** on both `sport:gaelic` and `ball:gaelic-football` (the pictogram had a middle dot).
- The rugby, volleyball, baseball, basketball, soccer, tennis, cricket and handball pictograms now show the equipment, with a grey sheet in the metal style like the other pictograms, instead of a solid glyph.
- `playwright.config.mjs` takes `TEST_PORT` (default 7201), so a worktree can test on its own port.
- The demo's playground keeps the turn when the emblem, style, tint or look changes, instead of putting the emblem back at rest.
- The playground and the gallery turn every emblem (the gear and the icons had no turn controls).
- Item sizes grew with the new code (gzipped, one item bundled by itself): a medal 3.2 to 4.5 kB, a flat emblem 3.0 to 4.3 kB, a cup 5.6 to 6.9 kB, a pictogram or an award 1.8 to 3.7 kB (the sumo and handball outlines 4.1 and 3.8 kB), a piece of gear 2.6 to 3.7 kB, the pennant 3.3 kB; the limits in `test/size.test.ts` are 4.6, 7.1 and 4.3 kB for a flat emblem, a cup and an icon. The engraving code is left out of a bundle that does not draw a medal, a plaque or a cup, and the turn code is the only addition to an icon's.

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

[Unreleased]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.3.2...v0.4.0
[0.3.2]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/johnmorrisdotca/dougu-sports/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/johnmorrisdotca/dougu-sports/releases/tag/v0.0.1
