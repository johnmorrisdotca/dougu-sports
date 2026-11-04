---
title: iframe で埋め込む
section: how-to
order: 5
description: iframe 1つで、スクリプトなしでエンブレムをページに入れます。見せるものはアドレスで決めます。
---

デモのサイトには、枠に入れるための `embed.html` があります。アドレスに書かれたものを描き、自分のファイルのほかは何も取ってきません。あなたのページにスクリプトもビルドもパッケージも要りません。

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

エンブレムは枠の中央に、透明な背景で描かれます。ページの色がそのまま背景になります。

## アドレスで指定できるもの

| パラメーター | 値 | 初期値 |
|---|---|---|
| `emblem`（または `id`） | エンブレムの id か短い名前 | `trophy:cup` |
| `variant` | `metal`, `line`, `color` | `metal` |
| `size` | ピクセル | 枠より16小さい |
| `tint`, `accent`, `initials` | 色（`#` は `%23` と書く）と、紋章の文字 | なし |
| `theme` | `inherit`, `auto`, `light`, `dark` | `inherit` |
| `locale` | `en`, `ja` | `en` |
| `yaw`, `pitch`, `roll` | 描く角度（度） | 0 |
| `turnable` | `1`: ドラッグ、矢印キー、スペースキーで回せる | オフ |
| `autoplay`, `speed` | `1`: 自動で回る（1秒に `speed` 度）。小さな一時停止ボタンが出る | オフ |

初期の状態では、枠は止まっていて、操作ボタンもありません。何か変わったときだけ描き、画面の外にある間は何も描きません。デモの「ページに入れる」パネル（ファミリー共通の埋め込みパネル）は、設定したエンブレムのこの iframe のほか、HTML、ESモジュール、React、Vue、Angular、Svelte、画像のアドレス、SVG のコードを書いてくれます。コードの横では、そのエンブレムが動いています。コードからは [emblemEmbedCode](api:emblemEmbedCode) が同じことをします。
