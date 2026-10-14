<h1 align="center">Dougu Sports <sub>道具</sub></h1>

<p align="center"><strong>Sports emblems as SVG strings, with optional 3D turning.</strong><br>
Trophies, medals, crests, the icon of every sport, and the ball and gear of the sports, each one a function that returns SVG: in polished metal, in one line, or in flat colour, light and dark, any size, any tint. Turn one about its axis and it is another string. Each emblem is its own module, so a page that wants one trophy takes one trophy. MIT, with no dependencies.</p>

<p align="center">
  <a href="https://github.com/johnmorrisdotca/dougu-sports/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/johnmorrisdotca/dougu-sports/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@johnmorrisdotca/dougu-sports"><img alt="npm" src="https://img.shields.io/npm/v/@johnmorrisdotca/dougu-sports?color=2f5d4a"></a>
  <a href="./LICENSE"><img alt="MIT licence" src="https://img.shields.io/badge/licence-MIT-2f5d4a"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-0-2f5d4a">
  <img alt="TypeScript" src="https://img.shields.io/badge/types-TypeScript-3178c6">
</p>

<p align="center"><a href="https://johnmorrisdotca.github.io/dougu-sports/"><strong>Open the demo →</strong></a> · <a href="https://johnmorrisdotca.github.io/dougu-sports/gallery.html">Gallery</a> · <a href="./docs/gallery.md">Every id</a> · <a href="./docs/turning.md">Turning</a> · <a href="./docs/layout.md">Layout</a> · <a href="./docs/japanese-sports.md">Japanese sports</a></p>

<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/hero-desk-dark.png">
<img alt="Ten trophies drawn in metal, each a generic form that stands for a league's cup: a tall banded silver cup, a ring of gold pennants round a baseball, a football on a three-sided stand, a basketball over a net, a wide two-handled bowl on a tall base, a globe held up by spiral figures, a gilt dish, a lidded cup with a pineapple, a terracotta urn and a gilded lidded cup. Below them gold, silver and bronze medals, crests, a rosette, a wreath and a belt, and one cup in the three styles." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/hero-desk-light.png" width="760">
</picture>
</p>

<table align="center">
<tr>
<td align="center" valign="top">
<img alt="A two-handled cup, a banded cup, a medal and a soccer ball each turned through five angles: the cups keep their outline and move their light and handles, the medal flips like a coin to show its plain back, and the ball rolls." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/turn-desk-light.png" width="470"><br><em>Turned: a ball rolls, a medal flips</em>
</td>
<td align="center" valign="top">
<img alt="The same emblems on a phone, light." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/phone-light.png" width="200"><br><em>On a phone</em>
</td>
</tr>
</table>

> **Status: preview.** 167 emblems: 24 trophies, 5 awards, 6 medals, 4 crests, a pictogram for each of the 38 sports, 47 balls and implements drawn in 3D, 42 pieces of gear (among them the Japanese sports and budo, [docs/japanese-sports.md](./docs/japanese-sports.md)) and a championship pennant; [docs/layout.md](./docs/layout.md) says where each goes. All of it is drawn for this package: no art is copied from another project.

## In 30 seconds

```sh
npm install @johnmorrisdotca/dougu-sports
```

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("trophy:hockey-cup", { size: 48 });

