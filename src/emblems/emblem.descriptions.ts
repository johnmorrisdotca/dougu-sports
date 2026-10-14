// The longer description of an emblem, for the docs and the gallery: what is drawn, in English and in Japanese. An emblem's own name (`en`, `ja`) is short, because it is also its accessible name (the `<title>`
// a screen reader reads), so what does not fit in a short name is here. An emblem with no entry is described well enough by its name.
import type { EmblemId } from "./emblem.ids.ts";

/** An emblem's description in the two languages. */
export interface EmblemDescription {
  readonly en: string;
  readonly ja: string;
}

const SOCCER_PANELS: Record<string, EmblemDescription> = {
  "": { en: "The 32-panel soccer ball", ja: "32枚貼りのサッカーボール" },
  "-26": { en: "The 26-panel soccer ball", ja: "26枚貼りのサッカーボール" },
  "-18": { en: "The 18-panel soccer ball", ja: "18枚貼りのサッカーボール" },
  "-14": { en: "The 14-panel soccer ball (6 propellers, 8 triangles)", ja: "14枚貼り（プロペラ形6枚、三角形8枚）のサッカーボール" },
  "-12": { en: "The 12-panel soccer ball", ja: "12枚貼りのサッカーボール" },
  "-6": { en: "The thermobonded 6-panel soccer ball", ja: "熱接着の6枚貼りサッカーボール" },
};

const SOCCER_COLOURS: Record<string, EmblemDescription> = {
  orange: { en: "in winter orange, a bright orange that shows against snow and in low light, with dark panels", ja: "雪の上や暗がりでも見やすい明るいオレンジ色で、暗い色のパネルが入る" },
  yellow: { en: "in high-visibility yellow, a fluorescent yellow that shows in low light, with dark panels", ja: "暗がりでも見やすい蛍光イエローで、暗い色のパネルが入る" },
};

/** The winter orange and high-visibility yellow balls of each construction: the construction's words and the colour's. */
function soccerColourways(): Partial<Record<EmblemId, EmblemDescription>> {
  const out: Partial<Record<EmblemId, EmblemDescription>> = {};
  for (const [suffix, panels] of Object.entries(SOCCER_PANELS)) {
    for (const [colour, words] of Object.entries(SOCCER_COLOURS)) out[`ball:soccer${suffix}-${colour}` as EmblemId] = { en: `${panels.en}, ${words.en}`, ja: `${panels.ja}。${words.ja}` };
  }
  return out;
}

