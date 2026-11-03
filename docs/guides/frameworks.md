---
title: In React, Vue, Svelte and Angular
section: how-to
order: 4
description: Use the emblem in React, Vue, Svelte and Angular, with the import that keeps a server render working.
---

`<dougu-emblem>` is a web component, so every framework can use it. Three things apply everywhere:

1. **Import the element on the client only.** The element extends the browser's `HTMLElement`; on a server the import is harmless but draws nothing. Each example below imports it inside the framework's "the page is in a browser" hook (`useEffect`, `onMounted`, `onMount`, `ngOnInit` behind a check), so a server render still works and the emblem appears once the page is live. To draw the SVG on the server instead, call [renderEmblem](api:renderEmblem) ([TypeScript and Node](typescript-and-node.md)).
2. **Use `variant`, not `style`.** `variant="line"` picks the look. `style` is the HTML attribute for inline CSS, and frameworks read it as CSS.
3. **Do not name your component `DouguEmblem` in Vue.** A single-file component refers to itself by its file name, so `<dougu-emblem>` inside a file called `DouguEmblem.vue` loads the component instead of the element, and it recurses forever. The example is called `EmblemCard.vue` for that reason.

## React

```tsx
import { useEffect } from "react";

export function DouguEmblem({ emblem = "trophy:stanley-cup", size = 200 }: { emblem?: string; size?: number }) {
  useEffect(() => {
    // The element needs a browser, so it is imported here, never at the top of the file: a server render never reaches an effect.
    void import("@johnmorrisdotca/dougu-sports/element");
  }, []);
  return <dougu-emblem emblem={emblem} size={size} turnable />;
}
```

With TypeScript, tell React the tag exists (a file such as `dougu-emblem.d.ts`):

```ts no-run
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "dougu-emblem": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { emblem?: string; size?: number | string; variant?: string; turnable?: boolean; autoplay?: boolean };
    }
  }
}
```

The component renders to a string on a server (`renderToString`), as the package's tests check: the tag is there, the emblem is drawn in the browser.

## Vue

```vue
<script setup lang="ts">
import { onMounted } from "vue";

withDefaults(defineProps<{ emblem?: string; size?: number }>(), { emblem: "trophy:stanley-cup", size: 200 });

// The element needs a browser: import it once the component is on the page, never while a server renders it.
onMounted(() => {
  void import("@johnmorrisdotca/dougu-sports/element");
});
</script>

<template>
  <dougu-emblem :emblem="emblem" :size="size" turnable></dougu-emblem>
</template>
```

Tell Vue's compiler that the tag is a custom element, in `main.ts`:

```ts no-check
import { createApp } from "vue";
import EmblemCard from "./EmblemCard.vue";

const app = createApp(EmblemCard);
app.config.compilerOptions.isCustomElement = (tag) => tag === "dougu-emblem";
app.mount("#app");
```

With Vite, the same option goes in `vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === "dougu-emblem" } } })`.

## Svelte

```svelte
<script lang="ts">
  import { onMount } from "svelte";

  let { emblem = "trophy:stanley-cup", size = 200 }: { emblem?: string; size?: number } = $props();

  // The element needs a browser: onMount never runs on the server.
  onMount(() => {
    void import("@johnmorrisdotca/dougu-sports/element");
  });
</script>

<dougu-emblem {emblem} {size} turnable></dougu-emblem>
```

## Angular

```ts no-check
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-dougu-emblem",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<dougu-emblem [attr.emblem]="emblem" [attr.size]="size" turnable></dougu-emblem>`,
})
export class DouguEmblemComponent implements OnInit {
  @Input() emblem = "trophy:stanley-cup";
  @Input() size = 200;

  ngOnInit(): void {
    // The element needs a browser: ngOnInit also runs when a server renders, so the import waits for one.
    if (typeof window !== "undefined") void import("@johnmorrisdotca/dougu-sports/element");
  }
}
```

`CUSTOM_ELEMENTS_SCHEMA` lets Angular's compiler accept the tag, and `[attr.emblem]` sets the attribute, which is what the element reads.
