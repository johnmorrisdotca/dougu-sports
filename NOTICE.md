# Notice: where the art comes from

The code of this package is under the MIT licence (see [LICENSE](LICENSE) and [LICENSES/MIT.txt](LICENSES/MIT.txt)). Every emblem is either drawn for this package (`source: "ours"`, `"generated"` or `"drawn"` in `emblemInfo`) or made from one of the sources below, and each emblem made from a source has a row in the second table. The licence text of each source is in [LICENSES/](LICENSES/).

No emblem carries the name, mark or logo of a league, a team, a federation or an event: the trophies, crests and balls are descriptive and generic.

## The sources the art may come from

| Source | What it is | Licence | Text kept in | Credit it asks for |
| --- | --- | --- | --- | --- |
| Material Symbols, Google (https://fonts.google.com/icons) | Icons as paths | Apache License 2.0 | [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt) | None required; named here |
| Noto Emoji and Noto Color Emoji, Google (https://github.com/googlefonts/noto-emoji) | Emoji drawings | Apache License 2.0 (the emoji; the fonts are under the SIL OFL 1.1, and none is used) | [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt) | None required; named here |
| Material Design Icons, Pictogrammers (https://pictogrammers.com/library/mdi/) | Icons as paths | Apache License 2.0 | [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt) | None required; named here |
| game-icons.net (https://game-icons.net/) | Icons by many authors | Creative Commons Attribution 3.0 | [LICENSES/CC-BY-3.0.txt](LICENSES/CC-BY-3.0.txt) | The author of each icon, with a link to the licence, and a note that it was changed |
| Drawn for this package | Everything marked `ours` | MIT | [LICENSES/MIT.txt](LICENSES/MIT.txt) | None |

## The emblems made from a source

Sixteen emblems are Material Symbols (Google, Apache License 2.0), fetched at a pinned commit by `scripts/fetch-material-symbols.mjs` (`src/emblems/emblem.material.data.ts` is its output) and not changed, except that the metal style paints the filled symbol with a gradient and a darker edge, and the line style draws the outlined symbol. The package has no runtime dependency on them. Copyright Google LLC; the licence text is [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt).

| Emblem | Made from | Author | How it was changed | Licence |
| --- | --- | --- | --- | --- |
| `trophy:cup` | Material Symbols `emoji_events` | Google | Painted by the metal style | Apache-2.0 |
| `award:medal` | Material Symbols `military_tech` | Google | Painted by the metal style | Apache-2.0 |
| `award:badge` | Material Symbols `workspace_premium` | Google | Painted by the metal style | Apache-2.0 |
| `award:crown` | Material Symbols `crown` | Google | Painted by the metal style | Apache-2.0 |
| `award:star` | Material Symbols `star` | Google | Painted by the metal style | Apache-2.0 |
| `award:shield` | Material Symbols `shield` | Google | Painted by the metal style | Apache-2.0 |
| `sport:nfl`, `sport:cfl`, `sport:ifaf` | Material Symbols `sports_football` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:nhl` | Material Symbols `sports_hockey` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:nba` | Material Symbols `sports_basketball` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:mlb` | Material Symbols `sports_baseball` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:soccer` | Material Symbols `sports_soccer` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:tennis` | Material Symbols `sports_tennis` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:volleyball` | Material Symbols `sports_volleyball` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:cricket` | Material Symbols `sports_cricket` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:rugby` | Material Symbols `sports_rugby` | Google | Drawn in the page's ink | Apache-2.0 |
| `sport:handball` | Material Symbols `sports_handball` | Google | Drawn in the page's ink | Apache-2.0 |

The other trophies, the medals, the place badges, the crests, the other sport pictograms and every ball are drawn for this package, under its MIT licence. The trophies are drawn in SVG by hand in a simplified, generic form; no real trophy, medal, logo, mark or engraving was copied or traced, and no photograph was traced (photographs were looked at, never copied).

## The balls and the gear

The balls (`src/emblems/ball/`) are drawn by this package's own code: a rotation, a projection and our own geometry (a seam curve, the truncated icosahedron, a layout of curved panels, a fitted basketball channel). No picture is copied for them. The sizes they carry (`size` on each ball: the diameter or length, the circumference and the mass, with the rule they come from) are facts read from the rulebooks listed below; no text, table or drawing of a rulebook is copied.

Some of the gear (`src/emblems/gear/`) is drawn by us (22 pieces: rackets, sticks, skates, the athletics and pool gear, the nets and posts: `source: "drawn"`). The rest is copied, with changes, from the open artwork below, each module naming its source, its pinned version and the SHA-256 of the file as published in its header, and each drawing carrying its credit in a `<desc>`. The changes are the ones the Apache-2.0 licence asks to have marked: the editors' wrappers and metadata removed, the coordinates written absolute and rounded, the ids renamed; for the glove, the black background square left out and the shape filled with leather and shaded; for the goalie mask, a pale face laid under the ink. `scripts/dougu/fetch-gear.mjs` fetches the files again from the pinned versions and checks their hashes; `scripts/dougu/build-gear.mjs` writes the modules from them. The full licence texts are in [LICENSES/](LICENSES/): [Apache-2.0](LICENSES/Apache-2.0.txt), [MIT](LICENSES/MIT.txt) (this package) and [CC BY 3.0](LICENSES/CC-BY-3.0.txt), and each upstream's own licence file as found in [LICENSES/upstream/](LICENSES/upstream/).

| Gear | Artwork | Licence | Copyright or credit, as read | Line style from |
| --- | --- | --- | --- | --- |
| `gear:hockey-stick` | Noto Emoji: [`2D/svg/emoji_u1f3d2.svg`](https://github.com/googlefonts/noto-emoji/blob/e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/2D/svg/emoji_u1f3d2.svg) | Apache-2.0 | Copyright 2013 Google, Inc. All Rights Reserved. | Pictogrammers MDI `svg/hockey-sticks.svg` (Apache-2.0, icon by Google) |
| `gear:field-hockey-stick` | Noto Emoji: [`2D/svg/emoji_u1f3d1.svg`](https://github.com/googlefonts/noto-emoji/blob/e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/2D/svg/emoji_u1f3d1.svg) | Apache-2.0 | Copyright 2013 Google, Inc. All Rights Reserved. | Commons `Field_hockey_stick_with_ball_Pinhead_icon.svg` (CC0) |
| `gear:lacrosse-stick` | Noto Emoji: [`2D/svg/emoji_u1f94d.svg`](https://github.com/googlefonts/noto-emoji/blob/e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/2D/svg/emoji_u1f94d.svg) | Apache-2.0 | Copyright 2013 Google, Inc. All Rights Reserved. | worked out from the colour artwork |
| `gear:cricket-bat` | Noto Emoji: [`2D/svg/emoji_u1f3cf.svg`](https://github.com/googlefonts/noto-emoji/blob/e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/2D/svg/emoji_u1f3cf.svg) | Apache-2.0 | Copyright 2013 Google, Inc. All Rights Reserved. | Pictogrammers MDI `svg/cricket.svg` (Apache-2.0, icon by Google) |
| `gear:table-tennis-paddle` | Noto Emoji: [`2D/svg/emoji_u1f3d3.svg`](https://github.com/googlefonts/noto-emoji/blob/e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/2D/svg/emoji_u1f3d3.svg) | Apache-2.0 | Copyright 2013 Google, Inc. All Rights Reserved. | Pictogrammers MDI `svg/table-tennis.svg` (Apache-2.0, icon by Google) |
| `gear:badminton-racket` | Noto Emoji: [`2D/svg/emoji_u1f3f8.svg`](https://github.com/googlefonts/noto-emoji/blob/e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/2D/svg/emoji_u1f3f8.svg) | Apache-2.0 | Copyright 2013 Google, Inc. All Rights Reserved. | Pictogrammers MDI `svg/badminton.svg` (Apache-2.0, icon by Nick) |
| `gear:tennis-racket` | Noto Emoji: [`2D/svg/emoji_u1f3be.svg`](https://github.com/googlefonts/noto-emoji/blob/e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/2D/svg/emoji_u1f3be.svg) | Apache-2.0 | Copyright 2013 Google, Inc. All Rights Reserved. | Pictogrammers MDI `svg/tennis.svg` (Apache-2.0, icon by Google) |
| `gear:goal-net` | Noto Emoji: [`2D/svg/emoji_u1f945.svg`](https://github.com/googlefonts/noto-emoji/blob/e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e/2D/svg/emoji_u1f945.svg) | Apache-2.0 | Copyright 2013 Google, Inc. All Rights Reserved. | worked out from the colour artwork |
| `gear:football-helmet` | Wikimedia Commons: [`FootballHelmet.svg`](https://commons.wikimedia.org/wiki/File:FootballHelmet.svg) | CC0 | Author: Simanek / Credit: https://openclipart.org/detail/86827/football-helmet | Pictogrammers MDI `svg/football-helmet.svg` (Apache-2.0, icon by Austin Andrews) |
| `gear:goalie-mask` | Wikimedia Commons: [`Hockey Mask (188584) - The Noun Project.svg`](https://commons.wikimedia.org/wiki/File:Hockey_Mask_(188584)_-_The_Noun_Project.svg) | CC0 | Author: Philippe Tardif / Credit: Noun Project - https://thenounproject.com/icon/188584 | worked out from the colour artwork |
| `gear:baseball-glove` | game-icons.net: [`delapouite/baseball-glove.svg`](https://game-icons.net/1x1/delapouite/baseball-glove.html) | CC BY 3.0 | Baseball glove icon by Delapouite under CC BY 3.0 | the same artwork as ink |

- **Noto Emoji** ([googlefonts/noto-emoji](https://github.com/googlefonts/noto-emoji), read at commit `e20cbc2bbec1926686be9f9bee7d1d2cfa1fea0e`): the files under `2D/svg/` only. Their licence is `2D/svg/LICENSE`, the Apache License 2.0, whose copyright line reads "Copyright 2013 Google, Inc. All Rights Reserved." The repository's root `LICENSE` is the SIL Open Font License 1.1 ("Copyright 2013 Google LLC") and governs the fonts, not these images; `2D/fonts/LICENSE` is also the OFL and has no copyright line. None of the fonts is used.
- **Pictogrammers Material Design Icons** ([Templarian/MaterialDesign-SVG](https://github.com/Templarian/MaterialDesign-SVG), read at commit `9e04201d4557e729822fb57f62a316c3dea1d4a8`): used only for the one-path line versions. The repository's `LICENSE` is the "Pictogrammers Free License", which has no copyright line and says the icons are redistributed under the Apache License 2.0 or their respective licences; the repository's `package.json` names Austin Andrews as author and Apache-2.0 as the licence, and each icon's author is in its `meta.json` (Google, Nick, Austin Andrews). Treated as Apache-2.0, with the icon's author credited.
- **Wikimedia Commons**: only files whose own file page says CC0 or Public domain, read on 2026-10-14 with the MediaWiki API and the page itself: `FootballHelmet.svg` (CC0, Simanek, via Openclipart), `Field hockey stick with ball Pinhead icon.svg` (CC0, Quincy Morgan and the Temaki contributors, Pinhead v12.0.0) and `Hockey Mask (188584) - The Noun Project.svg` (CC0, Philippe Tardif). The revisions are in `scripts/dougu/gear-assets.json`.
- **game-icons.net** ([game-icons/icons](https://github.com/game-icons/icons), read at commit `82d948812bfe3f269ef8f731dcdb07b08160edc4`): "Baseball glove icon by Delapouite under CC BY 3.0" (https://delapouite.com; licence https://creativecommons.org/licenses/by/3.0/). The repository has no `LICENSE`; its `license.txt` says "Icons provided under the Creative Commons 3.0 BY or CC0 if mentioned below" and asks for a mention such as "Icons made by {author}"; the credit is in the drawing's `<desc>` and here: Icons made by Delapouite. Available on https://game-icons.net.

### The rulebooks the balls' sizes are read from

Each ball's `size.rule` names the rule; the table gives the document and where it was read. Figures that are worked out (a diameter from a circumference) say so in `size.note`. Where a rulebook could not be read, or was read in a secondary copy, the note says that too.

| Balls | Rulebook and rule | Read at |
| --- | --- | --- |
| `ball:soccer`, `ball:soccer-colour` | IFAB Laws of the Game, Law 2 The Ball, section 2.1 Qualities and measurements | https://www.theifab.com/laws/latest/the-ball/ |
| `ball:teqball` | FITEQ Official Rules and Regulations of Teqball 2026, Rule 3 The Official Ball, 3.1.1-3.1.6 | https://cdn.buttercms.com/s6Mb1gRkRJuFP38kpMTh |
| `ball:basketball` | FIBA Basketball Equipment 2026, Rule 2 Basketballs, 2.4 and Table 1 (size 7 = men's competitions) | https://assets.fiba.basketball/image/upload/documents-corporate-fiba-official-rules-2026-equipment-v1-0.pdf |
| `ball:basketball-6` | FIBA Basketball Equipment 2026, Rule 2 Basketballs, 2.4 and Table 1 (size 6 = women's competitions) | https://assets.fiba.basketball/image/upload/documents-corporate-fiba-official-rules-2026-equipment-v1-0.pdf |
| `ball:basketball-3x3` | FIBA 3x3 Official Equipment & Software Appendix to the 3x3 Official Rules (Dec 2024 update), Table 1 and section 5.7 (as quoted by balls.com) (not read in the primary text: see the ball's note) | https://fiba3x3.com/docs/equipment-and-software-appendix-to-the-3x3-official-rules.pdf |
| `ball:baseball` | Official Baseball Rules, Rule 3.01 The Ball | https://mktg.mlbstatic.com/mlb/official-information/2026-official-baseball-rules.pdf |
| `ball:softball` | WBSC Official Rules of Softball Slow Pitch 2026-2029, Appendix 3 (Ball Specifications), B. Dimensions and Specifications and 'Ball standards' table; Fast Pitch 2026-2029 Appendix 3 gives the same 12 in ball | https://static.wbsc.org/uploads/federations/0/cms/documents/5f45c5e4-54ed-3659-8116-4d7cb5051f69.pdf |
| `ball:tennis` | ITF Rules of Tennis, Rule 3 The Ball and Appendix I The Ball (a)-(c) | https://www.itftennis.com/media/7221/2026-rules-of-tennis-english.pdf |
| `ball:padel` | FIP Rules of Padel, 'The Ball' article (as extracted in FIP Game Ball Certification Process, section B) and Appendix 'Technical specifications of the padel ball' | https://www.padelfip.com/wp-content/uploads/2026/04/Game-Ball-Certification-Process-3-1.pdf |
| `ball:sliotar` | GAA Official Guide Part 2, Rules of Specification, Rule 4.4(i) | https://www.galwaygaa.ie/wp-content/uploads/2026/02/Official-Guide-Part-2.pdf |
| `ball:volleyball`, `ball:volleyball-8` | FIVB Official Volleyball Rules 2025-2028, Rule 3 Balls, 3.1 Standards | https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf |
| `ball:beach-volleyball` | FIVB Official Beach Volleyball Rules 2025-2028, Rule 3 Balls, 3.1 Standards | https://www.fivb.com/wp-content/uploads/2025/02/FIVB-BeachVolleyball_Rules2025_2028-EN-v01.pdf |
| `ball:cricket-red`, `ball:cricket-white`, `ball:cricket-pink` | Laws of Cricket, Law 4 The Ball, 4.1 Weight and size (Size 1, Size 2, Size 3) | https://www.lords.org/getmedia/1d908298-5c44-468d-b6a7-e1414a1296e0/Laws-of-Cricket-2017-Code-4th-Edition-(2026)_3.pdf |
| `ball:football` | NFL Rulebook, Rule 2 The Ball, Section 1 (Dimensions) | https://operations.nfl.com/rules-officiating/2026-nfl-rulebook |
| `ball:football-cfl` | CFL Official Playing Rules, Rule 1 Conduct of the Game, Section 2 The Ball | https://static.cfl.ca/wp-content/uploads/2026_Rule-Book.pdf |
| `ball:football-ifaf` | IFAF Football Rules and Interpretations 2026, Rule 1 (The Game, Field, Players and Equipment), Section 3 The Ball, Article 1 a-i | https://amerikanskeidretter.no/wp-content/uploads/2026/02/IFAF-Football-Rules-and-Interpretations-2026-med-norske-tilpasninger.pdf |
| `ball:rugby` | World Rugby Laws of the Game (Rugby Union), Law 2 The ball, clauses 1-7 | https://passport.world.rugby/media/soypxfea/2607en-world-rugby-laws-final-compressed.pdf |
| `ball:afl` | Laws of Australian Football 2026, Law 4 The Football, 4.1 Specifications | https://play.afl/sites/default/files/2026-02/Laws%20of%20Australian%20Football%202026.pdf |
| `ball:gaelic-football` | GAA Official Guide Part 2, Rules of Specification, Rule 4.4(ii) | https://www.galwaygaa.ie/wp-content/uploads/2026/02/Official-Guide-Part-2.pdf |
| `ball:netball` | World Netball Rules of Netball, Rule 1 (Equipment: Ball), item 15 a-d | https://netballhamilton.org.nz/media/1997/world-netball-rules-book-2024.pdf |
| `ball:pickleball-outdoor`, `ball:pickleball-indoor` | USA Pickleball Equipment Standards Manual (Jan 2025, Revision 3.0), 2.D.1 Design, 2.D.3 Size, 2.D.4 Weight, 2.D.8 Design (holes); USA Pickleball 2026 Official Rulebook rule 3.C Ball Specifications | https://equipment.usapickleball.org/docs/Equipment-Standards-Manual.pdf |
| `ball:squash` and its coloured dots | World Squash 'Specifications for Squash Balls' (Recommended standards approved by the WSF; updated WSF AGM 2021, rebranded 2025), sections 1-3 and Notes 2-4 | https://www.worldsquash.sport/wp-content/uploads/2025/07/211127_Ball-Specifications.pdf |
| `ball:racquetball` | USA Racquetball Rules, Rule 2.2 Ball Specifications (a)-(b); Rule 2.3 Ball Selection | https://www.usaracquetball.com/play/rules/2-courts-and-equipment |
| `ball:lacrosse` | World Lacrosse Rules of Men's Field Lacrosse 2025-2027 (Ver 1.0), Section 2 Equipment, Rule 14 The Ball, 14.1 | https://www.bclacrosse.com/Referees%20and%20Officials/World%20Lacrosse%20Men's%20Field%20Rule%20Book.pdf |
| `ball:field-hockey` | FIH Rules of Hockey, Equipment section 3 Ball, 3.1 a-e | https://www.fih.hockey/static-assets/pdf/fih-Rules-of-hockey-2026-final.pdf |
| `ball:table-tennis` | Laws of Table Tennis, 2.3 The Ball, 2.3.1-2.3.3 | https://db.ittf.com/sites/default/files/public/2026-02/2026_Statutes_v1_consolidated_tc.pdf |
| `ball:handball` | IHF Rules of the Game (Indoor Handball), Rule 3 The Ball, 3.1-3.3; sizes 0 and 00 and panel count from IHF Ball Regulations (XIII) Articles 2 and 3 | https://www.federhandball.it/wp-content/uploads/2025/07/Regolamento-tecnico-di-giuoco-2025-inglese.pdf |
| `ball:water-polo` | World Aquatics Competition Regulations, Part Six Water Polo Rules, Appendix 4 Field of Play & Equipment, 20.4.3 Ball (20.4.3.1-20.4.3.4); Part Six rule 1.1 points to Appendix 4 | https://waterpoloserbia.org/wp-content/uploads/2026/02/Vaterpolo-pravila-2025-Engleski.pdf |
| `ball:golf` | Rules of Equipment (R&A / USGA), Part 4 Conformance of Balls, 4.2 Weight and 4.3 Size | https://www.randa.org/roe/the-rules-of-equipment/part-4-conformance-of-balls |
| `ball:puck` | IIHF Official Rule Book, Rule 13 Puck, 13.1 Dimensions (the puck is Rule 13, not Rule 1) | https://blob.iihf.com/iihf-media/iihfmvc/media/downloads/rule%20book/2026-27_iihf_rule_book.pdf |
| `ball:curling-stone` | World Curling The Rules of Curling, R2 Stones (a)-(j); R3(b) handle colour | https://worldcurling.org/wp-content/uploads/2025/08/Rules-2025.pdf |
| `ball:shot` | World Athletics Technical Rules (C2.1), Rule 33 Shot Put - implement specification ('Shot'); smooth finish N7 (Ra <= 1.6 micrometres) | https://worldathletics.org/download/download?filename=0ed43077-8e08-492b-a4b3-267f27c18d0b.pdf&urlslug=C1.1%20%26%20C2.1%20-%20Competition%20Rules%20%26%20Technical%20Rules |
| `ball:discus` | World Athletics Technical Rules (C2.1), Rule 34 Discus Throw - 'The discus shall conform to the following specifications' | https://worldathletics.org/download/download?filename=0ed43077-8e08-492b-a4b3-267f27c18d0b.pdf&urlslug=C1.1%20%26%20C2.1%20-%20Competition%20Rules%20%26%20Technical%20Rules |
| `ball:hammer` | World Athletics Technical Rules (C2.1), Rule 36 Hammer Throw - 'The hammer shall conform to the following specifications' and construction text | https://worldathletics.org/download/download?filename=0ed43077-8e08-492b-a4b3-267f27c18d0b.pdf&urlslug=C1.1%20%26%20C2.1%20-%20Competition%20Rules%20%26%20Technical%20Rules |
| `ball:sepak-takraw` | ISTAF Law of the Game (Rules of the Game), Law 4 The Ball (Sepaktakraw Ball), 4.1-4.5 | https://sepaktakrawindia.com/wp-content/uploads/2022/04/REGU_TEAM-EVENT.pdf |
| `ball:roundnet` | International Roundnet Federation (IRF) Rules, Chapter 1 Equipment and Court, 1.1.2 Set Dimensions, 1.1.4 Ball Characteristics, 1.1.5 Ball Inflation | https://www.roundnetfederation.org/s/FINAL-IRF-Rulesset_-July-2026-1.pdf |
| `ball:shuttlecock-feather`, `ball:shuttlecock-nylon` | BWF Laws of Badminton, Law 2 Shuttle (2.1 general, 2.2 Feathered shuttle 2.2.1-2.2.6, 2.3 Non-feathered shuttle, 2.4 modifications) and Laws 3 Testing a shuttle for speed | https://worldbadminton.com/laws/index.html |

Facts only: a dimension or a mass is a fact, not a work. The NHL's puck rule was not read (the NHL's site was not fetched); the puck's size is the IIHF's.

## The demo and the docs

| What | Made from | Terms |
| --- | --- | --- |
| The demo's page | Written for this package, with the family stylesheet `demo/family.css` | MIT |
| The README's pictures (`docs/images`) | Taken by `scripts/screenshots.mjs` from the demo, which draws the package's own emblems | MIT |
