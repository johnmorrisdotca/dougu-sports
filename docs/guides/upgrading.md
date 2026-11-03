---
title: Upgrading
section: upgrading
order: 9
description: What changed between versions and what to do about it. The package is 0.x: read this before a minor version.
---

The package is at 0.x, so a minor version (0.30 to 0.31) may change behaviour. Each release's notes are in the [changelog](../../CHANGELOG.md); this page lists what needs your action.

## To 0.32: speed buttons in the demo

Nothing in the package changed. The demo takes kazoku-ui 0.14: the bar's Auto-turn speeds are the family's speed buttons, 0.5×, 1× and 2× (Slow, Medium and Fast are gone), kept in the address as `pace` (`?pace=2`) and not `speed`; the trophy case has the same three buttons for its four emblems (`?casepace=2`). The bar's base `speed="18"` is what the buttons multiply.

## To 0.31: the playground's zoom slider

Nothing in the package changed. The demo's playground takes kazoku-ui 0.12: the zoom is a slider with marks, in the bar's horizontal layout on a desk (a phone keeps the classic bar).

## To 0.30: the playground's Centre button, and the practice balls

Nothing you have changes. The package's code is the same except for the three practice baseballs (`ball:plastic-baseball-practice`, `-white`, `-orange`), which now have six large oval slots to a half in place of two rings of thin ones: a page that drew them looks different, and the slots are fewer and larger. The demo's playground takes kazoku-ui 0.11 (a Centre button, a pan that cannot lose the emblem, and exact grab on round balls); that is the demo and not the package.

## To 0.29: the element and the embed page

New: the `./element` entry point, which registers `<dougu-emblem>`; the embed page `embed.html` for an iframe; and [emblemEmbedCode](api:emblemEmbedCode), which writes the snippets for an emblem. Nothing you have changes. The package's `sideEffects` is no longer `false`: it names the element's file, so a bundler keeps its registration.

New emblems: three practice baseballs with slots on both halves (`ball:plastic-baseball-practice`, `-white`, `-orange`). The count of emblems in the registry goes up by three.

## Before 0.29

Earlier releases changed emblems and added trophies; nothing needed action. See the [changelog](../../CHANGELOG.md).
