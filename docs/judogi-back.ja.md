# 背中側から見た柔道衣とゼッケン

[README に戻る](../README.md) · 日本語 · [English](judogi-back.md)

<picture>
<source media="(prefers-color-scheme: dark)" srcset="images/judogi-dark.webp">
<img alt="4 着の柔道衣。正面から見た白い柔道衣と、ゼッケンを縫い付けた背中側の 3 着。ゼッケンは白い布で、色のついた帯に姓、その下に 3 文字の国名コードが入る。白に TANAKA JPN、青に TREMBLAY CAN、金の帯の白に SMITH USA。" src="images/judogi-light.webp">
</picture>

国際柔道連盟（IJF）の大会では、選手全員が上衣の背中に公式のバックナンバー（ゼッケン）を縫い付けます。ゼッケンは IJF 指定の業者がつくり、配置は規則で決まっています。`gear:judogi-back`（白い柔道衣）と `gear:judogi-blue-back`（青い柔道衣）は、柔道衣を広げて背中側から見た姿に、このゼッケンを付けて描きます。袖は、ほかの柔道衣と同じく手首まで届きます（[柔道衣](japanese-sports.md#the-judo-suit)を参照）。

使うのは大きいほうのゼッケンで、幅 38 cm、高さ 39 cm。上端は襟の下から 3 cm のところに付けます。上から順に次のものが入ります。

- **姓**：色のついた帯の上に、白い大文字で入ります。帯は青で、オリンピックの王者は金、世界選手権の王者は赤です（タイトルを持っているあいだだけです）。
- **国名コード**：国内オリンピック委員会（NOC）の 3 文字で、帯の下に太い大文字で入ります。
- **残りは空白**：IJF の大会では、大会の広告を入れる場所ですが、このパッケージはスポンサーのマークを描きません。
- 左端の小さな四角は、ゼッケンが本物であることを示すラベルを表し、縁には縫い目を破線で描いています。

実際のゼッケンには国旗がないので、ここにも国旗はありません。IJF、製造元、スポンサーのマークも描いていません。数値の出どころと、確認できなかったことは[参考資料](references.md#the-ijf-back-number)にあります。

## `backnumber` オプション

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("gear:judogi-blue-back", { backnumber: { name: "TREMBLAY", code: "CAN" }, size: 256, locale: "ja" });
console.log(svg.includes("<title>青い柔道衣の背面</title>")); // true
```

| フィールド | 働き |
| --- | --- |
| `name` | 姓を大文字で。使える文字は英字、数字、空白、ハイフン、アポストロフィで、16 文字までです。小文字は大文字に、アクセント付きの文字はアクセントなしの文字になります（規則は Müller のように文字に記号が付くことを認めています）。長い姓は帯に収まるよう小さくします。省略すると `TANAKA` になります |
| `code` | NOC の 3 文字（`CAN`、`JPN`、`USA`）。英字だけで大文字、3 文字までです。省略すると `JPN` になります |
| `band` | `"blue"`（既定）、`"gold"`、`"red"` |

柔道衣の色は id で決まります。`gear:judogi-back` が白、`gear:judogi-blue-back` が青です。`tint` は他の柔道衣と同じく布の色を、`accent` は帯の色を変えます。帯の既定は黒で、腰の後ろで交差させて描きます。このオプションは `renderEmblem` と `emblemFrame` が受け取るので、背面もほかの柔道衣と同じく、コインのように裏返りながら回り、姓とコードもそのままついてきます。

```js
import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";

const turned = emblemFrame("gear:judogi-back", { yaw: 40, backnumber: { name: "SMITH", code: "USA", band: "gold" } });
console.log(turned.includes("#d8a31a")); // true
```

`name` や `code` が文字列でなければ何も描きません。また、呼び出し側が渡した文字はマークアップとして絵に入ることはありません。文字はこのパッケージ自前の線で描いていて、テキストではないので、姓にタグを混ぜることはできません。このページの TANAKA、SMITH、TREMBLAY はよくある姓で、特定の選手の名前ではありません。
