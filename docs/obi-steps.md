# How a judo belt is tied, in six steps

[Back to the README](../README.md) · [日本語](obi-steps.ja.md) · English

<picture>
<source media="(prefers-color-scheme: dark)" srcset="images/obi-steps-dark.webp">
<img alt="Six close-ups of a white judo jacket with a black belt, numbered 1 to 6: the middle of the belt against the belly; two wraps with both ends hanging; the ends crossed; one end brought up under both wraps; the flat square knot; the finished knot with both ends hanging even." src="images/obi-steps-light.webp">
</picture>

`gear:obi-step-1` to `gear:obi-step-6` show how the belt (obi, 帯) of a judogi (柔道衣) is tied, the standard way. Each is a close-up of the jacket of [`gear:judogi`](japanese-sports.md#the-judo-suit) with the belt at that stage of the tying. A red number in the corner says which step it is, and a few small red marks say what to look at: the middle of the belt, the way an end travels, the ends being the same length.

| Step | Id | What it shows | In Japanese |
| --- | --- | --- | --- |
| 1 | `gear:obi-step-1` | Centre the belt on the belly: the middle of the belt against the middle of the belly, over the jacket. A notch marks the middle. | 帯の真ん中をおなかの中心に当てる |
| 2 | `gear:obi-step-2` | Wrap it twice round the waist, the ends crossing behind, so that both ends come back to the front. Two layers across the belly and two loose ends. | 帯を腰に二重に巻き、両端を前に戻す |
| 3 | `gear:obi-step-3` | Cross the ends in front of the belly, the wearer's left end (the right of the picture) over the other. | おなかの前で両端を交差させる |
| 4 | `gear:obi-step-4` | Tuck one end up from below, under both layers of the belt. It shows under the belt and again above it, and a red arrow follows its way. | 片方の端を二重の帯の下から上へ通す |
| 5 | `gear:obi-step-5` | Tie the flat square knot, hon-musubi (本結び): left over right, then right over left. The knot is made, the ends are not yet even. | 本結びで結ぶ |
| 6 | `gear:obi-step-6` | Pull it tight and let both ends hang even. A mark under the tips shows they are one length. | 結び目を締め、両端をそろえて垂らす |

The jacket closes the way every judogi does, left over right: the wearer's left front lies on top, which is the right-hand panel of the picture, and the lapel runs from the right of the neck down to the left (the Japanese word is 右前, the right panel worn against the body; the opposite wrap is the one for the dead). It is the very drawing of `gear:judogi`, so the steps agree with the suit in [the judo suit](japanese-sports.md#the-judo-suit), and a test holds them to it. The close-up leaves out the trousers and the sleeves, so that the belt is big enough to read at small sizes.

## Six ids, not a `step` option

The steps are six ids because that is how this package tells apart drawings that differ by more than a colour: the white and the blue suit, the suit from the front and from behind, and every belt are each an id, while the options (`tint`, `accent`, `backnumber`) only recolour a drawing or fill something in on it. A step changes what is drawn, so it is an id. That gives each step its own place in `EMBLEM_IDS`, `GEAR_IDS` and `JAPANESE_IDS`, its own name and caption in English and Japanese, its own turn, and a module of its own for a bundler; and a lesson is just a list of ids.

`obiStep(step, options)` is the short way, as `obi(rank, options)` is for the belts. The usual options apply: `tint` is the colour of the jacket and `accent` the colour of the belt (black by default). The red marks and the number are not the suit's, so they stay red.

```js
import { emblemName, obiStep, renderEmblem } from "@johnmorrisdotca/dougu-sports";

const steps = [1, 2, 3, 4, 5, 6].map((n) => `gear:obi-step-${n}`);
console.log(steps.length); // 6
console.log(emblemName(steps[4], "ja")); // 帯の結び方（5）本結び
console.log(emblemName(steps[4])); // Belt step 5: square knot
console.log(obiStep(6, { accent: "#7a4a24" }).includes("#7a4a24")); // true
console.log(renderEmblem("gear:obi-step-3", { tint: "#1456b6" }).includes("#1456b6")); // true
```

Each step turns like the other suits and fits its box at every angle. The tying order is the one the owner's reference diagrams show (see [the references](references.md#judo-and-karate-suits-and-belts)); the IJF's rule for the finished belt is only that the knot is "correctly and tightly made", with the tips 20 to 30 cm from it.
