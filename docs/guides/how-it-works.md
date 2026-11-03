---
title: How it stays light
section: explanation
order: 7
description: What an emblem is, when it is drawn, and the limits the package keeps so a page with it never works the processor for nothing.
---

An emblem is data and a function. The data (its profile, panels or shapes) is in its own module; the function turns the data into SVG text. Nothing is fetched, and no image, font or stylesheet comes with it.

## Pure and small

[renderEmblem](api:renderEmblem) is pure: the same arguments give the same string. An emblem that is bundled alone carries only its own data and the small renderer it needs, so a page that wants one cup pays for one cup.

## Drawn on demand

A still emblem is drawn once. A turning one is redrawn when its angle changes, at most once a frame, and the turn is plain SVG, not WebGL: no graphics context, no canvas, no texture. The element draws nothing while it is scrolled out of sight or the tab is hidden, and `autoplay` does not start for a reader who prefers reduced motion.

## Real holes, honest sides

A ball with holes (a pickleball, a practice baseball) has real ones: the near holes are cut out of the shell, and where a near hole lines up with a far one the page shows through. A flat object has a rim and a back: a medal flips like a coin.

## Drawn from facts

The sizes are the rulebooks' sizes, with the rule named in each emblem's information ([emblemInfo](api:emblemInfo)). Nothing is copied or traced from artwork, and no brand, league or sponsor mark is drawn; the real trophies are drawn from public descriptions and photographs looked at.

## Why `variant` and not `style`

`style` is a real HTML attribute (inline CSS), so frameworks read it as CSS and React refuses a string for it. The element's look is `variant`.