console.log(svg.startsWith("<svg")); // true
console.log(svg.includes("<title>Banded silver cup</title>")); // true
```

Put the string in a page (`element.innerHTML = svg`), write it to a file, or send it from a server: it is plain SVG, with no script, no font and no network. The outline takes the page's text colour, so an emblem follows light and dark mode as the text does.

## Who it is for

- **Sports sites** that mark a champion, a result or a list with a trophy, a medal or a crest, without licensing a logo.
- **Scoreboards and brackets** that want a generic emblem for a team that has no logo, tinted in the team's colour.
- **Anyone building a game or a card** who needs a ball or a piece of gear for a sport, in one style that matches the rest.
- **Pages that care about weight**: one emblem is one module, 2 to 7 kB gzipped with the renderer for its kind (a medal about 4.5, a turning cup about 7, an icon 2 to 3.6), and the package says `"sideEffects": false`.

## Features

- **Three styles** for every emblem: `metal` (polished metal: a gradient, a highlight and a soft rim of reflected light, edged in a darker tone of its own metal, with no heavy outline), `line` (one clean outline in the page's text colour, made to read at 14 pixels) and `color` (flat fills); see [Theming](#theming).
- **Size, tint, accent and theme** as options: a tint recolours the main part (a medal's metal, a crest's colour, a ball's patches), an accent the second colour (a ribbon, a crest's band, the pennants), a theme sets the ink for light, dark or either.
- **Turning**: `emblemFrame` and `ballFrame` return the emblem at an angle, in plain SVG: every emblem turns, a ball rolls, a cup keeps its outline and moves its light, and everything flat (gear, a bat, a crown, a sport's icon) flips like a coin; `bindTurn` lets a drag, the arrow keys or an auto-turn do the turning in a page; see [docs/turning.md](./docs/turning.md).
- **Engraving**: text cut into a medal, a plaque, the belt, a ring, a banner, a pennant and the plinth of a cup, from `label`, `year` and `rank` or one `engrave` string, in the ink that reads at 4.5 to 1 on the metal, and it turns with the emblem; see [Engrave an emblem](#engrave-an-emblem).
- **Labels in two languages**: the `<title>` is English or Japanese (`locale`), your own words (`title: "…"`), or left out for an emblem that sits beside text that says the same (`title: false`).
- **As an image, a sprite, a podium or a case**: `emblemDataUri` for an `<img>`, a CSS background or a canvas, `emblemSprite` to draw one emblem fifty times cheaply, `sportEquipment` for what a sport is played with, and `podium` and `awardCase` for results and trophy shelves; see [docs/compose.md](./docs/compose.md).
- **One module per item**, so a bundler takes only what is imported; see [Use it in your project](#use-it-in-your-project).
- **Short names and helpers**: `"cup"` is `"trophy:cup"`, `"trophy:cup/line"` is the line style, and `crest`, `medal`, `sportIcon` and `pennant` draw a team's crest, a medal, a sport's icon and a championship pennant.
- **Typed ids**: `EmblemId` is a union of `award:*`, `trophy:*`, `medal:*`, `crest:*`, `ball:*`, `gear:*`, `sport:*` and `pennant:*` ids.
- **Japanese sports and budō** (道具 is the name): a sumo cup, a championship banner, and the war fan, belt, bamboo sword, kendo helmet, judo and karate suits, rank belts, long bow and arrow, with Japanese names that are the governing bodies' words; see [docs/japanese-sports.md](./docs/japanese-sports.md).
- **Generic by design**: no emblem carries a league's, a team's or a federation's name or mark.
- **Accessible**: every drawing is `role="img"` with a `<title>`; see [Accessibility](#accessibility).
- **Deterministic**: the same id and options give the same string; a gradient's id comes from its colour.
- **No dependencies**, ESM with types.

### What's in it

<table>
<tr>
<td align="center" valign="top"><img alt="Ten trophies, medals and crests, and one cup in the three styles." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/hero-desk-light.png" width="360"><br><em>Trophies, medals and crests, and one cup in three styles</em></td>
<td align="center" valign="top"><img alt="Cups, a medal and a ball turned through five angles." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/turn-desk-light.png" width="360"><br><em>Turned through five angles</em></td>
</tr>
</table>

Every emblem, with its id in both styles and a button that copies it, is on the [gallery page](https://johnmorrisdotca.github.io/dougu-sports/gallery.html); the same list as text, with its names, kind, source and the import that takes it alone, is [docs/gallery.md](./docs/gallery.md), made from the built package. [docs/emblems.md](./docs/emblems.md) says how the art is drawn.

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
| `@johnmorrisdotca/dougu-sports/turn` | `emblemFrame`, `ballFrame` and `bindTurn` |
| `@johnmorrisdotca/dougu-sports/<group>/<name>` | One emblem, alone: `trophy/hockey-cup`, `medal/gold`, `crest/shield`, `sport/nhl`, `award/crown`, `ball/soccer`, `pennant/championship`, `gear/<name>` |

### One emblem and nothing else

```js
import { TROPHY_HOCKEY_CUP } from "@johnmorrisdotca/dougu-sports/trophy/hockey-cup";

console.log(TROPHY_HOCKEY_CUP.id); // trophy:hockey-cup
console.log(TROPHY_HOCKEY_CUP.svg({ size: 24 }).includes('width="24"')); // true
```

A bundler that imports this module takes the cup and the renderer for a body of revolution, and no other emblem: the package says `"sideEffects": false` and each constant is marked pure. `test/size.test.ts` bundles one item with esbuild and holds it to a limit for its kind (a ball 6.8 kB, a medal or a crest 4.6 kB, a cup 7.1 kB gzipped, most of that the renderer); `pnpm test:package` does the same from the packed tarball.

### In a page

```html
<span id="trophy"></span>
<script type="module">
  import { renderEmblem } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/dougu-sports@0/emblems";
  document.getElementById("trophy").innerHTML = renderEmblem("trophy:hockey-cup", { size: 40 });
</script>
```

### On a server

```js no-run
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
import { writeFileSync } from "node:fs";

