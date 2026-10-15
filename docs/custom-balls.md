# Custom balls

[Back to the README](../README.md) · [日本語](custom-balls.ja.md) · English

A baseball, a softball and the classic soccer balls (`ball:baseball`, `ball:softball`, `ball:soccer` and its orange, yellow and coloured versions) take options that paint and print them: a colour or two, a stamp of text, a cursive word where a maker's mark sits, a small mark under it, and a logo of your own wrapped onto the side. Everything is drawn on the sphere, not laid over it, so it curves with the ball, is foreshortened toward the edge, goes round the limb and out of sight, and comes back as the ball turns (`emblemFrame`, `ballFrame` and `bindTurn` take the same options). The output stays small and a pure function of the options.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("ball:baseball", { size: 320, paint: "#c4262e", stamp: true, script: true });
console.log(svg.startsWith("<svg")); // true
console.log(svg.length < 24000); // true
```

Everything is our own drawing: the cursive script is a set of waypoints drawn for this package (no font file, and it is not anyone's lettering), the stamp is our block lettering with our own stars, and the mark is a letter in a circle. The package carries no logo, wordmark or signature of a league, a team, a maker or anyone else. A logo or a mark is the one you pass, at render time, and it is drawn from the SVG you give.

## The options

| Option | What it takes |
| --- | --- |
| `paint` | A colour (`"#c4262e"`) or `{ body, second, split, angle, stitch }`: the colours of the ball. See [Colours](#colours). |
| `decal` | An SVG string, a `data:` image URI, or `{ svg, href, size, turn }`: a logo printed on the ball. See [A logo](#a-logo). |
| `stamp` | `true`, a line, a list of lines, or `{ lines, stars, sign, colour }`: stamped text. See [The stamp](#the-stamp). |
| `script` | `true`, a word, or `{ text, colour }`: our cursive script. See [The script and the mark](#the-script-and-the-mark). |
| `mark` | `true`, a letter, an SVG string, or `{ letter, svg, href, colour }`: the small mark under the script. |
| `spots` | `{ decal: { lon, lat }, label: { lon, lat } }`: where the logo and the lettering go, in degrees from the middle of the default view. |

A printed ball is drawn in a view that shows its label (the plain ball's own view is for the plain ball). In the line style nothing is printed. A ball that does not take these options ignores them. The balls' own modules (`ball/ball.baseball`) carry no printing code, so a ball bundled alone stays small: `renderEmblem`, the main entry and the registry take the printed ones, and for a single ball use `printed(BALL_BASEBALL)`.

## Colours

`paint` is a colour for a solid ball, or two for a two-tone one. The stitches change to a thread that shows against the body (red, cream, navy or near-black, whichever reads), and the seam stays.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

// A solid blue softball.
console.log(renderEmblem("ball:softball", { paint: "#1f4e8c" }).includes('fill="#1f4e8c"')); // true

// Half white, half red along the seam, as a commemorative ball is: one leather piece is white and the other red.
const two = renderEmblem("ball:baseball", { paint: { body: "#f4f0e6", second: "#c4262e" } });
console.log(two.includes('fill="#c4262e" fill-rule="evenodd"')); // true

// Or cut in halves, turned 30 degrees.
console.log(renderEmblem("ball:baseball", { paint: { body: "#f4f0e6", second: "#1f4e8c", split: "half", angle: 30 } }).length > 4000); // true
```

On a two-tone ball split along the seam each stitch's two legs lie on their own colour and take the thread that shows on it. `stitch` sets the thread yourself. On a soccer ball `body` is the hexagons and `second` the pentagons. Any other ball takes `body` as a tint.

## The stamp

`stamp: true` is `UNOFFICIAL` between two small stars over the ball's own words (`DIGITAL BASEBALL`, `DIGITAL SOFTBALL`, `DIGITAL SOCCER`), in condensed bold block lettering, in navy (or white or near-black where navy would not show on the ball). Give your own lines (up to three, 24 letters each; the first has the stars), turn the stars off, add a made-up signature line under with an optional caption, or choose the ink.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const stamp = renderEmblem("ball:baseball", { stamp: { lines: ["CLUB", "ANNIVERSARY BALL"], sign: { seed: 7, caption: "SECRETARY" }, colour: "#0b4f3b" } });
console.log(stamp.includes("#0b4f3b")); // true
```

The signature is a squiggle drawn from a seed: the same seed always draws the same line, and no seed is anyone's real hand.

## The script and the mark

`script: true` is the ball's own word (`Baseball`, `Softball`, `Soccer`) in an original cursive script, where a maker's mark would sit, and brings a small circled letter under it (the word's first letter). Give another word (a to z and a space; a capital without a drawing of its own is a tall small letter), a colour, another letter, or `mark: false` to leave the circle out.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const ball = renderEmblem("ball:baseball", { script: "Hardball", mark: { letter: "H", colour: "#8a1c1c" } });
console.log(ball.includes("#8a1c1c")); // true
```

