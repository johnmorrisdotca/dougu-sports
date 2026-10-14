# Gallery

[Back to the README](../README.md) · [日本語](gallery.ja.md) · English

Every emblem in the package, by group: 269 of them. The pictures are on the demo's gallery page; this list is the text of it, made by `scripts/make-gallery.mjs` from the built package (`pnpm gallery`).

Ids are `<group>:<name>`. The constant and the import follow from the id, so they are not repeated in every row:

- The constant is the id in capitals with `:` and `-` made `_`: `trophy:lidded-cup` → `TROPHY_LIDDED_CUP`. One id breaks it: `ball:squash` is `BALL_SQUASH_DOUBLE_YELLOW`, the double-yellow-dot ball.
- Import one alone from `@johnmorrisdotca/dougu-sports/<group>/<name>`: `trophy:lidded-cup` → `@johnmorrisdotca/dougu-sports/trophy/lidded-cup`. This holds for award, trophy, medal, crest, sport and pennant.
- Balls and gear are made in family modules, several to a file, so their import is `@johnmorrisdotca/dougu-sports/ball/ball.<file>` (or `gear/gear.<file>`), with the family named in [layout.md](layout.md) (the squash balls are in `ball/ball.squash`); the constant above is also exported from the main entry.

The printed pucks (`puck:*`) are made in one family module, `@johnmorrisdotca/dougu-sports/ball/ball.puck.print`, and take a `face` option ([pucks.md](pucks.md)).

The folders the art lives in are in [layout.md](layout.md).

## award

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `award:medal` | Medal | icon | ours |  |
| `award:badge` | Badge | icon | ours |  |
| `award:crown` | Crown | icon | ours |  |
| `award:star` | Star | icon | ours |  |
| `award:shield` | Shield | icon | ours |  |

## trophy

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `trophy:cup` | Cup | icon | ours |  |
| `trophy:lidded-cup` | Cup with a lid | lathe | ours |  |
| `trophy:bowl` | Bowl | lathe | ours |  |
| `trophy:salver` | Salver | lathe | ours |  |
| `trophy:globe` | Globe on a stand | lathe | ours |  |
| `trophy:hockey-cup` | Banded silver cup | lathe | ours | Tall banded silver cup |
| `trophy:basketball` | Basketball trophy | lathe | ours | Basketball trophy |
| `trophy:baseball` | Baseball trophy | lathe | ours |  |
| `trophy:football` | Football trophy | lathe | ours | Football trophy |
| `trophy:canadian-bowl` | Wide two-handled bowl | lathe | ours |  |
| `trophy:soccer-ball` | Soccer ball trophy | lathe | ours | Soccer ball trophy |
| `trophy:soccer-globe` | Globe on a column | lathe | ours |  |
| `trophy:tennis-plate` | Plate on a pedestal | lathe | ours |  |
| `trophy:tennis-cup` | Pineapple cup | lathe | ours | Two-handled cup with a pineapple |
| `trophy:cricket-urn` | Urn | lathe | ours |  |
| `trophy:rugby-cup` | Gilded cup with a lid | lathe | ours |  |
| `trophy:plaque` | Plaque | flat | ours |  |
| `trophy:belt` | Championship belt | flat | ours |  |
| `trophy:laurel` | Laurel wreath | flat | ours |  |
| `trophy:rosette` | Rosette with ribbons | flat | ours |  |
| `trophy:ring` | Championship ring | flat | ours |  |
| `trophy:banner` | Rafter banner | flat | ours |  |
| `trophy:sumo-cup` | Phoenix-handle cup | lathe | ours | A tall silver cup on a tall stepped stand, with an ornate phoenix-crested handle on each side |
| `trophy:championship-banner` | Championship banner | flat | ours | A fringed banner on a pole with a gilt finial and an embroidered border, with no lettering unless some is given |

## medal

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `medal:gold` | Gold medal | flat | ours |  |
| `medal:silver` | Silver medal | flat | ours |  |
| `medal:bronze` | Bronze medal | flat | ours |  |
| `medal:place-1` | First place badge | flat | ours |  |
| `medal:place-2` | Second place badge | flat | ours |  |
| `medal:place-3` | Third place badge | flat | ours |  |

## crest

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `crest:shield` | Shield crest | flat | ours |  |
| `crest:roundel` | Round crest | flat | ours |  |
| `crest:diamond` | Diamond crest | flat | ours |  |
| `crest:pennant` | Pennant crest | flat | ours |  |

