# Japanese sports

[Back to the README](../README.md) · [日本語](japanese-sports.ja.md) · English

The package is called Dougu (*dōgu*: a tool, a piece of equipment), so the equipment of the Japanese sports and budō is here as first-class emblems: sumo, kendo, judo, kyudo and karate. Each is an original drawing with a generic id, in the metal, color and line styles, light and dark, and each turns.

`JAPANESE_IDS` lists them together; each is also in its own group (`sport`, `trophy` or `gear`).

| Sport | Pictogram | Items |
| --- | --- | --- |
| Sumo | `sport:sumo` (two wrestlers in the shikiri crouch) | `trophy:sumo-cup`, `gear:gunbai`, `gear:mawashi` |
| Championship flags | | `trophy:championship-banner` |
| Kendo | `sport:kendo` (the helmet) | `gear:shinai`, `gear:kendo-men` |
| Judo | `sport:judo` (the suit and belt) | `gear:judogi`, `gear:judogi-blue`, `gear:judogi-folded`, `gear:judogi-blue-folded`, `gear:judogi-back`, `gear:judogi-blue-back` ([from behind, with the back number](judogi-back.md)), `gear:obi`, the belts below and [six steps of tying one](obi-steps.md) |
| Kyudo | `sport:kyudo` (a bow, its string and an arrow) | `gear:yumi`, `gear:ya` |
| Karate | `sport:karate` (the suit) | `gear:karate-gi` |

```js
import { JAPANESE_IDS, emblemInfo, emblemName } from "@johnmorrisdotca/dougu-sports";

console.log(JAPANESE_IDS.length); // 41
console.log(emblemName("gear:gunbai", "ja")); // 軍配
console.log(emblemName("gear:gunbai")); // Referee's war fan
console.log(emblemInfo("gear:judogi").description?.ja.startsWith("白い柔道衣")); // true
```

## The words

The Japanese names use the words the sports' own governing bodies use in their rules and equipment lists: the Japan Sumo Association for the war fan and the loincloth, the All Japan Kendo Federation for the bamboo sword and the helmet, the All Japan Judo Federation for the suit and the belt, the All Japan Kyudo Federation for the bow and the arrow, and for karate the suit. The words themselves, with the parts of the kendo helmet, are on the [Japanese page](japanese-sports.ja.md). The short name of an emblem is its accessible name, so it is short; the longer description (`emblemInfo(id).description`, in English and in Japanese) is for the docs and the gallery. The Japanese was read by a reviewer who reads Japanese (see [CONTRIBUTING](../CONTRIBUTING.md)).

The ids and the drawings are generic: no federation's name or mark, no real trophy's name, and no lettering unless you give some.

## Turning

A flat item (a pictogram, a belt, a fan, a sword) flips like a coin through the one turn every flat drawing in the package shares (`src/emblems/emblem.flip.ts`): it is squeezed by the cosine of the yaw, shows its front mirrored and a little darker past a quarter turn, and has a thin dark rim that is widest edge on. The cup is a body of revolution, which keeps its outline and moves its light and its handles. Every id here turns.

```js
import { emblemFrame, renderEmblem } from "@johnmorrisdotca/dougu-sports";

console.log(emblemFrame("gear:shinai", { yaw: 0 }) === renderEmblem("gear:shinai")); // true
console.log(emblemFrame("gear:shinai", { yaw: 180 }).includes("scale(-1 1)")); // true
console.log(emblemFrame("trophy:sumo-cup", { yaw: 90 }) === renderEmblem("trophy:sumo-cup")); // false
```

## The sumo cup

`trophy:sumo-cup` is a tall silver cup on a tall stepped stand with a gilt rim, and on each side an ornate handle that sweeps up past the rim and curls over like a bird's head, in the manner of a phoenix. It is a generic cup, not any real one: it carries no name and no engraving unless you give `engrave`, which is cut round its stand.

## The championship banner

`trophy:championship-banner` is a broad, softly waving cloth on a pole with a gilt finial, an embroidered border and a short fringe. It has no lettering by default (the blank cloth has a ring and a star); `initials` puts up to three letters on it. `tint` is the cloth (purple by default; crimson is `#9d1b2e`) and `accent` the gold of the trim.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";

const plain = renderEmblem("trophy:championship-banner");
const crimson = renderEmblem("trophy:championship-banner", { tint: "#9d1b2e", initials: "ABC" });