### Your own mark

`mark` also takes an SVG string, drawn in its own colours in the circle's place. It is made safe first, in the same way as a logo (below). This is the slot for a mark of your own that this package must not carry:

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const mine = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><path d="M2 30 C 30 -10, 70 -10, 98 30 C 70 8, 30 8, 2 30Z" fill="#7a3fd0"/></svg>`;
const svg = renderEmblem("ball:baseball", { size: 320, script: true, mark: { svg: mine } });
console.log(svg.includes("#7a3fd0")); // true
```

## A logo

`decal` prints a logo on the side of the ball. An SVG is wrapped exactly: its outlines are flattened, every point is put on the sphere, fills are cut at the limb and strokes thin as they turn away, so it is foreshortened as a mark printed on a ball is. The logo has the middle of the label area by default, and the stamp, the script and the mark go on the far side (turn the ball to see them); `spots` moves either.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1f4e8c"/><path d="M24 64 L50 38 L76 64" fill="none" stroke="#f2b705" stroke-width="10" stroke-linecap="round"/></svg>`;
console.log(renderEmblem("ball:baseball", { decal: logo }).includes("#1f4e8c")); // true
// Put on the far side it is out of sight until the ball turns.
console.log(renderEmblem("ball:baseball", { decal: { svg: logo, size: 50 }, spots: { decal: { lon: 180 } } }).includes("#1f4e8c")); // false
console.log(ballFrame("ball:baseball", { decal: logo, yaw: 30 }) === ballFrame("ball:baseball", { decal: logo, yaw: 31 })); // false
```

`size` is how wide the logo is in degrees of the sphere (about 55 by default) and `turn` turns it on the ball. The logo may also be a `data:` URI: an SVG is read as above, and a PNG, JPEG, GIF or WebP (up to 400 kB, `base64` only) is laid on in small triangles, each carried by an affine map of its own: close, not exact, and the picture is written once. That is what a page gets from `FileReader.readAsDataURL` when a reader picks a file, so a logo upload needs no server (the demo's "Custom ball" section does it).

### What is made safe

Everything from outside is made safe before it is drawn, with an allow-list, never a deny-list. An SVG keeps its shapes, groups, gradients (as the mean colour of the stops) and their plain paint, transforms, fill rules and opacities; script, style, text, images, `use`, links, event handlers, `foreignObject`, filters, clip paths and anything with a colon, an entity or a quote in a value are dropped with what they hold. An address on the network (`https:`, `//`) is refused, and so is a `data:` URI that is not an image of those kinds. A colour is `#rgb`, `#rrggbb` or `rgb()` and anything else is ignored; text is drawn from our own glyphs, so it is never written into the markup. Sizes and counts are capped.

## Turning

The print is part of the ball, so a turned frame carries it:

```js
import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";

const frames = [-40, 0, 40].map((yaw) => emblemFrame("ball:soccer", { stamp: true, script: true, yaw }));
console.log(new Set(frames).size); // 3
```

```js no-run
import { bindTurn } from "@johnmorrisdotca/dougu-sports";

bindTurn(document.getElementById("ball"), "ball:baseball", { size: 320, paint: "#c4262e", stamp: true, script: true });
```

## A ball taken from its own module

```js
import { printed } from "@johnmorrisdotca/dougu-sports";
import { BALL_BASEBALL } from "@johnmorrisdotca/dougu-sports/ball/ball.baseball";

// The plain ball has no printer, so it ignores the options.
console.log(BALL_BASEBALL.svg({ stamp: true }) === BALL_BASEBALL.svg()); // true
console.log(printed(BALL_BASEBALL).svg({ stamp: true }) === BALL_BASEBALL.svg()); // false
```

`printed()` takes the ball with the printing code (about 19 kB gzipped for a baseball, mostly the script, the lettering and the warp); the plain module stays under 9 kB.
