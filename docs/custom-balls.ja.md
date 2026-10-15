# カスタムボール

[README に戻る](../README.md) · 日本語 · [English](custom-balls.md)

野球のボール、ソフトボール、定番のサッカーボール（`ball:baseball`、`ball:softball`、`ball:soccer` と、そのオレンジ・イエロー・カラー版）には、色や印刷を指定するオプションがあります。指定できるのは、1〜2色の塗り分け、スタンプの文字、メーカーのマークがある位置に置く筆記体の単語、その下の小さなマーク、そして自分のロゴをボールの側面に巻き付けた印刷です。すべて球面に重ねるのではなく球面そのものに描くので、ボールの曲面に沿い、縁に近づくほど縮んで見え、ボールを回すと縁の向こうに消えて、また戻ってきます（`emblemFrame`、`ballFrame`、`bindTurn` にも同じオプションを渡せます）。出力は小さく、同じオプションなら必ず同じ文字列になります。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("ball:baseball", { size: 320, paint: "#c4262e", stamp: true, script: true });
console.log(svg.startsWith("<svg")); // true
console.log(svg.length < 24000); // true
```

描かれるものはすべてこのパッケージのための自作です。筆記体はこのパッケージ用に描いた経由点の集まり（フォントファイルではなく、誰かの書体でもありません）、スタンプは自作のブロック体と星、マークは円の中の 1 文字です。リーグ、チーム、メーカー、その他の誰かのロゴ、ワードマーク、サインは一切含まれません。ロゴやマークは、描画時に渡した SVG そのものから描かれます。

## オプション

| オプション | 渡せるもの |
| --- | --- |
| `paint` | 色（`"#c4262e"`）、または `{ body, second, split, angle, stitch }`。ボールの色です。 |
| `decal` | SVG の文字列、`data:` 形式の画像 URI、または `{ svg, href, size, turn }`。ボールに印刷するロゴです。 |
| `stamp` | `true`、1 行の文字列、文字列の配列、または `{ lines, stars, sign, colour }`。スタンプの文字です。 |
| `script` | `true`、単語、または `{ text, colour }`。自作の筆記体です。 |
| `mark` | `true`、1 文字、SVG の文字列、または `{ letter, svg, href, colour }`。筆記体の下の小さなマークです。 |
| `spots` | `{ decal: { lon, lat }, label: { lon, lat } }`。ロゴと文字を置く位置で、初期の向きの中心からの角度（度）です。 |

印刷したボールは、ラベルが見える向きで描かれます（印刷しないボールは、そのボール本来の向きです）。ラインスタイルでは何も印刷されません。このオプションに対応していないボールでは、オプションは無視されます。各ボールのモジュール（`ball/ball.baseball`）には印刷のコードが入っていないので、ボールを単独でバンドルしたときの大きさは小さいままです。`renderEmblem`、メインエントリ、レジストリは印刷付きのボールを使います。1 つのボールだけを使うときは `printed(BALL_BASEBALL)` を使ってください。

## 色

`paint` は、単色のボールなら 1 色、ツートンカラーなら 2 色を指定します。縫い目の糸は、ボールの色の上で見やすい色（赤、クリーム、紺、黒に近い色のうち見やすいもの）に変わり、継ぎ目はそのまま残ります。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

// 青い単色のソフトボール。
console.log(renderEmblem("ball:softball", { paint: "#1f4e8c" }).includes('fill="#1f4e8c"')); // true

// 継ぎ目で左右に塗り分けた、記念ボールのような白と赤のボール。革の片方が白、もう片方が赤です。
const two = renderEmblem("ball:baseball", { paint: { body: "#f4f0e6", second: "#c4262e" } });
console.log(two.includes('fill="#c4262e" fill-rule="evenodd"')); // true

// または、半分に分けて 30 度回す。
console.log(renderEmblem("ball:baseball", { paint: { body: "#f4f0e6", second: "#1f4e8c", split: "half", angle: 30 } }).length > 4000); // true
```

継ぎ目に沿って塗り分けたツートンカラーのボールでは、縫い目の V 字の 2 本の脚がそれぞれの側の色の上に乗り、その色の上で見やすい糸の色になります。糸の色を自分で決めるには `stitch` を使います。サッカーボールでは、`body` が六角形、`second` が五角形の色です。ほかのボールでは、`body` をボール全体の色合いとして使います。

## スタンプ

`stamp: true` は、2 つの小さな星に挟まれた `UNOFFICIAL` と、その下のボール固有の文言（`DIGITAL BASEBALL`、`DIGITAL SOFTBALL`、`DIGITAL SOCCER`）を、幅の狭い太いブロック体で紺色に描きます（紺が見えにくいボールでは白か黒に近い色になります）。自分の文言（最大 3 行、1 行 24 文字まで。星は 1 行目に付きます）、星の有無、その下の架空のサイン（任意で小さなキャプション付き）、インクの色を指定できます。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const stamp = renderEmblem("ball:baseball", { stamp: { lines: ["CLUB", "ANNIVERSARY BALL"], sign: { seed: 7, caption: "SECRETARY" }, colour: "#0b4f3b" } });
console.log(stamp.includes("#0b4f3b")); // true
```

サインは種（シード）から描かれる線です。同じ種からは必ず同じ線が描かれ、どの種も実在の人物の筆跡ではありません。

## 筆記体とマーク

`script: true` は、メーカーのマークがある位置に、そのボールの単語（`Baseball`、`Softball`、`Soccer`）を自作の筆記体で描き、その下に小さな丸囲みの文字（単語の頭文字）を付けます。別の単語（a〜z と空白。専用の字形がない大文字は、背の高い小文字になります）、色、別の文字を指定できます。丸囲みの文字を付けないときは `mark: false` にします。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const ball = renderEmblem("ball:baseball", { script: "Hardball", mark: { letter: "H", colour: "#8a1c1c" } });
console.log(ball.includes("#8a1c1c")); // true
```

