# Notice: where the art comes from

The code of this package is under the MIT licence (see [LICENSE](LICENSE) and [LICENSES/MIT.txt](LICENSES/MIT.txt)). **Every emblem is drawn for this package** (`source: "ours"`, `"generated"` or `"drawn"` in `emblemInfo`) or made by its own code, and so is under the same MIT licence. Nothing is copied from another project: no icon set, no emoji font, no clip art and no photograph is in the package, so there is no third-party licence to carry and none is shipped (`LICENSES/` holds the MIT text and nothing else).

No emblem carries the name, mark or logo of a league, a team, a federation or an event: the trophies, crests, balls and gear are descriptive and generic. That includes the Japanese items (`trophy:sumo-cup`, `trophy:championship-banner` and the `gear:*` of sumo, kendo, judo, kyudo and karate): they are original drawings of what such an object looks like, with generic ids, and carry no trophy's name, no federation's mark and no lettering unless the caller gives some.

## How the art is made

- The trophies, medals, crests, awards and sport pictograms are drawn in SVG by hand in a simplified, generic form. No real trophy, medal, logo, mark or engraving was copied or traced, and no photograph was traced (photographs were looked at, never copied).
- The balls (`src/emblems/ball/`) are drawn by this package's own code: a rotation, a projection and our own geometry (a seam curve, the truncated icosahedron, a layout of curved panels, a fitted basketball channel).
- The printed pucks (`puck:*`, `src/emblems/ball/ball.puck.print.ts`) are our own drawings: the maple leaf, the flags of the Canadian and United States patterns and the stars are drawn from simple geometry, the lettering is a stroke alphabet adapted from the block letters of the author's own senshu-jerseys (same author, same MIT licence, no font file), and the signature is made by a seeded pen, so it is no real person's. Photographs of souvenir pucks were looked at for what such a puck shows (a flag, a name, a number, a signature, a ring of words) and nothing was copied or traced. No team's or league's logo or wordmark, no maker's mark and no real player's name is used.
- The gear (`src/emblems/gear/`) is drawn by us from a list of parts (a path, a colour, how it reads as a line); the bow, the arrow and the other tapering shapes are made by a small function of ours (`swell`), and the rest are paths written for this package.
- The Japanese words for the Japanese items are the ones the sports' governing bodies use in their own rules and equipment lists (kendo, judo, kyudo and karate federations and the sumo association); the bodies' names and marks are not used in any id, title or drawing.

## The balls' sizes

The sizes the balls carry (`size` on each ball: the diameter or length, the circumference and the mass, with the rule they come from) are facts read from the rulebooks listed below; no text, table or drawing of a rulebook is copied.

### The rulebooks the balls' sizes are read from

Each ball's `size.rule` names the rule; the table gives the document and where it was read. Figures that are worked out (a diameter from a circumference) say so in `size.note`. Where a rulebook could not be read, or was read in a secondary copy, the note says that too.

| Balls | Rulebook and rule | Read at |
| --- | --- | --- |
| `ball:soccer`, `ball:soccer-colour`, `ball:soccer-26`, `ball:soccer-18`, `ball:soccer-14`, `ball:soccer-12`, `ball:soccer-6`, `ball:soccer-orange`, `ball:soccer-26-orange`, `ball:soccer-18-orange`, `ball:soccer-14-orange`, `ball:soccer-12-orange`, `ball:soccer-6-orange`, `ball:soccer-yellow`, `ball:soccer-26-yellow`, `ball:soccer-18-yellow`, `ball:soccer-14-yellow`, `ball:soccer-12-yellow`, `ball:soccer-6-yellow` | IFAB Laws of the Game, Law 2 The Ball, section 2.1 Qualities and measurements | https://www.theifab.com/laws/latest/the-ball/ |
| `ball:futsal` | Futsal Laws of the Game 2025/26, Law 2 The Ball, section 1 Qualities and measurements (circumference 62-64 cm, 400-440 g, 0.6-0.9 atm, bounce 50-65 cm from 2 m) | https://digitalhub.fifa.com/m/20d52e6779b53321/original/FUTSAL-Laws-of-the-Game-2025-2026.pdf |
| `ball:beach-soccer` | Beach Soccer Laws of the Game 2024-25, Law 2 The Ball, section 1 Qualities and measurements (circumference 68-70 cm, 400-440 g, 0.4-0.6 atm); the 2021/22 edition has the same figures | https://www.the-aiff.com/media/uploads/2024/11/Beach-Soccer-Laws-of-the-Game-2024-25.pdf |
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
