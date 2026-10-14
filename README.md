<h1 align="center">Dougu Sports <sub>道具</sub></h1>

<p align="center"><strong>Sports emblems as SVG strings, with optional 3D turning.</strong><br>
Trophies, medals, crests, and the ball and gear of every sport, each one a function that returns SVG: in metal, in one line, or in flat colour, light and dark, any size, any tint. Turn one about its axis and it is another string. Each emblem is its own module, so a page that wants one ball takes one ball. MIT, with no dependencies.</p>

<p align="center">
  <a href="https://github.com/johnmorrisdotca/dougu-sports/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/johnmorrisdotca/dougu-sports/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@johnmorrisdotca/dougu-sports"><img alt="npm" src="https://img.shields.io/npm/v/@johnmorrisdotca/dougu-sports?color=2f5d4a"></a>
  <a href="./LICENSE"><img alt="MIT licence" src="https://img.shields.io/badge/licence-MIT-2f5d4a"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-0-2f5d4a">
  <img alt="TypeScript" src="https://img.shields.io/badge/types-TypeScript-3178c6">
</p>

<p align="center"><a href="https://johnmorrisdotca.github.io/dougu-sports/"><strong>Open the demo →</strong></a> · <a href="https://johnmorrisdotca.github.io/dougu-sports/gallery.html">Gallery</a> · <a href="./docs/gallery.md">Every id</a> · <a href="./docs/turning.md">Turning</a> · <a href="./docs/layout.md">Layout</a></p>

<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/hero-desk-dark.png">
<img alt="The package's two sample emblems, each in the three styles: a gold medal on a red ribbon, and a soccer ball, drawn in metal with gradients, as one outline, and in flat colour." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/hero-desk-light.png" width="760">
</picture>
</p>

<table align="center">
<tr>
<td align="center" valign="top">
<img alt="A soccer ball and a medal turned through five angles: the ball rolls, and the medal flips like a coin to show its plain back." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/turn-desk-light.png" width="470"><br><em>Turned: a ball rolls, a medal flips</em>
</td>
<td align="center" valign="top">
<img alt="The same emblems on a phone, light." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/phone-light.png" width="200"><br><em>On a phone</em>
</td>
</tr>
</table>

> **Status: scaffold.** The package so far holds the machinery and two sample emblems, `award:medal` and `ball:soccer`, that stand in for the art. The trophies, medals, crests and the ball and gear of 33 sports arrive group by group ([docs/layout.md](./docs/layout.md) says where each goes), and the README's counts are read from the code, so they grow with it. Not on npm yet.

## In 30 seconds

```sh
npm install @johnmorrisdotca/dougu-sports
```

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("ball:soccer", { style: "color", size: 48 });

