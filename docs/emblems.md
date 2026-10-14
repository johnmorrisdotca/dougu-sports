# Emblems: how the art is drawn

[Back to the README](../README.md). Every emblem has an **id** (`trophy:hockey-cup`, `medal:gold`, `crest:shield`, `sport:nhl`, `ball:rugby`, `gear:hurley`), a name in English and in Japanese, and three styles. [gallery.md](gallery.md) lists them all with their names, kind, source and the import that takes each alone; the [gallery page](https://johnmorrisdotca.github.io/dougu-sports/gallery.html) draws them, with a button that copies each id.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const metal = renderEmblem("trophy:hockey-cup");
const line = renderEmblem("trophy:hockey-cup", { style: "line", size: 16 });
const same = renderEmblem("trophy:hockey-cup/line", { size: 16 });
console.log(metal.includes("linearGradient"), line.includes("linearGradient"), line === same);
// true false true
```

## The three styles

- **`metal`** (the default) is polished metal, drawn the way Material and Fluent icons are: clean shapes, no heavy black outline. Each round part has its own shading, a dark edge, a bright band left of the middle, the metal, a darker side and a faint light from the rim; a narrow highlight runs down it; a step or a ledge shows its top as a lighter ring; and the edge of a part is a darker tone of the metal, so the drawing holds on a white page and on a dark one.
- **`line`** is one clean outline in `currentColor`, with the small details left out, so that it takes the page's text colour and reads at 14 pixels. `"trophy:hockey-cup/line"` is the same as `{ style: "line" }`; the option wins if both are given.
- **`color`** is flat fills of the same tones, with no gradient.

The other options are `size`, `tint` (the main colour: the metal of a trophy, a crest's colour), `accent` (a second colour: a ribbon, a band, the pennants), `initials` (a crest's letters) and `theme`. `renderEmblem` is pure: the same call gives the same string.

## The trophies

A trophy is a body of revolution (kind `lathe`): a profile, which says the radius at each height, with what stands on it. One model draws the still emblem and the turned one. The profile is cut into pieces at its corners and its steps, and each piece is shaded across its own width, so a stack of bands widening one below another reads as a stack. The things that stand on the profile are:

| Part | What it is | Used by |
| --- | --- | --- |
| handles | A tube through points in the plane of its angle, drawn behind the cup when it is turned to the far side | the bowl, the cups, the urn |
| balls | A sphere with its seams (a basketball's, a soccer ball's, a globe's lines, a baseball's stitches), a football leaning at an angle, a pineapple | the ball trophies, the globe, the tennis cup |
| poles | A ring of poles, each with a pennant, their tops stepping up once round | the baseball trophy |
| decor | Rings, meridians, spiral strands, a net of diamonds, beads, and on a dish rings of gilt and rounded panels | the globe, the basketball, the plate |
| flat faces | A body of three or more flat sides, each lit by which way it faces | the football's stand |

Ten of them stand for the cup of a league or a sport, in a generic form that a reader knows at a glance. None carries a name, a mark or an engraving, and none is traced from a photograph:

| Id | What is drawn |
| --- | --- |
| `trophy:hockey-cup` | A tall silver cup: a small flared bowl, a collar, a bell, and a barrel of five bands that each widen a little, on a dark foot |
| `trophy:baseball` | A ring of thirty gold pennants on poles, their tops stepping up once round, standing round a silver baseball on a round base |
| `trophy:football` | A silver football leaning on one end, as if ready for a kick, on a tapered three-sided stand with a stepped base |
| `trophy:basketball` | A gold ball resting over a rim and a net, on a tapered column and a stepped base |
| `trophy:canadian-bowl` | A wide silver bowl with two handles on a stem, over a tall conical base of panels with a dark band and foot |
| `trophy:soccer-globe` | A gold globe held up by figures that spiral round a column flaring from a slim waist, over two green bands |
| `trophy:tennis-plate` | A silver salver on a pedestal, with rings of gilt and rounded panels on its face |
| `trophy:tennis-cup` | A gilded two-handled cup with a domed lid and a small pineapple, on a stem and a plinth |
| `trophy:cricket-urn` | A small terracotta urn with square handles, on a wooden base |
| `trophy:rugby-cup` | A gilded two-handled cup with a lid and a tall finial |

The rest are the plain `trophy:lidded-cup`, `trophy:bowl`, `trophy:salver`, `trophy:globe` and `trophy:soccer-ball`, the Material cup `trophy:cup`, and the flat `trophy:plaque`, `trophy:belt`, `trophy:laurel` and `trophy:rosette`.

## Medals, crests and pictograms

- **Medals** (`medal:gold`, `medal:silver`, `medal:bronze`) are a disc lit like a round of metal, with a bevelled rim, a star in relief and a plain back, hung from a ribbon of five stripes (blue, yellow, black, green, red); no rings are drawn. A medal flips like a coin. The `medal:place-1` to `medal:place-3` badges are the same disc with a numeral.
- **Crests** (`crest:shield`, `roundel`, `diamond`, `pennant`) are tinted by a team's colour, with a band and a bevelled edge, and the team's letters in the ink that reads on the colour (4.5 to 1, whatever the colour) or a star when it has none. `crest({ shape, colors, initials })` draws one.

```js
import { crest, medal, sportIcon } from "@johnmorrisdotca/dougu-sports/emblems";

const shield = crest({ shape: "shield", colors: ["#c8102e", "#f4f0e4"], initials: "HC" });
const gold = medal("gold");
const stick = sportIcon("nhl", { style: "line", size: 20 });
console.log(shield.includes(">HC<"), gold.includes("<title>Gold medal</title>"), stick.includes("<title>Ice hockey</title>"));
// true true true
```

- **Pictograms** (`sport:*`) are one for each of the thirty-three sports: twelve are Material Symbols icons and the rest are drawn here, each as the equipment (a stone, a shuttlecock, a racket, a net, a stick, an oval ball). They are drawn in the page's ink, and the metal style gives them a grey sheet when they are tinted.
- **Awards** (`award:*`) are Material Symbols: a medal, a badge, a crown, a star and a shield, painted with the metal gradient and an edge in the metal style.

## Balls and gear

`ball:*` (47 balls and implements) and `gear:*` (33 pieces of equipment) come from their own engines, described in [src/emblems/README.md](../src/emblems/README.md): a ball is drawn in true 3D (a rotation, a projection, panels cut at the limb, shading and a grain that stays where it is while the ball turns), and carries the official size of the rulebook it is from, which `lineup` draws at (a puck beside a basketball looks right). Gear is a flat drawing, drawn here or copied from open icon sets, each credited in its own `<desc>`. A prolate ball (a football, a rugby ball) is drawn to a point at its ends.

![The 47 balls and implements, in colour at three sizes and as line drawings, on a light page.](pieces/balls-light.webp)

![The 33 pieces of gear, in colour at three sizes and as line drawings, on a light page.](pieces/gear-light.webp)

```js
import { emblemInfo, lineup } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(emblemInfo("ball:puck").size.diameterMm); // 76
console.log(lineup(["ball:golf", "ball:tennis", "ball:soccer"], { height: 80 }).includes("<title>")); // true
```

## Light and dark

`theme` says where the ink comes from: `inherit` (the default) is the page's text colour, which is right for markup put in a page; `auto` is dark ink on a light device and pale ink on a dark one, for an image that cannot inherit; `light` and `dark` force one. The metals are the same on both pages. The tests hold every ink to 4.5 to 1 on its page, and the letters of a crest to 4.5 to 1 on the crest's colour.

## Where the art comes from

Sixteen emblems are Material Symbols (Apache 2.0), fetched at a pinned commit by `scripts/fetch-material-symbols.mjs`; some gear is copied from Noto Emoji, Wikimedia Commons (CC0) and game-icons.net (CC BY 3.0), with its licence and credit; everything else is drawn for this package. [NOTICE.md](../NOTICE.md) has every source, licence and change, and [references.md](references.md) what the sizes and the looks were read from.
