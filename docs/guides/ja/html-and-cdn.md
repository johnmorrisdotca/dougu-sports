---
title: 普通の HTML ページで、CDN から使う
section: how-to
order: 2
description: jsDelivr か unpkg のスクリプトタグ1つで、どんなページにもエンブレムを入れます。ビルドは要りません。
---

ビルドを使わないページは、CDN からパッケージを読み込みます。下の2つの例は、パッケージのテストがブラウザーで実際に動かして確かめています。実際のアドレスも、公開済みのパッケージで確かめました。

## jsDelivr から

jsDelivr は、アドレスの最後に `/+esm` を付けると、パッケージを1つのモジュールにまとめて返します。なのでタグは1つで足ります。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dougu Sports from jsDelivr</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/dougu-sports/element/+esm"></script>
  </head>
  <body>
    <dougu-emblem emblem="trophy:stanley-cup" size="200" turnable></dougu-emblem>
  </body>
</html>
```

アドレスはパッケージの入口を指しています。`.../dougu-sports/element/+esm` は `./element` の入口で、`<dougu-emblem>` を登録します。バージョンを書かないと最新版になります。勝手に変わってほしくないページでは、`@johnmorrisdotca/dougu-sports@0.33.0/element/+esm` のようにバージョンを決めてください。

## unpkg から

unpkg はファイルをそのまま返します。`?module` を付けると、ファイルの import を unpkg のアドレスに書き換えて返します。ブラウザーはパッケージの少しのファイルを、1つずつ取ってきます。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dougu Sports from unpkg</title>
    <script type="module" src="https://unpkg.com/@johnmorrisdotca/dougu-sports/dist/element.js?module"></script>
  </head>
  <body>
    <dougu-emblem emblem="trophy:stanley-cup" size="200" turnable></dougu-emblem>
  </body>
</html>
```

ページには、リクエストが1回で済む jsDelivr が向いています。ブラウザーが受け取るファイルを読みたいときは unpkg が便利です。

## 属性

| 属性 | はたらき |
|---|---|
| `emblem` | id（`trophy:cup`）か短い名前（`cup`）。あとにスタイルも書けます: `cup/line`。 |
| `variant` | `metal`（初期値）、`line`、`color`。 |
| `size` | 幅と高さ（ピクセル）。初期値は64。 |
| `tint`, `accent` | 主な色と、もう1色（メダルのリボン、紋章の帯）。16進数か `rgb()`。 |
| `initials` | 紋章の文字。3文字まで。 |
| `theme` | `inherit`（初期値）、`auto`、`light`、`dark`。 |
| `locale` | `en` か `ja`。スクリーンリーダーが読むタイトルの言語。 |
| `yaw`, `pitch`, `roll` | 描く角度（度）。 |
| `turnable` | ドラッグ、矢印キー、スペースキーで回せます。 |
| `autoplay`, `speed` | 自動で回ります。`speed` は1秒に回す度数。 |

スクリプトで属性を変えると、エンブレムは描き直されます。

## CDN のバージョンの決め方

バージョンのないアドレスは、いつも最新版を指します。公開するものには、正確なバージョン（`@0.33.0`）を書いてください。上げる前に [バージョンアップ](upgrading.md) を読んでください。

## Content-Security-Policy

厳しいポリシーのページでは、`script-src` に CDN のホストを入れます。この要素はインラインのスクリプトを書きません。スタイルも構築可能なスタイルシートとして使うので、`style-src 'self'` のポリシーで足ります。