### 自分のマーク

`mark` には SVG の文字列も渡せます。円の代わりに、その SVG が元の色のまま描かれます。ロゴと同じ方法で、先に安全な形に整えられます（下記）。このパッケージには含められない自分のマークを入れるための差し込み口です。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const mine = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><path d="M2 30 C 30 -10, 70 -10, 98 30 C 70 8, 30 8, 2 30Z" fill="#7a3fd0"/></svg>`;
const svg = renderEmblem("ball:baseball", { size: 320, script: true, mark: { svg: mine } });
console.log(svg.includes("#7a3fd0")); // true
```

## ロゴ

`decal` は、ボールの側面にロゴを印刷します。SVG は正確に球面へ巻き付けられます。輪郭を細かい点に分け、すべての点を球面に載せ、塗りは縁で切り、線は裏へ向かうにつれて細くなるので、球に印刷した印のように縮んで見えます。ロゴは初期状態でラベル領域の中心に置かれ、スタンプ、筆記体、マークは反対側に置かれます（ボールを回すと見えます）。どちらの位置も `spots` で動かせます。

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";
import { ballFrame } from "@johnmorrisdotca/dougu-sports/turn";

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1f4e8c"/><path d="M24 64 L50 38 L76 64" fill="none" stroke="#f2b705" stroke-width="10" stroke-linecap="round"/></svg>`;
console.log(renderEmblem("ball:baseball", { decal: logo }).includes("#1f4e8c")); // true
// 反対側に置くと、ボールを回すまで見えません。
console.log(renderEmblem("ball:baseball", { decal: { svg: logo, size: 50 }, spots: { decal: { lon: 180 } } }).includes("#1f4e8c")); // false
console.log(ballFrame("ball:baseball", { decal: logo, yaw: 30 }) === ballFrame("ball:baseball", { decal: logo, yaw: 31 })); // false
```

`size` はロゴの幅（球面上の度数。初期値は約 55）、`turn` はボール上でのロゴの回転です。ロゴは `data:` URI でも渡せます。SVG は上と同じように読まれ、PNG、JPEG、GIF、WebP（400 kB まで、`base64` のみ）は小さな三角形に分けて貼り付けられます。三角形ごとにそれぞれのアフィン変換で移すので、見た目は近くなりますが厳密ではなく、画像データは出力に 1 回だけ書き込まれます。ユーザーがファイルを選んだときに `FileReader.readAsDataURL` が返す値がこれなので、ロゴのアップロードにサーバーは不要です（デモの「Custom ball」セクションがそうしています）。

### 安全な形に整える処理

外部から渡されるものは、描画の前にすべて、許可リスト方式（禁止リストではありません）で安全な形に整えます。SVG は、図形、グループ、グラデーション（各色の平均色として扱います）と、その単純な塗り、変形、塗りつぶしの規則、不透明度だけを残します。スクリプト、スタイル、テキスト、画像、`use`、リンク、イベントハンドラー、`foreignObject`、フィルター、クリップパス、値の中にコロン・エンティティ・引用符があるものは、中身ごと取り除かれます。ネットワーク上のアドレス（`https:`、`//`）は拒否され、対応する種類の画像ではない `data:` URI も拒否されます。色は `#rgb`、`#rrggbb`、`rgb()` だけを受け付け、それ以外は無視します。文字は自作の字形から描くので、マークアップにそのまま書き込まれることはありません。大きさと個数には上限があります。

## 回転

印刷はボールの一部なので、回転させた各フレームにも印刷が含まれます。

```js
import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";

const frames = [-40, 0, 40].map((yaw) => emblemFrame("ball:soccer", { stamp: true, script: true, yaw }));
console.log(new Set(frames).size); // 3
```

```js no-run
import { bindTurn } from "@johnmorrisdotca/dougu-sports";

bindTurn(document.getElementById("ball"), "ball:baseball", { size: 320, paint: "#c4262e", stamp: true, script: true });
```

## 単独のモジュールから読み込んだボール

```js
import { printed } from "@johnmorrisdotca/dougu-sports";
import { BALL_BASEBALL } from "@johnmorrisdotca/dougu-sports/ball/ball.baseball";

// 単独のボールには印刷機能がないので、オプションは無視されます。
console.log(BALL_BASEBALL.svg({ stamp: true }) === BALL_BASEBALL.svg()); // true
console.log(printed(BALL_BASEBALL).svg({ stamp: true }) === BALL_BASEBALL.svg()); // false
```

`printed()` は、印刷のコードを付けたボールを返します（野球のボールで gzip 後に約 19 kB で、ほとんどが筆記体、文字、巻き付けの処理です）。印刷のないモジュール単体は 9 kB 未満のままです。