console.log(plain.includes("<text")); // false
console.log(crimson.includes(">ABC<")); // true
```

## The judo suit

`gear:judogi` is the white judogi laid flat, `gear:judogi-blue` the blue one, and `gear:judogi-folded` and `gear:judogi-blue-folded` the same folded into a neat rectangle with the belt tied round it. They are drawn from the IJF's judogi rules (Sport and Organisation Rules, C1, [references](references.md#judo-and-karate-suits-and-belts)):

- **Jacket (uwagi):** the lapels cross left over right, with the crossing under 10 cm below the top of the sternum, and the collar is a thick stitched lapel running from the back of the neck to the hem (the rule gives it as 4 cm wide and at most 1 cm thick). The sleeves are long, hanging out and down to the wrist (a judogi has no short sleeves), loose at the cuff, and cover the wrist bone completely; the skirt covers the buttocks, with short vents at the sides. `sport:judo` draws them the same way. The cloth is heavy, so the upper body and the sleeves are drawn quilted, in rows.
- **Trousers (zubon):** straight and loose, ending near the ankle, with a drawstring waist and reinforced knees.
- **Colour (C1.9):** the jacket and the trousers are one colour, "snow white" (`JUDOGI_WHITE`) or blue (`JUDOGI_BLUE`, between Pantone 285M and 286M); nothing else.
- **Belt:** the suit wears a black belt by default; `accent` takes any other colour (`OBI_RANKS`).
- The backnumber is sewn on the back (its top 3 cm below the collar, C1.8), so a front view does not show it. `gear:judogi-back` and `gear:judogi-blue-back` draw the suit from behind with it: [judogi-back.md](judogi-back.md).

## Belts

The belt (obi) is drawn as it is tied: wrapped twice round the waist, crossed at the back, both ends brought to the front and tied in a flat square (reef) knot, left over right and then right over left, with the two ends of one length hanging a little apart. `gear:obi` is the black belt; the grades have their own ids:

| Grade | Belt | Id |
| --- | --- | --- |
| Kyu, from the first | white, yellow, orange, green, blue, brown | `gear:obi-white`, `-yellow`, `-orange`, `-green`, `-blue`, `-brown` |
| 1st to 5th dan | black | `gear:obi` |
| 6th to 8th dan | red and white panels (kōhaku-obi) | `gear:obi-kohaku` |
| 9th and 10th dan | solid red | `gear:obi-red` |
| A woman's black belt in Japan | black with a white stripe down the middle | `gear:obi-women` |
| Between two kyu | two colours, side by side along the belt: white-yellow, yellow-orange, orange-green, green-blue, blue-brown | `gear:obi-white-yellow`, `-yellow-orange`, `-orange-green`, `-green-blue`, `-blue-brown` |

The Kodokan's own kyu belts are white (5th and 4th kyu) and brown (3rd to 1st kyu); the colours between them were added by other countries, so the order and the ages differ from one country to the next. The two-colour belts are the intermediate belts several countries give young judoka (France since 1990; the IJF names these four pairs); no rule found fixes how the two colours are laid on the belt, so they are drawn as two halves of the width. See the [references](references.md#judo-and-karate-suits-and-belts) for the sources.

`OBI_RANKS` holds the colours (`kohaku` is the red of the panels, `red` the red of the 9th dan), and `obi(rank, options)` draws one. `rank` is a grade or a pair of grades for a two-colour belt (`obi(["white", "yellow"])`); `tint` takes any other colour, or a pair of colours; `accent` is the stripe at the ends of a one-colour belt, the white of the red-and-white belt and the second colour of a pair; `women: true` adds the stripe of the women's black belt and is ignored by every other belt. `gear:judogi` and `gear:karate-gi` take an `accent` for the colour of the belt they wear.

How the belt is tied, step by step, is in [obi-steps.md](obi-steps.md) ([日本語](obi-steps.ja.md)): `gear:obi-step-1` to `gear:obi-step-6`.

```js
import { OBI_RANKS, obi } from "@johnmorrisdotca/dougu-sports";

console.log(Object.keys(OBI_RANKS).join(" ")); // white yellow orange green blue brown black kohaku red
console.log(obi("brown", { size: 24 }).includes(OBI_RANKS.brown)); // true
console.log(obi("black", { women: true }).includes("#f6f4ee")); // true
console.log(obi(["white", "yellow"]).includes(OBI_RANKS.yellow)); // true
```

## The karate suit

`gear:karate-gi` is drawn from the WKF competition rules (article 2.2.1): white, without stripes or piping; a lighter cloth than the judogi's (no quilting, a plain narrow collar); a jacket that covers the hips and no more than three-quarters of the thigh; sleeves that reach the bend of the wrist at most and halfway down the forearm at least, so three-quarter length, a little shorter than a judogi's and never elbow-length; ties on the jacket; trousers that cover at least two thirds of the shin and stop above the ankle bone; and a red (AKA) or blue (AO) belt, which is why the belt is red by default. `sport:karate` is the same suit as a pictogram, and `sport:judo` the judogi.

## American football pictograms

`sport:nfl`, `sport:cfl` and `sport:ifaf` are the balls of `ball:football`, `ball:football-cfl` and `ball:football-ifaf` as pictograms: a prolate ball on the diagonal with a row of laces on its upper side. The NFL ball has no stripes; the CFL ball has a white stripe all the way round near each end (CFL Rule 1, Section 2); the IFAF ball has two 1-inch white stripes near each end, on the two panels next to the laces only (IFAF Football Rules and Interpretations 2023, Rule 1, Section 3, Article 1 e), which is the upper half of the picture.
