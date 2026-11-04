---
title: In a plain HTML page, from a CDN
section: how-to
order: 2
description: Add an emblem to any page with one script tag from jsDelivr or unpkg, with no build step.
---

A page with no build step loads the package from a CDN. Both snippets below were run in a browser by the package's tests, and the live addresses were checked against the published package.

## From jsDelivr

jsDelivr bundles the package into one module when an address ends in `/+esm`, so one tag is enough:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dougu Sports from jsDelivr</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/dougu-sports/element/+esm"></script>
  </head>
  <body>
    <dougu-emblem emblem="trophy:stanley-cup" size="200" turnable></dougu-emblem>
  </body>
</html>
```

The address names the package's entry point: `.../dougu-sports/element/+esm` is the `./element` entry, which registers `<dougu-emblem>`. With no version in the address you get the latest; pin one for a page that must not change under you, as in `@johnmorrisdotca/dougu-sports@0.33.0/element/+esm`.

## From unpkg

unpkg serves each file as it is; add `?module` and it rewrites the file's imports to unpkg addresses, so the browser fetches the package's few files, one request each:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dougu Sports from unpkg</title>
    <script type="module" src="https://unpkg.com/@johnmorrisdotca/dougu-sports/dist/element.js?module"></script>
  </head>
  <body>
    <dougu-emblem emblem="trophy:stanley-cup" size="200" turnable></dougu-emblem>
  </body>
</html>
```

jsDelivr is one request and the better choice for a page; unpkg is useful when you want to read the files the browser gets.

## The attributes

| Attribute | What it does |
|---|---|
| `emblem` | The id (`trophy:cup`) or a short name (`cup`). A style may follow: `cup/line`. |
| `variant` | `metal` (the default), `line` or `color`. |
| `size` | Width and height in pixels, 64 by default. |
| `tint`, `accent` | The main colour and a second one (a medal's ribbon, a crest's band): hex or `rgb()`. |
| `initials` | The letters of a crest, up to three. |
| `theme` | `inherit` (the default), `auto`, `light` or `dark`. |
| `locale` | `en` or `ja`: the language of the title a screen reader reads. |
| `yaw`, `pitch`, `roll` | The angle it is drawn at, in degrees. |
| `turnable` | A drag, the arrow keys and Space turn it. |
| `autoplay`, `speed` | It turns by itself, at `speed` degrees a second. |

Change an attribute with script and the emblem is drawn again.

## Choosing a CDN version

A CDN address without a version follows the latest release. Write an exact version (`@0.33.0`) in anything you publish, and read [upgrading](upgrading.md) before you move it.

## Content-Security-Policy

A page with a strict policy needs the CDN's host in `script-src`. The element writes no inline script, and its styles are adopted as a constructable stylesheet, so a policy of `style-src 'self'` is enough.
