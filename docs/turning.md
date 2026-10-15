# Turning

[Back to the README](../README.md). An emblem can be drawn at an angle. A turn is a function of two numbers, so a slider, an animation loop or a server can each make the frames; there is no timer, no canvas and no WebGL in the package.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";

console.log(emblemFrame("medal:gold", { yaw: 0, pitch: 0 }) === renderEmblem("medal:gold")); // true
console.log(emblemFrame("medal:gold", { yaw: 180 }) === renderEmblem("medal:gold")); // false
```

`yaw` is degrees about the vertical axis and `pitch` is degrees of tilt toward the eye, both measured from the emblem's resting view; `{ yaw: 0, pitch: 0 }` is the still drawing (in the box of the turn: see below), and a turn of 360 is the same as none.

## What each kind does

| Kind | A turn | Example |
| --- | --- | --- |
| `lathe` | Keeps the silhouette of a body of revolution and moves what is on it: the bright band of its metal slides, a handle goes round to the far side and is drawn behind the cup, the grooves of a column wind, the seams of a ball on a stand move, the net and the pennants go round; a stand with flat faces shows the faces that look toward the eye. A tilt shows more or less of the top of a dish. | `trophy:tennis-cup`, `trophy:baseball`, `trophy:football` |
| `flat` | Squeezes the drawing by the cosine of the turn and shows the back past a quarter turn, as a coin turns, with the rim showing thick as it goes edge on. A tilt squeezes it from the top. Its engraving goes with its face: hidden on the back, or another engraving there. | `medal:gold`, `crest:shield`, `trophy:ring`, `pennant:championship` |
| `ball` | Rolls the ball in true 3D: panels, seams and marks are on the sphere and turn with it; `roll` turns it about the line of sight. A ball that is turning has no grain, so its resting turn is its still drawing without the grain. | `ball:soccer` |
| `icon`, `gear` | Flips like a coin, as a cut-out does: the face is squeezed by the cosine, past a quarter turn it shows its front mirrored and a little darker, and the rim (the thickness of the sheet) is a dark edge on the side that turns away, widest edge on. In the line style the rim is the page's ink. | `sport:nhl`, `trophy:cup`, `gear:hurley` |

```js
import { emblemFrame, renderEmblem } from "@johnmorrisdotca/dougu-sports";

console.log(emblemFrame("trophy:tennis-cup", { yaw: 0 }) === renderEmblem("trophy:tennis-cup", { turnBox: true })); // true
console.log(emblemFrame("trophy:tennis-cup", { yaw: 120 }).includes("<path")); // true
console.log(emblemFrame("sport:nhl", { yaw: 70 }) === renderEmblem("sport:nhl")); // false
console.log(emblemFrame("gear:hurley", { yaw: 120 }).includes("scale(-0.5 1)")); // true
```

## The box of a turn

A drawing is made in a square view box, and a turn can reach past the box of the still: a cup tilted toward the eye by 60 degrees shows its rim and its foot above and below where they stand at rest, a handle swings out, and the flat art of a skate or a pair of goggles has a stroke on the edge. So every emblem has a box for its still drawing (`renderEmblem`) and, for a body of revolution, a larger one that holds every turn of it. **A frame is always drawn in the box of the turn**, the same box at every yaw, pitch and roll, so nothing is cut off and the drawing does not change size or jump as it turns. The box is square and the element is `size` by `size` either way, so the cup is drawn a little smaller while it can turn (up to 30 percent for the tallest) and a page does not reflow when it swaps one emblem for another.

```js
import { emblemFrame, renderEmblem } from "@johnmorrisdotca/dougu-sports";

const box = (svg) => /viewBox="([^"]*)"/.exec(svg)[1];
console.log(box(emblemFrame("trophy:hockey-cup", { yaw: 0 })) === box(emblemFrame("trophy:hockey-cup", { yaw: 90, pitch: 60 }))); // true
console.log(box(renderEmblem("trophy:hockey-cup")) === box(emblemFrame("trophy:hockey-cup", { yaw: 0 }))); // false
console.log(box(renderEmblem("ball:soccer")) === box(emblemFrame("ball:soccer", { yaw: 90 }))); // true
```

`turnBox: true` on `renderEmblem` draws the still in the box of the turn (what `bindTurn` does for the resting view), and `turnBox: false` on a frame draws it in the still's own box. A ball, a medal, a crest and a sport's icon need no more room than their still has, so for them the two boxes are one. `test/turnbox.test.ts` measures every emblem's ink against its box; `node scripts/turn-boxes.ts` prints the box a new emblem needs, to put in its model as `box` and `turnBox`.

## A loop

```js
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

