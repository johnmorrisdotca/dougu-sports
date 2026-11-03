---
title: Upgrading
section: upgrading
order: 9
description: What changed between versions and what to do about it. The package is 0.x: read this before a minor version.
---

The package is at 0.x, so a minor version (0.28 to 0.29) may change behaviour. Each release's notes are in the [changelog](../../CHANGELOG.md); this page lists what needs your action.

## To 0.29: the element and the embed page

New: the `./element` entry point, which registers `<dougu-emblem>`; the embed page `embed.html` for an iframe; and [emblemEmbedCode](api:emblemEmbedCode), which writes the snippets for an emblem. Nothing you have changes. The package's `sideEffects` is no longer `false`: it names the element's file, so a bundler keeps its registration.

New emblems: three practice baseballs with slots on both halves (`ball:plastic-baseball-practice`, `-white`, `-orange`). The count of emblems in the registry goes up by three.

## Before 0.29

Earlier releases changed emblems and added trophies; nothing needed action. See the [changelog](../../CHANGELOG.md).
