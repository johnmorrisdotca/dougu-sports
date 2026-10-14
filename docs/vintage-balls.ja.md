# ヴィンテージ、年代風、柄入りのボール

[README に戻る](../README.md) · 日本語 · [English](vintage-balls.md)

通常のサッカー、野球、バレーボールの id では足りない 50 種類のボールです。その時代の縫い方をした、使い込んだ革のボール、年代ごとの試合球をイメージしたサッカーボール、店の壁に並ぶような柄のボール、糸の色や時代が違う野球ボール、国の色のバレーボールを収めています。どれも立体（3D）で描き、`ballFrame` で回転し、カラースタイルとラインスタイルの両方があります。絵はすべてこのパッケージ独自のものです。パネル構成は事実（パネルの枚数、多面体、曲線）に基づき、模様は時代や雰囲気を思わせるように描いたもので、実在のデザインを写したものではありません。出典は [references.md](references.md#vintage-era-style-and-patterned-balls)（英語）にあります。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

console.log(renderEmblem("ball:soccer-1900-laced").includes("<title>Soccer ball, laced</title>")); // true
console.log(renderEmblem("ball:volleyball-colours", { colors: ["#e8112d", "#ffffff", "#0b2d72"] }).includes("#e8112d")); // true
console.log(ballFrame("ball:soccer-2006-propeller", { yaw: 360 }) === ballFrame("ball:soccer-2006-propeller", { yaw: 0 })); // true
```

## ヴィンテージのサッカーボール（5 種類）

薄茶色、茶色、栗色の使い込んだ革で、擦れた跡があり、継ぎ目ごとに縫い目が入ります。`tint` は革の主な色を、`accent` は糸の色を置き換えます。

| id | パネル構成 | 何を表すか |
| --- | --- | --- |
| `ball:soccer-1870-hand-stitched` | 細長いパネル 8 枚が両端のボタンに集まり、手で十字に縫ってある | 1800 年代後半の手縫いのボール |
| `ball:soccer-1900-laced` | パネル 8 枚、両端の丸いキャップ、十字に紐を掛けて閉じる切れ目 | 1900 年代の紐つきのボール |
| `ball:soccer-1930-18-panel` | 帯状のパネル 18 枚（3 枚ずつ 6 組）を 2 種類の色合いの革で作り、継ぎ目を縫い合わせる | 1930 年代の帯状パネルのボール |
| `ball:soccer-1950-12-panel` | 栗色の革の五角形 12 枚を 4 種類の色合いにする | 1950 年代の 12 枚貼りのボール |
| `ball:soccer-1960-32-panel-leather` | 五角形 12 枚と六角形 20 枚の革のボール | 1960 年代の 32 枚貼りのボール |

古い 4 つのボールは、1872 年以降の規則が定める円周（27〜28 インチ）で描いています。1960 年代のボールは現在と同じ大きさです（[soccer-balls.ja.md](soccer-balls.ja.md) を参照）。

## 年代風のサッカーボール（11 種類）

どれも、その時代のパネル構成の上に、時代の雰囲気だけを思わせるこのパッケージ独自の模様を描いています。実在のボールのデザイン、マーク、名前は使っていません。id には模様と年代を入れています。

| id | パネル構成 | 見た目 |
| --- | --- | --- |
| `ball:soccer-1970-black-white` | 32 枚貼り（五角形 12 枚、六角形 20 枚） | 白い輪のある黒い五角形と、中央に淡いくぼみと点のある白い六角形。1970 年代前半の試合球風 |
| `ball:soccer-1978-triad` | 32 枚貼り | 六角形ごとに太い曲線の三角形を 3 枚、風車のように配し、先端が五角形のまわりに集まる。1970 年代後半の試合球風 |
| `ball:soccer-1986-decorated-triad` | 32 枚貼り | 同じ三つ巴を素焼きの赤にして白い珠の列を飾り、五角形は金の輪をあしらった暗い色にしたもの |
| `ball:soccer-1998-coloured-triad` | 32 枚貼り | 白地に青、赤、金の三つ巴を置き、五角形は深い紺色にしたもの |
| `ball:soccer-2002-triangle-sweep` | 32 枚貼り | 六角形ごとに細長い三角形が流れるように並ぶ。黒鉛色に金色を添え、五角形は炭色 |
| `ball:soccer-2006-propeller` | 14 枚貼り（プロペラ形 6 枚、三角形 8 枚） | 各プロペラの内側に金の線、暗い三角形に金の印 |
| `ball:soccer-2010-grooved` | 8 枚貼り（辺を S 字に曲げた正八面体） | 継ぎ目は溝で、各パネルに細い等高線のような線。淡い灰色とミント色 |
| `ball:soccer-2014-ribbon` | ねじれた 6 枚貼り | 白地に、ティール、オレンジ、紫の幅広いリボンが交差する |
| `ball:soccer-2018-pixel` | 6 枚貼り | 黒鉛色、灰色、赤、金の四角いピクセルが、一方に密集し反対側へまばらになる |
| `ball:soccer-2022-speed-shell` | 三角形 20 枚（正二十面体） | えんじ、クリーム、金のパネルそれぞれに、貝殻のように重なる輪郭線 |
| `ball:soccer-training-high-vis` | 32 枚貼り | 現代の高視認性トレーニングボール。蛍光の黄緑色に、濃いピンクの五角形と黒い速度線 |

14 枚貼り、6 枚貼り、32 枚貼りは、それぞれ `ball:soccer-14`、`ball:soccer-6`、`ball:soccer` と同じパネル構成です。8 枚貼りの正八面体と 20 枚貼りの正二十面体は新しい構成です（`src/emblems/ball/ball.tilings.ts` の `octahedron8` と `icosahedron`）。模様は、球の 1 点に接する平面に描いた図形を球面に載せたもの（`ball.decal.ts` の `frameAt`）なので、ボールと一緒に回転し、印刷された模様と同じように縮んで見えます。

## 店の壁に並ぶような柄（18 種類）

6 種類の一般的な柄を、それぞれ 3 通りの配色で用意しました。大きさはすべて 11 人制のボールと同じです。`tint` は柄の主な色を、`accent` は暗い色を置き換えます。

| 柄 | id | 絵 |
| --- | --- | --- |
| 星 | `ball:soccer-stars-blue`、`-red`、`-night` | 32 枚のすべてのパネルに角が 5 つの星 |
| 六角形の輪郭 | `ball:soccer-hexagons-cyan`、`-magenta`、`-lime` | 六角形ごとに二重の輪郭線、五角形は塗りつぶし |
| 炎 | `ball:soccer-flames-fire`、`-ice`、`-toxic` | 暗い五角形から 5 本の炎。外側の炎と明るい内側の炎 |
| シェブロン | `ball:soccer-chevrons-red`、`-green`、`-blue` | 極から極への 8 枚のパネルを 1 枚おきに色づけし、3 本の V 字の帯を重ねる |
| 二色の渦巻き | `ball:soccer-swirl-blue`、`-red`、`-teal` | ボールを巻くようにねじれた 4 枚のパネルを 2 色で塗り分ける |
| メタリック | `ball:soccer-metallic-gold`、`-silver`、`-cobalt` | 空と地面を映す磨いた仕上げの 32 枚貼り |

## 野球ボール（5 種類と、赤い縫い糸のもの）

8 の字の縫い目は、`ball:baseball` と同じ曲線（`x=(1-b)cos t + b cos 3t` など）です。赤だけで縫ったものは `ball:baseball` そのものです。

| id | 絵 |
| --- | --- |
| `ball:baseball-lemon-peel` | 1850〜60 年代の初期のレモンピール型。2 点で交わる 4 本の縫い目、古びた革に濃い色の糸 |
| `ball:baseball-red-blue` | 8 の字の縫い目を赤と青で交互に縫ったもの |
| `ball:baseball-black-red` | 8 の字の縫い目を黒と赤で交互に縫ったもの |
| `ball:baseball-vintage-leather` | 擦れた古い革に、色あせた赤い糸の 8 の字のボール |
| `ball:softball-11-optic` | 11 インチの蛍光イエローのソフトボール。赤い縫い目、円周 27.9 cm、重さ 166.5〜173.6 g（縫い目は 80 針。規則はフラットシームで 80 針以上） |

赤と青、黒と赤の縫い糸は、1930 年代の選手の記憶にある両メジャーリーグのボールの縫い糸の見た目を記したもので、規則ではありません。レモンピール型の大きさは現在のものです。当時はボールを定める規則がなかったためです。

## 国の色のバレーボール（11 種類）

18 枚貼りの室内用ボール（3 枚の帯が 6 組）のパネルを、国旗から取った 3 色で塗ったものです。旗、紋章、マークは描かず、色だけなので、国旗プラグインの形状指定（`flags(code, { shape, size, theme })`）は必要ありません。ボールの大きさは FIVB の規則による室内用ボール（`ball:volleyball` と同じ）です。

| id | 3 色 |
| --- | --- |
| `ball:volleyball-brazil` | 緑 `#009c3b`、黄 `#ffdf00`、青 `#002776` |
| `ball:volleyball-japan` | 白 `#f6f4ee`、赤 `#bc002d`、濃い赤 `#7d0020` |
| `ball:volleyball-canada` | 赤 `#d52b1e`、白、濃い赤 `#9b1c14` |
| `ball:volleyball-usa` | 赤 `#b22234`、白、青 `#3c3b6e` |
| `ball:volleyball-italy` | 緑 `#009246`、白、赤 `#ce2b37` |
| `ball:volleyball-poland` | 白、赤 `#dc143c`、濃い赤 `#9b1030` |
| `ball:volleyball-france` | 青 `#0055a4`、白、赤 `#ef4135` |
| `ball:volleyball-serbia` | 赤 `#c6363c`、青 `#0c4076`、白 |
| `ball:volleyball-netherlands` | 赤 `#ae1c28`、白、青 `#21468b` |
| `ball:volleyball-germany` | 黒 `#1b1b1b`、赤 `#dd0000`、金 `#ffce00` |
| `ball:volleyball-colours` | 3 色を指定するまでは黄、青、白 |

2 色の旗（日本、カナダ、ポーランド）は、3 色のパネル配置でも見分けられるよう、1 色の濃い色合いを 3 色目にしています。`colors` オプションを使うと、11 種類のどれにも好きな 3 色を指定できます。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";

// クラブの色を同じボールに。1〜2 色なら繰り返して 3 色にし、色として読めないものは捨てます。
const svg = renderEmblem("ball:volleyball-colours", { colors: ["#0b6e4f", "#f4d03f", "#ffffff"] });
console.log(svg.includes("#0b6e4f")); // true
console.log(renderEmblem("ball:volleyball-brazil", { colors: ["#ff0000"] }).includes("#ff0000")); // true
```

`colors` を指定しない場合は、`tint` が 1 色目を、`accent` が 2 色目を置き換えます。
