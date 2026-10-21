# The slotted practice baseball

[Back to the README](../README.md) · English

`ball:plastic-baseball-slotted` ("Plastic baseball, slotted") is the hollow white plastic practice baseball with oblong slots on one half and the other half solid. It is drawn with the same real holes as the pickleballs ([pickleball.md](pickleball.md)): each near slot is cut out of the shell and shows the dark inside of the ball, and where a near slot and a far one line up, the page shows through. The package names no maker for it: it is a generic ball, and no brand is in its id, its names, its documents or its pictures.

<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/slotted-dark.webp">
<img alt="The white slotted plastic ball four times: at rest with its ring of eight oblong slots, from the side with the background showing through two slots where a near slot lines up with a far one, from its pole with all eight slots round the middle, and from the solid half with no slot at all." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/slotted-light.webp" width="760">
</picture>
</p>

## What it is

| | |
| --- | --- |
| Id | `ball:plastic-baseball-slotted` |
| Names | "Plastic baseball, slotted" (English); the Japanese name is in `emblemInfo` |
| Size | the size of a regulation baseball: 73.8 mm across (Official Baseball Rules, Rule 3.01, the middle of the circumference range) |
| Holes | eight oblong slots, each 19 mm long (0.75 inch), on one half only, in a ring round the pole of that half, each running along the line to the pole |
| Shell | hollow plastic, a wall of no more than 3.2 mm (1/8 inch); the drawing uses 5 percent of the radius |
| Mass | not stated: no source read gives one, so the package gives none |

The figures are from the English Wikipedia article on the ball, read on 2026-10-21 (the article is titled with the maker's registered trademark, which this package does not use). It does not give the width of a slot, so a slot is drawn a third as wide as it is long, with half circles at its ends, and a ring of eight slots sits at 36 degrees from the pole. The article says the ball is about the size of a regulation baseball; a pickleball guide's chart of the same ball says 2.86 to 2.94 inches across, the range the baseball rule gives.

## Seen from every side

- From its pole you see all eight slots, a ring round a solid middle.
- Turned a little, the slots on the near side foreshorten to thin ellipses and the wall of each slot shows as a crescent, lit or shaded by which way it faces.
- Seen from the side, with the pole across your line of sight, a slot on the near side lies exactly over one on the far side, and the page shows through both. This is real transparency: the pixel is the page's own on any background.
- Seen from the solid half, nothing is cut out, and the ball is a plain white sphere.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

// A ball with slots has them cut out of its shell by a mask.
console.log(renderEmblem("ball:plastic-baseball-slotted", { size: 128 }).includes("<mask")); // true
// Seen from the solid half, nothing is cut.
console.log(ballFrame("ball:plastic-baseball-slotted", { yaw: 202, pitch: -22 }).includes("<g mask=")); // false
```

## Try it

[The slotted ball in the demo](https://johnmorrisdotca.github.io/dougu-sports/?id=ball:plastic-baseball-slotted&turn=1): move the pointer over it to turn it.

<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/slotted-turn-dark.webp">
<img alt="Three slotted plastic balls: the one on the left stands still showing its ring of slots, the one on the right stands still seen from the side, and only the one in the centre rolls, so that the ring of slots comes round, the page shows through as two slots line up, and the solid half goes by." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/slotted-turn-light.webp" width="760">
</picture>
</p>
