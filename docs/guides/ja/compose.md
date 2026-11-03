---
title: 表彰台、スプライト、データ URL
section: how-to
order: 11
description: エンブレムを画像や CSS の背景にし、少ないノードで何度も描き、実際の大きさの比で並べ、表彰台やトロフィーケースを作ります。
---

エンブレムは SVG の文字列です。このガイドの関数は、その文字列をさまざまな形で使うためのものです。`<img>` の `src`、CSS の背景、キャンバスの画像にできます。シンボルのシートにまとめれば、64 個のサッカーボールを置いてもノードはわずかで済みます。ルールブックどおりの大きさの比で並べることも、表彰台やトロフィーケースに組むこともできます。どれも純粋な関数で、文字列を返します。

## エンブレムを画像として

`currentColor` は `<img>` の中には引き継がれません。そこで `emblemDataUri` が、インクを具体的な色にして返します。色は `color` オプションで決まり、指定がなければテーマの色になります（`"dark"` は明るいインク、`"light"` と既定は暗いインク）。属性や CSS の `url()` を途中で閉じてしまうおそれのある文字はすべてパーセントエンコードされるので、返った文字列は、そのまま `img.src`、`background-image: url("…")`、キャンバス用の `new Image()` に渡せます。

```js
import { emblemDataUri } from "@johnmorrisdotca/dougu-sports/emblems";

const src = emblemDataUri("sport:nhl", { size: 48, color: "#c8102e" });
console.log(src.startsWith("data:image/svg+xml;utf8,%3Csvg")); // true
console.log(decodeURIComponent(src).includes("currentColor")); // false
```

## 同じエンブレムを何度も

インラインで描くと、64 個のサッカーボールは 2,304 ノード、530 kB になります。シートを使えば 228 ノード、15 kB です。`emblemSprite` は各エンブレムを `<symbol>` として1回だけ描き、`sprite.use` が返すのは数ノード、数十バイトほどです。`sprite.sheet` は、ページに1回だけ置きます。

```js
import { emblemSprite } from "@johnmorrisdotca/dougu-sports/emblems";

const sprite = emblemSprite(["ball:soccer", "medal:gold"]);
const cell = sprite.use("ball:soccer", { size: 24, title: false });
console.log(cell.startsWith('<svg width="24" height="24" aria-hidden="true"><use href="#')); // true
console.log(sprite.sheet.includes("<symbol")); // true
```

エンブレムの横に同じ内容を表すテキストがあるときは、`title: false` を渡します。絵は `aria-hidden="true"` になります。渡さない場合は、使うたびにアクセシブルな名前が付きます。

## 実際の大きさの比で

各ボールには、元になったルールブックの公式の大きさが入っていて（`emblemInfo(id).size`。根拠にしたルールもわかります）、`lineup` は、その相対的な大きさのまま複数を並べて描きます。たとえばゴルフボールは 42.67 mm、サッカーボールは約 220 mm です。

```js
import { emblemInfo, lineup } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(emblemInfo("ball:golf").size.diameterMm); // 42.67
const svg = lineup(["ball:golf", "ball:tennis", "ball:soccer", "ball:puck"], { height: 80 });
console.log(svg.includes("<title>Balls at their true relative sizes")); // true
```

## 競技で使う道具

`sportEquipment(sport)` は、その競技に使うものと、その競技で勝ち取るものを返します。ボール、用具、優勝者が掲げるトロフィー、そしてオリンピック競技ならメダルです。返される id はどれも `renderEmblem` で描けるので、競技の用具を一覧するページで、それぞれの絵を表示できます。

```js
import { renderEmblem, sportEquipment } from "@johnmorrisdotca/dougu-sports/emblems";

const nhl = sportEquipment("nhl");
console.log(nhl.ball, nhl.trophy); // ball:puck trophy:hockey-cup
console.log(nhl.gear.length > 0, renderEmblem(nhl.trophy).startsWith("<svg")); // true true
```

## 表彰台とトロフィーケース

`podium` は、1位、2位、3位を段のついた台の上に並べます。`awardCase` は、チームのトロフィーを棚に並べ、それぞれに個数を添えます。どちらもページの文字色で描かれる1つの SVG 文字列で、タイトルと説明を持ちます。表彰台に渡す旗は SVG マークアップでも URL でもよく、画像として描かれるので、何かが実行されることはありません。

```js
import { awardCase, podium } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = podium([{ name: "Aoki", label: "9.80 s" }, { name: "Dupont" }, { name: "Rossi" }]);
console.log(svg.includes("<desc>1st: Aoki (9.80 s); 2nd: Dupont; 3rd: Rossi</desc>")); // true
const shelf = awardCase([{ emblem: "trophy:hockey-cup", count: 3 }, { emblem: "medal:gold" }]);
console.log(shelf.includes("×3")); // true
```

## 刻印、色、言語

ここで紹介した関数のどれにも、同じオプションが使えます。色は `tint` と `accent`、面に刻む文字は `engrave`（または `label`、`year`、`rank`）、日本語のタイトルは `locale: "ja"` で指定します。オプションの一覧は[合成](../../compose.md)と[刻印](../../engraving.md)にあり（どちらも英語のみ）、デモの[ビルダー](https://johnmorrisdotca.github.io/dougu-sports/builder.html)では、選んだエンブレムのコードを書き出せます。
