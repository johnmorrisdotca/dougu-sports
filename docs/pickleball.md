# Pickleballs

[Back to the README](../README.md) · English

The package draws two pickleballs, `ball:pickleball-outdoor` (40 small holes, yellow) and `ball:pickleball-indoor` (26 large holes, white). Since 0.15.0 their holes are real: each one is cut through the shell, so a pixel seen through a hole is not a darker shade of the ball but whatever is behind it.

<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/pickleball-dark.webp">
<img alt="The yellow outdoor pickleball above and the white indoor one below, each at rest and at three turns, with the dark inside of the ball showing through the near holes and the background showing where a near hole and a far one line up." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/pickleball-light.webp" width="760">
</picture>
</p>

## What a hole looks like

- **Through a hole you see the inside of the ball**: the back of the hollow shell, darker than the outside and lit a little low and to the right, where the light that comes in through the near holes lands.
- **Where a near hole and a far hole line up, the page shows through.** Nothing is painted there, so it is true on any background, light or dark, and the SVG is transparent at that point.
- **A hole near the edge is a thin ellipse** (a hole is a short cylinder along the line to the ball's centre, so it foreshortens like any circle on a sphere), and its wall shows as a crescent on the side away from you, lit or shaded by which way it faces.
- **The cut edge** carries a soft shadow and a thin lit rim, which is the thickness of the shell. The shell is 5 percent of the ball's radius thick.
- **It turns**: `ballFrame`, `emblemFrame` and `bindTurn` draw each angle the same way, so the holes move across the ball and the far holes come into view through the near ones. Every turn has ids of its own, so a row of turns on one page does not borrow one another's holes.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

const still = renderEmblem("ball:pickleball-outdoor", { size: 128 });
// The near holes are cut out of the shell by a mask.
console.log(still.includes("<mask")); // true
console.log(ballFrame("ball:pickleball-indoor", { yaw: 45 }).includes("<mask")); // true
// The line style draws a mark for each hole instead.
console.log(renderEmblem("ball:pickleball-outdoor", { style: "line" }).includes("<mask")); // false
```

## Where the holes are

The centres are an even spread over the sphere (a Fibonacci spiral), 40 for the outdoor ball and 26 for the indoor ball, with a cap of 0.13 and 0.19 radians. The rulebook gives 26 to 40 holes and does not tell the two balls apart; 40 small holes and 26 large ones is how they are sold. The line style is as it was: one mark per hole in the page's ink.

## How it is drawn

In order, back to front: the inside of the ball (a disc with the far holes cut out of it, where each far hole is open only where its inner and its outer opening overlap), the wall of each near hole, then the shell under a mask with the near holes cut out of it, so that its shading, highlight and grain are cut too. The code is `src/emblems/ball/ball.holes.ts`; only the pickleballs take it, so every other ball's bundle is the size it was. A ball asks for it with `hollow` in `dottedBall`; the golf ball's dimples, the field hockey ball's and the squash ball's dots are drawn exactly as before.

## Try it

The demo turns any emblem: [the outdoor ball](https://johnmorrisdotca.github.io/dougu-sports/?id=ball:pickleball-outdoor&turn=1) and [the indoor ball](https://johnmorrisdotca.github.io/dougu-sports/?id=ball:pickleball-indoor&turn=1). Move the pointer over the ball to turn it.

<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/pickleball-turn-dark.webp">
<img alt="Four pickleballs rolling, outdoor and indoor in turn, each a quarter turn behind the one before: the near holes show the dark inside and flash with the background as holes line up." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/pickleball-turn-light.webp" width="760">
</picture>
</p>
