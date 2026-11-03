---
title: TypeScript と Node
section: how-to
order: 6
description: 型、型としての id、DOM のないサーバーでのエンブレムの描画です。
---

パッケージは自分の型を持っています。id も型なので、間違った id はエディターでエラーになります。

```ts
import { EMBLEM_IDS, emblemInfo, renderEmblem, type EmblemId, type EmblemOptions } from "@johnmorrisdotca/dougu-sports/emblems";
import type { DouguEmblem } from "@johnmorrisdotca/dougu-sports/element";

const options: EmblemOptions = { style: "line", size: 96 };
const id: EmblemId = "trophy:stanley-cup";
const svg: string = renderEmblem(id, options);
console.log(svg.length, emblemInfo(id).en, EMBLEM_IDS.length);

export function turnIt(cup: DouguEmblem): void {
  cup.setAttribute("turnable", "");
}

// @ts-expect-error "neon" is not a style
renderEmblem(id, { style: "neon" });
```

要素の型は `/element` から来ます。DOM の型（`lib: ["dom"]`）が必要です。型だけを import するファイルは、要素を読み込みません。

## サーバーで

描く関数はどれも純粋です。時計も DOM もブラウザーのグローバルも使わず、同じ引数なら同じ文字列を返します。サーバーはブラウザーとまったく同じものを描けます。

```mjs
import { EMBLEM_IDS, renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

// A server draws the same SVG a browser does: pure, no DOM, no browser globals.
const svg = renderEmblem("trophy:stanley-cup", { size: 160, style: "line" });
const page = `<!doctype html><title>The cup</title>${svg}`;
console.log(page.length > 1000, EMBLEM_IDS.length);
```

## 1つのエンブレムだけ

`/emblems` は一覧のすべてを持っています。1つのカップだけがほしいページは、そのエンブレムのモジュールを import します。それはそのエンブレムしか持っていません。

```ts
import { TROPHY_HOCKEY_CUP } from "@johnmorrisdotca/dougu-sports/trophy/hockey-cup";

console.log(TROPHY_HOCKEY_CUP.id, TROPHY_HOCKEY_CUP.svg({ size: 24 }).includes('width="24"'));
```
