---
title: Architecture
section: explanation
order: 10
description: Emblems as data and a pure renderer, the registry that names them, the entries that keep a page small, and the checks that hold them.
---

This guide is the map for someone who wants to change the package or to know why it behaves as it does. [How it stays light](how-it-works.md) says what a page pays for; this one follows `renderEmblem("trophy:hockey-cup")` through the files and names the rules they keep.

## The pipeline

```text
an id ──► emblem.ids.ts ──► emblem.registry.ts ──► an Emblem ──► emblem.core.ts ──► one SVG document
 "medal:gold"  (names only)   (id → drawing)       (data + svg())   (options, colours,
                                                                      the wrapper)
                                                       │
                                                       ├─ emblem.lathe.ts: a body of revolution (cups, bowls, balls) from a profile
                                                       ├─ emblem.shapes.ts: a flat object or icon (medals, crests, sport icons) from a list of shapes
                                                       ├─ emblem.flip.ts, turn-*.ts: a finished drawing turned, by a coin flip or about a vertical axis
                                                       └─ emblem.engrave.ts: text cut into a face
```

- **`emblem.ids.ts`** is only names: the ids of the emblems in their groups, and the types they make. It imports nothing, so reading it costs nothing. An id is `<group>:<name>`, and a short name (`cup`, `crown`) is an alias.
- **`emblem.registry.ts`** is the table of every emblem by id, keyed by the id union, so a missing or extra emblem is a type error. Importing it pulls in every drawing; importing one drawing's module does not.
- **`emblem.core.ts`** is what every emblem is made of: the options, the colours, the way a drawing is wrapped into a document, and the `Emblem` object each drawing is. It imports nothing from the rest of the package.
- **A drawing** is data. A cup, a bowl or a ball is a *profile* (the radius at each height) drawn by the lathe; a medal, a crest or an icon is a list of *shapes* with roles (the metal, its shade, a glint, ink, a line). The metal, line and colour styles are three renderings of the same data.
- **`emblem.api.ts`** is the library's functions: draw one by id, turn one, read a string that may be an id.

```js
import { emblemInfo, renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(renderEmblem("cup") === renderEmblem("trophy:cup"));
console.log(emblemInfo("trophy:hockey-cup").kind, emblemInfo("medal:gold").kind); // lathe flat
```

## Five rules

1. **Pure and deterministic.** The same arguments give the same string: no clock, no random number, no network, no font and no image. That is what lets a server draw an emblem, a test compare it and a page cache it.
2. **Names cost nothing, drawings cost what they hold.** The ids are in a file of their own; a drawing is in a module of its own (`trophy/hockey-cup`); the registry is the only file that imports them all. A page that names one emblem pays for one emblem and the small renderer it needs (a cup 7.1 kB gzipped, a medal or a crest 4.6 kB, a ball 7.6 kB), held by `test/size.test.ts`, which bundles one item with esbuild.
3. **Everything from outside is made safe.** A tint is `#rgb`, `#rrggbb` or `rgb()`, and anything else is ignored. Titles and engraved text are escaped. A flag or logo you pass to a podium is drawn as an image, so it cannot run anything. An id from outside goes through `parseEmblem` or `isEmblemId`, which say no.
4. **One document for one picture.** A drawing is one SVG with ids of its own for its gradients and clips, so that several can share a page; `emblemSprite` and `podium` take a document apart (`emblem.compose.ts`) and put the pieces together again inside another.
5. **Likeness is cited.** A trophy drawn to look like a real one is measured on a photograph and says so in [likeness](../likeness.md); the sources and the licences of what a drawing was made from are in [likeness sources](../likeness-sources.md). A made-up maker mark or team logo (`/brands`) is original and marked as such.

## The entries

| Entry | What it holds |
| --- | --- |
| `@johnmorrisdotca/dougu-sports` | the full registry: every emblem by id, the functions, each emblem as a constant |
| `/emblems` | `renderEmblem`, the ids and the types, with no single drawing imported by name |
| `/<group>/<name>` | one emblem alone: `trophy/hockey-cup`, `medal/gold`, `sport/nhl` |
| `/turn` | `emblemFrame`, `ballFrame`, `bindTurn`; with an emblem object it needs no registry |
| `/element` | `<dougu-emblem>`; the only entry with a side effect (it registers the tag) |
| `/brands` | experimental: twelve made-up maker marks and ten made-up team logos |

## Turning is a second view of the same data

A still emblem is drawn once. A turning one is redrawn when its angle changes, at most once a frame, and it is plain SVG: no WebGL, no canvas, no texture. A body of revolution turns by rotating its profile; a flat object flips like a coin (`emblem.flip.ts` squeezes the face by the cosine of the yaw and shows its back past a quarter turn); a ball turns on a sphere with real holes cut through the shell. `bindTurn` takes an emblem object and then needs no registry, so a turnable cup is about 9 kB gzipped, and an id loads the registry on demand.

## How it is kept true

| Check | What it holds |
| --- | --- |
| `pnpm check` | lint, types, the unit tests (every id draws, every size limit, hostile input, the trophy audit), the build and the packed package |
| `pnpm test:readme` | every example in the README, the docs and the guides, run against the built package |
| `pnpm test:usage` | every way of using the package that the guides show, built or run as npm packs it |
| `pnpm test:demo` | the demo in a real browser at a phone's width and a desk's |
| `pnpm docs:check` | every export has a doc comment and a running example; every guide has its front matter and its links lead somewhere |

The family's shared files (`scripts/family-template.mjs`, `scripts/docs-site.mjs` and the rest) are copied byte for byte between packages; do not edit one here.
