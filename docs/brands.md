# Made-up maker and team logos

[Back to the README](../README.md) · English

> **Experimental and temporary: draft designs.** The `/brands` entry point and these logos are a first draft. The designs will change, and the entry point may be redone or removed, so do not depend on it yet.

Twelve made-up makers of balls and sports gear and ten made-up teams, as SVG, in their own entry point, `@johnmorrisdotca/dougu-sports/brands`. They are meant to look like the marks of real sports companies and clubs (a bold geometric symbol, a plain wordmark, a crest or a mascot) while belonging to no one: the geometry, the lettering, the names and the colours are drawn for this package, and each one is checked against the real marks nearest to it.

**The mark is the logo.** Every maker's mark works alone, and that is what you get by default; its name is a separate part you ask for (`layout`). A team logo is a mark only.

```js
import { makerLogo, teamLogo } from "@johnmorrisdotca/dougu-sports/brands";

const mark = makerLogo("arvane", { size: 48 });
console.log(mark.startsWith("<svg") && mark.includes("<title>Arvane</title>")); // true
// The name is optional: beside the mark, under it, or alone.
console.log(makerLogo("arvane", { layout: "horizontal" }).includes("stroke-width")); // true
console.log(mark.includes("stroke-width")); // false
console.log(teamLogo("larkmoor", { theme: "dark" }).includes("<title>Larkmoor Foxes</title>")); // true
```

The contact sheet (every logo, light and dark, in colour and in one colour, small and large, on a ball and on a shirt) is the demo page `brands.html`: run `pnpm dev` and open `http://127.0.0.1:7200/brands.html`.

## The options

| Option | What it takes |
| --- | --- |
| `layout` | Makers only. `"mark"` (the default), `"wordmark"` (the name alone), `"horizontal"` (mark, then name) or `"stacked"` (name under the mark). |
| `color` | `"full"` (the default) draws the logo's own colours; `"mono"` draws it in one colour. |
| `theme` | `"light"` (the default) or `"dark"`: the palette made for a light page or a dark one. |
| `ink` | The one colour of a `"mono"` logo, `#rgb`, `#rrggbb` or `rgb()`. Anything else is ignored, and the default is `currentColor`, so a mono logo takes the page's text colour. |
| `size` | The height in pixels (64 by default, at most 4096); the width follows the layout. |
| `title` | A string for the `<title>`, or `false` to drop it and mark the drawing `aria-hidden`. By default the maker's name, or the team's city and nickname. |

One logo bundled alone is about 10 kB gzipped (the data of the whole set comes with it). Every logo is flat shapes with no id, gradient, filter, text or script. A mark is made so that it reads in one colour too: its parts never overlap another colour, and its negative space is real. Each is drawn on a 100 by 100 box, and holds at 16 pixels.

## Inside another drawing

