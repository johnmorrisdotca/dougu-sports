---
title: React、Vue、Svelte、Angular で使う
section: how-to
order: 4
description: React、Vue、Svelte、Angular でエンブレムを使います。サーバーでの描画も壊れない import の仕方です。
---

`<dougu-emblem>` はウェブコンポーネントなので、どのフレームワークでも使えます。どれにも当てはまることが3つあります。

1. **要素は、ブラウザーでだけ import します。** 要素はブラウザーの `HTMLElement` を拡張しています。サーバーで import しても何も起きませんが、描かれもしません。下の例は、どれも「ページがブラウザーにある」フック（`useEffect`、`onMounted`、`onMount`、チェックつきの `ngOnInit`）の中で import しています。だからサーバーでの描画も壊れず、ページが動いてからエンブレムが出ます。サーバーでSVGを描きたいときは、[renderEmblem](api:renderEmblem) を呼びます（[TypeScript と Node](typescript-and-node.md)）。
2. **`style` ではなく `variant` を使います。** `variant="line"` で見た目を選びます。`style` はインライン CSS のための HTML 属性で、フレームワークは CSS として読んでしまいます。
3. **Vue では、コンポーネントに `DouguEmblem` という名前をつけません。** 単一ファイルコンポーネントは、ファイル名で自分自身を指します。`DouguEmblem.vue` というファイルの中の `<dougu-emblem>` は、要素ではなくコンポーネント自身を読み込み、延々と繰り返してしまいます。例のファイルが `EmblemCard.vue` なのは、このためです。

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

TypeScript では、タグがあることを React に伝えます（`dougu-emblem.d.ts` のようなファイル）。

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

このコンポーネントは、サーバーでも文字列に描けます（`renderToString`）。パッケージのテストで確かめています。タグまでは出て、エンブレムはブラウザーで描かれます。

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

`main.ts` で、このタグがカスタム要素だと Vue のコンパイラーに伝えます。

```ts no-check
import { createApp } from "vue";
import EmblemCard from "./EmblemCard.vue";

const app = createApp(EmblemCard);
app.config.compilerOptions.isCustomElement = (tag) => tag === "dougu-emblem";
app.mount("#app");
```

Vite では、同じ設定を `vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === "dougu-emblem" } } })` に書きます。

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

`CUSTOM_ELEMENTS_SCHEMA` で Angular のコンパイラーがタグを受け入れます。`[attr.emblem]` は属性を設定します。要素が読むのは属性です。
