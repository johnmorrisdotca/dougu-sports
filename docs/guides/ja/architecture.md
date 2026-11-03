---
title: 設計
section: explanation
order: 10
description: データとしてのエンブレムと純粋な描画関数、エンブレムに名前を付けるレジストリ、ページを小さく保つエントリーポイント、それらを守る検査を説明します。
---

このガイドは、パッケージを変更したい人、またはその振る舞いの理由を知りたい人のための地図です。[軽さのしくみ](how-it-works.md)では、ページに何がどれだけかかるかを説明しています。このガイドでは、`renderEmblem("trophy:hockey-cup")` が通るファイルを順にたどり、各ファイルが守る規則を示します。

## 流れ

```text
an id ──► emblem.ids.ts ──► emblem.registry.ts ──► an Emblem ──► emblem.core.ts ──► one SVG document
 "medal:gold"  (names only)   (id → drawing)       (data + svg())   (options, colours,
                                                                      the wrapper)
                                                       │
                                                       ├─ emblem.lathe.ts: a body of revolution (cups, bowls, balls) from a profile
                                                       ├─ emblem.shapes.ts: a flat object or icon (medals, crests, sport icons) from a list of shapes
                                                       ├─ emblem.flip.ts, turn-*.ts: a finished drawing turned, by a coin flip or about a vertical axis
                                                       └─ emblem.engrave.ts: text cut into a face
```

- **`emblem.ids.ts`** は名前だけのファイルです。グループごとのエンブレムの id と、そこから作る型が入っています。何もインポートしないので、読み込んでもコストはかかりません。id は `<group>:<name>` の形で、短い名前（`cup`、`crown`）は別名です。
- **`emblem.registry.ts`** は、すべてのエンブレムを id で引ける表です。id のユニオン型をキーにしているので、足りないエンブレムや余分なエンブレムは型エラーになります。レジストリをインポートするとすべての絵が入りますが、1つの絵のモジュールだけをインポートしても入りません。
- **`emblem.core.ts`** は、すべてのエンブレムの土台です。オプション、色、絵を SVG ドキュメントに包む方法、そして各絵の実体である `Emblem` オブジェクトが入っています。パッケージの他の部分は何もインポートしません。
- **絵**はデータです。カップ、ボウル、ボールは*輪郭*（高さごとの半径）で表し、`emblem.lathe.ts`（旋盤）が輪郭を回して描きます。メダル、紋章、アイコンは、役割（金属、その陰影、ハイライト、インク、線）を持つ*図形*の一覧です。スタイル（metal、line、color）の3つは、同じデータを3通りに描いたものです。
- **`emblem.api.ts`** は、ライブラリが公開する関数です。id から描く、回す、id かもしれない文字列を解釈する、といった関数が入っています。

```js
import { emblemInfo, renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

console.log(renderEmblem("cup") === renderEmblem("trophy:cup"));
console.log(emblemInfo("trophy:hockey-cup").kind, emblemInfo("medal:gold").kind); // lathe flat
```

## 五つの規則

1. **純粋で決定的。** 同じ引数からは同じ文字列ができます。時計、乱数、ネットワーク、フォント、画像は使いません。そのため、サーバーでエンブレムを描き、テストで比べ、ページでキャッシュできます。
2. **名前にコストはかからず、絵には中身の分だけかかる。** id は専用のファイルにあり、絵は専用のモジュール（`trophy/hockey-cup`）にあります。すべてをインポートするのはレジストリだけです。1つのエンブレムを指定するページは、そのエンブレムと、必要な小さな描画関数の分だけを負担します（カップは gzip で 7.1 kB、メダルか紋章は 4.6 kB、ボールは 7.6 kB）。この大きさは `test/size.test.ts` が守っていて、esbuild で1つの項目をバンドルして確かめます。
3. **外から来るものはすべて安全に扱う。** `tint` は `#rgb`、`#rrggbb`、`rgb()` のいずれかで、それ以外は無視されます。タイトルと刻印のテキストはエスケープされます。表彰台に渡した旗やロゴは画像として描かれるので、何かが実行されることはありません。外から来た id は `parseEmblem` か `isEmblemId` に通します。どちらも、id でなければ「違う」と答えます。
4. **1つの絵は1つのドキュメント。** 絵は1つの SVG で、グラデーションとクリップに専用の id を持つので、複数の絵を1つのページに置けます。`emblemSprite` と `podium` は、ドキュメントを分解し（`emblem.compose.ts`）、その部品を別のドキュメントの中で組み直します。
5. **似せた絵には出典がある。** 実在のトロフィーに似せた絵は、写真で寸法を測って描いており、その旨を[実物に似せる](../../likeness.md)に書いています（英語のみ）。絵の元にしたものの出典とライセンスは、[似せた元の出典](../../likeness-sources.md)にあります（英語のみ）。架空のメーカーのマークやチームのロゴ（`/brands`）は独自のデザインで、そのことを明記しています。

## エントリーポイント

| エントリーポイント | 含むもの |
| --- | --- |
| `@johnmorrisdotca/dougu-sports` | 完全なレジストリ。id で引けるすべてのエンブレム、関数、定数としての各エンブレム |
| `/emblems` | `renderEmblem`、id、型。個々の絵は名前でインポートしません |
| `/<group>/<name>` | 1つのエンブレムだけ。`trophy/hockey-cup`、`medal/gold`、`sport/nhl` など |
| `/turn` | `emblemFrame`、`ballFrame`、`bindTurn`。エンブレムのオブジェクトを渡せば、レジストリは不要 |
| `/element` | `<dougu-emblem>`。副作用のある唯一のエントリーポイント（タグを登録します） |
| `/brands` | 実験的。架空のメーカーのマーク12個と、架空のチームのロゴ10個 |

## 回転は、同じデータの二つ目の見方

静止したエンブレムは1回だけ描かれます。回転するエンブレムは、角度が変わったときに、1フレームにつき多くても1回だけ描き直されます。使うのはふつうの SVG だけで、WebGL もキャンバスもテクスチャも使いません。回転体は輪郭を回転させて回します。平らなものはコインのように裏返ります（`emblem.flip.ts` がヨー角の余弦で面を縮め、4分の1回転を過ぎると裏を見せます）。ボールは、殻に本物の穴を開けた球として回ります。`bindTurn` はエンブレムのオブジェクトを受け取る場合はレジストリを必要としないので、回せるカップは gzip で約 9 kB です。id を渡した場合は、必要になったときにレジストリを読み込みます。

## 正しさを保つしくみ

| 検査 | 何を確かめるか |
| --- | --- |
| `pnpm check` | lint、型、単体テスト（すべての id が描けること、すべてのサイズ上限、悪意のある入力、トロフィーの監査）、ビルド、パックしたパッケージ |
| `pnpm test:readme` | README、ドキュメント、ガイドのすべての例を、ビルドしたパッケージで実行 |
| `pnpm test:usage` | ガイドが示すパッケージの使い方すべてを、npm がパックしたとおりにビルドまたは実行 |
| `pnpm test:demo` | スマートフォン幅とデスクトップ幅の両方で、デモを実際のブラウザーで確認 |
| `pnpm docs:check` | すべてのエクスポートにドキュメントコメントと実行できる例があること、すべてのガイドにフロントマターがあること、リンクの行き先が存在すること |

ファミリーで共有するファイル（`scripts/family-template.mjs`、`scripts/docs-site.mjs` など）は、パッケージ間でバイト単位まで同一のコピーです。ここでは編集しないでください。