## ball

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `ball:soccer` | Soccer ball | ball | generated |  |
| `ball:soccer-colour` | Soccer ball, coloured | ball | generated |  |
| `ball:soccer-26` | Soccer ball, 26 panels | ball | generated | 26 panels: 8 triangles and 18 squares, the faces of a rhombicuboctahedron |
| `ball:soccer-18` | Soccer ball, 18 panels | ball | generated | 18 panels: three strips on each of the six faces of a cube, the strips of neighbouring faces square to each other |
| `ball:soccer-14` | Soccer ball, 14 panels | ball | generated | 14 panels: 6 propellers and 8 triangles, on a truncated cube whose 12 long edges are bent into S curves |
| `ball:soccer-12` | Soccer ball, 12 panels | ball | generated | 12 panels: the 12 pentagons of a dodecahedron |
| `ball:soccer-6` | Soccer ball, 6 panels | ball | generated | 6 panels, thermobonded (glued, not stitched): six twisted gores with a few long curved seams, and a smooth look |
| `ball:soccer-orange` | Soccer ball, orange | ball | generated | The 32-panel soccer ball, in winter orange, a bright orange that shows against snow and in low light, with dark panels |
| `ball:soccer-26-orange` | Soccer 26 panels, orange | ball | generated | The 26-panel soccer ball, in winter orange, a bright orange that shows against snow and in low light, with dark panels |
| `ball:soccer-18-orange` | Soccer 18 panels, orange | ball | generated | The 18-panel soccer ball, in winter orange, a bright orange that shows against snow and in low light, with dark panels |
| `ball:soccer-14-orange` | Soccer 14 panels, orange | ball | generated | The 14-panel soccer ball (6 propellers, 8 triangles), in winter orange, a bright orange that shows against snow and in low light, with dark panels |
| `ball:soccer-12-orange` | Soccer 12 panels, orange | ball | generated | The 12-panel soccer ball, in winter orange, a bright orange that shows against snow and in low light, with dark panels |
| `ball:soccer-6-orange` | Soccer 6 panels, orange | ball | generated | The thermobonded 6-panel soccer ball, in winter orange, a bright orange that shows against snow and in low light, with dark panels |
| `ball:soccer-yellow` | Soccer ball, yellow | ball | generated | The 32-panel soccer ball, in high-visibility yellow, a fluorescent yellow that shows in low light, with dark panels |
| `ball:soccer-26-yellow` | Soccer 26 panels, yellow | ball | generated | The 26-panel soccer ball, in high-visibility yellow, a fluorescent yellow that shows in low light, with dark panels |
| `ball:soccer-18-yellow` | Soccer 18 panels, yellow | ball | generated | The 18-panel soccer ball, in high-visibility yellow, a fluorescent yellow that shows in low light, with dark panels |
| `ball:soccer-14-yellow` | Soccer 14 panels, yellow | ball | generated | The 14-panel soccer ball (6 propellers, 8 triangles), in high-visibility yellow, a fluorescent yellow that shows in low light, with dark panels |
| `ball:soccer-12-yellow` | Soccer 12 panels, yellow | ball | generated | The 12-panel soccer ball, in high-visibility yellow, a fluorescent yellow that shows in low light, with dark panels |
| `ball:soccer-6-yellow` | Soccer 6 panels, yellow | ball | generated | The thermobonded 6-panel soccer ball, in high-visibility yellow, a fluorescent yellow that shows in low light, with dark panels |
| `ball:futsal` | Futsal ball | ball | generated | Futsal: size 4, 62 to 64 cm round, 400 to 440 g, low bounce; 32 panels, bright blue and white with a small yellow pentagon on each of the twelve |
| `ball:beach-soccer` | Beach soccer ball | ball | generated | Beach soccer: size 5, 68 to 70 cm round, 400 to 440 g, soft (low pressure); the 14-panel propeller layout in bright yellow, orange and blue |
| `ball:soccer-1870-hand-stitched` | Soccer ball, hand-stitched | ball | generated | Late 1800s: eight long panels of worn tan leather sewn by hand with a visible cross of thread, and a button where they meet at each end |
| `ball:soccer-1900-laced` | Soccer ball, laced | ball | generated | 1900s: eight panels of brown leather, a round cap at each end, and a slit shut with a criss-crossed lace once the bladder was in |
| `ball:soccer-1930-18-panel` | Soccer ball, 18 strips | ball | generated | 1930s: 18 strips of chestnut and tan leather, six panels of three, the seams stitched |
| `ball:soccer-1950-12-panel` | Soccer ball, 12 panels | ball | generated | 1950s: 12 pentagons of chestnut leather in four tones, so that no two that touch match, the seams stitched |
| `ball:soccer-1960-32-panel-leather` | Soccer ball, 32 leather | ball | generated | 1960s: the 32 panels (12 pentagons and 20 hexagons) in leather, chestnut pentagons on tan hexagons, stitched along the seams |
| `ball:soccer-1970-black-white` | Soccer, 1970s black-white | ball | generated | In the style of the early-1970s match balls: 32 panels, black pentagons with a white ring and white hexagons with a pale dished centre and a dot |
| `ball:soccer-1978-triad` | Soccer, late-1970s triads | ball | generated | In the style of the late-1970s match balls: 32 panels, each hexagon carrying three bold curved triangles in a pinwheel, their points meeting round each pentagon |
| `ball:soccer-1986-decorated-triad` | Soccer, decorated triads | ball | generated | In the style of the 1980s match balls: the triads in clay red, each blade ornamented with a row of white beads, and dark pentagons ringed in gold |
| `ball:soccer-1998-coloured-triad` | Soccer, coloured triads | ball | generated | In the style of the 1990s match balls: the triads in blue, red and gold on white hexagons, with deep navy pentagons |
| `ball:soccer-2002-triangle-sweep` | Soccer, triangle sweep | ball | generated | In the style of the early-2000s match balls: long thin triangles that sweep across each hexagon in graphite, with gold sparks, over charcoal pentagons |
| `ball:soccer-2006-propeller` | Soccer, 14-panel propeller | ball | generated | In the style of the mid-2000s match balls: 14 panels (6 propellers and 8 triangles), a fine gold line inside each propeller and a gold mark on each dark triangle |
| `ball:soccer-2010-grooved` | Soccer, 8-panel grooved | ball | generated | In the style of the early-2010s match balls: 8 panels (an octahedron whose edges are bent into S curves) in white and teal, with deep dark grooves for seams and contour lines across each panel, dark teal on the white panels and white on the teal ones |
| `ball:soccer-2014-ribbon` | Soccer, 6-panel ribbons | ball | generated | In the style of the mid-2010s match balls: 6 twisted panels in white, crossed by wide ribbons in teal, orange and violet |
| `ball:soccer-2018-pixel` | Soccer, pixel blocks | ball | generated | In the style of the late-2010s match balls: 6 panels covered with square pixel blocks in graphite, grey, red and gold, thick on one side and thinning out |
| `ball:soccer-2022-speed-shell` | Soccer, 20-panel shell | ball | generated | In the style of the early-2020s match balls: 20 triangular panels (an icosahedron) in burgundy, cream and gold, each carrying nested outlines like a shell |
| `ball:soccer-training-high-vis` | Soccer, high-vis training | ball | generated | A modern high-visibility training ball: 32 panels in fluorescent yellow-green with hot pink pentagons ringed in black and three dark speed marks on each hexagon |
| `ball:soccer-stars-blue` | Soccer, stars, blue | ball | generated | A shop-wall pattern: a five-pointed star on every panel; the blue colourway |
| `ball:soccer-stars-red` | Soccer, stars, red | ball | generated | A shop-wall pattern: a five-pointed star on every panel; the red colourway |
| `ball:soccer-stars-night` | Soccer, stars, night | ball | generated | A shop-wall pattern: a five-pointed star on every panel; the gold on night blue colourway |
| `ball:soccer-hexagons-cyan` | Soccer, hexagons, cyan | ball | generated | A shop-wall pattern: two outlines inside each hexagon, one in the other, like a honeycomb, and solid pentagons; the cyan colourway |
| `ball:soccer-hexagons-magenta` | Soccer, hexagons, magenta | ball | generated | A shop-wall pattern: two outlines inside each hexagon, one in the other, like a honeycomb, and solid pentagons; the magenta colourway |
| `ball:soccer-hexagons-lime` | Soccer, hexagons, lime | ball | generated | A shop-wall pattern: two outlines inside each hexagon, one in the other, like a honeycomb, and solid pentagons; the lime colourway |
| `ball:soccer-flames-fire` | Soccer, flames, fire | ball | generated | A shop-wall pattern: five tongues of flame leaving each dark pentagon, an outer one and a lighter inner one; the fire: orange and yellow on black colourway |
| `ball:soccer-flames-ice` | Soccer, flames, ice | ball | generated | A shop-wall pattern: five tongues of flame leaving each dark pentagon, an outer one and a lighter inner one; the ice: blue and pale blue on navy colourway |
| `ball:soccer-flames-toxic` | Soccer, flames, toxic | ball | generated | A shop-wall pattern: five tongues of flame leaving each dark pentagon, an outer one and a lighter inner one; the toxic: green and yellow on deep purple colourway |
| `ball:soccer-chevrons-red` | Soccer, chevrons, red | ball | generated | A shop-wall pattern: eight gores from pole to pole, every other one coloured, crossed by three V-shaped bands that make a zigzag round the ball; the red and black colourway |
| `ball:soccer-chevrons-green` | Soccer, chevrons, green | ball | generated | A shop-wall pattern: eight gores from pole to pole, every other one coloured, crossed by three V-shaped bands that make a zigzag round the ball; the green and yellow colourway |
| `ball:soccer-chevrons-blue` | Soccer, chevrons, blue | ball | generated | A shop-wall pattern: eight gores from pole to pole, every other one coloured, crossed by three V-shaped bands that make a zigzag round the ball; the blue and orange colourway |
| `ball:soccer-swirl-blue` | Soccer, swirl, blue | ball | generated | A shop-wall pattern: four gores that twist round the ball, two in one colour and two in the other; the blue and white colourway |
| `ball:soccer-swirl-red` | Soccer, swirl, red | ball | generated | A shop-wall pattern: four gores that twist round the ball, two in one colour and two in the other; the red and black colourway |
| `ball:soccer-swirl-teal` | Soccer, swirl, teal | ball | generated | A shop-wall pattern: four gores that twist round the ball, two in one colour and two in the other; the orange and teal colourway |
| `ball:soccer-metallic-gold` | Soccer, metallic, gold | ball | generated | A shop-wall pattern: 32 panels in a polished metallic finish that mirrors the sky and the ground, a light metal on the hexagons and a dark one on the pentagons; the gold colourway |
| `ball:soccer-metallic-silver` | Soccer, metallic, silver | ball | generated | A shop-wall pattern: 32 panels in a polished metallic finish that mirrors the sky and the ground, a light metal on the hexagons and a dark one on the pentagons; the silver colourway |
| `ball:soccer-metallic-cobalt` | Soccer, metallic, cobalt | ball | generated | A shop-wall pattern: 32 panels in a polished metallic finish that mirrors the sky and the ground, a light metal on the hexagons and a dark one on the pentagons; the cobalt blue colourway |
| `ball:teqball` | Teqball ball | ball | generated |  |
| `ball:basketball` | Basketball | ball | generated |  |
| `ball:basketball-6` | Basketball, size 6 | ball | generated | Basketball, size 6 |
| `ball:basketball-3x3` | Basketball, 3x3 | ball | generated |  |
| `ball:baseball` | Baseball | ball | generated |  |
| `ball:softball` | Softball | ball | generated |  |
| `ball:baseball-lemon-peel` | Baseball, lemon-peel | ball | generated | The early lemon-peel ball of the 1850s and 1860s: a cover of four pieces and four lines of stitching that meet at two points, in aged leather with dark thread |
| `ball:baseball-red-blue` | Baseball, red and blue | ball | generated | The figure-8 seam stitched with alternate red and blue stitches, the American League's laces as a 1930s player remembered them |
| `ball:baseball-black-red` | Baseball, black and red | ball | generated | The figure-8 seam stitched with alternate black and red stitches, the National League's laces as a 1930s player remembered them |
| `ball:baseball-vintage-leather` | Baseball, aged leather | ball | generated | The figure-8 ball in aged leather the colour of tea, scuffed, with faded red thread |
| `ball:softball-11-optic` | Softball, 11 in, optic | ball | generated | The 11 in softball in optic yellow with red stitching: 27.9 cm round, 166.5 to 173.6 g (WBSC Slow Pitch rules) |
| `ball:tennis` | Tennis ball | ball | generated |  |
| `ball:padel` | Padel ball | ball | generated |  |
| `ball:sliotar` | Sliotar | ball | generated |  |
| `ball:volleyball` | Volleyball | ball | generated |  |
| `ball:volleyball-8` | Volleyball, 8 panels | ball | generated |  |
| `ball:beach-volleyball` | Beach volleyball | ball | generated |  |
| `ball:volleyball-colours` | Volleyball, three colours | ball | generated | The 18-panel indoor volleyball with panels in three colours of your own (the `colors` option); yellow, blue and white by default |
| `ball:volleyball-brazil` | Volleyball, Brazil | ball | generated | The 18-panel indoor volleyball in colours taken from the flag: green, yellow and blue. Colours only, no flag or mark is drawn |
| `ball:volleyball-japan` | Volleyball, Japan | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (white, red and a darker red), laid out so that it does not look like another country's: white, with one broad crimson band that runs round one side, across the front and over the top, and a darker red strip underneath. Colours only, no flag or mark is drawn |
| `ball:volleyball-canada` | Volleyball, Canada | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (red, white and a darker red), laid out so that it does not look like another country's: red, with a white stripe down the middle of the front and of the back, as the flag has its white pale, and a darker red on the top and the bottom. Colours only, no flag or mark is drawn |
| `ball:volleyball-usa` | Volleyball, USA | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (red, white and blue), laid out so that it does not look like another country's: a navy field on two opposite sides, as the flag has its blue canton, and red and white stripes on the other four faces. Colours only, no flag or mark is drawn |
| `ball:volleyball-italy` | Volleyball, Italy | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (green, white and red), laid out so that it does not look like another country's: green on one side, red on the opposite side, white on the top and the bottom, and green, white and red stripes across the front and the back. Colours only, no flag or mark is drawn |
| `ball:volleyball-poland` | Volleyball, Poland | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (white, red and a darker red), laid out so that it does not look like another country's: white above and red below, as the flag is cut: the ball stands on a corner, the three faces round the top are white and the three round the bottom red, each with a darker red strip in the middle. Colours only, no flag or mark is drawn |
| `ball:volleyball-france` | Volleyball, France | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (blue, white and red), laid out so that it does not look like another country's: three big fields in blue, white and red turning round a corner of the ball, each colour on two opposite faces. Colours only, no flag or mark is drawn |
| `ball:volleyball-serbia` | Volleyball, Serbia | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (red, blue and white), laid out so that it does not look like another country's: red above, blue in the middle and white below, as the flag's bands run: a red top, a white bottom, and blue across the front and the back. Colours only, no flag or mark is drawn |
| `ball:volleyball-netherlands` | Volleyball, Netherlands | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (red, white and blue), laid out so that it does not look like another country's: thin stripes of red, white and blue on every face of a ball standing on a corner. Colours only, no flag or mark is drawn |
| `ball:volleyball-germany` | Volleyball, Germany | ball | generated | The 18-panel indoor volleyball in colours taken from the flag (black, red and gold), laid out so that it does not look like another country's: black, red and gold as six big fields on a ball standing on a corner, each colour on two faces. Colours only, no flag or mark is drawn |
| `ball:cricket-red` | Cricket ball, red | ball | generated |  |
| `ball:cricket-white` | Cricket ball, white | ball | generated |  |
| `ball:cricket-pink` | Cricket ball, pink | ball | generated | Cricket ball, pink |
| `ball:football` | Football (NFL) | ball | generated | Football (NFL) |
| `ball:football-cfl` | Football (CFL) | ball | generated | Football (CFL) |
| `ball:football-ifaf` | Football (IFAF) | ball | generated | Football (IFAF) |
| `ball:rugby` | Rugby ball | ball | generated |  |
| `ball:afl` | Australian football | ball | generated | Australian football |
| `ball:gaelic-football` | Gaelic football | ball | generated | Gaelic football |
| `ball:netball` | Netball | ball | generated |  |
| `ball:pickleball-outdoor` | Pickleball, outdoor | ball | generated |  |
| `ball:pickleball-indoor` | Pickleball, indoor | ball | generated |  |
| `ball:squash` | Squash ball, 2 yellow dots | ball | generated | Squash ball, double yellow dot |
| `ball:squash-yellow` | Squash ball, yellow dot | ball | generated | Squash ball, yellow dot |
| `ball:squash-green` | Squash ball, green dot | ball | generated | Squash ball, green dot |
| `ball:squash-red` | Squash ball, red dot | ball | generated | Squash ball, red dot |
| `ball:squash-blue` | Squash ball, blue dot | ball | generated | Squash ball, blue dot |
| `ball:racquetball` | Racquetball | ball | generated |  |
| `ball:lacrosse` | Lacrosse ball | ball | generated |  |
| `ball:field-hockey` | Field hockey ball | ball | generated |  |
| `ball:table-tennis` | Table-tennis ball | ball | generated |  |
| `ball:handball` | Handball | ball | generated |  |
| `ball:water-polo` | Water polo ball | ball | generated |  |
| `ball:golf` | Golf ball | ball | generated |  |
| `ball:puck` | Hockey puck | ball | generated |  |
| `ball:curling-stone` | Curling stone | ball | generated |  |
| `ball:shot` | Shot | ball | generated |  |
| `ball:discus` | Discus | ball | generated |  |
| `ball:hammer` | Hammer | ball | generated |  |
| `ball:sepak-takraw` | Sepak takraw ball | ball | generated |  |
| `ball:roundnet` | Roundnet ball | ball | generated |  |
| `ball:shuttlecock-feather` | Shuttlecock, feather | ball | generated | Shuttlecock, feather |
| `ball:shuttlecock-nylon` | Shuttlecock, nylon | ball | generated | Shuttlecock, nylon |

