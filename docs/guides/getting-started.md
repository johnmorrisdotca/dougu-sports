---
title: Getting started
section: tutorial
order: 1
description: Install Dougu Sports, draw your first emblem as SVG, put it in a page and make it turn.
---

Dougu Sports draws sports emblems (trophies, medals, crests, the ball and the gear of every sport) as SVG. There is nothing to load: an emblem is a string that a function returns, and an optional tag, `<dougu-emblem>`, draws one in a page.

## Install it

```sh
npm install @johnmorrisdotca/dougu-sports
# or: pnpm add @johnmorrisdotca/dougu-sports
# or: yarn add @johnmorrisdotca/dougu-sports
```

## Draw an emblem

Every emblem has an id. [renderEmblem](api:renderEmblem) takes an id and some options and gives you a document of SVG:

```ts
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("trophy:stanley-cup", { style: "line", size: 96 });
console.log(svg.startsWith("<svg"), svg.includes("<title>Stanley Cup</title>"));
```

The three styles are `metal` (the default: gradients and shine), `line` (one outline in the page's text colour) and `color` (flat fills). The ids are in [EMBLEM_IDS](api:EMBLEM_IDS), and the demo's gallery shows every one.

## Put it in a page

The same emblem as a tag. Load the element once, then write the tag anywhere:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/dougu-sports/element/+esm"></script>
<dougu-emblem emblem="trophy:stanley-cup" size="200" turnable></dougu-emblem>
```

`turnable` lets a reader drag it, use the arrow keys, or press Space to start and stop a slow turn. Add `autoplay` and it turns by itself (not for a reader who prefers reduced motion, and not while it is off screen).

## Where next

- [Plain HTML, from a CDN](html-and-cdn.md): the tag with no build step.
- [With a bundler](bundlers.md): Vite and webpack.
- [In React, Vue, Svelte and Angular](frameworks.md).
- [An iframe](embed-in-an-iframe.md), for a page that cannot run a script.
- [TypeScript and Node](typescript-and-node.md): the types, and drawing on a server.
- [How it stays light](how-it-works.md), and [troubleshooting](troubleshooting.md).
