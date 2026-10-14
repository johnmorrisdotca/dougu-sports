# Japanese sports

[Back to the README](../README.md). The package is called Dougu (道具, *dōgu*: a tool, a piece of equipment), so the equipment of the Japanese sports and budō is here as first-class emblems: sumo, kendo, judo, kyudo and karate. Each is an original drawing with a generic id, in the metal, color and line styles, light and dark, and each turns.

`JAPANESE_IDS` lists them together; each is also in its own group (`sport`, `trophy` or `gear`).

| Sport | Pictogram | Items | Japanese |
| --- | --- | --- | --- |
| Sumo | `sport:sumo` (two wrestlers in the tachiai) | `trophy:sumo-cup`, `gear:gunbai`, `gear:mawashi` | 相撲, 鳳凰飾りの銀杯, 軍配, 廻し |
| Championship flags | | `trophy:championship-banner` | 優勝旗 |
| Kendo | `sport:kendo` (the helmet) | `gear:shinai`, `gear:kendo-men` | 剣道, 竹刀, 剣道の面 |
| Judo | `sport:judo` (the suit and belt) | `gear:judogi`, `gear:obi` | 柔道, 柔道衣, 武道の帯 |
| Kyudo | `sport:kyudo` (a bow, its string and an arrow) | `gear:yumi`, `gear:ya` | 弓道, 弓道の弓, 弓道の矢 |
| Karate | `sport:karate` (a fist) | `gear:karate-gi` | 空手, 空手衣 |

```js
import { JAPANESE_IDS, emblemInfo, emblemName } from "@johnmorrisdotca/dougu-sports";

console.log(JAPANESE_IDS.length); // 16
console.log(emblemName("gear:gunbai", "ja")); // 軍配
console.log(emblemName("gear:gunbai")); // Referee's war fan
console.log(emblemInfo("gear:judogi").description?.ja); // 柔道衣。上衣、ズボン、帯
```

## The words

The Japanese names use the words the sports' own governing bodies use in their rules and equipment lists: the Japan Sumo Association (日本相撲協会) for 軍配 and 廻し, the All Japan Kendo Federation (全日本剣道連盟) for 竹刀 and 面, the All Japan Judo Federation (全日本柔道連盟) for 柔道衣 and 帯, the All Japan Kyudo Federation (全日本弓道連盟) for 弓 and 矢, and for karate 空手衣. The short name of an emblem is its accessible name, so it is short; the longer description (`emblemInfo(id).description`, in English and in Japanese, with the parts' words: 面金, 面布団, 突き垂れ, 下がり) is for the docs and the gallery. The Japanese was read by a reviewer who reads Japanese (see [CONTRIBUTING](../CONTRIBUTING.md)).

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

## Belts

`gear:obi` is a tied belt, black by default. `OBI_RANKS` holds the colours from the first rank to the black belt, and `obi(rank, options)` draws one; `tint` takes any other colour, and `accent` the stripe at its ends. `gear:judogi` and `gear:karate-gi` take an `accent` for the colour of the belt they wear.

```js
import { OBI_RANKS, obi } from "@johnmorrisdotca/dougu-sports";

console.log(Object.keys(OBI_RANKS).join(" ")); // white yellow orange green blue brown black
console.log(obi("brown", { size: 24 }).includes(OBI_RANKS.brown)); // true
```
