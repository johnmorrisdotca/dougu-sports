# ギャラリー

[README に戻る](../README.md) · 日本語 · [English](gallery.md)

パッケージに含まれるすべてのエンブレムを、グループごとに並べた一覧です（全 274 点）。画像はデモのギャラリーページで見られます。この一覧はそのテキスト版で、ビルド済みのパッケージから `scripts/make-gallery.ts` が生成します（`pnpm gallery`）。

id は `<グループ>:<名前>` の形です。定数とインポートパスは id から決まるので、行ごとには書いていません。

- 定数は、id を大文字にし、`:` と `-` を `_` に置き換えたものです。`trophy:lidded-cup` → `TROPHY_LIDDED_CUP`。例外は 1 つだけで、`ball:squash` は `BALL_SQUASH_DOUBLE_YELLOW`（黄色い点が 2 つ付いたボール）です。
- 1 つだけインポートするときは、`@johnmorrisdotca/dougu-sports/<グループ>/<名前>` を指定します。`trophy:lidded-cup` → `@johnmorrisdotca/dougu-sports/trophy/lidded-cup`。award、trophy、medal、crest、sport、pennant は、すべてこの形でインポートできます。
- ball と gear は、ファミリーごとのモジュールにまとめてあり、1 つのファイルに複数のエンブレムが入っています。そのため、インポートのパスは `@johnmorrisdotca/dougu-sports/ball/ball.<ファイル>`（gear は `gear/gear.<ファイル>`）になります。ファミリーの名前は [layout.md](layout.md)（英語）に載っています（スカッシュのボールは `ball/ball.squash`）。上の定数は、パッケージのメインエントリからもインポートできます。

印刷パック（`puck:*`）は 1 つのファミリーモジュール `@johnmorrisdotca/dougu-sports/ball/ball.puck.print` にまとめてあり、`face` オプションを受け取ります（[pucks.ja.md](pucks.ja.md)）。

野球のボール、ソフトボール、定番のサッカーボール（`ball:baseball`、`ball:softball`、`ball:soccer` と、そのオレンジ・イエロー・カラー版）は、`paint`、`decal`、`stamp`、`script`、`mark`、`spots` のオプションを受け取ります。単色またはツートンカラーの塗り分け、ボールに巻き付けて印刷するロゴ、スタンプの文字、筆記体の単語、小さなマークを指定できます（[custom-balls.ja.md](custom-balls.ja.md)）。

エンブレムのソース（元の画像）が入っているフォルダーは、[layout.md](layout.md)（英語）にまとめてあります。

## award

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `award:medal` | メダル | icon | ours |  |
| `award:badge` | バッジ | icon | ours |  |
| `award:crown` | 王冠 | icon | ours |  |
| `award:star` | 星 | icon | ours |  |
| `award:shield` | 盾 | icon | ours |  |
| `award:ribbon` | リボン | flat | ours |  |

## trophy

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `trophy:cup` | カップ | icon | ours |  |
| `trophy:lidded-cup` | ふた付きカップ | lathe | ours |  |
| `trophy:bowl` | ボウル | lathe | ours |  |
| `trophy:salver` | 足付きの丸盆 | lathe | ours |  |
| `trophy:globe` | 台座の上の地球儀 | lathe | ours |  |
| `trophy:hockey-cup` | 段付きの銀カップ | lathe | ours | 帯を何段も重ねた背の高い銀のカップ |
| `trophy:basketball` | バスケットボールのトロフィー | lathe | ours | バスケットボールのトロフィー |
| `trophy:baseball` | 野球のトロフィー | lathe | ours |  |
| `trophy:football` | アメフトのトロフィー | lathe | ours | アメリカンフットボールのトロフィー |
| `trophy:canadian-bowl` | 取っ手が二つの広いボウル | lathe | ours |  |
| `trophy:soccer-ball` | サッカーのトロフィー | lathe | ours | サッカーボールのトロフィー |
| `trophy:soccer-globe` | 柱の上の地球儀 | lathe | ours |  |
| `trophy:tennis-plate` | 台付きの大皿 | lathe | ours |  |
| `trophy:tennis-cup` | パイナップル飾りのカップ | lathe | ours | 取っ手が二つあり、ふたにパイナップルの飾りが付いたカップ |
| `trophy:cricket-urn` | 取っ手付きの壺 | lathe | ours |  |
| `trophy:rugby-cup` | ふた付きの金色のカップ | lathe | ours |  |
| `trophy:plaque` | 記念盾 | flat | ours |  |
| `trophy:belt` | チャンピオンベルト | flat | ours |  |
| `trophy:laurel` | 月桂樹の冠 | flat | ours |  |
| `trophy:rosette` | リボン付きのロゼット | flat | ours |  |
| `trophy:ring` | 優勝リング | flat | ours |  |
| `trophy:banner` | 優勝バナー | flat | ours |  |
| `trophy:sumo-cup` | 鳳凰飾りの銀杯 | lathe | ours | 段のある高い台に載った、背の高い銀の杯。両側の取っ手に鳳凰の飾りが付く |
| `trophy:championship-banner` | 優勝旗 | flat | ours | 金の先端飾りの付いた竿に掛けた、刺繍の縁と房の付いた旗。文字は指定したときだけ入る |

