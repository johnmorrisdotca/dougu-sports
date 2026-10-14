# ギャラリー

[README に戻る](../README.md) · 日本語 · [English](gallery.md)

パッケージに含まれるすべてのエンブレムを、グループごとに並べた一覧です（全 194 点）。画像はデモのギャラリーページで見られます。この一覧はそのテキスト版で、ビルド済みのパッケージから `scripts/make-gallery.mjs` が生成します（`pnpm gallery`）。

id は `<グループ>:<名前>` の形です。定数とインポートパスは id から決まるので、行ごとには書いていません。

- 定数は、id を大文字にし、`:` と `-` を `_` に置き換えたものです。`trophy:lidded-cup` → `TROPHY_LIDDED_CUP`。例外は 1 つだけで、`ball:squash` は `BALL_SQUASH_DOUBLE_YELLOW`（黄色い点が 2 つ付いたボール）です。
- 1 つだけインポートするときは、`@johnmorrisdotca/dougu-sports/<グループ>/<名前>` を指定します。`trophy:lidded-cup` → `@johnmorrisdotca/dougu-sports/trophy/lidded-cup`。award、trophy、medal、crest、sport、pennant は、すべてこの形でインポートできます。
- ball と gear は、ファミリーごとのモジュールにまとめてあり、1 つのファイルに複数のエンブレムが入っています。そのため、インポートのパスは `@johnmorrisdotca/dougu-sports/ball/ball.<ファイル>`（gear は `gear/gear.<ファイル>`）になります。ファミリーの名前は [layout.md](layout.md)（英語）に載っています（スカッシュのボールは `ball/ball.squash`）。上の定数は、パッケージのメインエントリからもインポートできます。

印刷パック（`puck:*`）は 1 つのファミリーモジュール `@johnmorrisdotca/dougu-sports/ball/ball.puck.print` にまとめてあり、`face` オプションを受け取ります（[pucks.ja.md](pucks.ja.md)）。

エンブレムのソース（元の画像）が入っているフォルダーは、[layout.md](layout.md)（英語）にまとめてあります。

## award

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `award:medal` | メダル | icon | ours |  |
| `award:badge` | バッジ | icon | ours |  |
| `award:crown` | 王冠 | icon | ours |  |
| `award:star` | 星 | icon | ours |  |
| `award:shield` | 盾 | icon | ours |  |

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
| `ball:teqball` | テックボール用ボール | ball | generated |  |
| `ball:basketball` | バスケットボール | ball | generated |  |
| `ball:basketball-6` | バスケットボール6号球 | ball | generated | バスケットボール（6号球） |
| `ball:basketball-3x3` | 3x3バスケットボール | ball | generated |  |
| `ball:baseball` | 野球のボール | ball | generated |  |
| `ball:softball` | ソフトボール | ball | generated |  |
| `ball:tennis` | テニスボール | ball | generated |  |
| `ball:padel` | パデルボール | ball | generated |  |
| `ball:sliotar` | シリター | ball | generated |  |
| `ball:volleyball` | バレーボール | ball | generated |  |
| `ball:volleyball-8` | バレーボール（8枚貼り） | ball | generated |  |
| `ball:beach-volleyball` | ビーチバレーボール | ball | generated |  |
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
| `gear:judogi` | 柔道衣 | gear | drawn | 柔道衣。上衣、ズボン、帯 |
| `gear:obi` | 武道の帯 | gear | drawn | 段級に応じた色の、結んだ帯（白から黒まで） |
| `gear:yumi` | 弓道の弓 | gear | drawn | 上が長い非対称の長弓。弦を張り、握り革と籐巻きが付く |
| `gear:ya` | 弓道の矢 | gear | drawn | 弓道の矢。矢羽根、筈、矢尻が付く |
| `gear:karate-gi` | 空手衣 | gear | drawn | 空手衣。上衣、ズボン、帯 |

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
| `sport:judo` | 柔道 | icon | ours | 柔道衣と帯 |
| `sport:kyudo` | 弓道 | icon | ours | 弦を張った長弓と矢 |
| `sport:karate` | 空手 | icon | ours | 握りしめた拳 |

## pennant

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `pennant:championship` | 優勝ペナント | flat | ours |  |
