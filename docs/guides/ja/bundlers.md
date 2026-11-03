---
title: バンドラーで使う: Vite、webpack、ES モジュール
section: how-to
order: 3
description: パッケージを入れて、Vite か webpack のプロジェクトで要素や関数を import します。
---

インストールします。

```sh
npm install @johnmorrisdotca/dougu-sports
# or: pnpm add @johnmorrisdotca/dougu-sports
# or: yarn add @johnmorrisdotca/dougu-sports
```

すべて ES モジュールで、入口ごとに分かれています。バンドラーは import したものだけを取り込みます。`@johnmorrisdotca/dougu-sports`（全部）、`/emblems`（一覧と `renderEmblem`）、`/turn`、`/brands`、`/element`（`<dougu-emblem>` タグ）、そしてエンブレムごとのモジュール（`/trophy/hockey-cup`、`/ball/ball.soccer`）です。エンブレムごとのモジュールは、それ自身のほかには何も持ちません。`/element` を import するとタグが1回だけ登録されます。

## Vite

ページです。

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dougu Sports with Vite</title>
  </head>
  <body>
    <dougu-emblem emblem="trophy:stanley-cup" size="200"></dougu-emblem>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

スクリプトです。要素を import するとタグが登録されます。あとは普通のDOM操作です。

```ts no-run
import "@johnmorrisdotca/dougu-sports/element";
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const cup = document.querySelector("dougu-emblem")!;
cup.setAttribute("turnable", "");
console.log(renderEmblem("medal:gold", { size: 48 }).startsWith("<svg"));
```

`npm create vite@latest` でプロジェクトができます。エンブレムに必要なのは、この2つのファイルだけです。設定なしで Vite がビルドします。

## webpack

入口です。

```js no-run
import "@johnmorrisdotca/dougu-sports/element";

const cup = document.createElement("dougu-emblem");
cup.setAttribute("emblem", "trophy:stanley-cup");
cup.setAttribute("size", "200");
document.body.append(cup);
```

そして `webpack.config.mjs` です。`exports` を持つパッケージのために、webpack 5 は特別な設定は要りません。

```mjs no-run
import { fileURLToPath } from "node:url";

export default {
  mode: "production",
  entry: "./src/index.js",
  output: { path: fileURLToPath(new URL("./dist", import.meta.url)), filename: "main.js" },
};
```

`npx webpack` を実行して、`dist/main.js` をページから読み込みます。

## ほかのツール

`package.json` の `exports` を読めるツールなら、同じように使えます。Rollup、esbuild、Parcel、Bun、Deno（`npm:@johnmorrisdotca/dougu-sports/element`）などです。パッケージは依存のない ES2022 で、副作用があるのは `./element` の入口だけです。`package.json` の `sideEffects` がそれを示しているので、ツリーシェイクで残りは小さくなります。