const frames = [];
for (let yaw = 0; yaw < 360; yaw += 30) frames.push(ballFrame("ball:soccer", { yaw, size: 48 }));
console.log(frames.length); // 12
```

Every id of the package turns, at every angle, in every style, and gives finite, well-formed SVG (`test/turn.test.ts` holds it over all of them). Twelve frames are twelve strings; show them one after another with `requestAnimationFrame`, and stop when the page asks for reduced motion (`matchMedia("(prefers-reduced-motion: reduce)")`).

## Let the reader turn it: `bindTurn`

`bindTurn(element, ref, options?)` draws an emblem into an element with the emblem's own `frame` and turns it as the reader drags it, presses the arrow keys or starts an auto-turn. It is in the `./turn` entry (and the main one) and in a module of its own, so importing an emblem never pulls it in.

### Light: pass the emblem

```js no-run
import { bindTurn } from "@johnmorrisdotca/dougu-sports/turn";
import { TROPHY_HOCKEY_CUP } from "@johnmorrisdotca/dougu-sports/trophy/hockey-cup";
import { TROPHY_TENNIS_CUP } from "@johnmorrisdotca/dougu-sports/trophy/tennis-cup";

const turner = bindTurn(document.getElementById("cup"), TROPHY_HOCKEY_CUP, {
  size: 160,
  onTurn: ({ yaw, pitch, roll }) => console.log(yaw, pitch, roll),
});
document.getElementById("spin").onclick = () => turner.togglePlay();
// later: another emblem at the same angles, and then let go of the element
turner.update(TROPHY_TENNIS_CUP, { size: 160 });
turner.destroy();
```

`ref` is an emblem object (the constant a module exports: `TROPHY_HOCKEY_CUP`, `MEDAL_GOLD`, `BALL_SOCCER`) or an id. With the object, `bindTurn` imports no drawing and not the registry, so a page carries the turning (about 2.5 kB gzipped) and the one emblem and its renderer (a cup is 6.9 kB of it), about 9.4 kB for a turnable cup, where the registry is about 80 kB. `test/size.test.ts` holds the bundle to 10 kB. The element is drawn, and `ready` is resolved, before `bindTurn` returns. The emblems stay tree-shakeable: nothing but what you import is in the bundle. What an id carries that an object does not is read by the registry: a style written after the id (`"trophy:cup/line"`; with an object pass `style: "line"`) and the print of a puck whose `face` names an emblem by id (with an object give the face an `image`).

### By id

```js no-run
import { bindTurn } from "@johnmorrisdotca/dougu-sports/turn";

