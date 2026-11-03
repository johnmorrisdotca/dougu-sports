---
title: With a bundler: Vite, webpack and ES modules
section: how-to
order: 3
description: Install the package and import the element, or just the functions, in a Vite or webpack project.
---

Install it:

```sh
npm install @johnmorrisdotca/dougu-sports
# or: pnpm add @johnmorrisdotca/dougu-sports
# or: yarn add @johnmorrisdotca/dougu-sports
```

Everything is an ES module with its own entry point, so a bundler includes only what you import: `@johnmorrisdotca/dougu-sports` (everything), `/emblems` (the registry and `renderEmblem`), `/turn`, `/brands`, `/element` (the `<dougu-emblem>` tag), and one module for each emblem (`/trophy/hockey-cup`, `/ball/ball.soccer`), which carries nothing else. Importing `/element` registers the tag, once.

## Vite

The page:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dougu Sports with Vite</title>
  </head>
  <body>
    <dougu-emblem emblem="trophy:stanley-cup" size="200"></dougu-emblem>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

And its script. Importing the element registers the tag; the rest is plain DOM:

```ts no-run
import "@johnmorrisdotca/dougu-sports/element";
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const cup = document.querySelector("dougu-emblem")!;
cup.setAttribute("turnable", "");
console.log(renderEmblem("medal:gold", { size: 48 }).startsWith("<svg"));
```

`npm create vite@latest` gives you the project; these two files are all the emblem needs. Vite builds the entry with no configuration.

## webpack

The entry:

```js no-run
import "@johnmorrisdotca/dougu-sports/element";

const cup = document.createElement("dougu-emblem");
cup.setAttribute("emblem", "trophy:stanley-cup");
cup.setAttribute("size", "200");
document.body.append(cup);
```

and `webpack.config.mjs`. webpack 5 needs nothing special for a package with `exports`:

```mjs no-run
import { fileURLToPath } from "node:url";

export default {
  mode: "production",
  entry: "./src/index.js",
  output: { path: fileURLToPath(new URL("./dist", import.meta.url)), filename: "main.js" },
};
```

Run `npx webpack`, and load `dist/main.js` from a page.

## Other tools

Anything that reads `package.json`'s `exports` works the same: Rollup, esbuild, Parcel, Bun, Deno (`npm:@johnmorrisdotca/dougu-sports/element`). The package is plain ES2022 with no dependency, and only the `./element` entry has a side effect, which `sideEffects` in `package.json` names, so tree-shaking keeps the rest small.
