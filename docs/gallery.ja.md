# ギャラリー

[README に戻る](../README.md) · 日本語 · [English](gallery.md)

パッケージに含まれるすべてのエンブレムを、グループごとに並べた一覧です（全 344 点）。画像はデモのギャラリーページで見られます。この一覧はそのテキスト版で、ビルド済みのパッケージから `scripts/make-gallery.ts` が生成します（`pnpm gallery`）。

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
| `trophy:paterson-cup` | パターソン・カップ | lathe | ours | パターソン・カップ。縁にまっすぐな彫刻の帯がある幅広の銀のボウルで、渦巻き形の耳状の取っ手が2つ付き、短い脚と濃い色の木の台座があります。1912年から、パシフィック・コースト・ホッケー協会の優勝チームに贈られました。 |
| `trophy:stanley-cup` | スタンレー・カップ | lathe | ours | 縁に滑らかな帯がある縦溝入りの広いボウル、玉飾りのある首、段状に広がる細い三つの輪、黒い台座にのった五段の帯の胴を描いています。ナショナル・ホッケー・リーグのプレーオフの優勝チームに贈られます（初授与は1893年）。 |
| `trophy:hart-trophy` | ハート賞 | lathe | ours | 金色の炎形の球が、長く先細りになる銀の軸の上にのり、その下にドーム形の鐘形と暗い色の八角形の台座が付いた姿を描いています。チームにとって最も価値の高い選手と評価された選手に贈られます。 |
| `trophy:vezina-trophy` | ベジーナ賞 | lathe | ours | 四本の柱を持つ銀の東屋が、ドームと暗い色の球の下にあり、広がった鐘形と、暗い赤色の木の段付きの台座にのっている姿を描いています。最も優れたゴールキーパーと評価された選手に贈られます。 |
| `trophy:norris-trophy` | ノリス賞 | lathe | ours | ふた付きの銀のボウルの上にどんぐり形の飾りがあり、節のある脚とドーム形の足の下に、明るい色の木の二段の八角形の台座がある姿を描いています。総合的に最も優れた能力を示したディフェンスマンに贈られます。 |
| `trophy:calder-trophy` | カルダー賞 | lathe | ours | 輪状の取っ手が二つ付き、結び目のある脚を持つ背の高い銀のカップが、銅の縁取りのある暗い色の木のブロック二つの上にのっている姿を描いています。最も優れた新人選手に贈られます。 |
| `trophy:presidents-trophy` | プレジデンツ・トロフィー | lathe | ours | 幅の広い浅い銀の皿の上にホッケースティックが二本交差して置かれ、細い三本の柱、暗い色のキャップ、暗い色の台座にのっている姿を描いています。レギュラーシーズンで最も成績の良かったチームに贈られます。 |
| `trophy:art-ross-trophy` | アート・ロス賞 | lathe | ours | 小さな脚付きのカップにのった広い銀のボウルが、赤茶色の木の背の高い四角錐の台座にのっている姿を描いています。台座は足元に向かって大きく広がっています。リーグのポイント首位の選手に贈られます。 |
| `trophy:lady-byng-trophy` | レディ・ビング賞 | lathe | ours | ふた付きの銀のカップに平らな耳形の取っ手が二つあり、節のある脚と広がった足を持ち、蜂蜜色の木のブロックにのっている姿を描いています。高い水準のプレーとともに最もスポーツマンシップに優れた選手に贈られます。 |
| `trophy:jennings-trophy` | ジェニングス賞 | lathe | ours | 広い銀のボウルが段付きの足にのり、その下に暗い赤色の木の三段の台座がある姿を描いています。最も失点の少なかったチームのゴールキーパーに贈られます（複数人の場合もあります）。 |
| `trophy:selke-trophy` | セルキー賞 | lathe | ours | 王冠をのせた銀のボウルに花飾りと輪形の取っ手があり、広がった足の下に暗い色の六角形の台座がある姿を描いています。守備プレーが最も優れたフォワードに贈られます。 |
| `trophy:king-clancy-trophy` | キング・クランシー賞 | lathe | ours | ふた付きで取っ手が二つある背の高い銀のカップが、節のある脚の上にあり、蜂蜜色の木の二段の丸い台座にのっている姿を描いています。氷上でも氷上以外でも最もリーダーシップを発揮し、人道的な貢献をした選手に贈られます。 |
| `trophy:masterton-trophy` | マスタートン賞 | lathe | ours | 金色の炎をいただく背の高い銀の円錐が二つ、丸い皿にのり、その下に蜂蜜色の木の八角形の台座がある姿を描いています。粘り強さ、スポーツマンシップ、ホッケーへの献身を最もよく示した選手に贈られます。 |
| `trophy:jack-adams-trophy` | ジャック・アダムス賞 | lathe | ours | 額に入った肖像の下に、渦巻き形の取っ手が付いた広がった形の銀の壺があり、大きなプレートのあるブロックと、幅の広い段状の木の台座にのっている姿を描いています。チームの成功に最も貢献したと評価されたヘッドコーチに贈られます。 |
| `trophy:prince-of-wales-trophy` | ウェールズ杯 | lathe | ours | 背の高い広がった形の銀の花瓶に幅広のふたと羽根飾りのつまみがあり、スティック形の三本の脚が透明なクリスタルを囲んで支え、暗い色の八角形の台座にのっている姿を描いています。イースタン・カンファレンスの優勝チームに贈られます。 |
| `trophy:campbell-bowl` | キャンベル・ボウル | lathe | ours | ふた付きで取っ手が二つある銀のボウルに大きな渦巻き形の取っ手があり、暗い色の六角形の台座にのっている姿を描いています。ウェスタン・カンファレンスの優勝チームに贈られます。 |
| `trophy:rocket-richard-trophy` | モーリス・リシャール賞 | lathe | ours | 透き通った琥珀色の幅広く広がった漏斗の中に金色のスケーターが立ち、銀の環の付いた暗い色の先細りの台座にのっている姿を描いています。レギュラーシーズンで最も多くのゴールを決めた選手に贈られます。 |
| `trophy:conn-smythe-trophy` | コーン・スマイス賞 | lathe | ours | 銀の建物から銀のカエデの葉が扇状に立ち上がり、蜂蜜色の木の段が刳り形のある足元に向かって広がっている姿を描いています。プレーオフで最も価値の高かった選手に贈られます。 |
| `trophy:ted-lindsay-award` | テッド・リンゼイ賞 | lathe | ours | スティックを持つ青銅のスケーターがピンの上に立ち、その下に背の高い黒い六角形の柱と、広がった銀の台座がある姿を描いています。選手たちの投票で選ばれる、最も傑出した選手に贈られます。 |
| `trophy:lester-patrick-trophy` | レスター・パトリック賞 | lathe | ours | 青銅の男性像が、赤みがかった木の背の高い四角い台座の上に、くつろいだ姿勢で立っている姿を描いています。アメリカでのホッケーに対する傑出した貢献をした人々に贈られます。 |
| `trophy:lombardi-trophy` | ロンバルディ・トロフィー | lathe | ours | ロンバルディ・トロフィーは、銀色のフットボールが、足元に向かって広がる背の高い三角柱の台の上に斜めに載った姿を描いています。NFLの優勝決定戦、スーパーボウルの優勝チームに贈られます。 |
| `trophy:larry-obrien-trophy` | ラリー・オブライエン・トロフィー | lathe | ours | 2022年に新しくなったラリー・オブライエン・トロフィーは、銀色の溝状の縫い目をもつ金色のバスケットボールが、上に向かって広がる背の高い金色の花瓶の縁の手前に載り、花瓶には銀色のひし形の網目が刻まれ、重なった2枚の金色の円盤の上に立つ姿を描いています。NBAファイナルの優勝チームに贈られます。 |
| `trophy:commissioners-trophy` | MLB優勝トロフィー | lathe | ours | コミッショナーズ・トロフィーは、30本の細い支柱が、それぞれ金色のペナントを付けて輪になり、輪の上端は後ろが高く手前が低く、幅広い丸い銀色の台の上に立つ姿を描いています。ワールドシリーズの優勝チームに贈られます。 |
| `trophy:grey-cup` | グレイカップ | lathe | ours | グレイカップは、持ち手が2つで渦巻き模様の脚をもつ銀色のカップが、暗い帯の入った12面の背の高い広がる円錐形の台の上に載った姿を描いています。カナディアン・フットボール・リーグの優勝決定戦に勝ったチームに贈られます。 |
| `trophy:cy-young-award` | サイ・ヤング賞 | flat | ours | サイ・ヤング賞は、暗い色の飾り板に、曲線を描く銀色の帯とV字、銘板の上で野球のボールを握る手をあしらった姿を描いています。各リーグの最優秀投手に贈られます。 |
| `trophy:mlb-mvp-award` | 野球のMVP賞 | flat | ours | MVP賞は、銀色の輪とダイヤモンド、金色のメダリオン、銘板、交差した2本のバットを配した、暗い色の八角形の飾り板を描いています。各リーグの最優秀選手に贈られます。 |
| `trophy:relief-man-award` | リリーフマン賞 | lathe | ours | リリーフマン賞は、金色の盾を付けた銀色の消防ヘルメットが、短いクロームの支柱の上に載り、真鍮の銘板を付けたクルミ材の角柱と、段のあるクルミ材の台の上に立つ姿を描いています。1976年から2012年まで、各リーグの最優秀救援投手に贈られました。 |
| `trophy:hank-aaron-award` | ハンク・アーロン賞 | flat | ours | ハンク・アーロン賞は、ホームベースの形に削り出したマホガニーの台に、灰色の金属の面、左上がりに置かれたバット、その上に重なる2本のリボンをあしらった姿を描いています。各リーグの最優秀打者に贈られます。 |
| `trophy:bill-russell-trophy` | ビル・ラッセル・トロフィー | lathe | ours | ビル・ラッセル・トロフィーは、銀色の溝状の縫い目をもつ金色のバスケットボールが、銀色の網目を刻んだ背の高い金色のラッパ形の台の口に収まり、台は細いくびれへとすぼまってから二段の丸い足へと広がる姿を描いています。NBAファイナルの最優秀選手(ファイナルMVP)に贈られます。 |
| `trophy:nba-western-conference-2001` | ウェスタン・カンファレンス・トロフィー | lathe | ours | 2001年から2021年までのウェスタン・カンファレンス優勝トロフィーは、溝のある縫い目と細かなざらつきをもつ銀色のバスケットボールが、交差する金色の帯に載り、上が黒く下に向かって広がる磨かれた銀色のすそをもつ丸い土台に立つ姿を描いています。ウェスタン・カンファレンスの優勝チームに贈られました。 |
| `trophy:nba-eastern-conference-2001` | イースタン・カンファレンス・トロフィー | lathe | ours | 2001年から2021年までのイースタン・カンファレンス優勝トロフィーは、溝のある縫い目と細かなざらつきをもつ淡いつや消しの銀色のバスケットボールが、3本の細い金色の支柱に載り、磨かれた銀色の板と胴をもつ黒い丸い土台に立つ姿を描いています。イースタン・カンファレンスの優勝チームに贈られました。 |
| `trophy:oscar-robertson-trophy` | オスカー・ロバートソン・トロフィー | lathe | ours | オスカー・ロバートソン・トロフィーは、溝のある縫い目をもつ大きな銀色のバスケットボールが、交差する金色の帯の受け台に収まり、小さな金色のドームの上に載り、黒い輪、細い金色の帯、広がった黒い胴、背の高い金色のすそ、黒い足が重なる丸い土台に立つ姿を描いています。ウェスタン・カンファレンスの優勝チームに贈られます。 |
| `trophy:bob-cousy-trophy` | ボブ・クージー・トロフィー | lathe | ours | ボブ・クージー・トロフィーは、溝のある縫い目をもつ大きな銀色のバスケットボールが、小さな金色の皿の上の3本の細い金色の支柱に載り、金色の板、黒い3段、背の高い金色の胴、黒い足が重なる丸い土台に立つ姿を描いています。イースタン・カンファレンスの優勝チームに贈られます。 |
| `trophy:magic-johnson-trophy` | マジック・ジョンソン・トロフィー | lathe | ours | マジック・ジョンソン・トロフィーは、溝のある縫い目をもつ銀色のバスケットボールが、交差する帯の小さな金色の受け台に収まり、ひし形の網目を刻んだ背の高い金色のラッパ形の台の上に載り、台は黒い輪、金色の帯、黒い足の上に立つ姿を描いています。ウェスタン・カンファレンス・ファイナルの最優秀選手に贈られます。 |
| `trophy:larry-bird-trophy` | ラリー・バード・トロフィー | lathe | ours | ラリー・バード・トロフィーは、溝のある縫い目をもつ銀色のバスケットボールが、小さな金色の皿の上の3本の細い金色の支柱に載り、ひし形の網目を刻んだ背の高い金色のラッパ形の台の上に載り、台は黒い輪、金色の帯、黒い足の上に立つ姿を描いています。イースタン・カンファレンス・ファイナルの最優秀選手に贈られます。 |
| `trophy:larry-obrien-trophy-1977` | ラリー・オブライエン・トロフィー(旧デザイン) | lathe | ours | 2021年までのラリー・オブライエン・トロフィーは、表面のなめらかな金色のバスケットボールが、上に向かって広がる金色の花瓶の縁の手前に載り、花瓶の下半分には網目が刻まれ、黒い輪と平らな四角い金色の台座の上に立つ姿を描いています。NBAファイナルの優勝チームに贈られます。 |
| `trophy:walter-cup` | ウォルター・カップ | lathe | ours | ウォルター・カップは、脚付きの幅広く浅い銀色のボウルが、スティック形の背の高い2枚のブレードの間に立ち、重厚な丸い台の上に載った姿を描いています。プロフェッショナル・ウィメンズ・ホッケー・リーグ(PWHL)の優勝チームに贈られます。 |
| `trophy:wnba-championship-trophy` | WNBA優勝トロフィー | lathe | ours | WNBA優勝トロフィーは、銀色のバスケットボールを、斜めに伸びる2本の管が支え、低い板状の台に載った姿を描いています。WNBAファイナルの優勝チームに贈られます。 |
| `trophy:lamar-hunt-trophy` | ハント・トロフィー | lathe | ours | ラマー・ハント・トロフィーは、磨いた銀色の、中が透けたフットボールが先端で後ろへ傾いて立つ姿を描いています。手前には紐を通す切れ込みのある帯があり、後ろには曲がった二本の帯があって、裾の広がった丸い銀色の台と黒い土台の上に載っています。アメリカン・フットボール・カンファレンス(AFC)の優勝チームに贈られます。 |
| `trophy:george-halas-trophy` | ハラス・トロフィー | lathe | ours | ジョージ・ハラス・トロフィーは、磨いた銀色の、中が透けたフットボールが先端で後ろへ傾いて立つ姿を描いています。手前には紐を通す切れ込みのある帯があり、後ろには曲がった二本の帯があって、裾の広がった丸い銀色の台と黒い土台の上に載っています。ナショナル・フットボール・カンファレンス(NFC)の優勝チームに贈られます。 |
| `trophy:silver-slugger-award` | シルバースラッガー賞 | flat | ours | シルバースラッガー賞は、背の高い黒い板を銀色のバットが横切り、楕円のバッジと銘板が付いた姿を描いています。各リーグの各ポジションで最も優れた打者に贈られます。 |
| `trophy:world-series-mvp-trophy` | ワールドシリーズMVP賞 | lathe | ours | ワールドシリーズMVP賞は、ねじれた銀色の炎が、暗い帯の入った幅広い丸い台の上に立つ姿を描いています。ワールドシリーズで最も活躍した選手に贈られます。 |
| `trophy:avco-world-trophy` | アブコ・トロフィー | lathe | ours | アブコ・ワールド・トロフィー。銀の玉が入ったガラスの筒の上に、脚付きの広い銀のボウルをのせ、輪のついた首の部分、銀の板をはめた背の高い黒い筒、広い銀の台座を描いています。ワールド・ホッケー・アソシエーション（WHA）の優勝チームに贈られます。 |
| `trophy:obrien-cup` | オブライエン・カップ | flat | ours | 長い暗色の台の上に、暗色のブロックにのせた針金の取っ手つきの浅く広い金色のボウルと、その両脇に立つブロンズのスケート選手二人を描いています。ナショナル・ホッケー・アソシエーション（NHA）と、のちに発足当初のナショナル・ホッケー・リーグ（NHL）の優勝チームに贈られます。 |
| `trophy:gold-glove-award` | ゴールデングラブ賞 | flat | ours | 木の土台の上の台座に、金色の野球のグラブと、その両脇に金色の野球ボール二つを描いています。MLBで、各リーグのポジションごとに最も守備の優れた選手に贈られます。 |
| `trophy:fifa-world-cup` | FIFAワールドカップ | lathe | ours | 金色の地球を、らせん状にのびる2人の人物が掲げる姿を、マラカイトグリーンの帯と金色の帯の台座の上に描いています。男子のFIFAワールドカップの優勝チームに贈られます。 |
| `trophy:woodlawn-vase` | ウッドローン・ヴェース | lathe | ours | 非常に背の高い、段のある銀の花瓶を描いています。幅広い胴には彫金の装飾があり、渦巻き形の取っ手が二つ付いて、くびれた軸と丸い台座の上に立っています。米国三冠の第2戦、プリークネスステークスの優勝馬に贈られます。 |
| `trophy:dfb-pokal` | DFBポカール | lathe | ours | 帯が胴を一周する背の高い金色のカップを描いています。細くくびれた軸と、輪の装飾がある台座があります。ドイツのカップ戦、DFBポカールの優勝クラブに贈られます。 |
| `trophy:champions-league-trophy` | CLトロフィー | lathe | ours | UEFAチャンピオンズリーグ・トロフィー。長い取っ手が二つ輪を描く、背の高い銀の壺を描いています。UEFAチャンピオンズリーグの優勝クラブに贈られます。 |
| `trophy:webb-ellis-cup` | ウェブ・エリス・カップ | lathe | ours | 金色のふた付きカップを描いています。取っ手が二つあり、ふたの上にパイナップル形の飾りが付いて、丸い台座に載っています。男子のラグビーワールドカップの優勝チームに贈られます。 |
| `trophy:fa-cup` | FAカップ | lathe | ours | ふた付きの背の高い銀のカップを描いています。耳形の渦巻きの取っ手、丸い胴、広い台座があります。イングランド最古のカップ戦、FAカップの優勝クラブに贈られます。 |
| `trophy:cricket-world-cup` | クリケットW杯 | lathe | ours | クリケット・ワールドカップ。銀の輪に収まった金色の地球を、弧を描く4本の銀の帯が支え、その下に銀の円盤をちりばめた黒いドームがある姿を描いています。男子のクリケット・ワールドカップの優勝チームに贈られます。 |
| `trophy:wimbledon-gentlemens-trophy` | ウィンブルドン男子 | lathe | ours | ウィンブルドン男子シングルス優勝杯。パイナップルの飾りが付いた、金色のふた付きカップを描いています。取っ手が二つあり、背の高い丸い台座に載っています。ウィンブルドン選手権の男子シングルスの優勝者に贈られます。 |
| `trophy:venus-rosewater-dish` | ウィンブルドン女子 | flat | ours | ヴィーナス・ローズウォーター・ディッシュ。正面から見た、幅広い丸い銀の大皿を描いています。何重もの輪の装飾と、中央の丸い飾り（ボス）があります。ウィンブルドン選手権の女子シングルスの優勝者に贈られます。 |
| `trophy:ballon-dor` | バロンドール | lathe | ours | 黒いドーム形の台座に載った金色のサッカーボールを描いています。年間で最も優れたサッカー選手に贈られます。 |
| `trophy:ashes-urn` | アッシズの壺 | lathe | ours | テラコッタの小さな壺を描いています。四角い取っ手が付き、旋盤で削り出した木の台に載っています。イングランドとオーストラリアが戦うアッシズ・シリーズの象徴として、ローズ・クリケット・グラウンドに保管されています。 |
| `trophy:borg-warner-trophy` | ボルグ・ワーナー | lathe | ours | ボルグ・ワーナー・トロフィー。先細りの非常に背の高い銀の本体に顔のレリーフが並び、頂にチェッカーフラッグを持つ人物が立つ姿を、ドラム形の台座の上に描いています。インディ500の優勝者に贈られます。 |
| `trophy:americas-cup` | アメリカズカップ | lathe | ours | 注ぎ口の付いた背の高い銀の水差しを描いています。幅広く丸い胴と大きならせん形の取っ手があり、段になった台座の上に載っています。ヨットレースのアメリカズカップの優勝チームに贈られます。 |
| `trophy:calder-cup` | カルダー・カップ | lathe | ours | カルダー・カップは、縁に月桂樹の葉の帯をめぐらせ、持ち手が2つある銀色のボウルが、こぶのある脚の上に載る姿を描いています。脚は鐘の形に広がり、黒い丸い台座と、板をはめた2段の黒い角台の上に立っています。アメリカン・ホッケー・リーグ（AHL）の優勝チームに贈られます。 |
| `trophy:kelly-cup` | ケリー・カップ | lathe | ours | ケリー・カップは、口縁の下に細い輪を2本めぐらせ、持ち手が2つある小さな銀色のカップが、銀で縁取った板の帯を巻いた3段の黒い円筒の台座の上に立つ姿を描いています。下の段ほど幅が広くなっています。ECHLの優勝チームに贈られます。 |
| `trophy:cfp-trophy` | CFPトロフィー | lathe | ours | CFPトロフィーは、縁が金色で縦に立てた黒いフットボールが、背の高い細い金色の柱の上に載る姿を描いています。柱は上へ細くすぼまって小さな受け皿になり、板の帯を巻いた黒い円筒の台座の上に立っています。カレッジフットボール・プレーオフの全米王者に贈られます。 |
| `trophy:mls-cup` | MLSカップ | lathe | ours | MLSカップは、金色の縁をもつ背の高い銀色のゴブレットが、裾の広がった丸い台座の上に載る姿を描いています。ゴブレットの杯部は脚に向かってなだらかにすぼまり、台座には濃い色の溝が1本刻まれています。脚から立ち上がる溝入りの4枚の羽根状の飾りが、外側へ広がりながら上へ伸び、縁を越えてから内側へ巻いています。メジャーリーグサッカー（MLS）のプレーオフの優勝クラブに贈られます。 |
| `trophy:foundation-player-award` | NHL財団選手賞 | lathe | ours | 背の高い透明なクリスタルのブロックを描いています。高さは幅の2倍強あり、正面には上の両角から下の中央近くまで伸びる、細長いV字のカット面が2つあります。ホッケーの価値観を生かして、暮らす地域の人々の生活を最も豊かにした選手に贈られます。 |
| `trophy:messier-leadership-award` | メシエ・リーダーシップ賞 | lathe | ours | 磨いた銀の切り抜きの選手が、スティックを右の低い位置に構え、スケーティングする姿を描いています。その後ろに同じ切り抜きが、奥へ少しずつずれながら重なっています。台座は黒い2段で、銀の銘板と、何列も並ぶ小さな銀のユニフォームがあります。氷上でも氷の外でも、最もリーダーシップを発揮した選手に贈られます。 |

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
| `ball:plastic-baseball-slotted` | 野球の穴あき練習球 | ball | generated | 中空の白いプラスチック製の野球練習球。半球の一方に細長い穴が8つ並び、もう一方には穴がない |
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
| `gear:baseball-cap` | 野球帽 | gear | drawn | 野球帽を斜め前から描いています。頭頂のボタン、縫い目、3つのはと目のあるドーム形のクラウンと、縁と何列もの縫い目のある湾曲したつばが見えます。 |
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
| `sport:mma` | 総合格闘技 | icon | ours | 上から見た総合格闘技のケージ。ひし形の金網に囲まれた八角形の床 |
| `sport:boxing` | ボクシング | icon | ours | ボクシンググローブ。親指を添えた丸いこぶしと、指の折り目、バンドの付いた袖口 |
| `sport:wrestling` | レスリング | icon | ours | マットの円の上で組み合う二人のレスラー。互いの肩に手をかけ、膝を曲げて構える |
| `sport:prowrestling` | プロレス | icon | ours | 角から見たプロレスのリング。キャンバス、四隅のコーナーポストとその間に張った三本のロープ、エプロン |

## pennant

| Id | 日本語 | 種類 | 出どころ | 説明 |
| --- | --- | --- | --- | --- |
| `pennant:championship` | 優勝ペナント | flat | ours |  |