## puck

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `puck:canada` | Canada flag puck | ball | generated | Black puck printed with our own flag of the Canadian pattern, CANADA under it and a red ring of words |
| `puck:canada-red` | Canada red puck | ball | generated | Black puck printed with a red face, a big white maple leaf of our own drawing, CANADA under it and a dark ring of words |
| `puck:canada-white` | Canada white puck | ball | generated | Black puck printed with a white face, red bands left and right, a big red maple leaf and CANADA under it |
| `puck:usa` | USA stripes puck | ball | generated | Black puck printed with a disc of stars and stripes, USA lettered across it and a navy ring of words |
| `puck:usa-navy` | USA navy puck | ball | generated | Black puck printed with a navy face, a red ring with a white rim, five stars and USA in big white letters |
| `puck:player` | Player number puck | ball | generated | Black puck printed like a jersey: a made-up surname round the top, a big number and a gold ring |
| `puck:signed` | Signed puck | ball | generated | The navy puck with a made-up gold marker signature across the face, drawn by a seeded pen and never a real person's hand |
| `puck:souvenir` | Souvenir puck | ball | generated | A generic souvenir puck: a cream face, a navy ring of words you choose and a star, or your own picture |

## gear

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `gear:hockey-stick` | Hockey stick and puck | gear | drawn | Hockey stick and puck |
| `gear:goalie-stick` | Goalie stick | gear | drawn | Ice hockey goalie stick |
| `gear:hockey-skate` | Hockey skate | gear | drawn | Hockey skate |
| `gear:goalie-mask` | Goalie mask | gear | drawn |  |
| `gear:goal-net` | Goal net | gear | drawn |  |
| `gear:field-hockey-stick` | Field hockey stick | gear | drawn | Field hockey stick and ball |
| `gear:lacrosse-stick` | Lacrosse stick and ball | gear | drawn |  |
| `gear:cricket-bat` | Cricket bat | gear | drawn | Cricket bat and ball |
| `gear:wicket` | Cricket wicket | gear | drawn |  |
| `gear:table-tennis-paddle` | Table-tennis paddle | gear | drawn | Table-tennis paddle and ball |
| `gear:badminton-racket` | Badminton racket | gear | drawn | Badminton racket and shuttlecock |
| `gear:tennis-racket` | Tennis racket and ball | gear | drawn |  |
| `gear:squash-racket` | Squash racket | gear | drawn |  |
| `gear:racquetball-racket` | Racquetball racket | gear | drawn |  |
| `gear:padel-racket` | Padel racket | gear | drawn |  |
| `gear:pickleball-paddle` | Pickleball paddle | gear | drawn |  |
| `gear:roundnet-set` | Roundnet set | gear | drawn |  |
| `gear:volleyball-net` | Volleyball net | gear | drawn |  |
| `gear:basketball-hoop` | Basketball hoop | gear | drawn |  |
| `gear:baseball-bat` | Baseball bat | gear | drawn |  |
| `gear:baseball-glove` | Baseball glove | gear | drawn |  |
| `gear:football-helmet` | Football helmet | gear | drawn | Football helmet |
| `gear:goalposts` | Goal posts | gear | drawn |  |
| `gear:hurley` | Hurley | gear | drawn | Hurley |
| `gear:curling-broom` | Curling broom | gear | drawn |  |
| `gear:figure-skate` | Figure skate | gear | drawn |  |
| `gear:speed-skate` | Speed skate | gear | drawn |  |
| `gear:diving-board` | Diving board | gear | drawn |  |
| `gear:swim-goggles` | Swim goggles | gear | drawn |  |
| `gear:starting-blocks` | Starting blocks | gear | drawn |  |
| `gear:relay-baton` | Relay baton | gear | drawn |  |
| `gear:javelin` | Javelin | gear | drawn |  |
| `gear:hurdles` | Hurdle | gear | drawn |  |
| `gear:gunbai` | Referee's war fan | gear | drawn | The sumo referee's war fan, with its tassel |
| `gear:mawashi` | Sumo belt | gear | drawn | The wrestler's belt, with the stiff cords that hang from its front |
| `gear:shinai` | Bamboo sword | gear | drawn | The kendo practice sword: four bamboo staves with a leather tip, a tie and a hilt |
| `gear:kendo-men` | Kendo helmet | gear | drawn | The kendo helmet: a steel grille, cloth flaps and a throat guard |
| `gear:judogi` | Judo suit | gear | drawn | The white judo suit laid flat: a jacket with long sleeves down to the wrist, thick stitched lapels crossed left over right and a quilted upper body, trousers with reinforced knees, and the belt tied in a flat knot |
| `gear:judogi-blue` | Blue judo suit | gear | drawn | The blue judo suit laid flat, in the blue the competition rules allow beside white |
| `gear:judogi-folded` | Folded judo suit | gear | drawn | The white judo suit folded into a neat rectangle, collar and lapel stitching on top, the belt tied round it |
| `gear:judogi-blue-folded` | Folded blue judo suit | gear | drawn | The blue judo suit folded into a neat rectangle, collar and lapel stitching on top, the belt tied round it |
| `gear:judogi-back` | Judo suit, back view | gear | drawn | The white judo suit laid flat and seen from behind: long sleeves down to the wrist, the collar, the belt crossed behind the waist, and the back number of international competitions sewn on 3 cm under the collar, a white patch with the family name in white capitals on a band, the country code under it and a blank space for the sponsor |
| `gear:judogi-blue-back` | Blue judo suit, back view | gear | drawn | The blue judo suit laid flat and seen from behind, with the back number of international competitions sewn on 3 cm under the collar: the family name on a band, the country code under it and a blank space for the sponsor |
| `gear:obi` | Belt | gear | drawn | A belt in the flat square knot: two layers round the waist and two equal ends hanging, black |
| `gear:obi-white` | White belt | gear | drawn | A white belt in the flat square knot, the first kyu belt |
| `gear:obi-yellow` | Yellow belt | gear | drawn | A yellow belt in the flat square knot |
| `gear:obi-orange` | Orange belt | gear | drawn | An orange belt in the flat square knot |
| `gear:obi-green` | Green belt | gear | drawn | A green belt in the flat square knot |
| `gear:obi-blue` | Blue belt | gear | drawn | A blue belt in the flat square knot |
| `gear:obi-brown` | Brown belt | gear | drawn | A brown belt in the flat square knot, the highest kyu belt |
| `gear:obi-kohaku` | Red and white belt | gear | drawn | The red and white belt of the 6th to 8th dan, in panels, in the flat square knot |
| `gear:obi-red` | Red belt | gear | drawn | The solid red belt of the 9th and 10th dan, in the flat square knot |
| `gear:obi-women` | Women's black belt | gear | drawn | A black belt with the white stripe down its middle that women wear in Japan |
| `gear:obi-white-yellow` | White and yellow belt | gear | drawn | A two-colour belt, white above and yellow below, between the white and yellow grades |
| `gear:obi-yellow-orange` | Yellow and orange belt | gear | drawn | A two-colour belt, yellow above and orange below, between the yellow and orange grades |
| `gear:obi-orange-green` | Orange and green belt | gear | drawn | A two-colour belt, orange above and green below, between the orange and green grades |
| `gear:obi-green-blue` | Green and blue belt | gear | drawn | A two-colour belt, green above and blue below, between the green and blue grades |
| `gear:obi-blue-brown` | Blue and brown belt | gear | drawn | A two-colour belt, blue above and brown below, between the blue and brown grades |
| `gear:obi-step-1` | Belt step 1: centre | gear | drawn | Step 1 of tying the judo belt: the middle of the belt is set against the middle of the belly, over the jacket of the judogi |
| `gear:obi-step-2` | Belt step 2: two wraps | gear | drawn | Step 2 of tying the judo belt: the belt is wrapped twice round the waist, and both ends come back to the front |
| `gear:obi-step-3` | Belt step 3: cross | gear | drawn | Step 3 of tying the judo belt: the two ends are crossed in front of the belly, the wearer's left end over the right one |
| `gear:obi-step-4` | Belt step 4: tuck under | gear | drawn | Step 4 of tying the judo belt: one end is brought up from below, under both layers of the belt round the waist |
| `gear:obi-step-5` | Belt step 5: square knot | gear | drawn | Step 5 of tying the judo belt: the flat square knot (hon-musubi), left over right and then right over left |
| `gear:obi-step-6` | Belt step 6: even ends | gear | drawn | Step 6 of tying the judo belt: the knot is pulled tight and both ends hang down even, with a mark under their tips |
| `gear:yumi` | Long bow | gear | drawn | The long asymmetric bow, held a third of the way up, with its string and wrapped grip |
| `gear:ya` | Arrow | gear | drawn | A kyudo arrow with feather fletching, a nock and a steel point |
| `gear:karate-gi` | Karate suit | gear | drawn | The white karate suit laid flat: a lighter jacket with three-quarter sleeves, a wide V of plain lapels and tie strings, straight trousers, and a red belt in a flat knot |