export const EMBLEM_DESCRIPTIONS: Readonly<Partial<Record<EmblemId, EmblemDescription>>> = {
  "trophy:hockey-cup": { en: "Tall banded silver cup", ja: "帯を何段も重ねた背の高い銀のカップ" },
  "trophy:basketball": { en: "Basketball trophy", ja: "バスケットボールのトロフィー" },
  "trophy:football": { en: "Football trophy", ja: "アメリカンフットボールのトロフィー" },
  "trophy:soccer-ball": { en: "Soccer ball trophy", ja: "サッカーボールのトロフィー" },
  "trophy:tennis-cup": { en: "Two-handled cup with a pineapple", ja: "取っ手が二つあり、ふたにパイナップルの飾りが付いたカップ" },
  "sport:ifaf": { en: "American football, international rules", ja: "国際ルールのアメリカンフットボール" },
  "sport:pickleball": { en: "Pickleball paddle and ball", ja: "ピックルボールのパドルとボール" },
  "sport:tabletennis": { en: "Table tennis paddle and ball", ja: "卓球のラケットとボール" },
  "sport:squash": { en: "Squash racket and ball", ja: "スカッシュのラケットとボール" },
  "sport:racquetball": { en: "Racquetball racket and ball", ja: "ラケットボールのラケットとボール" },
  "sport:sepaktakraw": { en: "Woven ball", ja: "セパタクローの編み目のボール" },
  "sport:teqball": { en: "Curved table and ball", ja: "テックボールの湾曲した台とボール" },
  "sport:roundnet": { en: "Round net", ja: "ラウンドネットの円形ネット" },
  "sport:netball": { en: "Ball and hoop", ja: "ネットボールのボールとゴールリング" },
  "sport:artisticswimming": { en: "Raised legs", ja: "水面に上げた脚（アーティスティックスイミング）" },
  "sport:afl": { en: "Oval ball", ja: "オーストラリアンフットボールのボール" },
  "sport:gaelic": { en: "Round ball with seams", ja: "ゲーリックフットボールのボール" },
  "sport:fieldhockey": { en: "Hooked stick and ball", ja: "フィールドホッケーのスティックとボール" },
  "ball:basketball-6": { en: "Basketball, size 6", ja: "バスケットボール（6号球）" },
  "ball:cricket-pink": { en: "Cricket ball, pink", ja: "クリケットボール（ピンク）" },
  "ball:football": { en: "Football (NFL)", ja: "アメリカンフットボールのボール（NFL）" },
  "ball:football-cfl": { en: "Football (CFL)", ja: "カナディアンフットボールのボール（CFL）" },
  "ball:football-ifaf": { en: "Football (IFAF)", ja: "アメリカンフットボールのボール（IFAF）" },
  "ball:afl": { en: "Australian football", ja: "オーストラリアンフットボールのボール" },
  "ball:gaelic-football": { en: "Gaelic football", ja: "ゲーリックフットボールのボール" },
  "ball:squash": { en: "Squash ball, double yellow dot", ja: "スカッシュボール（ダブルイエロードット）" },
  "ball:squash-yellow": { en: "Squash ball, yellow dot", ja: "スカッシュボール（イエロードット）" },
  "ball:squash-green": { en: "Squash ball, green dot", ja: "スカッシュボール（グリーンドット）" },
  "ball:squash-red": { en: "Squash ball, red dot", ja: "スカッシュボール（レッドドット）" },
  "ball:squash-blue": { en: "Squash ball, blue dot", ja: "スカッシュボール（ブルードット）" },
  "ball:shuttlecock-feather": { en: "Shuttlecock, feather", ja: "シャトルコック（水鳥の羽根）" },
  "ball:shuttlecock-nylon": { en: "Shuttlecock, nylon", ja: "シャトルコック（ナイロン）" },
  "puck:canada": { en: "Black puck printed with our own flag of the Canadian pattern, CANADA under it and a red ring of words", ja: "黒いパックの天面に、独自に描いたカナダ風の旗とその下の CANADA の文字、縁には文字の入った赤い輪を印刷したもの" },
  "puck:canada-red": { en: "Black puck printed with a red face, a big white maple leaf of our own drawing, CANADA under it and a dark ring of words", ja: "黒いパックの天面に、赤地に白い大きなメープルの葉（独自の絵）、その下の CANADA の文字、縁には文字の入った暗い輪を印刷したもの" },
  "puck:canada-white": { en: "Black puck printed with a white face, red bands left and right, a big red maple leaf and CANADA under it", ja: "黒いパックの天面に、白地に左右の赤い帯、大きな赤いメープルの葉とその下の CANADA の文字を印刷したもの" },
  "puck:usa": { en: "Black puck printed with a disc of stars and stripes, USA lettered across it and a navy ring of words", ja: "黒いパックの天面に、星と縞模様の円盤、その上に大きく書いた USA の文字、縁には文字の入った紺の輪を印刷したもの" },
  "puck:usa-navy": { en: "Black puck printed with a navy face, a red ring with a white rim, five stars and USA in big white letters", ja: "黒いパックの天面に、紺地に白い細線にはさまれた赤い輪、5 つの星、大きな白い USA の文字を印刷したもの" },
  "puck:player": { en: "Black puck printed like a jersey: a made-up surname round the top, a big number and a gold ring", ja: "ジャージのように、縁の上側に沿った架空の姓、大きな背番号、金色の輪を印刷した黒いパック" },
  "puck:signed": { en: "The navy puck with a made-up gold marker signature across the face, drawn by a seeded pen and never a real person's hand", ja: "紺地のパックの天面に、金色のマーカーで書いたような架空のサインを重ねたもの（シード値から描くので、実在の人物の筆跡ではない）" },
  "puck:souvenir": { en: "A generic souvenir puck: a cream face, a navy ring of words you choose and a star, or your own picture", ja: "汎用の記念パック。クリーム色の地に、好きな文字を入れた紺の輪と星（または自分で用意した絵）" },
  "gear:hockey-stick": { en: "Hockey stick and puck", ja: "アイスホッケーのスティックとパック" },
  "gear:goalie-stick": { en: "Ice hockey goalie stick", ja: "アイスホッケーのゴーリーのスティック" },
  "gear:hockey-skate": { en: "Hockey skate", ja: "アイスホッケーのスケート靴" },
  "gear:field-hockey-stick": { en: "Field hockey stick and ball", ja: "フィールドホッケーのスティックとボール" },
  "gear:cricket-bat": { en: "Cricket bat and ball", ja: "クリケットのバットとボール" },
  "gear:table-tennis-paddle": { en: "Table-tennis paddle and ball", ja: "卓球のラケットとボール" },
  "gear:badminton-racket": { en: "Badminton racket and shuttlecock", ja: "バドミントンのラケットとシャトルコック" },
  "gear:football-helmet": { en: "Football helmet", ja: "アメリカンフットボールのヘルメット" },
  "gear:hurley": { en: "Hurley", ja: "ハーリー（ハーリングのスティック）" },
  "trophy:sumo-cup": { en: "A tall silver cup on a tall stepped stand, with an ornate phoenix-crested handle on each side", ja: "段のある高い台に載った、背の高い銀の杯。両側の取っ手に鳳凰の飾りが付く" },
  "trophy:championship-banner": { en: "A fringed banner on a pole with a gilt finial and an embroidered border, with no lettering unless some is given", ja: "金の先端飾りの付いた竿に掛けた、刺繍の縁と房の付いた旗。文字は指定したときだけ入る" },
  "sport:sumo": { en: "Two wrestlers in the crouch they face each other in at the start of a bout, with their belts", ja: "仕切りの姿勢で向かい合う、廻しを締めた二人の力士" },
  "sport:handball": { en: "A hand throwing the ball, with lines of speed", ja: "ボールを投げる手と、速さを表す線" },
  "sport:kendo": { en: "The kendo helmet", ja: "剣道の面" },
  "sport:judo": { en: "The judo suit and belt", ja: "柔道衣と帯" },
  "sport:kyudo": { en: "A long bow, its string and an arrow", ja: "弦を張った長弓と矢" },
  "sport:karate": { en: "A clenched fist", ja: "握りしめた拳" },
  "gear:gunbai": { en: "The sumo referee's war fan, with its tassel", ja: "行司が持つ軍配と、その房" },
  "gear:mawashi": { en: "The wrestler's belt, with the stiff cords that hang from its front", ja: "力士の廻しと、前に垂らした下がり" },
  "gear:shinai": { en: "The kendo practice sword: four bamboo staves with a leather tip, a tie and a hilt", ja: "剣道の竹刀。四つ割りの竹に先革、中結、柄が付く" },
  "gear:kendo-men": { en: "The kendo helmet: a steel grille, cloth flaps and a throat guard", ja: "剣道の面。面金、面布団、突き垂れが付く" },
  "gear:judogi": { en: "The judo suit: a jacket with crossed lapels, trousers and a belt", ja: "柔道衣。上衣、ズボン、帯" },
  "gear:obi": { en: "A tied belt in the colour of a rank, white to black", ja: "段級に応じた色の、結んだ帯（白から黒まで）" },
  "gear:yumi": { en: "The long asymmetric bow, held a third of the way up, with its string and wrapped grip", ja: "上が長い非対称の長弓。弦を張り、握り革と籐巻きが付く" },
  "gear:ya": { en: "A kyudo arrow with feather fletching, a nock and a steel point", ja: "弓道の矢。矢羽根、筈、矢尻が付く" },
  "gear:karate-gi": { en: "The karate suit: a jacket with crossed lapels, trousers and a belt", ja: "空手衣。上衣、ズボン、帯" },
  "ball:soccer-26": { en: "26 panels: 8 triangles and 18 squares, the faces of a rhombicuboctahedron", ja: "三角形8枚と正方形18枚の26枚貼り。斜方立方八面体の26面と同じ構成" },
  "ball:soccer-18": { en: "18 panels: three strips on each of the six faces of a cube, the strips of neighbouring faces square to each other", ja: "立方体の6面に3枚ずつ帯状のパネルを貼った18枚貼り。隣り合う面の帯は互いに直角" },
  "ball:soccer-14": { en: "14 panels: 6 propellers and 8 triangles, on a truncated cube whose 12 long edges are bent into S curves", ja: "プロペラ形6枚と三角形8枚の14枚貼り。切頂立方体の長い辺12本をS字に曲げた形" },
  "ball:soccer-12": { en: "12 panels: the 12 pentagons of a dodecahedron", ja: "正十二面体の五角形12枚で作った12枚貼り" },
  "ball:soccer-6": { en: "6 panels, thermobonded (glued, not stitched): six twisted gores with a few long curved seams, and a smooth look", ja: "縫わずに貼り合わせる熱接着の6枚貼り。ねじれた細長いパネル6枚が、長く曲がった数本の継ぎ目でつながり、表面はなめらか" },
  "ball:futsal": { en: "Futsal: size 4, 62 to 64 cm round, 400 to 440 g, low bounce; 32 panels, bright blue and white with a small yellow pentagon on each of the twelve", ja: "フットサル用の4号球。円周62〜64cm、重さ400〜440g、弾みにくい。32枚貼りで、明るい青と白の配色。12枚の五角形それぞれに、小さな黄色の五角形が入る" },
  "ball:beach-soccer": { en: "Beach soccer: size 5, 68 to 70 cm round, 400 to 440 g, soft (low pressure); the 14-panel propeller layout in bright yellow, orange and blue", ja: "ビーチサッカー用の5号球。円周68〜70cm、重さ400〜440g、空気圧が低くやわらかい。14枚貼りのプロペラ形で、黄色、オレンジ、青の明るい配色" },
  ...soccerColourways(),
};