## medal

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `medal:gold` | 金メダル | flat | ours |  |
| `medal:silver` | 銀メダル | flat | ours |  |
| `medal:bronze` | 銅メダル | flat | ours |  |
| `medal:place-1` | 1位のバッジ | flat | ours |  |
| `medal:place-2` | 2位のバッジ | flat | ours |  |
| `medal:place-3` | 3位のバッジ | flat | ours |  |

## crest

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `crest:shield` | 盾形のエンブレム | flat | ours |  |
| `crest:roundel` | 丸形のエンブレム | flat | ours |  |
| `crest:diamond` | ひし形のエンブレム | flat | ours |  |
| `crest:pennant` | ペナント形のエンブレム | flat | ours |  |

## ball

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `ball:soccer` | サッカーボール | ball | generated |  |
| `ball:soccer-colour` | サッカーボール（カラー） | ball | generated |  |
| `ball:soccer-26` | 26枚貼りサッカーボール | ball | generated | 三角形8枚と正方形18枚の26枚貼り。斜方立方八面体の26面と同じ構成 |
| `ball:soccer-18` | 18枚貼りサッカーボール | ball | generated | 立方体の6面に3枚ずつ帯状のパネルを貼った18枚貼り。隣り合う面の帯は互いに直角 |
| `ball:soccer-14` | 14枚貼りサッカーボール | ball | generated | プロペラ形6枚と三角形8枚の14枚貼り。切頂立方体の長い辺12本をS字に曲げた形 |
| `ball:soccer-12` | 12枚貼りサッカーボール | ball | generated | 正十二面体の五角形12枚で作った12枚貼り |
| `ball:soccer-6` | 6枚貼りサッカーボール | ball | generated | 縫わずに貼り合わせる熱接着の6枚貼り。ねじれた細長いパネル6枚が、長く曲がった数本の継ぎ目でつながり、表面はなめらか |
| `ball:soccer-orange` | 32枚貼り・オレンジ | ball | generated | 32枚貼りのサッカーボール。雪の上や暗がりでも見やすい明るいオレンジ色で、暗い色のパネルが入る |
| `ball:soccer-26-orange` | 26枚貼り・オレンジ | ball | generated | 26枚貼りのサッカーボール。雪の上や暗がりでも見やすい明るいオレンジ色で、暗い色のパネルが入る |
| `ball:soccer-18-orange` | 18枚貼り・オレンジ | ball | generated | 18枚貼りのサッカーボール。雪の上や暗がりでも見やすい明るいオレンジ色で、暗い色のパネルが入る |
| `ball:soccer-14-orange` | 14枚貼り・オレンジ | ball | generated | 14枚貼り（プロペラ形6枚、三角形8枚）のサッカーボール。雪の上や暗がりでも見やすい明るいオレンジ色で、暗い色のパネルが入る |
| `ball:soccer-12-orange` | 12枚貼り・オレンジ | ball | generated | 12枚貼りのサッカーボール。雪の上や暗がりでも見やすい明るいオレンジ色で、暗い色のパネルが入る |
| `ball:soccer-6-orange` | 6枚貼り・オレンジ | ball | generated | 熱接着の6枚貼りサッカーボール。雪の上や暗がりでも見やすい明るいオレンジ色で、暗い色のパネルが入る |
| `ball:soccer-yellow` | 32枚貼り・蛍光イエロー | ball | generated | 32枚貼りのサッカーボール。暗がりでも見やすい蛍光イエローで、暗い色のパネルが入る |
| `ball:soccer-26-yellow` | 26枚貼り・蛍光イエロー | ball | generated | 26枚貼りのサッカーボール。暗がりでも見やすい蛍光イエローで、暗い色のパネルが入る |
| `ball:soccer-18-yellow` | 18枚貼り・蛍光イエロー | ball | generated | 18枚貼りのサッカーボール。暗がりでも見やすい蛍光イエローで、暗い色のパネルが入る |
| `ball:soccer-14-yellow` | 14枚貼り・蛍光イエロー | ball | generated | 14枚貼り（プロペラ形6枚、三角形8枚）のサッカーボール。暗がりでも見やすい蛍光イエローで、暗い色のパネルが入る |
| `ball:soccer-12-yellow` | 12枚貼り・蛍光イエロー | ball | generated | 12枚貼りのサッカーボール。暗がりでも見やすい蛍光イエローで、暗い色のパネルが入る |
| `ball:soccer-6-yellow` | 6枚貼り・蛍光イエロー | ball | generated | 熱接着の6枚貼りサッカーボール。暗がりでも見やすい蛍光イエローで、暗い色のパネルが入る |
| `ball:futsal` | フットサルボール | ball | generated | フットサル用の4号球。円周62〜64cm、重さ400〜440g、弾みにくい。32枚貼りで、明るい青と白の配色。12枚の五角形それぞれに、小さな黄色の五角形が入る |
| `ball:beach-soccer` | ビーチサッカーボール | ball | generated | ビーチサッカー用の5号球。円周68〜70cm、重さ400〜440g、空気圧が低くやわらかい。14枚貼りのプロペラ形で、黄色、オレンジ、青の明るい配色 |
| `ball:soccer-1870-hand-stitched` | 手縫いのサッカーボール | ball | generated | 1800年代後半の手縫いボール。使い込んだ薄茶色の革の細長いパネル8枚を、糸の十字がはっきり見える縫い目でつなぎ、両端のパネルが集まるところにボタンが付く |
| `ball:soccer-1900-laced` | 紐つきのサッカーボール | ball | generated | 1900年代の紐つきボール。茶色い革のパネル8枚、両端の丸いキャップ、内袋（ブラダー）を入れたあとに十字に紐を掛けて閉じる切れ目 |
| `ball:soccer-1930-18-panel` | 18枚貼りの革ボール | ball | generated | 1930年代の18枚貼り。栗色と薄茶色の革の帯状パネル18枚（3枚ずつ6組）を使い、継ぎ目を縫い合わせたもの |
| `ball:soccer-1950-12-panel` | 12枚貼りの革ボール | ball | generated | 1950年代の12枚貼り。栗色の革の五角形12枚を4種類の色合いにして、隣り合うパネルが同じ色合いにならないようにし、継ぎ目を縫い合わせたもの |
| `ball:soccer-1960-32-panel-leather` | 32枚貼りの革ボール | ball | generated | 1960年代の32枚貼りの革ボール。五角形12枚と六角形20枚を使い、薄茶色の六角形に栗色の五角形を配して、継ぎ目を縫い合わせたもの |
| `ball:soccer-retro-pentagons` | 70年代風・白黒 | ball | generated | 1970年代風。32枚貼りで、白い輪のある黒い五角形と、中央が淡くくぼんだように描かれ点のある白い六角形 |
| `ball:soccer-retro-leaves` | 70年代後期風・三つ巴 | ball | generated | 1970年代後半風。32枚貼りで、六角形ごとに太くまっすぐな紺色の葉を3枚ずつ配し、それぞれの先端が五角形のほうを向く |
| `ball:soccer-retro-rosette` | 80年代風・飾りロゼット | ball | generated | 1980年代風。六角形ごとに素焼きのような赤の5枚花びらのロゼットを置き、花びらごとに白い珠の列を飾り、五角形は金の輪をあしらった暗い色 |
| `ball:soccer-retro-star` | 80年代風・星形 | ball | generated | 1980年代風の別版。クリーム色の六角形ごとに、濃いティールの6つの先端を持つ星と中央のサフラン色の点を配し、五角形はクリーム色の輪をあしらった紺色 |
| `ball:soccer-retro-pinwheel` | 90年代風・色つき三つ巴 | ball | generated | 1990年代風。白い六角形ごとに緑、琥珀色、すもも色の曲線の葉3枚を風車のように配し、3色が出会う中心に濃い緑の円を置き、五角形は濃い緑 |
| `ball:soccer-retro-kites` | 2000年代風・凧の流れ | ball | generated | 2000年代前半風。六角形ごとに細長い凧形がスレートブルーで流れるように並び、銀色の小さな凧形が添えられ、五角形はチャコールグレー |
| `ball:soccer-14-panel-double-border` | 14枚貼り・二重縁取り | ball | generated | 2000年代半ば風の14枚貼り（プロペラ形6枚、三角形8枚）。二重の縁取りが特徴で、継ぎ目に沿って黒い平行線が2本、白いプロペラの内側に赤い平行線が2本入り、暗い三角形には赤い点が入る |
| `ball:soccer-8-panel-plain` | 8枚貼り・無地と等高線 | ball | generated | 2010年代前半風の8枚貼り（辺をS字に曲げた正八面体）。何も描かれていない白いパネルと、白い等高線が3本入ったスレートブルーのパネルが、深く暗い溝で区切られる |
| `ball:soccer-6-panel-bands` | 6枚貼り・帯柄 | ball | generated | 2010年代半ば風の6枚貼り。ねじれた白いパネルを青、琥珀色、マゼンタの帯が横切り、継ぎ目が集まる両極には、入れ子になった3つのひし形が並ぶ |
| `ball:soccer-6-panel-diamonds` | 6枚貼り・ひし形柄 | ball | generated | 2010年代後半風の6枚貼り。グラファイト、灰色、ティール、金の小さなひし形が一方に密集し、反対側へ向かってまばらになり、継ぎ目が集まる両極には、入れ子になった3つのひし形が並ぶ |
| `ball:soccer-20-panel-dots` | 20枚貼り・点と輪郭 | ball | generated | 2020年代前半風の20枚貼り（正二十面体）。濃い青、クリーム色、砂色の三角形のパネルそれぞれに、入れ子の輪郭線が1本と、中央の点が入る |
| `ball:soccer-training-high-vis` | 蛍光トレーニングボール | ball | generated | 現代の高視認性トレーニングボール。蛍光の黄緑色の32枚貼りで、黒い輪をあしらった濃いピンクの五角形と、六角形ごとに3本の黒い速度線が入る |
| `ball:soccer-stars-blue` | 星柄・青 | ball | generated | 店頭によくある柄：すべてのパネルに角が5つの星。配色は青 |
| `ball:soccer-stars-red` | 星柄・赤 | ball | generated | 店頭によくある柄：すべてのパネルに角が5つの星。配色は赤 |
| `ball:soccer-stars-night` | 星柄・夜空 | ball | generated | 店頭によくある柄：すべてのパネルに角が5つの星。配色は夜空の紺に金 |
| `ball:soccer-hexagons-cyan` | 六角形柄・シアン | ball | generated | 店頭によくある柄：六角形の中に二重の輪郭線を入れた蜂の巣のような柄と、塗りつぶした五角形。配色はシアン |
| `ball:soccer-hexagons-magenta` | 六角形柄・マゼンタ | ball | generated | 店頭によくある柄：六角形の中に二重の輪郭線を入れた蜂の巣のような柄と、塗りつぶした五角形。配色はマゼンタ |
| `ball:soccer-hexagons-lime` | 六角形柄・ライム | ball | generated | 店頭によくある柄：六角形の中に二重の輪郭線を入れた蜂の巣のような柄と、塗りつぶした五角形。配色はライム |
| `ball:soccer-flames-fire` | 炎柄・ファイア | ball | generated | 店頭によくある柄：暗い色の五角形から外へ伸びる5本の炎。外側の炎と、明るい内側の炎の二重。配色はファイア：黒地にオレンジと黄色 |
| `ball:soccer-flames-ice` | 炎柄・アイス | ball | generated | 店頭によくある柄：暗い色の五角形から外へ伸びる5本の炎。外側の炎と、明るい内側の炎の二重。配色はアイス：紺地に青と水色 |
| `ball:soccer-flames-toxic` | 炎柄・トキシック | ball | generated | 店頭によくある柄：暗い色の五角形から外へ伸びる5本の炎。外側の炎と、明るい内側の炎の二重。配色はトキシック：濃い紫地に緑と黄色 |
| `ball:soccer-chevrons-red` | シェブロン柄・赤 | ball | generated | 店頭によくある柄：極から極へ伸びる8枚のパネルを1枚おきに色づけし、3本のV字の帯を重ねて、ボールを一周するジグザグにしたもの。配色は赤と黒 |
| `ball:soccer-chevrons-green` | シェブロン柄・緑 | ball | generated | 店頭によくある柄：極から極へ伸びる8枚のパネルを1枚おきに色づけし、3本のV字の帯を重ねて、ボールを一周するジグザグにしたもの。配色は緑と黄色 |
| `ball:soccer-chevrons-blue` | シェブロン柄・青 | ball | generated | 店頭によくある柄：極から極へ伸びる8枚のパネルを1枚おきに色づけし、3本のV字の帯を重ねて、ボールを一周するジグザグにしたもの。配色は青とオレンジ |
| `ball:soccer-swirl-blue` | 渦巻き柄・青 | ball | generated | 店頭によくある柄：ボールを巻くようにねじれた4枚のパネルを、2枚ずつ2色に塗り分けたもの。配色は青と白 |
| `ball:soccer-swirl-red` | 渦巻き柄・赤 | ball | generated | 店頭によくある柄：ボールを巻くようにねじれた4枚のパネルを、2枚ずつ2色に塗り分けたもの。配色は赤と黒 |
| `ball:soccer-swirl-teal` | 渦巻き柄・ティール | ball | generated | 店頭によくある柄：ボールを巻くようにねじれた4枚のパネルを、2枚ずつ2色に塗り分けたもの。配色はオレンジとティール |
| `ball:soccer-metallic-gold` | メタリック・金 | ball | generated | 店頭によくある柄：空と地面を映す磨いた金属の質感の32枚貼り。六角形は明るい金属、五角形は暗い金属。配色は金 |
| `ball:soccer-metallic-silver` | メタリック・銀 | ball | generated | 店頭によくある柄：空と地面を映す磨いた金属の質感の32枚貼り。六角形は明るい金属、五角形は暗い金属。配色は銀 |
| `ball:soccer-metallic-cobalt` | メタリック・コバルト | ball | generated | 店頭によくある柄：空と地面を映す磨いた金属の質感の32枚貼り。六角形は明るい金属、五角形は暗い金属。配色はコバルトブルー |
| `ball:teqball` | テックボール用ボール | ball | generated |  |
| `ball:basketball` | バスケットボール | ball | generated |  |
| `ball:basketball-6` | バスケットボール6号球 | ball | generated | バスケットボール（6号球） |
| `ball:basketball-3x3` | 3x3バスケットボール | ball | generated |  |
| `ball:baseball` | 野球のボール | ball | generated |  |
| `ball:softball` | ソフトボール | ball | generated |  |
| `ball:baseball-lemon-peel` | レモンピール型野球ボール | ball | generated | 1850〜60年代の初期のレモンピール型ボール。4枚の革と、2点で交わる4本の縫い目でできており、古びた革に濃い色の糸 |
| `ball:baseball-red-blue` | 赤青の縫い糸の野球ボール | ball | generated | 8の字の縫い目を赤と青の糸で交互に縫ったもの。1930年代の選手の回想にあるアメリカンリーグのボールの縫い糸 |
| `ball:baseball-black-red` | 黒赤の縫い糸の野球ボール | ball | generated | 8の字の縫い目を黒と赤の糸で交互に縫ったもの。1930年代の選手の回想にあるナショナルリーグのボールの縫い糸 |
| `ball:baseball-vintage-leather` | 古びた革の野球ボール | ball | generated | 茶色く変色して傷のついた古い革に、色あせた赤い糸で8の字に縫ったボール |
| `ball:softball-11-optic` | 11インチ蛍光ソフト | ball | generated | 11インチの蛍光イエローのソフトボール。赤い縫い目、円周27.9cm、重さ166.5〜173.6g（WBSCスローピッチ規則） |
| `ball:tennis` | テニスボール | ball | generated |  |
| `ball:padel` | パデルボール | ball | generated |  |
| `ball:sliotar` | シリター | ball | generated |  |
| `ball:volleyball` | バレーボール | ball | generated |  |
| `ball:volleyball-8` | バレーボール（8枚貼り） | ball | generated |  |
| `ball:beach-volleyball` | ビーチバレーボール | ball | generated |  |
| `ball:volleyball-colours` | 三色のバレーボール | ball | generated | 3色を自由に指定できる（colors オプション）18枚貼りの室内用バレーボール。初期設定は黄、青、白 |
| `ball:volleyball-brazil` | バレー（ブラジル） | ball | generated | 国旗の色を取り入れた18枚貼りの室内用バレーボール：緑、黄、青。色だけで、旗や紋章は描かない |
| `ball:volleyball-japan` | バレー（日本） | ball | generated | 国旗の色（白、赤、濃い赤）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、白地に、側面から正面、上面へ回る幅広い深紅の帯が1本入り、底面には濃い赤の帯が入る。色だけで、旗や紋章は描かない |
| `ball:volleyball-canada` | バレー（カナダ） | ball | generated | 国旗の色（赤、白、濃い赤）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、赤地の正面と背面の中央に白い縦帯が入り（国旗の白い部分に倣う）、上面と底面は濃い赤。色だけで、旗や紋章は描かない |
| `ball:volleyball-usa` | バレー（アメリカ） | ball | generated | 国旗の色（赤、白、青）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、向かい合う2面が紺色（国旗の青い部分に倣う）、残る4面は赤と白の縞。色だけで、旗や紋章は描かない |
| `ball:volleyball-italy` | バレー（イタリア） | ball | generated | 国旗の色（緑、白、赤）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、緑の面と赤の面が向かい合い、上面と底面は白、正面と背面は緑、白、赤の縞。色だけで、旗や紋章は描かない |
| `ball:volleyball-poland` | バレー（ポーランド） | ball | generated | 国旗の色（白、赤、濃い赤）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、国旗の上下の分け方に倣い、上半分が白、下半分が赤。頂点を真上に向けて置き、上を囲む3面が白、下を囲む3面が赤、下の各面の中央には濃い赤の帯が入る。色だけで、旗や紋章は描かない |
| `ball:volleyball-france` | バレー（フランス） | ball | generated | 国旗の色（青、白、赤）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、頂点を真上に向け、青、白、赤の大きな3つの領域が頂点のまわりを巡る。各色は向かい合う2面を占める。色だけで、旗や紋章は描かない |
| `ball:volleyball-serbia` | バレー（セルビア） | ball | generated | 国旗の色（赤、青、白）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、国旗の帯の順に上から赤、青、白と並ぶ。上面は赤、底面は白、正面と背面は青。色だけで、旗や紋章は描かない |
| `ball:volleyball-netherlands` | バレー（オランダ） | ball | generated | 国旗の色（赤、白、青）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、頂点を真上に向けたボールの全面に、赤、白、青の細い縞が入る。色だけで、旗や紋章は描かない |
| `ball:volleyball-germany` | バレー（ドイツ） | ball | generated | 国旗の色（黒、赤、金）を取り入れた18枚貼りの室内用バレーボール。他の国のボールと見分けがつく配置で、頂点を真上に向けたボールが、黒、赤、金の大きな6つの面に分かれ、各色が2面ずつを占める。色だけで、旗や紋章は描かない |
| `ball:cricket-red` | クリケットボール（赤） | ball | generated |  |
| `ball:cricket-white` | クリケットボール（白） | ball | generated |  |
| `ball:cricket-pink` | ピンクのクリケット球 | ball | generated | クリケットボール（ピンク） |
| `ball:football` | アメフトボール（NFL） | ball | generated | アメリカンフットボールのボール（NFL） |
| `ball:football-cfl` | フットボール（CFL） | ball | generated | カナディアンフットボールのボール（CFL） |
| `ball:football-ifaf` | アメフトボール（IFAF） | ball | generated | アメリカンフットボールのボール（IFAF） |
| `ball:rugby` | ラグビーボール | ball | generated |  |
| `ball:afl` | オージーボール | ball | generated | オーストラリアンフットボールのボール |
| `ball:gaelic-football` | ゲーリックフットボール | ball | generated | ゲーリックフットボールのボール |
| `ball:netball` | ネットボール | ball | generated |  |
| `ball:pickleball-outdoor` | ピックルボール（屋外用） | ball | generated |  |
| `ball:pickleball-indoor` | ピックルボール（屋内用） | ball | generated |  |
| `ball:squash` | スカッシュ球（ダブルイエロー） | ball | generated | スカッシュボール（ダブルイエロードット） |
| `ball:squash-yellow` | スカッシュ球（黄色） | ball | generated | スカッシュボール（イエロードット） |
| `ball:squash-green` | スカッシュ球（緑） | ball | generated | スカッシュボール（グリーンドット） |
| `ball:squash-red` | スカッシュ球（赤） | ball | generated | スカッシュボール（レッドドット） |
| `ball:squash-blue` | スカッシュ球（青） | ball | generated | スカッシュボール（ブルードット） |
| `ball:racquetball` | ラケットボール | ball | generated |  |
| `ball:lacrosse` | ラクロスボール | ball | generated |  |
| `ball:field-hockey` | フィールドホッケーボール | ball | generated |  |
| `ball:table-tennis` | 卓球ボール | ball | generated |  |
| `ball:handball` | ハンドボール | ball | generated |  |
| `ball:water-polo` | 水球ボール | ball | generated |  |
| `ball:golf` | ゴルフボール | ball | generated |  |
| `ball:puck` | アイスホッケーのパック | ball | generated |  |
| `ball:curling-stone` | カーリングストーン | ball | generated |  |
| `ball:shot` | 砲丸 | ball | generated |  |
| `ball:discus` | 円盤 | ball | generated |  |
| `ball:hammer` | ハンマー（ハンマー投） | ball | generated |  |
| `ball:sepak-takraw` | セパタクローボール | ball | generated |  |
| `ball:roundnet` | ラウンドネットボール | ball | generated |  |
| `ball:shuttlecock-feather` | 水鳥シャトル | ball | generated | シャトルコック（水鳥の羽根） |
| `ball:shuttlecock-nylon` | ナイロンシャトル | ball | generated | シャトルコック（ナイロン） |

