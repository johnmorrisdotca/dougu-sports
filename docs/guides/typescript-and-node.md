---
title: TypeScript and Node
section: how-to
order: 6
description: The types, the ids as types, and drawing emblems on a server with no DOM.
---

The package ships its own types. The ids are types too, so a wrong id is an error in your editor:

```ts
import { EMBLEM_IDS, emblemInfo, renderEmblem, type EmblemId, type EmblemOptions } from "@johnmorrisdotca/dougu-sports/emblems";
import type { DouguEmblem } from "@johnmorrisdotca/dougu-sports/element";

const options: EmblemOptions = { style: "line", size: 96 };
const id: EmblemId = "trophy:stanley-cup";
const svg: string = renderEmblem(id, options);
console.log(svg.length, emblemInfo(id).en, EMBLEM_IDS.length);

export function turnIt(cup: DouguEmblem): void {
  cup.setAttribute("turnable", "");
}

// @ts-expect-error "neon" is not a style
renderEmblem(id, { style: "neon" });
```

The type of the element comes from `/element`, which needs the DOM types (`lib: ["dom"]`); a file that imports only the type never loads the element.

## On a server

Every function that draws is pure: no clock, no DOM, no browser global, the same string for the same arguments. A server draws exactly what a browser does:

```mjs
import { EMBLEM_IDS, renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

// A server draws the same SVG a browser does: pure, no DOM, no browser globals.
const svg = renderEmblem("trophy:stanley-cup", { size: 160, style: "line" });
const page = `<!doctype html><title>The cup</title>${svg}`;
console.log(page.length > 1000, EMBLEM_IDS.length);
```

## One emblem and nothing else

`/emblems` carries the whole registry. A page that wants one cup imports that emblem's module, which carries only itself:

```ts
import { TROPHY_HOCKEY_CUP } from "@johnmorrisdotca/dougu-sports/trophy/hockey-cup";

console.log(TROPHY_HOCKEY_CUP.id, TROPHY_HOCKEY_CUP.svg({ size: 24 }).includes('width="24"'));
```
