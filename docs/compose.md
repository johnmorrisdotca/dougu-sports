# Labels, images, sprites, equipment, podium and award case

[Back to the README](../README.md). The emblems draw themselves; these functions put them to work in a page: an `<img>`, a sheet drawn once and used many times, a sport's equipment, a podium and a trophy shelf. All are pure functions of their arguments that return strings, with no DOM and no dependency. The [demo's compose page](https://johnmorrisdotca.github.io/dougu-sports/compose.html) draws each one, with the call and a button that copies it.

## Labels: `locale` and `title`

Every emblem is `role="img"` with a `<title>`. Two options change it, and they work for every kind of emblem, in every style, still or turned, and in `crest()` and `medal()`:

| Option | Does |
| --- | --- |
| `locale: "ja"` | The `<title>` is the emblem's Japanese name (`emblemName(id, "ja")`), and the drawing says `lang="ja"`. `"en"` is the default. |
| `title: "…"` | The `<title>` is your text, escaped (at most 300 characters). It wins over `locale`. An empty string is ignored. |
| `title: false` | No `<title>`; the drawing is `aria-hidden="true"` and not `role="img"`. For an emblem next to text that says the same. |

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(renderEmblem("trophy:hockey-cup", { locale: "ja" }).includes("<title>段付きの銀カップ</title>")); // true
console.log(renderEmblem("ball:soccer", { title: "Match ball" }).includes("<title>Match ball</title>")); // true
console.log(renderEmblem("ball:soccer", { title: "<script>" }).includes("<script>")); // false
console.log(renderEmblem("ball:soccer", { title: false }).includes("<title>")); // false
```

## An emblem as an image: `emblemDataUri`

`emblemDataUri(ref, options?)` returns `data:image/svg+xml;utf8,…` for `img.src`, `background-image: url("…")` and a canvas. It takes the options of `renderEmblem` and one more, `color`.

An image cannot inherit its page's text colour: `currentColor` inside an `<img>` is black. The line style, a sport's pictogram and the awards are drawn in `currentColor`, so the ink is settled when the address is made:

| You pass | The ink is |
| --- | --- |
| `color: "#c8102e"` (or `#rgb`, `rgb()`) | that colour; it wins over `theme` |
| `theme: "dark"` | pale ink, `#eef1f3` |
| `theme: "light"`, `"inherit"` or nothing | dark ink, `#20262d` |
| `theme: "auto"` | dark ink, and pale ink where the device prefers a dark colour scheme (the rule is inside the image) |

The metals, a ball's panels and a crest's colour are not ink and are unchanged. The encoding leaves nothing that could end an attribute, a quoted `url("…")` or an unquoted one (`"`, `'`, `(`, `)`, `<`, `>`, `&`, `#`, a space), so the same string goes anywhere.

```js
import { emblemDataUri } from "@johnmorrisdotca/dougu-sports/emblems";

const red = emblemDataUri("sport:nhl", { size: 48, color: "#c8102e" });
console.log(decodeURIComponent(red).includes('stroke="#c8102e"')); // true
console.log(decodeURIComponent(emblemDataUri("sport:nhl", { theme: "dark" })).includes("#eef1f3")); // true
console.log(/["'()<>&#\s]/.test(red.slice("data:image/svg+xml;utf8,".length))); // false
```

```js no-run
img.src = emblemDataUri("medal:gold", { size: 64 });
element.style.backgroundImage = `url("${emblemDataUri("sport:nhl", { color: "#1f4e9c" })}")`;
const picture = new Image();
picture.onload = () => context.drawImage(picture, 0, 0);
picture.src = emblemDataUri("ball:soccer", { size: 128 });
```

A test in a real browser (`e2e/compose.demo.ts`) loads every kind of emblem, in several themes and colours and with a Japanese and a hostile title, in an `<img>`, and draws each on a canvas.

## One emblem, many times: `emblemSprite`

A bracket or a table that shows the same ball or medal fifty times pays for the whole drawing fifty times. `emblemSprite(ids, options?)` draws each emblem once, as a `<symbol>`, and returns the sheet and a function that writes the markup of one use:

```js
import { emblemSprite } from "@johnmorrisdotca/dougu-sports/emblems";

const sprite = emblemSprite(["ball:soccer", "medal:gold", "medal:gold/line"]);
console.log(sprite.sheet.match(/<symbol /g).length); // 3
console.log(sprite.use("medal:gold", { size: 20, class: "icon", title: "Winner" }).startsWith('<svg width="20" height="20" role="img" class="icon"><title>Winner</title><use href="#')); // true
console.log(sprite.use("medal:gold", { locale: "ja" }).includes("<title>金メダル</title>")); // true
```

- **`sheet`** is one hidden `<svg>` (`width="0" height="0"`, `position:absolute`, `aria-hidden`; not `display:none`, which stops a gradient from drawing in some browsers). Put it in the page once, anywhere in `<body>`.
- **`use(id, { size, class, title, locale })`** is `<svg width height role="img"><title>…</title><use href="#…"/></svg>`: three nodes, with the title, and two with `title: false`. `id` must be one of the sprite's (a short name such as `"cup"` is the same as `"trophy:cup"`); another is an error. The snippet has no `xmlns` and is for HTML.
- **Ids are unique across the sheet.** The gradients, clip paths and filters of every symbol are in one `<defs>`, each once, named by the sheet's prefix and a counter, so two symbols never share one and the sheet's ids cannot meet the page's. The prefix is made from the ids and the options (the same call gives the same sheet); `prefix: "bracket"` chooses it.
- **The sheet's options** are `style`, `tint`, `accent`, `theme` and `grain`, for every symbol. A `"dark"` or `"light"` theme is the `color` of each use; `"auto"` is a rule in the sheet that sets `color` on the uses (`class` carries it). A different look is another sprite, or an id that names its style (`"medal:gold/line"`). Symbols are drawn without the grain a large ball has by default (`grain: true` keeps it), because a sprite is for small, many drawings.

Measured with 64 uses at 24 pixels, as the markup is (an element each):

| 64 uses of | Inline: nodes | bytes | gzipped | Sprite sheet: nodes | bytes | gzipped |
| --- | --- | --- | --- | --- | --- | --- |
| `ball:soccer` | 2,304 | 530,496 | 5,917 | 228 | 15,254 | 1,876 |
| `medal:gold` | 1,792 | 115,392 | 1,404 | 220 | 8,703 | 852 |
| 32 balls and 32 medals | 2,048 | 322,944 | 4,876 | 254 | 17,006 | 2,358 |

The numbers include the sheet itself; the more uses, the closer a use is to its own 82 bytes. `test/api.test.ts` holds the saving to at least five to one in nodes and in bytes, and the compose page counts the nodes with a real browser's parser.

## What a sport is played with: `sportEquipment`

`sportEquipment(sport)` is `{ sport, ball?, gear[], trophy, medal? }` for each of the 42 `SPORT_NAMES`, typed, with every id an id of the registry (a test holds it):

```js
import { SPORT_NAMES, renderEmblem, sportEquipment } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(JSON.stringify(sportEquipment("nhl"))); // {"sport":"nhl","ball":"ball:puck","gear":["gear:hockey-stick","gear:hockey-skate","gear:goalie-mask","gear:goal-net"],"trophy":"trophy:hockey-cup"}
console.log(sportEquipment("athletics").medal); // medal:gold
console.log(SPORT_NAMES.filter((sport) => sportEquipment(sport).ball === undefined).join(" ")); // swimming diving artisticswimming skating sumo kendo judo kyudo karate mma boxing wrestling prowrestling
const everything = [sportEquipment("tennis").ball, ...sportEquipment("tennis").gear, sportEquipment("tennis").trophy].map((id) => renderEmblem(id));
console.log(everything.length); // 3
```

- `ball` is the ball or the implement that stands for one (the puck, the shuttlecock, the shot). Swimming, diving, artistic swimming, skating the five Japanese sports (sumo, kendo, judo, kyudo, karate) and the four combat sports (MMA, boxing, wrestling, professional wrestling) have none, so it is left out. `sportEquipment("sumo")` is the war fan, the mawashi and `trophy:sumo-cup`.
- `gear` lists the pieces of gear the package has an emblem for, most telling first; it is empty for a sport with none yet (sepak takraw, teqball, netball).
- `trophy` is the sport's own where the package draws one, and otherwise a plain `trophy:cup`, `trophy:bowl` or `trophy:laurel`. `medal` is `medal:gold` for a sport in the Games.
- The arrays are new on every call, and an unknown sport is an error.

## A podium: `podium`

`podium(places, options?)` puts first, second and third on tiered steps (second on the left, first in the middle, third on the right). `places[0]` is first; a place left out, or `null`, is an empty step.

```js
import { podium } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = podium(
  [
    { name: "Aoki", label: "9.80 s", flag: '<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r=".6" fill="#bc002d"/></svg>' },
    { name: "Dupont", label: "9.84 s", flag: "https://example.com/flags/fr.svg" },
    { name: "Rossi", emblem: "trophy:cup" },
  ],
  { width: 360, locale: "en" },
);
console.log(svg.includes("<desc>1st: Aoki (9.80 s); 2nd: Dupont (9.84 s); 3rd: Rossi</desc>")); // true
console.log(svg.includes('width="360"')); // true
console.log(podium([{ name: "青木" }], { locale: "ja" }).includes("<title>表彰台</title>")); // true
```

| A place has | Does |
| --- | --- |
| `emblem` | The medal or trophy on the step: any emblem. By default the gold, silver and bronze medals. |
| `name` | Written above the emblem; long names are cut with an ellipsis (the full name is in the description). |
| `flag` | SVG markup (`<svg …>`) or a URL; see below. |
| `label` | A line on the step: a time, a score, points. |

| Option | Values | Default |
| --- | --- | --- |
| `width` | Pixels; the height follows | `320` |
| `style` | `"metal"`, `"line"`, `"color"`: the emblems and the steps | `"metal"` |
| `theme` | `"inherit"`, `"auto"`, `"light"`, `"dark"` | `"inherit"` |
| `locale` | `"en"`, `"ja"`: the default title and description | `"en"` |
| `title`, `desc` | Your own title and description; `title: false` hides the drawing from a screen reader | "Podium", and who stands where |

**A flag is an image.** SVG markup is made a `data:image/svg+xml` address and drawn with `<image>`, and an SVG used as an image cannot run script or load anything, whatever it contains; a missing `xmlns` is added. A URL is accepted when it is `https:` with no credentials, a path on your own site (`/flags/fr.svg`, `./fr.svg`), or a `data:image/png|jpeg|gif|webp|avif|svg+xml` address. Anything else (`javascript:`, `http:`, `//host`, `file:`, a quote or a space) is left out and the place is drawn without a flag. Names, labels, titles and descriptions are escaped.

In Japanese the description reads `1位：青木（9.80 s）、2位：…`, with full-width punctuation and `、` between the places (a label is your own text, so its unit is yours to write); in an award case a count is spoken `3回`, not `×3`, because a screen reader reads × unevenly.

The drawing is the page's text colour on steps tinted in gold, silver and bronze, so it reads on light and dark; it is `role="img"` with a title and a description, and the emblems inside carry no titles of their own.

## An award case: `awardCase`

`awardCase(items, options?)` draws a team's trophies on a shelf, each kind once, with a `×N` badge when the team has won it more than once. It wraps into rows.

```js
import { awardCase } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = awardCase(
  [
    { emblem: "trophy:hockey-cup", count: 4, label: "1994 to 2010" },
    { emblem: "medal:gold", count: 12 },
    { emblem: "crest:shield" },
    { emblem: "trophy:cup", count: 0 },
  ],
  { perRow: 5 },
);
console.log(svg.includes("<desc>Banded silver cup ×4 (1994 to 2010), Gold medal ×12, Shield crest</desc>")); // true
console.log(svg.includes("×4") && svg.includes("×12")); // true
console.log(awardCase([{ emblem: "medal:gold" }], { locale: "ja" }).includes("<title>トロフィーケース</title>")); // true
```

An item is `{ emblem, count?, label? }`: `count` is 1 by default, a count under 1 leaves the item out, and a badge stops at `×999`; `label` is a line under the shelf (the years). At most 60 items are drawn.

| Option | Values | Default |
| --- | --- | --- |
| `perRow` | Items in a row before it wraps, 1 to 12 | `5` |
| `size` | An emblem's width in the drawing's units, 24 to 128 | `56` |
| `layout` | `"shelf"` (a plank under each row) or `"row"` (no plank, closer) | `"shelf"` |
| `width`, `style`, `theme`, `locale`, `title`, `desc` | As for `podium` | the drawing's own width |

The same trophy in two items shares its gradients; the whole case is a single string of SVG, in the page's text colour, with the badges in a fixed dark pill that reads on both pages.