## puck

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `puck:canada` | カナダ国旗のパック | ball | generated | 黒いパックの天面に、独自に描いたカナダ風の旗とその下の CANADA の文字、縁には文字の入った赤い輪を印刷したもの |
| `puck:canada-red` | カナダ赤地のパック | ball | generated | 黒いパックの天面に、赤地に白い大きなメープルの葉（独自の絵）、その下の CANADA の文字、縁には文字の入った暗い輪を印刷したもの |
| `puck:canada-white` | カナダ白地のパック | ball | generated | 黒いパックの天面に、白地に左右の赤い帯、大きな赤いメープルの葉とその下の CANADA の文字を印刷したもの |
| `puck:usa` | アメリカ星条旗のパック | ball | generated | 黒いパックの天面に、星と縞模様の円盤、その上に大きく書いた USA の文字、縁には文字の入った紺の輪を印刷したもの |
| `puck:usa-navy` | アメリカ紺地のパック | ball | generated | 黒いパックの天面に、紺地に白い細線にはさまれた赤い輪、5 つの星、大きな白い USA の文字を印刷したもの |
| `puck:player` | 選手名と背番号のパック | ball | generated | ジャージのように、縁の上側に沿った架空の姓、大きな背番号、金色の輪を印刷した黒いパック |
| `puck:signed` | サイン入りパック | ball | generated | 紺地のパックの天面に、金色のマーカーで書いたような架空のサインを重ねたもの（シード値から描くので、実在の人物の筆跡ではない） |
| `puck:souvenir` | 記念パック | ball | generated | 汎用の記念パック。クリーム色の地に、好きな文字を入れた紺の輪と星（または自分で用意した絵） |

