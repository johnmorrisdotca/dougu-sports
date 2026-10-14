# Turning

[Back to the README](../README.md). An emblem can be drawn at an angle. A turn is a function of two numbers, so a slider, an animation loop or a server can each make the frames; there is no timer, no canvas and no WebGL in the package.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";

console.log(emblemFrame("medal:gold", { yaw: 0, pitch: 0 }) === renderEmblem("medal:gold")); // true
console.log(emblemFrame("medal:gold", { yaw: 180 }) === renderEmblem("medal:gold")); // false
```

`yaw` is degrees about the vertical axis and `pitch` is degrees of tilt toward the eye, both measured from the emblem's resting view; `{ yaw: 0, pitch: 0 }` is the still drawing, and a turn of 360 is the same as none.

## What each kind does

| Kind | A turn | Example |
| --- | --- | --- |
| `lathe` | Keeps the silhouette of a body of revolution and moves what is on it: the bright band of its metal slides, a handle goes round to the far side and is drawn behind the cup, the grooves of a column wind, the seams of a ball on a stand move, the net and the pennants go round; a stand with flat faces shows the faces that look toward the eye. A tilt shows more or less of the top of a dish. | `trophy:tennis-cup`, `trophy:baseball`, `trophy:football` |
| `flat` | Squeezes the drawing by the cosine of the turn and shows the back past a quarter turn, as a coin turns, with the rim showing thick as it goes edge on. A tilt squeezes it from the top. Its engraving goes with its face: hidden on the back, or another engraving there. | `medal:gold`, `crest:shield`, `trophy:ring`, `pennant:championship` |
| `ball` | Rolls the ball in true 3D: panels, seams and marks are on the sphere and turn with it; `roll` turns it about the line of sight. A ball that is turning has no grain, so its resting turn is its still drawing without the grain. | `ball:soccer` |
| `icon`, `gear` | Flips like a coin, as a cut-out does: the face is squeezed by the cosine, past a quarter turn it shows its front mirrored and a little darker, and the rim (the thickness of the sheet) is a dark edge on the side that turns away, widest edge on. In the line style the rim is the page's ink. | `sport:nhl`, `trophy:cup`, `gear:hurley` |

```js
import { emblemFrame, renderEmblem } from "@johnmorrisdotca/dougu-sports";

console.log(emblemFrame("trophy:tennis-cup", { yaw: 0 }) === renderEmblem("trophy:tennis-cup")); // true
console.log(emblemFrame("trophy:tennis-cup", { yaw: 120 }).includes("<path")); // true
console.log(emblemFrame("sport:nhl", { yaw: 70 }) === renderEmblem("sport:nhl")); // false
console.log(emblemFrame("gear:hurley", { yaw: 120 }).includes("scale(-0.5 1)")); // true
```

## A loop

```js
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

const frames = [];
for (let yaw = 0; yaw < 360; yaw += 30) frames.push(ballFrame("ball:soccer", { yaw, size: 48 }));
console.log(frames.length); // 12
```

Every id of the package turns, at every angle, in every style, and gives finite, well-formed SVG (`test/turn.test.ts` holds it over all of them). Twelve frames are twelve strings; show them one after another with `requestAnimationFrame`, and stop when the page asks for reduced motion (`matchMedia("(prefers-reduced-motion: reduce)")`).