`makerLogoGroup` and `teamLogoGroup` return a `<g>` to put inside any SVG: a jersey, a cap, a T-shirt, a card. It has no id and no title, so any number can share a document. `x`, `y` and `size` (the logo's height) say where it goes in that drawing's units.

```js
import { makerLogoGroup, teamLogoGroup } from "@johnmorrisdotca/dougu-sports/brands";

const chest = makerLogoGroup("kovreth", { x: 70, y: 60, size: 60 }, { theme: "dark" });
const sleeve = teamLogoGroup("tarn", { x: 20, y: 40, size: 24 });
const shirt = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${chest}${sleeve}</svg>`;
console.log(chest.startsWith('<g transform="translate(70 60) scale(0.6)">')); // true
console.log(shirt.includes("<title>")); // false
```

The package draws no shirt or cap of its own (the jerseys are another package's), so the placing is the caller's: the group is the same for any garment. The demo page draws a plain T-shirt shape of its own, to show a mark on a chest and a team logo on a sleeve.

## On a ball

`makerBall(id)` returns the options that print a maker's logo on a ball, to spread into `renderEmblem`, `emblemFrame` or `bindTurn`; `renderMakerBall` does the call for you. The logo is the ball's `decal` ([custom balls](custom-balls.md)): it is wrapped onto the sphere, so it curves with the ball and turns with it. The baseball, the softball and the classic soccer balls take it; any other ball ignores a print and is drawn plain.

```js
import { makerBall, renderMakerBall } from "@johnmorrisdotca/dougu-sports/brands";
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const ball = renderMakerBall("ball:baseball", "ostrel", {}, { size: 320 });
console.log(ball === renderEmblem("ball:baseball", { size: 320, ...makerBall("ostrel") })); // true
console.log(ball.includes("#ee6a2c")); // true
// With its name, wider on the ball (74 degrees against 50 for the mark alone).
console.log(makerBall("ostrel", { layout: "horizontal" }).decal.size); // 74
```

`width` (the logo's width in degrees of the ball) and `turn` adjust it, and `spots` of the ball's own options moves it. The same options of a maker (`layout`, `color`, `theme`, `ink`) apply.

## The data

`MAKERS` and `TEAMS` are the set as data: each entry has its `id`, its name, a `note`, its `parts` (an SVG path and a role, `a`, `b` or `c`, each) and its `light` and `dark` palettes; a maker also has the `lettering` of its wordmark. Draw them yourself if you need another format. `MAKER_IDS` and `TEAM_IDS` list the ids.

The wordmarks are set with this package's own alphabet of capitals (`lettering(word, style)`, `LETTERS`): strokes on a skeleton, with a style per maker (weight, rounded, cut or sharp corners, width, spacing, lean, line ends). It is not a typeface of anyone's, and it draws no letter outside A to Z.

## The makers

Each maker's note says what the nearest real brand is and how this one differs.

| Id | Name | Genre | Nearest real brand, and how this one differs |
| --- | --- | --- | --- |
| `arvane` | Arvane | stripes | the Adidas performance mark, three slanted stripes that make a triangle. Arvane is one upright triangle cut into three level bands with a notch in the base, in green and amber; there is no slanted stripe at all. |
| `tarsin` | Tarsin | animal | Orca, the triathlon and swim maker whose mark is a whole orca. Tarsin shows only the symmetrical tail fluke over two waterline bars, in indigo and cyan, and no body. |
| `ravelle` | Ravelle | motion | the Nike swoosh, one tapered curve. Ravelle is a ball with two concentric arcs that taper at both ends and wrap the ball like a wake; it has no single wedge and no check shape. |
| `kovreth` | Kovreth | monogram | Fila, a letter in a box. Kovreth is a hexagon with the K cut out of it as negative space (a slit between the stem and the arms), in sunflower; the letter, the shape and the cut are all different. |
| `dunmar` | Dunmar | shield | the shield badges that many kit makers and clubs use, with no single owner. Dunmar is a shield split down the middle, the right half set lower, with no letter, stripe or star, in claret and old gold. |
| `ostrel` | Ostrel | disc | The North Face, a half dome cut by curved lines. Ostrel is a whole disc cut by one straight diagonal gap into two offset pieces, in orange and navy. |
| `vexlin` | Vexlin | geometry | Umbro's double diamond and Hummel's chevrons, marks made of one repeated simple shape. Vexlin is three hexagons in a triangle, one a ring and one in the second colour, in violet and teal. |
| `quillan` | Quillan | disc | the BMW roundel, a circle in four quarters (not a sports mark). Quillan has convex quarter-discs set apart by a cross-shaped gap, one quarter smaller, with no ring, in teal and amber. |
| `tenzar` | Tenzar | monogram | the three-bar marks such as the Adidas performance logo. Tenzar is a Z of two level bars with bevelled ends joined by one diagonal slab in a second colour; the bars are not parallel and not three of a kind. |
| `marenko` | Marenko | geometry | no sports maker that we know; the golden-ratio spiral is a common device in design. Marenko is four tiles, three of them quarter-discs, in gold and green. |
| `halvane` | Halvane | animal | the Ram Trucks ram head (a vehicle maker, not sport) and clubs that are called Rams. Halvane is two spiral horns and a plain shield face, flat, in violet and yellow. |
| `solvik` | Solvik | ball | the everyday tennis-ball icon, a disc with two seam curves, which is a generic symbol and not any maker's mark. Solvik is a lime disc with two crescent seams cut out, and nothing else. |

## The teams

The city and the nickname are invented. Each team's note says what the nearest well-known logo is and how this one differs.

| Id | Team | Style | Nearest real logo, and how this one differs |
| --- | --- | --- | --- |
| `saltmere` | Saltmere Gulls | roundel | a club that wears a whole seagull. This one is a roundel: a gull's wings cut out of the sky over a wave line. |
| `greywick` | Greywick Wardens | crest | the many castle-on-a-shield crests. This is a plain shield under a red chief with a tower cut out. |
| `brightwater` | Brightwater Comets | monogram | letter-in-a-disc club badges. A B knocked out of a violet disc, with a gold arc for the comet. |
| `cinderfell` | Cinderfell Bears | mascot | the Memphis Grizzlies' bear head. This one is a flat front view built from circles, with an angry brow. |
| `valmere` | Valmere Hawks | mascot | the Atlanta Hawks' hawk head. This one is a faceted head in profile, in navy and amber. |
| `larkmoor` | Larkmoor Foxes | mascot | the Fox Racing head and the Leicester City fox. This is a front-facing fox made of seven flat facets. |
| `ironport` | Ironport Sharks | emblem | the San Jose Sharks' leaping shark. This one is only a fin, in a ring, over two wave bars. |
| `pinecrest` | Pinecrest Firs | badge | forestry and outdoor badges; no well-known club uses a fir. Three stacked triangles cut out of a rounded square. |
| `redfern` | Redfern Rovers | crest | the Dallas Cowboys' star. This is a gold star set inside a red diamond ring. |
| `tarn` | Tarn Valley Peaks | badge | Patagonia's skyline and The North Face's half dome. Two cut-out peaks and a sun in a hexagon. |

## How the names and marks were checked

- Every name was searched on the web as a sportswear or equipment brand, and the ones that turned up (a ski-gear maker, a cycling-clothing maker, a ball seller, an apparel maker) were dropped for another; the team names were searched as clubs and found nothing. A test (`test/brands.test.ts`) holds each maker's name at more than two letters' distance from a list of real brands, and keeps the set free of the author's own marks.
- Every mark was looked at beside the real marks of its kind: no three parallel slanted stripes, no check-shaped swoosh, no leaping cat, no double diamond, no chevron pair, no crocodile.
- This is a design check and a name search, not legal clearance. A trademark search (USPTO, EUIPO, WIPO) is the check for a business that will sell under one of these names.
- No logo or wordmark of SPX, SPXN, SPXIS or SportsInteractive is in the package, and nothing here is traced from anyone's work.
