# 日本の競技

[README に戻る](../README.md) · 日本語 · [English](japanese-sports.md)

パッケージの名前 Dougu は「道具」、つまり何かをするときに使うものを指す日本語です。そこで、日本の競技と武道（相撲、剣道、柔道、弓道、空手）の道具を、れっきとしたエンブレムとして収めています。どれも専用に描き起こしたオリジナルの絵で、汎用の id を持ち、`metal`、`color`、`line` のスタイルとライト・ダークの両方があり、すべて回転します。

`JAPANESE_IDS` にこれらをまとめて並べています。また、それぞれ該当するグループ（`sport`、`trophy`、`gear`）にも入っています。

| 競技 | ピクトグラム | 項目 | 日本語名 |
| --- | --- | --- | --- |
| 相撲 | `sport:sumo`（仕切りの構えの力士二人） | `trophy:sumo-cup`、`gear:gunbai`、`gear:mawashi` | 相撲、鳳凰飾りの銀杯、軍配、廻し |
| 優勝旗 | | `trophy:championship-banner` | 優勝旗 |
| 剣道 | `sport:kendo`（面） | `gear:shinai`、`gear:kendo-men` | 剣道、竹刀、剣道の面 |
| 柔道 | `sport:judo`（柔道衣と帯） | `gear:judogi`、`gear:judogi-blue`、`gear:judogi-folded`、`gear:judogi-blue-folded`、`gear:judogi-back`、`gear:judogi-blue-back`（[背中側とゼッケン](judogi-back.ja.md)）、`gear:obi`、下の各段級の帯、[帯の結び方 6 手順](obi-steps.ja.md) | 柔道、柔道衣、武道の帯 |
| 弓道 | `sport:kyudo`（弓、弦、矢） | `gear:yumi`、`gear:ya` | 弓道、弓道の弓、弓道の矢 |
| 空手 | `sport:karate`（空手衣） | `gear:karate-gi` | 空手、空手衣 |

```js
import { JAPANESE_IDS, emblemInfo, emblemName } from "@johnmorrisdotca/dougu-sports";

console.log(JAPANESE_IDS.length); // 41
console.log(emblemName("gear:gunbai", "ja")); // 軍配
console.log(emblemName("gear:gunbai")); // Referee's war fan
console.log(emblemInfo("gear:judogi").description?.ja.startsWith("白い柔道衣")); // true
```

## 言葉

日本語名には、それぞれの競技の統括団体が規則や用具の一覧で使う言葉を採りました。日本相撲協会の「軍配」「廻し」、全日本剣道連盟の「竹刀」「面」、全日本柔道連盟の「柔道衣」「帯」、全日本弓道連盟の「弓」「矢」、空手の「空手衣」です。エンブレムの短い名前はアクセシブルネーム（スクリーンリーダーが読む名前）なので、短くしてあります。もっと長い説明（`emblemInfo(id).description`、英語と日本語）はドキュメントとギャラリー用で、剣道の面と廻しの各部の言葉（面金、面布団、突き垂れ、下がり）もそこに入ります。日本語の文は、日本語が読める人が確認しています（[CONTRIBUTING](../CONTRIBUTING.md) を参照）。

id と絵は汎用です。団体の名前やマーク、実在するトロフィーの名前は使わず、文字も、指定しないかぎり入りません。

## 回転

平らなアイテム（ピクトグラム、帯、軍配、竹刀）は、このパッケージのすべての平らな絵が共有する一つの回転（`src/emblems/emblem.flip.ts`）で、コインのように裏返ります。ヨー角の余弦で幅が縮み、4 分の 1 回転を過ぎると前面が鏡像になって少し暗くなり、細い暗い縁は真横を向いたときにいちばん太く見えます。杯は回転体なので輪郭は変わらず、光と持ち手が動きます。ここにある id はすべて回転します。