## sport

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `sport:nfl` | American football | icon | ours |  |
| `sport:cfl` | Canadian football | icon | ours |  |
| `sport:ifaf` | International football | icon | ours | American football, international rules |
| `sport:nhl` | Ice hockey | icon | ours |  |
| `sport:nba` | Basketball | icon | ours |  |
| `sport:mlb` | Baseball | icon | ours |  |
| `sport:soccer` | Soccer | icon | ours |  |
| `sport:curling` | Curling stone | icon | ours |  |
| `sport:tennis` | Tennis | icon | ours |  |
| `sport:volleyball` | Volleyball | icon | ours |  |
| `sport:badminton` | Shuttlecock | icon | ours |  |
| `sport:pickleball` | Pickleball paddle | icon | ours | Pickleball paddle and ball |
| `sport:tabletennis` | Table tennis paddle | icon | ours | Table tennis paddle and ball |
| `sport:padel` | Padel racket and ball | icon | ours |  |
| `sport:squash` | Squash racket | icon | ours | Squash racket and ball |
| `sport:racquetball` | Racquetball racket | icon | ours | Racquetball racket and ball |
| `sport:sepaktakraw` | Woven ball | icon | ours | Woven ball |
| `sport:teqball` | Curved table | icon | ours | Curved table and ball |
| `sport:roundnet` | Round net | icon | ours | Round net |
| `sport:netball` | Ball and hoop | icon | ours | Ball and hoop |
| `sport:swimming` | Swimmer | icon | ours |  |
| `sport:waterpolo` | Water polo ball | icon | ours |  |
| `sport:diving` | Diver | icon | ours |  |
| `sport:artisticswimming` | Raised legs | icon | ours | Raised legs |
| `sport:lacrosse` | Lacrosse stick | icon | ours |  |
| `sport:rugby` | Rugby | icon | ours |  |
| `sport:afl` | Oval ball | icon | ours | Oval ball |
| `sport:gaelic` | Round ball | icon | ours | Round ball with seams |
| `sport:cricket` | Cricket | icon | ours |  |
| `sport:fieldhockey` | Hooked stick | icon | ours | Hooked stick and ball |
| `sport:handball` | Handball | icon | ours | A hand throwing the ball, with lines of speed |
| `sport:athletics` | Running track | icon | ours |  |
| `sport:skating` | Ice skate | icon | ours |  |
| `sport:sumo` | Sumo | icon | ours | Two wrestlers in the crouch they face each other in at the start of a bout, with their belts |
| `sport:kendo` | Kendo | icon | ours | The kendo helmet |
| `sport:judo` | Judo | icon | ours | A judo suit: a jacket with sleeves down to the wrist and crossed lapels, a belt in a flat knot with two ends hanging, and trousers |
| `sport:kyudo` | Kyudo | icon | ours | A long bow, its string and an arrow |
| `sport:karate` | Karate | icon | ours | A karate suit: a short jacket with three-quarter sleeves and a wide V of lapels, a belt in a flat knot, and straight trousers |

## pennant

| Id | English | Kind | Source | Description |
| --- | --- | --- | --- | --- |
| `pennant:championship` | Championship pennant | flat | ours |  |