## gear

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `gear:hockey-stick` | スティックとパック | gear | drawn | アイスホッケーのスティックとパック |
| `gear:goalie-stick` | ゴーリーのスティック | gear | drawn | アイスホッケーのゴーリーのスティック |
| `gear:hockey-skate` | アイスホッケースケート | gear | drawn | アイスホッケーのスケート靴 |
| `gear:goalie-mask` | ゴールキーパーマスク | gear | drawn |  |
| `gear:goal-net` | ゴールネット | gear | drawn |  |
| `gear:field-hockey-stick` | ホッケーのスティック | gear | drawn | フィールドホッケーのスティックとボール |
| `gear:lacrosse-stick` | ラクロスのクロスとボール | gear | drawn |  |
| `gear:cricket-bat` | クリケットのバット | gear | drawn | クリケットのバットとボール |
| `gear:wicket` | クリケットのウィケット | gear | drawn |  |
| `gear:table-tennis-paddle` | 卓球のラケット | gear | drawn | 卓球のラケットとボール |
| `gear:badminton-racket` | バドミントンのラケット | gear | drawn | バドミントンのラケットとシャトルコック |
| `gear:tennis-racket` | テニスのラケットとボール | gear | drawn |  |
| `gear:squash-racket` | スカッシュのラケット | gear | drawn |  |
| `gear:racquetball-racket` | ラケットボールのラケット | gear | drawn |  |
| `gear:padel-racket` | パデルのラケット | gear | drawn |  |
| `gear:pickleball-paddle` | ピックルボールのパドル | gear | drawn |  |
| `gear:roundnet-set` | ラウンドネットのセット | gear | drawn |  |
| `gear:takraw-net` | セパタクローのネット | gear | drawn |  |
| `gear:netball-post` | ネットボールのポスト | gear | drawn |  |
| `gear:teqball-table` | テックボールのテーブル | gear | drawn |  |
| `gear:volleyball-net` | バレーボールのネット | gear | drawn |  |
| `gear:basketball-hoop` | バスケットゴール | gear | drawn |  |
| `gear:baseball-bat` | 野球のバット | gear | drawn |  |
| `gear:baseball-glove` | 野球のグラブ | gear | drawn |  |
| `gear:football-helmet` | アメフトのヘルメット | gear | drawn | アメリカンフットボールのヘルメット |
| `gear:goalposts` | ゴールポスト | gear | drawn |  |
| `gear:hurley` | ハーリングのスティック | gear | drawn | ハーリー（ハーリングのスティック） |
| `gear:curling-broom` | カーリングのブラシ | gear | drawn |  |
| `gear:figure-skate` | フィギュアスケート靴 | gear | drawn |  |
| `gear:speed-skate` | スピードスケート靴 | gear | drawn |  |
| `gear:diving-board` | 飛び込み板 | gear | drawn |  |
| `gear:swim-goggles` | 水泳のゴーグル | gear | drawn |  |
| `gear:starting-blocks` | スターティングブロック | gear | drawn |  |
| `gear:relay-baton` | リレーのバトン | gear | drawn |  |
| `gear:javelin` | やり投げのやり | gear | drawn |  |
| `gear:hurdles` | ハードル | gear | drawn |  |
| `gear:gunbai` | 軍配 | gear | drawn | 行司が持つ軍配と、その房 |
| `gear:mawashi` | 廻し | gear | drawn | 力士の廻しと、前に垂らした下がり |
| `gear:shinai` | 竹刀 | gear | drawn | 剣道の竹刀。四つ割りの竹に先革、中結、柄が付く |
| `gear:kendo-men` | 剣道の面 | gear | drawn | 剣道の面。面金、面布団、突き垂れが付く |
| `gear:judogi` | 柔道衣 | gear | drawn | 白い柔道衣を広げた姿。手首まで届く長い袖、右前に合わせた刺し子で厚い襟、刺し子の身頃、膝を補強したズボン、本結びにした帯 |
| `gear:judogi-blue` | 青い柔道衣 | gear | drawn | 試合で白と並んで認められている青の柔道衣を広げた姿 |
| `gear:judogi-folded` | 畳んだ柔道衣 | gear | drawn | 白い柔道衣をきちんと四角く畳んだ姿。上に襟の刺し子が見え、帯を巻いて結んである |
| `gear:judogi-blue-folded` | 畳んだ青い柔道衣 | gear | drawn | 青い柔道衣をきちんと四角く畳んだ姿。上に襟の刺し子が見え、帯を巻いて結んである |
| `gear:judogi-back` | 柔道衣の背面 | gear | drawn | 白い柔道衣を背中側から広げた姿。手首まで届く長い袖、襟、腰の後ろで交差した帯、襟の3cm下に縫い付けた国際大会用のゼッケン。白い布の上部の帯に白い大文字の姓、その下に国名コード、下部は協賛用の余白 |
| `gear:judogi-blue-back` | 青い柔道衣の背面 | gear | drawn | 青い柔道衣を背中側から広げた姿。襟の3cm下に縫い付けた国際大会用のゼッケン。帯に姓、その下に国名コード、下は協賛用の余白 |
| `gear:obi` | 武道の帯 | gear | drawn | 本結びにした黒帯。腰に二周巻き、同じ長さの端を二本垂らした形 |
| `gear:obi-white` | 白帯 | gear | drawn | 本結びにした白帯。初級の帯 |
| `gear:obi-yellow` | 黄帯 | gear | drawn | 本結びにした黄帯 |
| `gear:obi-orange` | 橙帯 | gear | drawn | 本結びにした橙帯 |
| `gear:obi-green` | 緑帯 | gear | drawn | 本結びにした緑帯 |
| `gear:obi-blue` | 青帯 | gear | drawn | 本結びにした青帯 |
| `gear:obi-brown` | 茶帯 | gear | drawn | 本結びにした茶帯。級の上位の帯 |
| `gear:obi-kohaku` | 紅白帯 | gear | drawn | 本結びにした紅白帯。六段から八段の帯で、赤と白を交互に縫い合わせてある |
| `gear:obi-red` | 紅帯 | gear | drawn | 本結びにした紅帯。九段と十段の帯 |
| `gear:obi-women` | 女子用の黒帯 | gear | drawn | 中央に白線の入った女子用の黒帯 |
| `gear:obi-white-yellow` | 白と黄の二色帯 | gear | drawn | 上半分が白、下半分が黄の二色帯。白帯と黄帯の間の級の帯 |
| `gear:obi-yellow-orange` | 黄と橙の二色帯 | gear | drawn | 上半分が黄、下半分が橙の二色帯。黄帯と橙帯の間の級の帯 |
| `gear:obi-orange-green` | 橙と緑の二色帯 | gear | drawn | 上半分が橙、下半分が緑の二色帯。橙帯と緑帯の間の級の帯 |
| `gear:obi-green-blue` | 緑と青の二色帯 | gear | drawn | 上半分が緑、下半分が青の二色帯。緑帯と青帯の間の級の帯 |
| `gear:obi-blue-brown` | 青と茶の二色帯 | gear | drawn | 上半分が青、下半分が茶の二色帯。青帯と茶帯の間の級の帯 |
| `gear:obi-step-1` | 帯の結び方（1）中心 | gear | drawn | 柔道の帯の結び方、手順1。柔道衣の上から、帯の真ん中をおなかの中心に当てる |
| `gear:obi-step-2` | 帯の結び方（2）二重巻き | gear | drawn | 柔道の帯の結び方、手順2。帯を腰に二重に巻き、両端を前に戻す |
| `gear:obi-step-3` | 帯の結び方（3）交差 | gear | drawn | 柔道の帯の結び方、手順3。おなかの前で両端を交差させる。着る人の左の端が、右の端の上になるように重ねる |
| `gear:obi-step-4` | 帯の結び方（4）下に通す | gear | drawn | 柔道の帯の結び方、手順4。片方の端を、腰に巻いた二重の帯の下から上へ通す |
| `gear:obi-step-5` | 帯の結び方（5）本結び | gear | drawn | 柔道の帯の結び方、手順5。本結びで結ぶ。左を右の上に重ね、次に右を左の上に重ねる |
| `gear:obi-step-6` | 帯の結び方（6）仕上げ | gear | drawn | 柔道の帯の結び方、手順6。結び目を締め、両端の長さをそろえて垂らす。先端の下に、長さがそろっていることを示す印がある |
| `gear:yumi` | 弓道の弓 | gear | drawn | 上が長い非対称の長弓。弦を張り、握り革と籐巻きが付く |
| `gear:ya` | 弓道の矢 | gear | drawn | 弓道の矢。矢羽根、筈、矢尻が付く |
| `gear:karate-gi` | 空手衣 | gear | drawn | 白い空手衣を広げた姿。七分袖の軽い上衣、広いV字の襟と結び紐、まっすぐなズボン、本結びにした赤い帯 |