```js
import { emblemFrame, renderEmblem } from "@johnmorrisdotca/dougu-sports";

console.log(emblemFrame("gear:shinai", { yaw: 0 }) === renderEmblem("gear:shinai")); // true
console.log(emblemFrame("gear:shinai", { yaw: 180 }).includes("scale(-1 1)")); // true
console.log(emblemFrame("trophy:sumo-cup", { yaw: 90 }) === renderEmblem("trophy:sumo-cup")); // false
```

## 相撲の杯

`trophy:sumo-cup` は、背の高い階段状の台に載った背の高い銀の杯で、縁は金めっきです。両側には、縁より高く伸びて鳥の頭のように巻いた華やかな持ち手が付き、鳳凰をかたどっています。実在の杯ではなく汎用の杯で、`engrave` を指定しないかぎり名前も彫刻も入りません。`engrave` を指定すると、台のまわりに彫られます。

## 優勝旗

`trophy:championship-banner` は、ゆるやかに波打つ幅広の布を、金の飾りの付いた竿に掲げたもので、刺繍の縁と短い房が付きます。初期設定では文字は入りません（無地の布には輪と星があります）。`initials` で最大 3 文字まで入れられます。`tint` は布の色（初期設定は紫、深紅は `#9d1b2e`）、`accent` は縁飾りの金です。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";

const plain = renderEmblem("trophy:championship-banner");
const crimson = renderEmblem("trophy:championship-banner", { tint: "#9d1b2e", initials: "ABC" });

console.log(plain.includes("<text")); // false
console.log(crimson.includes(">ABC<")); // true
```

## 柔道衣

`gear:judogi` は広げた白い柔道衣、`gear:judogi-blue` は青い柔道衣です。`gear:judogi-folded` と `gear:judogi-blue-folded` は、同じものを帯を巻いて四角くたたんだ姿です。IJF（国際柔道連盟）の柔道衣の規則（Sport and Organisation Rules、C1、[参考資料](references.md#judo-and-karate-suits-and-belts)）を元に描いています。

- **上衣：** 襟は左を右の上に重ね（右前）、合わせ目は胸骨の上端から下へ 10 cm 未満の位置にあります。襟は、背中側の首元から裾まで走る、厚く縫い込んだ襟です（規則では幅 4 cm、厚さは 1 cm まで）。袖は手首まで届く長いもの（柔道衣に半袖はありません）で、袖口はゆったりしていて手首の骨を完全に覆います。裾は臀部を覆い、脇に短い切れ込みがあります。`sport:judo` も同じように描きます。生地が厚いので、上半身と袖は段々の刺し縫い（キルティング）で描いています。
- **ズボン：** まっすぐでゆったりし、足首の近くまでの長さです。腰は紐で結び、膝は補強されています。
- **色（C1.9）：** 上衣とズボンは同じ色で、「雪のような白」（`JUDOGI_WHITE`）か青（`JUDOGI_BLUE`、Pantone 285M と 286M の間）です。それ以外はありません。
- **帯：** 初期設定は黒帯です。ほかの色は `accent` で指定します（`OBI_RANKS`）。
- ゼッケンは背中に縫い付けます（上端は襟の下 3 cm、C1.8）。そのため、正面からは見えません。`gear:judogi-back` と `gear:judogi-blue-back` は、ゼッケンを付けて背中側から描いたものです：[judogi-back.ja.md](judogi-back.ja.md)。

## 帯

帯は結んだ姿で描きます。腰に二重に巻いて背中で交差させ、両端を前に出して、左を右の上、次に右を左の上に重ねる平らな本結びで結び、同じ長さの両端が少し離れて垂れます。`gear:obi` が黒帯で、各段級にはそれぞれ id があります。

| 段級 | 帯 | id |
| --- | --- | --- |
| 級（昇級の順） | 白、黄、橙、緑、青、茶 | `gear:obi-white`、`-yellow`、`-orange`、`-green`、`-blue`、`-brown` |
| 初段から 5 段 | 黒 | `gear:obi` |
| 6 段から 8 段 | 紅白のだんだら（紅白帯） | `gear:obi-kohaku` |
| 9 段と 10 段 | 赤一色 | `gear:obi-red` |
| 日本の女子の黒帯 | 黒の中央に白い線 | `gear:obi-women` |
| 二つの級の間 | 帯に沿って二色を並べたもの：白黄、黄橙、橙緑、緑青、青茶 | `gear:obi-white-yellow`、`-yellow-orange`、`-orange-green`、`-green-blue`、`-blue-brown` |

講道館自身の級の帯は白（5 級と 4 級）と茶（3 級から 1 級）で、その間の色は他の国が加えたものなので、順序や年齢は国によって違います。二色の帯は、いくつかの国が若い柔道家に与える中間の帯です（フランスは 1990 年から。IJF が挙げているのは、5 組のうち白黄、黄橙、橙緑、緑青の 4 組で、青茶を挙げた出典は見つかっていないものの、一通りそろえるために描いています）。二色を帯にどう配置するかを決めた規則は見つからなかったので、幅を半分ずつに分けて描いています。出典は[参考資料](references.md#judo-and-karate-suits-and-belts)にあります。

`OBI_RANKS` に色が入っています（`kohaku` は紅白の赤、`red` は 9 段の赤）。`obi(rank, options)` が帯を描きます。`rank` は段級、または二色の帯なら二つの段級の組です（`obi(["white", "yellow"])`）。`tint` では別の色、または色の組を指定できます。`accent` は、一色の帯では両端の線、紅白の帯では白、二色の帯では二つ目の色になります。`women: true` は女子の黒帯の線を加え、ほかの帯では無視されます。`gear:judogi` と `gear:karate-gi` は、着ている帯の色を `accent` で指定できます。

帯を一手順ずつ結ぶ様子は [obi-steps.ja.md](obi-steps.ja.md) にあります：`gear:obi-step-1` から `gear:obi-step-6`。

```js
import { OBI_RANKS, obi } from "@johnmorrisdotca/dougu-sports";