writeFileSync("cup.svg", renderEmblem("trophy:hockey-cup", { size: 256, theme: "light" }));
```

## Examples

### Draw an emblem by its id

An id is `<group>:<name>`. `renderEmblem` takes an id, or an id with a style after a slash.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(renderEmblem("medal:gold/line") === renderEmblem("medal:gold", { style: "line" })); // true
console.log(renderEmblem("medal:gold") === renderEmblem("medal:gold", { style: "metal" })); // true
console.log(renderEmblem("cup") === renderEmblem("trophy:cup")); // true
console.log(renderEmblem("gear:hurley").includes("<title>Hurley</title>")); // true
```

A trophy or an award can also be written without its group: `"cup"` is `"trophy:cup"` and `"crown"` is `"award:crown"` (`EMBLEM_ALIASES` lists them).

### Tint an emblem in a team's colour

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("ball:soccer", { style: "color", tint: "#0b6e4f" });
console.log(svg.includes('fill="#0b6e4f"')); // true
console.log(renderEmblem("ball:soccer", { tint: "not a colour" }) === renderEmblem("ball:soccer")); // true
```

A tint is `#rgb`, `#rrggbb` or `rgb(r, g, b)`; anything else is ignored, so a colour that comes from outside cannot reach the markup. The `accent` option is a second colour in the same form: a medal's ribbon, a crest's band, a rosette's tails.

### Draw a crest for a team with no logo

```js
import { crest } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = crest({ shape: "roundel", colors: ["#c8102e", "#f4f0e4"], initials: "no" });
console.log(svg.includes(">NO<")); // true
console.log(svg.includes("#c8102e") && svg.includes("#f4f0e4")); // true
```

A crest takes the team's colour and a second colour, and up to three letters, in the ink that reads on the colour; with no letters it has a star. `medal("gold")` and `sportIcon("nhl")` are the same kind of shortcut.

### Draw balls at their true sizes

```js
import { emblemInfo, lineup } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(emblemInfo("ball:golf").size.diameterMm); // 42.67
const svg = lineup(["ball:golf", "ball:tennis", "ball:soccer", "ball:puck"], { height: 80 });
console.log(svg.includes("<title>Balls at their true relative sizes")); // true
```

Each ball carries the official size of the rulebook it is from (`emblemInfo(id).size`, with the rule), and `lineup` draws several side by side at the rules' relative sizes.