## sport

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `sport:nfl` | アメリカンフットボール | icon | ours |  |
| `sport:cfl` | カナディアンフットボール | icon | ours |  |
| `sport:ifaf` | 国際アメフト | icon | ours | 国際ルールのアメリカンフットボール |
| `sport:nhl` | アイスホッケー | icon | ours |  |
| `sport:nba` | バスケットボール | icon | ours |  |
| `sport:mlb` | 野球 | icon | ours |  |
| `sport:soccer` | サッカー | icon | ours |  |
| `sport:curling` | カーリングのストーン | icon | ours |  |
| `sport:tennis` | テニス | icon | ours |  |
| `sport:volleyball` | バレーボール | icon | ours |  |
| `sport:badminton` | シャトルコック | icon | ours |  |
| `sport:pickleball` | ピックルボールのパドル | icon | ours | ピックルボールのパドルとボール |
| `sport:tabletennis` | 卓球のラケット | icon | ours | 卓球のラケットとボール |
| `sport:padel` | パデルのラケットとボール | icon | ours |  |
| `sport:squash` | スカッシュのラケット | icon | ours | スカッシュのラケットとボール |
| `sport:racquetball` | ラケットボールのラケット | icon | ours | ラケットボールのラケットとボール |
| `sport:sepaktakraw` | セパタクローのボール | icon | ours | セパタクローの編み目のボール |
| `sport:teqball` | テックボールの台 | icon | ours | テックボールの湾曲した台とボール |
| `sport:roundnet` | ラウンドネット | icon | ours | ラウンドネットの円形ネット |
| `sport:netball` | ネットボールのゴール | icon | ours | ネットボールのボールとゴールリング |
| `sport:swimming` | 競泳の選手 | icon | ours |  |
| `sport:waterpolo` | 水球のボール | icon | ours |  |
| `sport:diving` | 飛込の選手 | icon | ours |  |
| `sport:artisticswimming` | 水面に上げた脚 | icon | ours | 水面に上げた脚（アーティスティックスイミング） |
| `sport:lacrosse` | ラクロスのスティック | icon | ours |  |
| `sport:rugby` | ラグビー | icon | ours |  |
| `sport:afl` | オーストラリアンフットボール | icon | ours | オーストラリアンフットボールのボール |
| `sport:gaelic` | ゲーリックフットボール | icon | ours | ゲーリックフットボールのボール |
| `sport:cricket` | クリケット | icon | ours |  |
| `sport:fieldhockey` | フィールドホッケー | icon | ours | フィールドホッケーのスティックとボール |
| `sport:handball` | ハンドボール | icon | ours | ボールを投げる手と、速さを表す線 |
| `sport:athletics` | 陸上競技のトラック | icon | ours |  |
| `sport:skating` | スケート靴 | icon | ours |  |
| `sport:sumo` | 相撲 | icon | ours | 仕切りの姿勢で向かい合う、廻しを締めた二人の力士 |
| `sport:kendo` | 剣道 | icon | ours | 剣道の面 |
| `sport:judo` | 柔道 | icon | ours | 柔道衣。手首まで届く袖と、右前に合わせた襟の上衣、本結びで二本の端を垂らした帯、ズボン |
| `sport:kyudo` | 弓道 | icon | ours | 弦を張った長弓と矢 |
| `sport:karate` | 空手 | icon | ours | 空手衣。七分袖で襟を広いV字に合わせた短めの上衣、本結びの帯、まっすぐなズボン |

## pennant

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `pennant:championship` | 優勝ペナント | flat | ours |  |
