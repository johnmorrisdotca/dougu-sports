---
title: はじめに
section: tutorial
order: 1
description: Dougu Sports を入れて、エンブレムをSVGで描き、ページに置いて、回してみます。
---

Dougu Sports（道具）は、スポーツのエンブレム（トロフィー、メダル、紋章、あらゆるスポーツのボールと用具）をSVGで描きます。読み込むものは何もありません。エンブレムは関数が返す文字列で、ページに置くための `<dougu-emblem>` タグも使えます。

## インストール

```sh
npm install @johnmorrisdotca/dougu-sports
# or: pnpm add @johnmorrisdotca/dougu-sports
# or: yarn add @johnmorrisdotca/dougu-sports
```

## エンブレムを描く

エンブレムにはそれぞれ id があります。[renderEmblem](api:renderEmblem) に id とオプションを渡すと、SVGの文書が返ります。

```ts
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("trophy:stanley-cup", { style: "line", size: 96 });
console.log(svg.startsWith("<svg"), svg.includes("<title>Stanley Cup</title>"));
```

スタイルは3つです。`metal`（初期値。グラデーションと光沢）、`line`（ページの文字色の線1本）、`color`（べた塗り）。id の一覧は [EMBLEM_IDS](api:EMBLEM_IDS) にあり、デモのギャラリーですべて見られます。

## ページに置く

同じエンブレムを、タグで置けます。要素を一度読み込めば、どこにでもタグを書けます。

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/dougu-sports/element/+esm"></script>
<dougu-emblem emblem="trophy:stanley-cup" size="200" turnable></dougu-emblem>
```

`turnable` をつけると、ドラッグ、矢印キー、スペースキー（ゆっくり回し始める・止める）で回せます。`autoplay` をつけると自動で回ります（動きを減らす設定の人と、画面の外にある間は回りません）。

## 次に読むもの

- [普通の HTML ページで CDN から使う](html-and-cdn.md): ビルドなしでタグを使う方法。
- [バンドラーで使う](bundlers.md): Vite と webpack。
- [React、Vue、Svelte、Angular で使う](frameworks.md)。
- [iframe で埋め込む](embed-in-an-iframe.md): スクリプトを動かせないページ向け。
- [TypeScript と Node](typescript-and-node.md): 型と、サーバーでの描画。
- [軽さのしくみ](how-it-works.md) と [困ったとき](troubleshooting.md)。
