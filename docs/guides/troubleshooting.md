---
title: Troubleshooting and questions
section: troubleshooting
order: 8
description: Why nothing appears, and the errors people meet with CDNs, frameworks and servers.
---

## Nothing appears

- **A plain page with `import "@johnmorrisdotca/dougu-sports/element"` in a script tag.** A browser cannot resolve a package name. Use a CDN address ([plain HTML](html-and-cdn.md)), an import map, or a bundler ([bundlers](bundlers.md)).
- **The tag has no emblem attribute.** `<dougu-emblem>` draws nothing without `emblem`. Its `data-state` says what happened: `still`, `live`, `empty` or `error`.
- **The id is wrong.** An id that names no emblem sets `data-state="error"` and draws nothing; `renderEmblem` throws an error that says what an id looks like. [isEmblemId](api:isEmblemId) checks one.
- **The script is not a module.** Use `<script type="module">`.

## It does not turn

- Not every emblem turns: a flat icon (a sport's pictogram) has no other side. `turner` on the element is `undefined` for one that is drawn still.
- `autoplay` does nothing for a reader who has asked their device for reduced motion. A drag still turns it.
- It waits while it is scrolled out of sight, and while the tab is hidden.

## A server render fails

Importing `/element` on a server is safe, but the tag draws only in a browser. Import it in the framework's browser hook ([frameworks](frameworks.md)), or draw the SVG on the server with `renderEmblem` ([TypeScript and Node](typescript-and-node.md)).

## React: "The `style` prop expects a mapping"

Use `variant`, not `style`.

## Vue: "Failed to resolve component: dougu-emblem"

Tell the compiler the tag is a custom element: `isCustomElement` in [frameworks](frameworks.md).

## The emblem is the wrong colour on a dark page

The `line` style takes the page's text colour. For an emblem used as an `<img>`, which cannot inherit, use `theme="auto"` or [emblemDataUri](api:emblemDataUri) with a `color`.

## The package is large in my bundle

Import the module of the emblem you use (`/trophy/hockey-cup`), not the registry. `/emblems` carries every emblem.