### Choose the outline for a theme

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(renderEmblem("medal:gold", { theme: "dark" }).includes('color="#eef1f3"')); // true
console.log(renderEmblem("medal:gold", { theme: "light" }).includes('color="#20262d"')); // true
console.log(renderEmblem("medal:gold").includes(" color=")); // false
```

### Turn an emblem

```js
import { ballFrame, emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(emblemFrame("trophy:hockey-cup", { yaw: 0 }) === renderEmblem("trophy:hockey-cup")); // true
console.log(emblemFrame("trophy:tennis-cup", { yaw: 90 }) === renderEmblem("trophy:tennis-cup")); // false
console.log(ballFrame("ball:soccer", { yaw: 90 }) === ballFrame("ball:soccer", { yaw: 450 })); // true
```

More in [docs/turning.md](./docs/turning.md).

### Engrave an emblem

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const medal = renderEmblem("medal:gold", { engrave: "MVP 2026" });
console.log(medal.includes(">MVP<") && medal.includes(">2026<")); // true
const plaque = renderEmblem("trophy:plaque", { label: "Champions", year: 2026 });
console.log(plaque.includes(">Champions<") && plaque.includes(">2026<")); // true
const cup = renderEmblem("trophy:hockey-cup", { engrave: "優勝 2026" });
console.log(cup.includes(">優<")); // true
console.log(renderEmblem("medal:gold").includes("<text")); // false
```

A medal, a place badge, the plaque, the belt, a ring (the team up one shoulder and the year down the other), a banner and a pennant take an engraving, and so does the plinth of every cup that stands on one. Give one string (`engrave`, any text, Japanese included, up to three lines of 24 letters), or a `label`, a `year` and a `rank`: the rank is the biggest line, the year the smallest. The text is escaped, fitted to its face (a longer word is set smaller, and a space is a place to break the line when that makes bigger letters) and cut in the ink that reads at 4.5 to 1 on the metal, a tone of the metal, black or white, in the line style the page's ink.

```js
import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";

const at = (yaw) => emblemFrame("medal:gold", { engrave: "MVP", engraveBack: "2026", yaw });
console.log(at(0).includes(">MVP<"), at(180).includes(">MVP<"), at(180).includes(">2026<")); // true false true
```

Turned, the engraving goes with its face: squeezed with a medal, hidden on its back (which has an engraving of its own when `engraveBack` is given), and on a cup set letter by letter round the plinth, so it foreshortens, slides behind the edge and comes round again. A drawn numeral or star that an engraving replaces is left out.

### Draw a championship pennant

```js
import { pennant } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = pennant({ colors: ["#1f4e8c", "#f2c230"], text: "Champions", year: 2026 });
console.log(svg.includes(">CHAMPIONS<") && svg.includes(">2026<")); // true
console.log(pennant({ text: "Champions", view: "back" }).includes("CHAMPIONS")); // false
```

A long triangle of felt on a dowel with a stitched edge, lettered with its words and its year as large as the triangle lets them be. The colours are the felt, the stitching and the lettering (which takes the stitching's colour unless a third is given); the back is plain felt with the dowel on the other side.

### Read what an emblem is

```js
import { emblemInfo, emblemName } from "@johnmorrisdotca/dougu-sports";

console.log(emblemInfo("medal:gold").kind); // flat
console.log(emblemInfo("trophy:hockey-cup").kind); // lathe
console.log(emblemName("medal:gold", "ja")); // 金メダル
```

### List the emblems

```js
import { EMBLEM_GROUPS, EMBLEM_IDS, SPORT_NAMES } from "@johnmorrisdotca/dougu-sports";

console.log(Object.keys(EMBLEM_GROUPS).join(" ")); // award trophy medal crest ball gear sport pennant
console.log(EMBLEM_IDS.includes("ball:soccer")); // true
console.log(SPORT_NAMES.length); // 38
```

### Check a string from outside

```js
import { isEmblemId, parseEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(isEmblemId("ball:soccer")); // true
console.log(parseEmblem("ball:soccer/line")?.style); // line
console.log(parseEmblem("ball:nonesuch")); // undefined
```

### Write the title in Japanese, in your own words, or not at all

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(renderEmblem("medal:gold", { locale: "ja" }).includes("<title>金メダル</title>")); // true
console.log(renderEmblem("medal:gold", { title: "Champions <2026>" }).includes("<title>Champions &lt;2026&gt;</title>")); // true
console.log(renderEmblem("medal:gold", { title: false }).includes('aria-hidden="true"')); // true
```

`locale` is `"en"` (the default) or `"ja"`. A `title` string is escaped and wins over the locale; `false` drops the `<title>` and marks the drawing `aria-hidden="true"`, for an emblem beside text that says the same.

### Use an emblem as an image

```js
import { emblemDataUri } from "@johnmorrisdotca/dougu-sports/emblems";

const src = emblemDataUri("sport:nhl", { size: 48, color: "#c8102e" });
console.log(src.startsWith("data:image/svg+xml;utf8,%3Csvg")); // true
console.log(decodeURIComponent(src).includes("currentColor")); // false
```

`currentColor` does not cross an `<img>` boundary, so the ink is made a colour for you: `color` for the line, otherwise the theme's (`"dark"` is pale ink; `"light"` and the default are dark ink). Every character that could end an attribute or a CSS `url()` is percent-encoded, so the string goes in `img.src`, `background-image: url("…")` and `new Image()` for a canvas. More in [docs/compose.md](./docs/compose.md).

### Draw one emblem many times

```js
import { emblemSprite } from "@johnmorrisdotca/dougu-sports/emblems";

const sprite = emblemSprite(["ball:soccer", "medal:gold"]);
const cell = sprite.use("ball:soccer", { size: 24, title: false });
console.log(cell.startsWith('<svg width="24" height="24" aria-hidden="true"><use href="#')); // true
console.log(sprite.sheet.includes("<symbol")); // true
```

Put `sprite.sheet` in the page once, then `sprite.use(id, { size, class, title })` for each cell. Sixty-four soccer balls are 2,304 nodes and 530 kB drawn inline and 228 nodes and 15 kB from a sheet; see [docs/compose.md](./docs/compose.md).

### What a sport is played with

```js
import { sportEquipment } from "@johnmorrisdotca/dougu-sports/emblems";

const nhl = sportEquipment("nhl");
console.log(nhl.ball, nhl.trophy); // ball:puck trophy:hockey-cup
console.log(nhl.gear.join(" ")); // gear:hockey-stick gear:hockey-skate gear:goalie-mask gear:goal-net
```

Each of the 38 sports has a trophy, most have a ball and gear, and a sport in the Games has a medal; every id is one `renderEmblem` draws.

### A podium and an award case

```js
import { awardCase, podium } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = podium([{ name: "Aoki", label: "9.80 s" }, { name: "Dupont" }, { name: "Rossi" }]);
console.log(svg.includes("<desc>1st: Aoki (9.80 s); 2nd: Dupont; 3rd: Rossi</desc>")); // true
const shelf = awardCase([{ emblem: "trophy:hockey-cup", count: 3 }, { emblem: "medal:gold" }]);
console.log(shelf.includes("×3")); // true
```

Both are one SVG string in the page's text colour, with a title and a description. A podium takes a flag as SVG markup or a URL, drawn as an image so that it cannot run anything; see [docs/compose.md](./docs/compose.md).

### Let a drag, the keys or a clock turn it

```js no-run
import { bindTurn } from "@johnmorrisdotca/dougu-sports/turn";

const turner = bindTurn(document.getElementById("cup"), "trophy:tennis-cup", { size: 160, speed: 36 });
document.getElementById("spin").onclick = () => turner.togglePlay();
```

A drag turns it, the arrow keys turn it, Space starts and stops an auto-turn, and nothing moves until you ask; see [docs/turning.md](./docs/turning.md).

### In React, Vue and the rest

The functions return strings, so a framework puts them where it puts any markup: `dangerouslySetInnerHTML={{ __html: renderEmblem("medal:gold") }}` in React, `v-html` in Vue, `{@html …}` in Svelte. The string holds no script and no external reference.

```ts no-check
const Cup = () => <span dangerouslySetInnerHTML={{ __html: renderEmblem("trophy:hockey-cup", { size: 32 }) }} />;
```

## The emblems

An emblem is a small object: `id`, `en` and `ja` names, a `source` (who drew it), a `kind`, the `model` it is drawn from, and two functions, `svg(options)` and `frame(options)`. A ball or an implement also has a `size`, its official dimensions and the rule they are from.

| Kind | What it is | A turn |
| --- | --- | --- |
| `lathe` | A body of revolution: a cup, a bowl, an urn, a column with a ball or a globe on it, a stand with flat faces | Keeps its outline, and moves its light, its handles, its seams and its grooves |
| `flat` | A front and a back drawn from shapes: a medal, a crest, a plaque, a rosette, a ring, a banner, a pennant | Flips like a coin, thick at the rim as it goes edge on |
| `ball` | A ball or an implement drawn in true 3D, with its panels, seams and marks on the surface | Rolls |
| `icon` | One drawing: an award, a plain cup or a sport's pictogram | Flips like a coin: its front, its back mirrored and a little darker, and a thin rim |
| `gear` | A piece of equipment, a flat drawing in layers | Flips like a coin, as an icon does |

### The groups

| Group | What it holds | Folder |
| --- | --- | --- |
| `award` | Five awards: a medal, a badge, a crown, a star, a shield | `src/emblems/award/` |
| `trophy` | Twenty-four trophies: ten that stand for a league's cup in a generic form (a tall banded cup, a ring of pennants round a baseball, a football on a stand, a ball over a net, a wide two-handled bowl, a globe held up by spiral figures, a gilt dish, a lidded cup with a pineapple, an urn, a gilded cup), plain cups, bowls and dishes, a plaque, a belt, a wreath, a rosette, a championship ring, a rafter banner, a phoenix-handled sumo cup and a championship banner | `src/emblems/trophy/` |
| `medal` | Gold, silver and bronze medals on a ribbon of five stripes, and a badge for each of the first three places | `src/emblems/medal/` |
| `crest` | Four generic crests, tinted by a team's colours, with its letters | `src/emblems/crest/` |
| `ball` | 47 balls and implements, in 3D, each with its official size: soccer, basketball, baseball, tennis, rugby, the footballs, golf, the puck, the curling stone and the rest | `src/emblems/ball/` |
| `gear` | 42 pieces of equipment: sticks, rackets, skates, a glove, a helmet, nets and posts, a javelin, starting blocks, and for the Japanese sports a war fan, a sumo belt, a bamboo sword, a kendo helmet, a judo suit, a belt, a long bow, an arrow and a karate suit | `src/emblems/gear/` |
| `sport` | One pictogram for each of the thirty-eight sports | `src/emblems/sport/` |
| `pennant` | A felt championship pennant on a dowel, with a stitched edge, lettered with its words and its year | `src/emblems/pennant/` |

The thirty-eight sports the ball, gear and sport emblems are made for are `SPORT_NAMES` (the five Japanese ones, sumo, kendo, judo, kyudo and karate, have a pictogram and their gear, and no ball): NFL, CFL, IFAF, NHL, NBA, MLB, soccer, curling, tennis, volleyball, badminton, pickleball, table tennis, padel, squash, racquetball, sepak takraw, teqball, roundnet, netball, swimming, water polo, diving, artistic swimming, lacrosse, rugby, Australian football, Gaelic games, cricket, field hockey, handball, athletics and skating. How the trophies are drawn, and what each stands for, is in [docs/emblems.md](./docs/emblems.md); the balls and the gear are described in [src/emblems/README.md](./src/emblems/README.md).

## API

| Function or value | What it does |
| --- | --- |
| `renderEmblem(ref, options?)` | An emblem as SVG. `ref` is an id, an id with a style (`"medal:gold/line"`), or an emblem |
| `emblemSvg` | The same as `renderEmblem` |
| `crest(options?)` | A crest by shape, colours and letters |
| `pennant(options?)` | A championship pennant by colours, words and year |
| `medal(kind, options?)` | A gold, silver or bronze medal on its ribbon |
| `sportIcon(sport, options?)` | The pictogram of a sport, by the names of `SPORT_NAMES`; an unknown sport is an error |
| `lineup(ids, options?)` | Several balls side by side, at their true relative sizes (or all as large as the largest) |
| `emblemFrame(ref, options?)` | An emblem turned by `yaw` and `pitch` degrees (and `roll` for a ball) |
| `bindTurn(element, ref, options?)` | Draws an emblem into an element and lets a drag, the arrow keys, Space or a clock turn it; returns a controller with `angles`, `playing`, `turnable`, `setAngles`, `update`, `play`, `pause`, `togglePlay` and `destroy` |
| `emblemDataUri(ref, options?)` | An emblem as a `data:image/svg+xml;utf8,…` address for an `<img>`, a CSS background or a canvas, with the ink made a colour (`color`, or the theme's) |
| `emblemSprite(ids, options?)` | A hidden sheet of `<symbol>`s with unique ids, and `use(id, { size, class, title })` for the markup of each use |
| `sportEquipment(sport)` | The ball, gear, trophy and medal of a sport, as ids of the registry |
| `podium(places, options?)` | First, second and third on tiered steps, with medals or trophies, names, flags and lines of text, as one SVG |
| `awardCase(items, options?)` | A team's trophies on a shelf or in a row, with `×N` count badges, wrapping into rows, as one SVG |
| `ballFrame(id, options?)` | A ball rolled; an id that is not a ball is an error |
| `parseEmblem(value)` | The id and style a string names, or `undefined` |
| `isEmblemId(value)`, `isBallId(value)` | Whether a value is the id of an emblem, or of a ball |
| `emblemOf(ref)` | The emblem object a reference names |
| `emblemInfo(id)`, `emblemName(id, language?)`, `emblemModel(id)` | What an emblem is: its short names (which are its accessible names), kind and source, a longer `description` where it has one, and the data it is drawn from |
| `EMBLEMS` | Every emblem as markup in the metal style at 64 pixels, by id |
| `EMBLEM_TABLE` | Every emblem object, by id |
| `TROPHY_HOCKEY_CUP`, `MEDAL_GOLD`, `CREST_SHIELD`, `SPORT_NHL`, `BALL_SOCCER`, `GEAR_HURLEY`... | Each emblem as a constant, named by its id in capitals (`trophy:hockey-cup`); [docs/gallery.md](./docs/gallery.md) lists every constant with its id and the module that takes it alone |
| `EMBLEM_IDS`, `EMBLEM_GROUPS`, `EMBLEM_FOLDERS`, `EMBLEM_ALIASES` | Every id, the groups, the folder of each group's art, and the short names (`cup` for `trophy:cup`) |
| `AWARD_IDS`, `TROPHY_IDS`, `MEDAL_IDS`, `CREST_IDS`, `BALL_IDS`, `GEAR_IDS`, `SPORT_IDS`, `PENNANT_IDS` | The ids of each group |
| `MEDAL_KINDS`, `CREST_SHAPES` | The kinds of medal, and the shapes of crest |
| `SPORT_NAMES` | The thirty-eight sports |
| `JAPANESE_IDS` | The ids of the Japanese sports and budo, together: sumo, kendo, judo, kyudo and karate, with their trophies and gear ([docs/japanese-sports.md](./docs/japanese-sports.md)) |
| `OBI_RANKS`, `obi(rank, options?)` | The colours of a belt from `white` to `black`, and the belt of a rank drawn |
| `EMBLEM_DESCRIPTIONS` | The longer description of an emblem, in English and Japanese; `emblemInfo(id).description` is the one of an id |
| `EMBLEM_STYLES`, `EMBLEM_INK`, `EMBLEM_PAGE`, `METALS` | The styles, the ink and page colours the themes use, and the metals |
| `VERSION` | The package's version |

### Options

| Option | Values | Default |
| --- | --- | --- |
| `style` | `"metal"`, `"line"`, `"color"` | `"metal"` |
| `size` | A number of pixels, 4096 at most | `64` |
| `tint` | `#rgb`, `#rrggbb` or `rgb(r, g, b)` | the emblem's own colour |
| `accent` | `#rgb`, `#rrggbb` or `rgb(r, g, b)` | the emblem's second colour (a ribbon, a band, pennants) |
| `initials` | Up to three letters (a crest, or the championship banner) | none: the crest has a star, the banner a ring and a star |
| `theme` | `"inherit"`, `"auto"`, `"light"`, `"dark"` | `"inherit"` |
| `grain` | `true` or `false` (a ball only) | on for a ball of 48 pixels or more that is not turning |
| `engrave` | Any text, up to three lines of 24 letters, Japanese included: cut into the face (see [Engrave an emblem](#engrave-an-emblem)) | none |
| `label`, `year`, `rank` | The words, the year (smaller, under them) and the number (the biggest line) to engrave when `engrave` is not given | none (a place badge's rank is its place) |
| `engraveBack` | The text of a medal's, ring's or banner's back, shown when it is turned over | a plain back |
| `numberColor` | The colour of a pennant's lettering | the stitching's colour |
| `view` | `"front"` or `"back"`: which side of a pennant is drawn at rest | `"front"` |
| `locale` | `"en"`, `"ja"`: the language of the `<title>` | `"en"` |
| `title` | A string (written, escaped, as the `<title>`) or `false` (no `<title>`, and `aria-hidden="true"`) | the emblem's name |
| `yaw`, `pitch`, `roll` (turning only; `roll` for a ball) | Degrees from the resting view | `0` |

`podium` and `awardCase` take their own options too (`width`, `style`, `theme`, `locale`, `title`, `desc`, and for the case `perRow`, `size` and `layout`), and `emblemDataUri`, `emblemSprite` and `bindTurn` theirs: see [docs/compose.md](./docs/compose.md) and [docs/turning.md](./docs/turning.md).

The types are `EmblemId`, `EmblemRef`, `EmblemOptions`, `EmblemLocale`, `FrameOptions`, `DataUriOptions`, `Sprite`, `SpriteOptions`, `UseOptions`, `SportEquipment`, `PodiumPlace`, `PodiumOptions`, `AwardItem`, `AwardCaseOptions`, `DisplayOptions`, `TurnControlOptions`, `TurnController`, `TurnAngles`, `TurnContainer`, `TurnEvent`, `EmblemStyle`, `EmblemTheme`, `Emblem`, `EmblemInfo`, `EmblemKind`, `EmblemSource`, `EmblemGroup`, `CrestOptions`, `CrestShape`, `PennantOptions`, `PennantId`, `MedalKind`, `LineupOptions`, `PieceSize`, `EmblemDescription`, `ObiRank`, `SportName`, the id types of each group (and `JapaneseId`), and the types of the models the emblems are drawn from (`LatheModel`, `FlatModel` and their parts).

## Theming

In the `metal` and `color` styles a trophy, a medal or a crest is edged by a darker tone of its own metal, so it needs nothing from the page and looks the same on a light page and on a dark one. In the `line` style (and in a pictogram, which is a drawing in ink) the drawing is `currentColor`, so it takes the colour of the text around it. The `theme` option changes that when the SVG is used where it cannot inherit (an `<img>`, a data address):

| `theme` | The ink |
| --- | --- |
| `inherit` | The page's text colour (`currentColor`): the default for markup put in a page |
| `auto` | Dark ink on a light device and pale ink on a dark one, by `prefers-color-scheme` |
| `light` | `#20262d`, made to read on `#ffffff` |
| `dark` | `#eef1f3`, made to read on `#14181c` |

The metals are `METALS` (gold `#d9a620`, silver `#aeb6c0`, bronze `#b8733a`); each is shaded with a dark edge, a bright band, the metal, a darker side and a faint light from the rim, which holds on both pages. The `line` style has no fill, so it takes only the ink. For a ball and a piece of gear, `color` is the same shaded drawing as `metal`.

## Limits

- A turn is drawn in plain SVG, not in 3D: a cup keeps its silhouette and moves its light, handles and seams; a medal is squeezed; a ball is projected from its own geometry, panel by panel, and has no grain while it turns. Gear, icons and pictograms flip like a coin, with the back as a mirror of the front and a thin rim; a pennant's back is its own drawing; one turn (`src/emblems/emblem.flip.ts`) does it for all of them.
- A tint is one colour, the main one, and an accent a second. The pieces of a trophy that are another metal (the gilt of a plate, the green bands of a globe, the black foot of a cup) keep their own colour.
- The trophies are generic: each is drawn for this package in a simplified form that a reader knows at a glance, and none is traced from a photograph or carries a name, a mark or an engraving.
- A trophy in the metal style is about 3 to 4.5 kB of markup, a medal or a crest about 1 to 2 kB, a line drawing about 1 to 2.5 kB; a ball in 3D is 5 to 13 kB, and a piece of gear is 1 to 4 kB, drawn in layers.
- The size is a number of pixels up to 4096; the drawing is a vector at any size.
- No emblem carries a real league's, team's or federation's mark.

## Accessibility

- Every emblem is `role="img"` with a `<title>` that names it in English ("Gold medal", "Soccer ball"). `emblemName(id, "ja")` gives the Japanese name for a caller that writes its own label.
- Where an emblem is only decoration next to text that says the same, pass `title: false`: the drawing has no `<title>` and is `aria-hidden="true"`. `locale: "ja"` writes the Japanese name, with `lang="ja"` on the drawing.
- A podium and an award case are `role="img"` with a `<title>` and a `<desc>` that says who stands where, or what is in the case, with the counts; the emblems inside carry no titles of their own, so nothing is read twice.
- `bindTurn` gives its element a tab stop, a role description and a description that names the arrow keys and Space, and `touch-action: none` so that a drag turns the emblem instead of scrolling. Nothing turns until the reader asks, and under `prefers-reduced-motion` an auto-turn only starts when the caller forces it.
- Colour is never the only carrier of meaning: the `line` style has no colour at all.
- The ink reads at 4.5 to 1 against the page the `light` and `dark` themes name, and a crest's letters read at 4.5 to 1 on the crest's colour, whatever the colour; the tests hold both.
- Nothing moves by itself: turning happens when the caller asks for a frame, and the demo's sliders are 44 pixels tall.

## Browser and runtime support

Any current browser, and Node 22 or later. The package is plain strings, so it also runs in Deno, Bun, a worker and an edge function. CI tests Node 22 and 24 on Linux, macOS and Windows, and the demo in Chromium and WebKit at a phone's width and a desk's.

## Languages

The package's own words are the emblems' names, in English (`en`) and Japanese (`ja`), read with `emblemName(id, language)`. The `<title>` inside a drawing is English unless you pass `locale: "ja"` or a `title` of your own; a podium's and an award case's default title and description, and `bindTurn`'s description for a screen reader, come in both languages the same way. The demo's header and footer come in English and Japanese.

## Roadmap

- Native review of the Japanese names, and more pictograms and gear where a sport has none yet.
- Deliberately not: logos of real leagues and teams, a canvas or WebGL renderer, and a runtime dependency.

## Architecture

The code is `src/emblems/`: the core (options, colours, gradients, the wrapper), the id lists, the registry, the renderers (the body of revolution, the flat object and icon, and the ball and gear engines) and one module per emblem, or per family of balls and gear, in a folder for its group; [docs/layout.md](./docs/layout.md) has the folders and how to add one. The package has no state and no clock: every function is a pure function of its arguments.

## The name

Dougu (道具, *dōgu*, どうぐ) is Japanese for a tool or a piece of equipment: the things a task is done with. The package is the equipment of sport, as pictures.

## Where it comes from, and where it is used

Every emblem is drawn for this package, and nothing is copied from another project: no icon set, no emoji and no clip art ([NOTICE.md](./NOTICE.md) says so, and keeps the rulebooks the balls' sizes were read from, listed in [docs/references.md](./docs/references.md)). It is made for [spxn.com](https://spxn.com), the historical record of the NHL, NBA, MLB, NFL and CFL, and for the other packages of the family that draw sport.

### Used by

[Kyogijo Stadiums](https://github.com/johnmorrisdotca/kyogijo-stadiums) drew the same kind of emblems inside itself; they moved here, redrawn, and Kyogijo then imports them.

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
- [Dougu Sports](https://github.com/johnmorrisdotca/dougu-sports) (道具): sports emblems as SVG: trophies, medals, crests, and the ball and gear of every sport, with optional 3D turning. [Demo](https://johnmorrisdotca.github.io/dougu-sports/).

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

See [CHANGELOG.md](./CHANGELOG.md). 0.1.0 brings the full set of 148 emblems; the next version engraves and turns everything; 0.0.1 was the first preview.

## Credits

The medal and the soccer ball are drawn for this package. Every other source is credited in [NOTICE.md](./NOTICE.md).

## Licence

The code, and the art drawn for this package, are [MIT](./LICENSE). Art taken from another project keeps its own licence, named in [NOTICE.md](./NOTICE.md), with its text in [LICENSES/](./LICENSES/).