console.log(Object.keys(OBI_RANKS).join(" ")); // white yellow orange green blue brown black kohaku red
console.log(obi("brown", { size: 24 }).includes(OBI_RANKS.brown)); // true
console.log(obi("black", { women: true }).includes("#f6f4ee")); // true
console.log(obi(["white", "yellow"]).includes(OBI_RANKS.yellow)); // true
```

## 空手衣

`gear:karate-gi` は WKF（世界空手連盟）の競技規則（2.2.1 項）を元に描いています。白で、線もパイピングもありません。生地は柔道衣より薄く（キルティングなし、幅の狭いふつうの襟）、上衣は腰を覆い、太ももの 4 分の 3 より下には届きません。袖は、長くても手首の曲がるところまで、短くても前腕の半分まで、つまり七分袖で、柔道衣よりやや短く、肘までの短さにはなりません。上衣には紐が付きます。ズボンはすねの 3 分の 2 以上を覆い、くるぶしの骨より上で止まります。帯は赤（AKA）か青（AO）で、そのため帯の初期設定は赤です。`sport:karate` は同じ空手衣をピクトグラムにしたもの、`sport:judo` は柔道衣です。

## アメリカンフットボールのピクトグラム

`sport:nfl`、`sport:cfl`、`sport:ifaf` は、`ball:football`、`ball:football-cfl`、`ball:football-ifaf` のボールをピクトグラムにしたもので、斜めに置いた長球に、上側に紐の列が付いています。NFL のボールにはストライプがありません。CFL のボールは、両端の近くに一周する白いストライプが付きます（CFL Rule 1, Section 2）。IFAF のボールは、両端の近くに幅 1 インチの白いストライプが 2 本ずつ、紐の両側の 2 枚のパネルだけに付き、それは絵の上半分です（IFAF Football Rules and Interpretations 2023, Rule 1, Section 3, Article 1 e）。
