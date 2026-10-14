# Turning

[Back to the README](../README.md). An emblem can be drawn at an angle. A turn is a function of two numbers, so a slider, an animation loop or a server can each make the frames; there is no timer, no canvas and no WebGL in the package.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";

console.log(emblemFrame("award:medal", { yaw: 0, pitch: 0 }) === renderEmblem("award:medal")); // true
console.log(emblemFrame("award:medal", { yaw: 180 }) === renderEmblem("award:medal")); // false
```

`yaw` is degrees about the vertical axis and `pitch` is degrees of tilt toward the eye, both measured from the emblem's resting view; `{ yaw: 0, pitch: 0 }` is the still drawing, and a turn of 360 is the same as none.

## What each kind does

| Kind | A turn | Example |
| --- | --- | --- |
| `flat` | Squeezes the drawing by the cosine of the turn and shows the back past a quarter turn, as a coin turns. A tilt squeezes it from the top. | `award:medal` |
| `ball` | Rolls the ball: each patch is a polygon on a sphere, projected by the turn; a patch round the edge is flattened against it. | `ball:soccer` |
| `icon` | Is not turned; it is drawn as it is. | none yet |
| `lathe` | Keeps the outline of a body of revolution (a cup) and moves its light and handles. | none yet |

## A loop

```js
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

const frames = [];
for (let yaw = 0; yaw < 360; yaw += 30) frames.push(ballFrame("ball:soccer", { yaw, size: 48 }));
console.log(frames.length); // 12
```

Twelve frames are twelve strings; show them one after another with `requestAnimationFrame`, and stop when the page asks for reduced motion (`matchMedia("(prefers-reduced-motion: reduce)")`).
