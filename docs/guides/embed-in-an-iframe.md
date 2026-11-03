---
title: Embed it with an iframe
section: how-to
order: 5
description: Put an emblem in any page with one iframe and no script, and choose what it shows in the address.
---

The demo site has a page made to be framed, `embed.html`. It draws what its address says and fetches nothing but its own files, so it needs no script, no build and no package on your side:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dougu Sports in an iframe</title>
  </head>
  <body>
    <iframe
      src="https://johnmorrisdotca.github.io/dougu-sports/embed.html?emblem=trophy:stanley-cup&size=200&turnable=1"
      title="The Stanley Cup"
      width="216"
      height="216"
      loading="lazy"
      style="border: 0"
    ></iframe>
  </body>
</html>
```

The emblem is centred in the frame on a transparent background, so it sits on your page's colour.

## What the address can say

| Parameter | Values | Default |
|---|---|---|
| `emblem` (or `id`) | an emblem id or a short name | `trophy:cup` |
| `variant` | `metal`, `line`, `color` | `metal` |
| `size` | pixels | the frame, less 16 |
| `tint`, `accent`, `initials` | colours (write `#` as `%23`) and a crest's letters | none |
| `theme` | `inherit`, `auto`, `light`, `dark` | `inherit` |
| `locale` | `en`, `ja` | `en` |
| `yaw`, `pitch`, `roll` | the angle it is drawn at, in degrees | 0 |
| `turnable` | `1`: a drag, the arrow keys and Space turn it | off |
| `autoplay`, `speed` | `1`: it turns by itself, at `speed` degrees a second; a small Pause button appears | off |

By default the frame is still and has no controls. It draws when something changes and nothing while it is out of sight. The demo's "Put it in your page" panel writes this iframe for the emblem you have set up, and the function [emblemEmbedCode](api:emblemEmbedCode) does the same in code.