const turner = bindTurn(document.getElementById("cup"), "trophy:tennis-cup", { size: 160 });
await turner.ready; // the registry has loaded and the emblem is drawn
```

An id is read from the registry, and the registry is the whole package (about 80 kB gzipped), so `bindTurn` of `./turn` loads it only when it is given an id: a dynamic import, which a bundler makes a chunk of its own. Until it has loaded the element is left as it was, `turnable` is `false` and `ready` is pending, though `angles` and `setAngles` already work; when it has, the emblem is drawn at those angles. The second id after the first is bound at once, since the registry is then loaded. An id that names no emblem makes `ready` reject. `bindTurn` of the main entry (`@johnmorrisdotca/dougu-sports`) has the registry in hand and draws an id at once, with no `ready` to wait for, and takes an emblem object too.

### What the reader can do

| Input | Does |
| --- | --- |
| Drag (the primary button, a finger or a pen) | Left and right turn the yaw, up and down tilt the pitch; Shift on a ball turns the roll. The element is `touch-action: none` and `user-select: none`, with a grab cursor, and holds the pointer while it is down. |
| Left and Right | Turn the yaw by `keyStep` degrees (5), or three times as much with Shift (15). |
| Up and Down | Tilt the pitch the same way, within `pitchRange`. |
| Home or 0 | Back to the resting view. |
| Space | Start or stop the auto-turn. |

The element gets `tabindex="0"` (unless the page set one), a role (`group`, unless it has one), an `aria-roledescription` and an `aria-description` that names the arrow keys and Space, in English or in Japanese (`locale`). `preventDefault()` is called only for the keys it handles. Yaw wraps into -180 (excluded) to 180, as the demo's slider does; pitch is clamped. Each change is drawn once on the next animation frame, however many pointer moves there were. An emblem that cannot turn (a pictogram, today) is drawn as it is and nothing is listened to; turnability is read from the registry's own frames, so an emblem that gains a turn turns here without a change to `bindTurn`.

### The auto-turn

Nothing moves by itself. `autoPlay` is off by default, `play()`, `pause()` and `togglePlay()` start and stop it, and `speed` is degrees of yaw a second (36, negative to turn the other way, at most 720 either way).

- It runs on `requestAnimationFrame` with the elapsed time, clamped to 0.1 s so that a slow frame is not a jump, stops asking for frames while the page is hidden, and calls `onTurn` on every frame so that a slider follows.
- With `pauseOnInteract` (on by default) a drag holds it while the pointer is down and it goes on from the new angle with no jump; an arrow key, Home or `setAngles` (a slider) pauses it. With it off only `pause()` stops it.
- Under `prefers-reduced-motion: reduce`, `autoPlay: true` starts paused: only a reader's own action, such as pressing a Play button, starts it, unless the caller passes `autoPlay: "force"`.
- `onPlayChange(playing)` is told of each start and stop, whatever caused it. `play()` and `togglePlay()` on an emblem that cannot turn do nothing and give `false`.

### Options and controller

| Option | Default |
| --- | --- |
| The options of `emblemFrame` (`style`, `size`, `tint`, `accent`, `theme`, `locale`, `title`) and the first `yaw`, `pitch` and `roll` | resting view |
| `sensitivity`: degrees of turn for each pixel | `1.5` |
| `pitchRange`: `[least, most]` degrees | `[-60, 60]` |
| `keyStep`: degrees for an arrow key (three times as much with Shift) | `5` |
| `onTurn(angles)`: after each turn by the pointer, a key or the clock; not for `setAngles` or `update` | none |
| `autoPlay`: `false`, `true` or `"force"` (only read by `bindTurn`) | `false` |
| `speed`, `pauseOnInteract`, `onPlayChange(playing)` | `36`, `true`, none |

| Controller | |
| --- | --- |
| `angles` | A copy of `{ yaw, pitch, roll }` |
| `playing`, `turnable` | Whether the auto-turn runs, and whether the emblem can turn (`false` until an id has loaded) |
| `ready` | A promise: resolved when the emblem is drawn and bound (at once for an emblem object), rejected for an id that names nothing |
| `setAngles(partial)` | Sets some angles (wrapped or clamped), draws at once, pauses the auto-turn |
| `update(ref, options?)` | Draws another emblem (an object or an id) or the same one with other options, and keeps the angles (unless the options carry some) |
| `play()`, `pause()`, `togglePlay()` | The auto-turn; `togglePlay()` gives the new state |
| `destroy()` | Removes the listeners and every attribute and style `bindTurn` added, puts back what the page had, cancels the frame; the last drawing stays |

`bindTurn` needs only a few members of its element (`innerHTML`, `style`, `addEventListener`, `removeEventListener`, the attribute methods, and optionally the pointer capture ones), so any object that has them will do; that is how `test/turn-control.test.ts` runs it with no DOM and no dependency:

```js
import { bindTurn } from "@johnmorrisdotca/dougu-sports/turn";
import { TROPHY_TENNIS_CUP } from "@johnmorrisdotca/dougu-sports/trophy/tennis-cup";

const listeners = {};
const element = {
  innerHTML: "",
  style: {},
  attributes: {},
  addEventListener(type, listener) { listeners[type] = listener; },
  removeEventListener() {},
  getAttribute(name) { return this.attributes[name] ?? null; },
  setAttribute(name, value) { this.attributes[name] = value; },
  removeAttribute(name) { delete this.attributes[name]; },
};
const turner = bindTurn(element, TROPHY_TENNIS_CUP, { size: 96 });
listeners.keydown({ key: "ArrowRight", preventDefault() {} });
listeners.keydown({ key: "ArrowRight", shiftKey: true, preventDefault() {} });
console.log(turner.angles.yaw); // 20
console.log(element.innerHTML.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')); // true
console.log(turner.togglePlay()); // true
turner.destroy();
console.log(Object.keys(element.attributes).length); // 0
```