console.log(svg.startsWith("<svg")); // true
console.log(svg.includes("<title>Soccer ball</title>")); // true
```

Put the string in a page (`element.innerHTML = svg`), write it to a file, or send it from a server: it is plain SVG, with no script, no font and no network. The outline takes the page's text colour, so an emblem follows light and dark mode as the text does.

## Who it is for

- **Sports sites** that mark a champion, a result or a list with a trophy, a medal or a crest, without licensing a logo.
- **Scoreboards and brackets** that want a generic emblem for a team that has no logo, tinted in the team's colour.
- **Anyone building a game or a card** who needs a ball or a piece of gear for a sport, in one style that matches the rest.
- **Pages that care about weight**: one emblem is one module and about 2 kB gzipped, and the package says `"sideEffects": false`.

## Features

- **Three styles** for every emblem: `metal` (full colour with gradients), `line` (one outline in the page's text colour) and `color` (flat fills); see [Theming](#theming).
- **Size, tint and theme** as options: a tint recolours the main part (a medal's metal, a ball's patches), a theme sets the outline for light, dark or either.
- **Turning**: `emblemFrame` and `ballFrame` return the emblem at an angle, in plain SVG; see [docs/turning.md](./docs/turning.md).
- **One module per item**, so a bundler takes only what is imported; see [Use it in your project](#use-it-in-your-project).
- **Typed ids**: `EmblemId` is a union of `award:*`, `trophy:*`, `medal:*`, `crest:*`, `ball:*`, `gear:*` and `sport:*` ids.
- **Generic by design**: no emblem carries a league's, a team's or a federation's name or mark.
- **Accessible**: every drawing is `role="img"` with a `<title>`; see [Accessibility](#accessibility).
- **Deterministic**: the same id and options give the same string; a gradient's id comes from its colour.
- **No dependencies**, ESM with types.

### What's in it

<table>
<tr>
<td align="center" valign="top"><img alt="A gold medal on a red ribbon with a star on its face, in metal, line and color." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/hero-desk-light.png" width="360"><br><em><code>award:medal</code> and <code>ball:soccer</code>, each in three styles</em></td>
<td align="center" valign="top"><img alt="A soccer ball and a medal turned through five angles." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/turn-desk-light.png" width="360"><br><em>Turned through five angles</em></td>
</tr>
</table>

The list of every emblem, with its names, kind, source and the import that takes it alone, is [docs/gallery.md](./docs/gallery.md), made from the built package.

## Use it in your project

### Install

```sh
npm install @johnmorrisdotca/dougu-sports
# or: pnpm add @johnmorrisdotca/dougu-sports
# or: yarn add @johnmorrisdotca/dougu-sports
```

It is ESM, and `require` works on Node 22.12 and later. It needs no DOM: the functions return strings.

### Install under another name

```sh
npm install emblems@npm:@johnmorrisdotca/dougu-sports
```

```ts no-check
import { renderEmblem } from "emblems/emblems";
```

The alias is a name in your `package.json` only: the same package, the same code.

### Entry points

| Import | What it holds |
| --- | --- |
| `@johnmorrisdotca/dougu-sports` | The full registry: every emblem by id, the functions, and each emblem as a constant |
| `@johnmorrisdotca/dougu-sports/emblems` | `renderEmblem`, the ids and the types, with no single drawing imported by name |
| `@johnmorrisdotca/dougu-sports/turn` | `emblemFrame` and `ballFrame` |
| `@johnmorrisdotca/dougu-sports/award/<name>` | One award, trophy, medal, crest or sport emblem, alone (`award/medal`) |
| `@johnmorrisdotca/dougu-sports/ball/<name>` | One ball, alone (`ball/soccer`) |
| `@johnmorrisdotca/dougu-sports/gear/<name>` | One piece of gear, alone |

### One emblem and nothing else

```js
import { BALL_SOCCER } from "@johnmorrisdotca/dougu-sports/ball/soccer";

console.log(BALL_SOCCER.id); // ball:soccer
console.log(BALL_SOCCER.svg({ size: 24 }).includes('width="24"')); // true
```

A bundler that imports this module takes the soccer ball and the small renderer for balls, and no other emblem: the package says `"sideEffects": false` and each constant is marked pure. `test/size.test.ts` bundles one item with esbuild and holds it under 3 kB gzipped; `pnpm test:package` does the same from the packed tarball.

### In a page

```html
<span id="trophy"></span>
<script type="module">
  import { renderEmblem } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/dougu-sports@0/emblems";
  document.getElementById("trophy").innerHTML = renderEmblem("award:medal", { size: 40 });
</script>
```

### On a server

```js no-run
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
import { writeFileSync } from "node:fs";

writeFileSync("medal.svg", renderEmblem("award:medal", { size: 256, theme: "light" }));
```

## Examples

### Draw an emblem by its id

An id is `<group>:<name>`. `renderEmblem` takes an id, or an id with a style after a slash.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(renderEmblem("award:medal/line") === renderEmblem("award:medal", { style: "line" })); // true
console.log(renderEmblem("award:medal") === renderEmblem("award:medal", { style: "metal" })); // true
```

### Tint an emblem in a team's colour

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("ball:soccer", { style: "color", tint: "#0b6e4f" });
console.log(svg.includes('fill="#0b6e4f"')); // true
console.log(renderEmblem("ball:soccer", { tint: "not a colour" }) === renderEmblem("ball:soccer")); // true
```

A tint is `#rgb`, `#rrggbb` or `rgb(r, g, b)`; anything else is ignored, so a colour that comes from outside cannot reach the markup.

