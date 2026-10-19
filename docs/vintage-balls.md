# Vintage, era-style and patterned balls

[Back to the README](../README.md) · [日本語](vintage-balls.ja.md) · English

Fifty balls that the plain soccer, baseball and volleyball ids do not cover: worn leather balls with the stitching of their time, soccer balls in the style of an era's match balls, the patterns of a shop wall, baseballs of other threads and times, and volleyballs in national colours. Every one is drawn in true 3D, turns with `ballFrame`, and comes in the colour style and the line style. Every drawing is our own: the constructions are facts (a panel count, a polyhedron, a curve), and the graphics are made here to evoke a period or a style, never to copy a design. The sources are in [references.md](references.md#vintage-era-style-and-patterned-balls).

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

console.log(renderEmblem("ball:soccer-1900-laced").includes("<title>Soccer ball, laced</title>")); // true
console.log(renderEmblem("ball:volleyball-colours", { colors: ["#e8112d", "#ffffff", "#0b2d72"] }).includes("#e8112d")); // true
console.log(ballFrame("ball:soccer-2006-propeller", { yaw: 360 }) === ballFrame("ball:soccer-2006-propeller", { yaw: 0 })); // true
```

## Vintage soccer balls (5)

Worn leather in tan, brown and chestnut, with scuffs and a stitch line along every seam. `tint` replaces the main leather colour and `accent` the thread.

| Id | The construction | What it stands for |
| --- | --- | --- |
| `ball:soccer-1870-hand-stitched` | 8 long panels meeting at a button at each end, cross-stitched by hand | The hand-stitched casing of the late 1800s |
| `ball:soccer-1900-laced` | 8 panels, a round cap at each end and a slit shut with a criss-crossed lace | The laced ball of the 1900s |
| `ball:soccer-1930-18-panel` | 18 strips: six panels of three, in two tones, the seams stitched | The strip ball of the 1930s |
| `ball:soccer-1950-12-panel` | 12 pentagons in four tones of chestnut | The 12-panel ball of the 1950s |
| `ball:soccer-1960-32-panel-leather` | 12 pentagons and 20 hexagons in leather | The 32-panel ball of the 1960s |

The four older balls are drawn at the circumference the Laws have given since 1872 (27 to 28 inches); the 1960s ball is the size of today's (see [soccer-balls.md](soccer-balls.md)).

## Soccer balls in the style of an era (11)

Each is on the construction of its time, with graphics of our own that only suggest the period. None uses a real ball's design, mark or name, and the ids name the style and the decade.

| Id | The construction | The look |
| --- | --- | --- |
| `ball:soccer-1970-black-white` | 32 panels (12 pentagons, 20 hexagons) | Slate pentagons with a white ring, white hexagons with a pale dished centre and a dot |
| `ball:soccer-1978-triad` | 32 panels | Three straight navy leaves on each hexagon, their points meeting round each pentagon |
| `ball:soccer-1986-decorated-triad` | 32 panels | A five-petal rosette on each hexagon in warm clay, with a row of white beads along each petal, and gold-ringed dark pentagons |
| `ball:soccer-1998-coloured-triad` | 32 panels | Curved leaves in green, amber and plum on white, with deep green pentagons |
| `ball:soccer-2002-triangle-sweep` | 32 panels | Three slate-blue and silver kites on each hexagon, over charcoal pentagons |
| `ball:soccer-2006-propeller` | 14 panels (6 propellers, 8 triangles) | A coral line inside each propeller, a coral mark on each dark triangle |
| `ball:soccer-2010-grooved` | 8 panels (an octahedron with its edges bent into S curves) | White and slate-blue panels, plain seams, and three contour lines across each panel |
| `ball:soccer-2014-ribbon` | 6 twisted panels | White, crossed by straight bands in blue, amber and magenta |
| `ball:soccer-2018-pixel` | 6 panels | Diamond pixels in graphite, teal and gold, thick on one side and thinning out |
| `ball:soccer-2022-speed-shell` | 20 triangles (an icosahedron) | Blue and sand panels, each with a ring of dots at its centre |
| `ball:soccer-training-high-vis` | 32 panels | A modern high-visibility training ball: fluorescent yellow-green, hot pink pentagons, dark speed marks |

The 14-panel layout, the 6-gore layout and the 32 panels are the same constructions as `ball:soccer-14`, `ball:soccer-6` and `ball:soccer`; the 8-panel octahedron and the 20-panel icosahedron are new tilings (`octahedron8` and `icosahedron` in `src/emblems/ball/ball.tilings.ts`). A graphic is a flat shape laid on the sphere at a point (`frameAt` in `ball.decal.ts`), so it turns with the ball and foreshortens as a mark printed on it does.

## Patterns of a shop wall (18)

Six generic patterns, each in three colourways, all on the size of an 11-a-side ball. `tint` replaces the main colour of the pattern and `accent` the dark one.

| Pattern | Ids | The drawing |
| --- | --- | --- |
| Stars | `ball:soccer-stars-blue`, `-red`, `-night` | A five-pointed star on every panel of the 32 |
| Hexagon outlines | `ball:soccer-hexagons-cyan`, `-magenta`, `-lime` | Two outlines, one inside the other, in each hexagon, and solid pentagons |
| Flames | `ball:soccer-flames-fire`, `-ice`, `-toxic` | Five tongues of flame from each dark pentagon, an outer and a lighter inner one |
| Chevrons | `ball:soccer-chevrons-red`, `-green`, `-blue` | Eight gores from pole to pole, every other one coloured, crossed by three V-shaped bands |
| Two-tone swirl | `ball:soccer-swirl-blue`, `-red`, `-teal` | Four gores that twist round the ball, in two colours |
| Metallic glossy | `ball:soccer-metallic-gold`, `-silver`, `-cobalt` | The 32 panels in a polished finish that mirrors the sky and the ground |

## Baseballs (5, and the red one)

The figure-8 seam is the same curve as `ball:baseball`'s (`x=(1-b)cos t + b cos 3t` and so on). The stitching in red alone is `ball:baseball` itself.

| Id | The drawing |
| --- | --- |
| `ball:baseball-lemon-peel` | The early "lemon-peel" ball of the 1850s and 1860s: four lines of stitching that meet at two points, in aged leather with dark thread |
| `ball:baseball-red-blue` | The figure-8 seam stitched in alternate red and blue |
| `ball:baseball-black-red` | The figure-8 seam stitched in alternate black and red |
| `ball:baseball-vintage-leather` | The figure-8 ball in aged, scuffed leather with faded red thread |
| `ball:softball-11-optic` | The 11 in softball in optic yellow with red stitching: 27.9 cm round, 166.5 to 173.6 g (80 stitches drawn; the rule asks for at least 80 on a flat-seam ball) |

The red and blue and the black and red stitchings are a record of what the two major leagues' laces looked like to a player of the 1930s, not a rule; the size of the lemon-peel ball is today's, because no rule fixed the ball then.

## Volleyballs in national colours (11)

The 18-panel indoor ball (six groups of three strips) with its panels in three colours taken from a flag. No flag, crest or mark is drawn: it is only colours, so the flags plug-in shape (`flags(code, { shape, size, theme })`) is not needed. The ball is the indoor ball of the FIVB's rule (`ball:volleyball`'s size).

| Id | The three colours | How they sit on the ball |
| --- | --- | --- |
| `ball:volleyball-brazil` | green `#009c3b`, yellow `#ffdf00`, blue `#002776` | the three colours in turn, as the middle and outer strips of the faces |
| `ball:volleyball-japan` | white `#f6f4ee`, crimson `#bc002d`, a darker red `#7d0020` | white with one broad crimson band round one side, across the front and over the top; a darker strip underneath |
| `ball:volleyball-canada` | red `#d52b1e`, white, a darker red `#9b1c14` | red, with a white stripe down the middle of the front and the back like the flag's pale; the darker red on top and bottom |
| `ball:volleyball-usa` | red `#b22234`, white, navy `#3c3b6e` | a navy field on two opposite sides, red and white stripes on the other four |
| `ball:volleyball-italy` | green `#009246`, white, red `#ce2b37` | green on one side, red on the other, white above and below, and green-white-red stripes across the front and the back |
| `ball:volleyball-poland` | white, red `#dc143c`, a darker red `#9b1030` | standing on a corner: white round the top, red round the bottom, as the flag is cut |
| `ball:volleyball-france` | blue `#0055a4`, white, red `#ef4135` | standing on a corner: three big fields, blue, white and red, each on two opposite faces |
| `ball:volleyball-serbia` | red `#c6363c`, blue `#0c4076`, white | the flag's bands from the top down: a red top, blue across the middle, a white bottom |
| `ball:volleyball-netherlands` | red `#ae1c28`, white, blue `#21468b` | standing on a corner: thin red, white and blue stripes on every face |
| `ball:volleyball-germany` | black `#1b1b1b`, red `#dd0000`, gold `#ffce00` | standing on a corner: six big fields, each colour on two faces |
| `ball:volleyball-colours` | yellow, blue and white until you give it three colours of your own | the classic three-colour ball |

Each country has a layout of its own, not only its own colours, so that two balls with alike colours (Japan and Poland are both white and red, the USA and the Netherlands both red, white and blue) still read as two balls at 16 pixels. `test/vintage.test.ts` holds the ten apart: every pair differs by a mean perceptual distance (CIE L\*a\*b\*) of 35 or more over the 18 panels, with at least 7 panels clearly different, and no two share a layout. A ball standing on a corner turns about that corner.

A flag with two colours (Japan, Canada, Poland) takes a darker shade of one as its third, so that the three-colour layout still reads. The `colors` option takes any three colours for any of the eleven:

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";

// A club's colours on the same ball; one or two colours are repeated to make three, and anything that is not a colour is dropped.
const svg = renderEmblem("ball:volleyball-colours", { colors: ["#0b6e4f", "#f4d03f", "#ffffff"] });
console.log(svg.includes("#0b6e4f")); // true
console.log(renderEmblem("ball:volleyball-brazil", { colors: ["#ff0000"] }).includes("#ff0000")); // true
```

`tint` replaces the first colour and `accent` the second, where `colors` is not given.
