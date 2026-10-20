# Engrave an emblem

[Back to the README](../README.md) · English

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const medal = renderEmblem("medal:gold", { engrave: "MVP 2026" });
console.log(medal.includes(">MVP<") && medal.includes(">2026<")); // true
const plaque = renderEmblem("trophy:plaque", { label: "Champions", year: 2026 });
console.log(plaque.includes(">Champions<") && plaque.includes(">2026<")); // true
const cup = renderEmblem("trophy:hockey-cup", { engrave: "優勝 2026" });
console.log(cup.includes(">優<")); // true
console.log(renderEmblem("medal:gold").includes("<text")); // false
```

A medal, a place badge, the plaque, the belt, a ring (the team up one shoulder and the year down the other), a banner and a pennant take an engraving, and so does the plinth of every cup that stands on one. Give one string (`engrave`, any text, Japanese included, up to three lines of 24 letters), or a `label`, a `year` and a `rank`: the rank is the biggest line, the year the smallest. The text is escaped, fitted to its face (a longer word is set smaller, and a space is a place to break the line when that makes bigger letters) and cut in the ink that reads at 4.5 to 1 on the metal, a tone of the metal, black or white, in the line style the page's ink.

```js
import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";

const at = (yaw) => emblemFrame("medal:gold", { engrave: "MVP", engraveBack: "2026", yaw });
console.log(at(0).includes(">MVP<"), at(180).includes(">MVP<"), at(180).includes(">2026<")); // true false true
```

Turned, the engraving goes with its face: squeezed with a medal, hidden on its back (which has an engraving of its own when `engraveBack` is given), and on a cup set letter by letter round the plinth, so it foreshortens, slides behind the edge and comes round again. A drawn numeral or star that an engraving replaces is left out.
