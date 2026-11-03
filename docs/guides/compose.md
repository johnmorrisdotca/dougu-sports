---
title: Podiums, sprites and data addresses
section: how-to
order: 11
description: Put one emblem in an image or a style sheet, draw it many times for a few nodes, set emblems side by side at true size, and build a podium or an award case.
---

An emblem is a string of SVG. These helpers take that string further: as an `<img>` source, a CSS background or a canvas image; as a sheet of symbols so that sixty-four soccer balls cost a few nodes each; side by side at the rulebook's sizes; and arranged as a podium or an award case. All of them are pure, and each returns a string.

## An emblem as an image

`currentColor` does not cross an `<img>` boundary, so `emblemDataUri` makes the ink a colour for you: `color` for the line, otherwise the theme's (`"dark"` is pale ink; `"light"` and the default are dark). Every character that could end an attribute or a CSS `url()` is percent-encoded, so the string goes in `img.src`, in `background-image: url("…")` and in `new Image()` for a canvas.

```js
import { emblemDataUri } from "@johnmorrisdotca/dougu-sports/emblems";

const src = emblemDataUri("sport:nhl", { size: 48, color: "#c8102e" });
console.log(src.startsWith("data:image/svg+xml;utf8,%3Csvg")); // true
console.log(decodeURIComponent(src).includes("currentColor")); // false
```

## The same emblem many times

Drawn inline, sixty-four soccer balls are 2,304 nodes and 530 kB. From a sheet they are 228 nodes and 15 kB: `emblemSprite` draws each emblem once as a `<symbol>`, and `sprite.use` is a few nodes and a few dozen bytes. Put `sprite.sheet` in the page once.

```js
import { emblemSprite } from "@johnmorrisdotca/dougu-sports/emblems";

const sprite = emblemSprite(["ball:soccer", "medal:gold"]);
const cell = sprite.use("ball:soccer", { size: 24, title: false });
console.log(cell.startsWith('<svg width="24" height="24" aria-hidden="true"><use href="#')); // true
console.log(sprite.sheet.includes("<symbol")); // true
```

Pass `title: false` when the emblem sits beside text that says the same; the drawing is then `aria-hidden="true"`. Without it, each use keeps its accessible name.

## At true relative sizes

Each ball carries the official size of the rulebook it is from (`emblemInfo(id).size`, with the rule), and `lineup` draws several side by side at the rules' relative sizes: a golf ball is 42.67 mm and a soccer ball about 220.

```js
import { emblemInfo, lineup } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(emblemInfo("ball:golf").size.diameterMm); // 42.67
const svg = lineup(["ball:golf", "ball:tennis", "ball:soccer", "ball:puck"], { height: 80 });
console.log(svg.includes("<title>Balls at their true relative sizes")); // true
```

## What a sport is played with

`sportEquipment(sport)` says what a sport is played and won with: its ball, its gear, the trophy its champion lifts and, where the sport is in the Games, the medal. Every id is one `renderEmblem` draws, so a page that lists a sport's kit can draw each piece.

```js
import { renderEmblem, sportEquipment } from "@johnmorrisdotca/dougu-sports/emblems";

const nhl = sportEquipment("nhl");
console.log(nhl.ball, nhl.trophy); // ball:puck trophy:hockey-cup
console.log(nhl.gear.length > 0, renderEmblem(nhl.trophy).startsWith("<svg")); // true true
```

## A podium and an award case

`podium` sets first, second and third on tiered steps. `awardCase` puts a team's trophies on a shelf with a count for each. Both are one SVG string in the page's text colour, with a title and a description. A podium takes a flag as SVG markup or a URL, drawn as an image so that it cannot run anything.

```js
import { awardCase, podium } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = podium([{ name: "Aoki", label: "9.80 s" }, { name: "Dupont" }, { name: "Rossi" }]);
console.log(svg.includes("<desc>1st: Aoki (9.80 s); 2nd: Dupont; 3rd: Rossi</desc>")); // true
const shelf = awardCase([{ emblem: "trophy:hockey-cup", count: 3 }, { emblem: "medal:gold" }]);
console.log(shelf.includes("×3")); // true
```

## Engraved, tinted, in a language

The same options work on every one of these: `tint` and `accent` for colour, `engrave` (or `label`, `year` and `rank`) for text cut into a face, `locale: "ja"` for the Japanese title. [Compose](../compose.md) and [engraving](../engraving.md) list them all, and the demo's [builder](https://johnmorrisdotca.github.io/dougu-sports/builder.html) writes the code for the emblem you choose.
