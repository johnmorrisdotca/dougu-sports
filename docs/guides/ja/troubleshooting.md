---
title: 困ったとき、よくある質問
section: troubleshooting
order: 8
description: 何も出ないとき、そして CDN、フレームワーク、サーバーで出るエラーについて。
---

## 何も出ない

- **script タグの中で `import "@johnmorrisdotca/dougu-sports/element"` と書いている。** ブラウザーはパッケージ名を解決できません。CDN のアドレス（[普通の HTML](html-and-cdn.md)）、import map、またはバンドラー（[バンドラー](bundlers.md)）を使ってください。
- **タグに emblem 属性がない。** `emblem` がないと `<dougu-emblem>` は何も描きません。`data-state` で様子が分かります: `still`、`live`、`empty`、`error`。
- **id が違う。** どのエンブレムでもない id は `data-state="error"` になって何も描きません。`renderEmblem` は、id の形を説明するエラーを出します。[isEmblemId](api:isEmblemId) で確かめられます。
- **スクリプトがモジュールではない。** `<script type="module">` を使ってください。

## 回らない

- すべてのエンブレムが回るわけではありません。平らなアイコン（スポーツのピクトグラム）には裏がありません。止まったまま描かれるものでは、要素の `turner` は `undefined` です。
- 端末で動きを減らす設定にしている人には、`autoplay` は何もしません。ドラッグでは回せます。
- 画面の外にある間と、タブが隠れている間は止まります。

## サーバーでの描画が失敗する

サーバーで `/element` を import しても安全ですが、タグはブラウザーでだけ描かれます。フレームワークのブラウザー用フックの中で import するか（[フレームワーク](frameworks.md)）、サーバーでは `renderEmblem` でSVGを描いてください（[TypeScript と Node](typescript-and-node.md)）。

## React: 「`style` prop expects a mapping」

`style` ではなく `variant` を使います。

## Vue: 「Failed to resolve component: dougu-emblem」

このタグがカスタム要素だと、コンパイラーに伝えます。[フレームワーク](frameworks.md) の `isCustomElement` を見てください。

## 暗いページでエンブレムの色が合わない

`line` スタイルはページの文字色を使います。`<img>` のように色を引き継げないところでは、`theme="auto"` を使うか、[emblemDataUri](api:emblemDataUri) に `color` を渡してください。

## バンドルが大きい

レジストリではなく、使うエンブレムのモジュール（`/trophy/hockey-cup`）を import してください。`/emblems` はすべてのエンブレムを持っています。