### Choose the outline for a theme

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(renderEmblem("award:medal", { theme: "dark" }).includes('color="#eef1f3"')); // true
console.log(renderEmblem("award:medal", { theme: "light" }).includes('color="#20262d"')); // true
console.log(renderEmblem("award:medal").includes(" color=")); // false
```

### Turn an emblem

```js
import { ballFrame, emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(emblemFrame("award:medal", { yaw: 0 }) === renderEmblem("award:medal")); // true
console.log(ballFrame("ball:soccer", { yaw: 90 }) === ballFrame("ball:soccer", { yaw: 450 })); // true
```

More in [docs/turning.md](./docs/turning.md).

### Read what an emblem is

```js
import { emblemInfo, emblemName } from "@johnmorrisdotca/dougu-sports";

console.log(emblemInfo("award:medal").kind); // flat
console.log(emblemName("award:medal", "ja")); // メダル
```

### List the emblems

```js
import { EMBLEM_GROUPS, EMBLEM_IDS, SPORT_NAMES } from "@johnmorrisdotca/dougu-sports";

console.log(Object.keys(EMBLEM_GROUPS).join(" ")); // award trophy medal crest ball gear sport
console.log(EMBLEM_IDS.includes("ball:soccer")); // true
console.log(SPORT_NAMES.length); // 33
```

### Check a string from outside

```js
import { isEmblemId, parseEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(isEmblemId("ball:soccer")); // true
console.log(parseEmblem("ball:soccer/line")?.style); // line
console.log(parseEmblem("ball:nonesuch")); // undefined
```

### In React, Vue and the rest

The functions return strings, so a framework puts them where it puts any markup: `dangerouslySetInnerHTML={{ __html: renderEmblem("award:medal") }}` in React, `v-html` in Vue, `{@html …}` in Svelte. The string holds no script and no external reference.

```ts no-check
const Medal = () => <span dangerouslySetInnerHTML={{ __html: renderEmblem("award:medal", { size: 32 }) }} />;
```

## The emblems

An emblem is a small object: `id`, `en` and `ja` names, a `source` (who drew it), a `kind`, the `model` it is drawn from, and two functions, `svg(options)` and `frame(options)`.

| Kind | What it is | A turn |
| --- | --- | --- |
| `flat` | A front and a back drawn from paths: a medal, a plaque, a rosette | Flips like a coin |
| `ball` | Marks on a sphere: a ball | Rolls |
| `lathe` | A body of revolution: a cup, a bowl, an urn | Keeps its outline, moves its light |
| `icon` | One path | Is not turned |

Only `flat` and `ball` exist so far; the others are named here because the art that is coming needs them.

### The groups

| Group | What it holds | Folder |
| --- | --- | --- |
| `award` | Awards: a medal on a ribbon, a crown, a star, a badge | `src/emblems/award/` |
| `trophy` | Cups, bowls, plaques, belts, wreaths | `src/emblems/award/` |
| `medal` | Gold, silver and bronze, and the places | `src/emblems/award/` |
| `crest` | Generic crests, tinted by a team's colour | `src/emblems/award/` |
| `ball` | The ball of each sport | `src/emblems/ball/` |
| `gear` | The gear of each sport: a stick, a racket, a helmet | `src/emblems/gear/` |
| `sport` | An icon for the sport itself | `src/emblems/award/` |

The thirty-three sports the ball, gear and sport emblems are made for are `SPORT_NAMES`: NFL, CFL, IFAF, NHL, NBA, MLB, soccer, curling, tennis, volleyball, badminton, pickleball, table tennis, padel, squash, racquetball, sepak takraw, teqball, roundnet, netball, swimming, water polo, diving, artistic swimming, lacrosse, rugby, Australian football, Gaelic games, cricket, field hockey, handball, athletics and skating.

## API

| Function or value | What it does |
| --- | --- |
| `renderEmblem(ref, options?)` | An emblem as SVG. `ref` is an id, an id with a style (`"award:medal/line"`), or an emblem |
| `emblemSvg` | The same as `renderEmblem` |
| `emblemFrame(ref, options?)` | An emblem turned by `yaw` and `pitch` degrees |
| `ballFrame(id, options?)` | A ball rolled; an id that is not a ball is an error |
| `parseEmblem(value)` | The id and style a string names, or `undefined` |
| `isEmblemId(value)`, `isBallId(value)` | Whether a value is the id of an emblem, or of a ball |
| `emblemOf(ref)` | The emblem object a reference names |
| `emblemInfo(id)`, `emblemName(id, language?)`, `emblemModel(id)` | What an emblem is: its names, kind and source, and the data it is drawn from |
| `EMBLEMS` | Every emblem as markup in the metal style at 64 pixels, by id |
| `EMBLEM_TABLE` | Every emblem object, by id |
| `AWARD_MEDAL`, `BALL_SOCCER` | The two emblems so far, as constants |
| `EMBLEM_IDS`, `EMBLEM_GROUPS`, `EMBLEM_FOLDERS` | Every id, the groups, and the folder of each group's art |
| `AWARD_IDS`, `TROPHY_IDS`, `MEDAL_IDS`, `CREST_IDS`, `BALL_IDS`, `GEAR_IDS`, `SPORT_IDS` | The ids of each group |
| `SPORT_NAMES` | The thirty-three sports |
| `EMBLEM_STYLES`, `EMBLEM_INK`, `EMBLEM_PAGE`, `METALS` | The styles, the ink and page colours the themes use, and the metals |
| `VERSION` | The package's version |

### Options

| Option | Values | Default |
| --- | --- | --- |
| `style` | `"metal"`, `"line"`, `"color"` | `"metal"` |
| `size` | A number of pixels, 4096 at most | `64` |
| `tint` | `#rgb`, `#rrggbb` or `rgb(r, g, b)` | the emblem's own colour |
| `theme` | `"inherit"`, `"auto"`, `"light"`, `"dark"` | `"inherit"` |
| `yaw`, `pitch` (turning only) | Degrees from the resting view | `0` |

The types are `EmblemId`, `EmblemRef`, `EmblemOptions`, `FrameOptions`, `EmblemStyle`, `EmblemTheme`, `Emblem`, `EmblemInfo`, `EmblemKind`, `EmblemSource`, `EmblemGroup`, `SportName`, and the id types of each group.

## Theming

Every emblem is drawn with its outline in `currentColor`, so it takes the colour of the text around it. The `theme` option changes that when the SVG is used where it cannot inherit (an `<img>`, a data address):

| `theme` | The outline |
| --- | --- |
| `inherit` | The page's text colour (`currentColor`): the default for markup put in a page |
| `auto` | Dark ink on a light device and pale ink on a dark one, by `prefers-color-scheme` |
| `light` | `#20262d`, made to read on `#ffffff` |
| `dark` | `#eef1f3`, made to read on `#14181c` |

The metals are `METALS` (gold `#d9a620`, silver `#aeb6c0`, bronze `#b8733a`). The `line` style has no fill, so it takes only the outline's colour.

## Limits

- Two sample emblems exist so far; the rest of the art is on its way (see the status note above).
- A turn is drawn in plain SVG, not in 3D: a flat emblem is squeezed, and a ball's patches are projected points, not a lit mesh. A patch round a ball's edge is flattened against it rather than clipped to the sphere.
- A tint is one colour. A second colour (a ribbon, a crest's band) is not an option yet.
- The size is a number of pixels up to 4096; the drawing is a vector at any size.
- No emblem carries a real league's, team's or federation's mark.

## Accessibility

- Every emblem is `role="img"` with a `<title>` that names it in English ("Medal", "Soccer ball"). `emblemName(id, "ja")` gives the Japanese name for a caller that writes its own label.
- Where an emblem is only decoration next to text that says the same, hide it from a screen reader with `aria-hidden="true"` on the element that holds it.
- Colour is never the only carrier of meaning: the `line` style has no colour at all.
- The outline reads at 4.5 to 1 against the page the `light` and `dark` themes name; the tests hold the pair.
- Nothing moves by itself: turning happens when the caller asks for a frame, and the demo's sliders are 44 pixels tall.

## Browser and runtime support

Any current browser, and Node 22 or later. The package is plain strings, so it also runs in Deno, Bun, a worker and an edge function. CI tests Node 22 and 24 on Linux, macOS and Windows, and the demo in Chromium and WebKit at a phone's width and a desk's.

## Languages

The package's own words are the emblems' names, in English (`en`) and Japanese (`ja`), read with `emblemName(id, language)`. The `<title>` inside a drawing is English. The demo's header and footer come in English and Japanese.

## Roadmap

- The art: trophies, medals, crests, then the ball and the gear of each of the 33 sports, group by group.
- Bodies of revolution (`lathe`), so a cup turns with its outline kept.
- A second colour as an option.
- Deliberately not: logos of real leagues and teams, a canvas or WebGL renderer, and a runtime dependency.

## Architecture

The code is `src/emblems/`: the core (options, colours, the wrapper), the id lists, the registry, the two renderers (flat and ball) and one module per emblem; [docs/layout.md](./docs/layout.md) has the folders and how to add one. The package has no state and no clock: every function is a pure function of its arguments.

## The name

Dougu (道具, *dōgu*, どうぐ) is Japanese for a tool or a piece of equipment: the things a task is done with. The package is the equipment of sport, as pictures.

## Where it comes from, and where it is used

The emblems are drawn for this package or made from the open sources listed in [NOTICE.md](./NOTICE.md), each with its licence in [LICENSES/](./LICENSES/). It is made for [spxn.com](https://spxn.com), the historical record of the NHL, NBA, MLB, NFL and CFL, and for the other packages of the family that draw sport.

### Used by

[Kyogijo Stadiums](https://github.com/johnmorrisdotca/kyogijo-stadiums) draws the same kind of emblems today, inside itself; they move here, and Kyogijo then imports them.

### The family

<!-- family:start (made by scripts/family-readme.mjs from scripts/family-template.mjs; change those, not this) -->
Dougu Sports is one of twenty-seven packages, each made for the same site, each at
[github.com/johnmorrisdotca](https://github.com/johnmorrisdotca). The code of every one is MIT.

- [Korokoro](https://github.com/johnmorrisdotca/korokoro) (コロコロ): dice, with notation, exact odds, real sounds and the dice of many games. [Demo](https://johnmorrisdotca.github.io/korokoro/).
- [Kyuubu](https://github.com/johnmorrisdotca/kyuubu) (キューブ): a turning cube for the browser, 2×2 to 7×7, with record solves to replay. [Demo](https://johnmorrisdotca.github.io/kyuubu/).
- [Hitotsu](https://github.com/johnmorrisdotca/hitotsu) (一つ): a colour-card shedding game for two to eight, with the house rules people play. [Demo](https://johnmorrisdotca.github.io/hitotsu/).
- [Toranpu](https://github.com/johnmorrisdotca/toranpu) (トランプ): a deck of playing cards, card games with computer players, and solitaires. [Demo](https://johnmorrisdotca.github.io/toranpu/).
- [Tane](https://github.com/johnmorrisdotca/tane) (種): seeded random numbers and daily seeds, the same in every browser and on every server. [Demo](https://johnmorrisdotca.github.io/tane/).
- [Narabe](https://github.com/johnmorrisdotca/narabe) (並べ): one rules engine for abstract board games, from gomoku and Reversi to Go and checkers. [Demo](https://johnmorrisdotca.github.io/narabe/).
- [Tenka](https://github.com/johnmorrisdotca/tenka) (天下): world conquest for two to six, on a map of the real world. [Demo](https://johnmorrisdotca.github.io/tenka/).
- [Kumimoji](https://github.com/johnmorrisdotca/kumimoji) (組み文字): a crossword tile race, in English and Japanese kana. [Demo](https://johnmorrisdotca.github.io/kumimoji/).
- [Tsunagi](https://github.com/johnmorrisdotca/tsunagi) (繋ぎ): a line-joining logic puzzle whose every level has exactly one answer. [Demo](https://johnmorrisdotca.github.io/tsunagi/).
- [Jarajara](https://github.com/johnmorrisdotca/jarajara) (ジャラジャラ): mahjong tiles drawn as SVG, stacked layouts, and the matching solitaire Awase. [Demo](https://johnmorrisdotca.github.io/jarajara/).
- [Suido](https://github.com/johnmorrisdotca/suido) (水道): a pipe puzzle: turn the pieces until the water reaches every drain. [Demo](https://johnmorrisdotca.github.io/suido/).
- [Domino](https://github.com/johnmorrisdotca/domino) (ドミノ): dominoes and Mexican Train. [Demo](https://johnmorrisdotca.github.io/domino/).
- [Kotoba](https://github.com/johnmorrisdotca/kotoba) (言葉): word lists and word-game rules in English, French, German and Japanese. [Demo](https://johnmorrisdotca.github.io/kotoba/).
- [Sugoroku](https://github.com/johnmorrisdotca/sugoroku) (双六): backgammon and its variants, with the doubling cube and match play. [Demo](https://johnmorrisdotca.github.io/sugoroku/).
- [Kazu](https://github.com/johnmorrisdotca/kazu) (数): grid number puzzles: Sudoku and its variants, Futoshiki and Skyscrapers. [Demo](https://johnmorrisdotca.github.io/kazu/).
- [Meikyuu](https://github.com/johnmorrisdotca/meikyuu) (迷宮): mazes on squares, hexagons, triangles and circles, made from a seed and drawn through with a finger or the mouse. [Demo](https://johnmorrisdotca.github.io/meikyuu/).
- [Hikidashi](https://github.com/johnmorrisdotca/hikidashi) (引き出し): a drawer of small Japanese text tools: era dates, kanji numerals, readings and sentence difficulty. [Demo](https://johnmorrisdotca.github.io/hikidashi/).
- [Chizu](https://github.com/johnmorrisdotca/chizu) (地図): maps of the world and of countries' regions, in English and Japanese, with a quiz and callouts. [Demo](https://johnmorrisdotca.github.io/chizu/).
- [Bushu](https://github.com/johnmorrisdotca/bushu) (部首): find a kanji by the parts it is made of. [Demo](https://johnmorrisdotca.github.io/bushu/).
- [Tobiishi](https://github.com/johnmorrisdotca/tobiishi) (飛び石): peg solitaire with nine boards and seeded solvable challenges. [Demo](https://johnmorrisdotca.github.io/tobiishi/).
- [Jirai](https://github.com/johnmorrisdotca/jirai) (地雷): minesweeper on shaped grids with verified no-guess boards. [Demo](https://johnmorrisdotca.github.io/jirai/).
- [Gunjin](https://github.com/johnmorrisdotca/gunjin) (軍人): five hidden-rank strategy games with pass-the-device play. [Demo](https://johnmorrisdotca.github.io/gunjin/).
- [Karakuri](https://github.com/johnmorrisdotca/karakuri) (からくり): eight hyper-casual puzzle games, some of them physics: draw a shield, pull pins, cut ropes, slide blocks, pour tubes. [Demo](https://johnmorrisdotca.github.io/karakuri/).
- [Houseki](https://github.com/johnmorrisdotca/houseki) (宝石): gem and stone matching puzzles: falling triplets, stone collapse, colour chains and gem swap. [Demo](https://johnmorrisdotca.github.io/houseki/).
- [Kyogijo Stadiums](https://github.com/johnmorrisdotca/kyogijo-stadiums) (競技場): sports fields, rinks, courts and ballparks drawn to scale as SVG, with each team and the score on them. [Demo](https://johnmorrisdotca.github.io/kyogijo-stadiums/).
- [Taisen Brackets](https://github.com/johnmorrisdotca/taisen-brackets) (対戦): a sport-agnostic tournament bracket, drawn as SVG, from a list of ties. [Demo](https://johnmorrisdotca.github.io/taisen-brackets/).
- [Dougu Sports](https://github.com/johnmorrisdotca/dougu-sports) (道具): sports emblems as SVG: trophies, medals, crests, and the ball and gear of every sport, with optional 3D turning. [Demo](https://johnmorrisdotca.github.io/dougu-sports/). Not on npm yet.

**This package is Dougu Sports.** The demos of all twenty-seven share one header and footer, so each links the rest.
<!-- family:end -->

## Development

```sh
pnpm install
pnpm check          # lint, types, tests, the build and the packed package
pnpm dev            # the demo on http://127.0.0.1:7200/
pnpm test:demo      # the demo in a real browser
pnpm test:readme    # the README's and the docs' examples, and docs/gallery.md
pnpm screenshots    # retake the README's pictures
```

This package owns local ports 7200 to 7299 (see [CONTRIBUTING.md](./CONTRIBUTING.md)).

## Contributing

Bug reports and ideas go in the [issues](https://github.com/johnmorrisdotca/dougu-sports/issues); read [CONTRIBUTING.md](./CONTRIBUTING.md) first, and [docs/layout.md](./docs/layout.md) before adding an emblem.

## Changes

See [CHANGELOG.md](./CHANGELOG.md). 0.0.1 is the first preview: the name, the API and two sample emblems; the full set follows.

## Credits

The medal and the soccer ball are drawn for this package. Every other source is credited in [NOTICE.md](./NOTICE.md).

## Licence

The code, and the art drawn for this package, are [MIT](./LICENSE). Art taken from another project keeps its own licence, named in [NOTICE.md](./NOTICE.md), with its text in [LICENSES/](./LICENSES/).
