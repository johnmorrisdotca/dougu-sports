# Famous trophies

[Back to the README](../README.md) · English

A trophy that stands for one real trophy is drawn as a very close likeness of it, so that a person who knows the trophy knows the drawing at once: the Stanley Cup's ribbed bowl and its rings, the FIFA World Cup's two figures holding up the globe, the Venus Rosewater Dish, the Commissioner's Trophy's ring of flags. The drawing is the package's own vector, made from measurements of a photograph and never traced, and it carries no lettering, no logo and no league, team or sponsor mark. The rule, the method and the references are in [drawing a trophy as a close likeness](./likeness.md) and the [sources](./likeness-sources.md).

<p align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/famous-desk-dark.webp">
<img alt="Thirty-six named trophies on royal purple, in four rows of nine, each with its name under it: the FIFA World Cup, the Stanley Cup, the Lombardi Trophy, the Larry O'Brien trophy, the Grey Cup, the FA Cup, the America's Cup, the Borg-Warner Trophy and the Wimbledon gentlemen's trophy; then the Venus Rosewater Dish, the Ballon d'Or, the Champions League trophy, the Webb Ellis Cup, the Ashes urn, the Cricket World Cup, the Woodlawn Vase, the DFB-Pokal and the Commissioner's Trophy; then the baseball awards (Cy Young, Gold Glove, Silver Slugger, MLB MVP, World Series MVP), the WNBA trophy, the Lamar Hunt Trophy, the Hart and the Vezina; and last the Norris, Calder, Conn Smythe, Art Ross, Presidents', Prince of Wales, Campbell Bowl, Rocket Richard and Walter Cup." src="https://raw.githubusercontent.com/johnmorrisdotca/dougu-sports/main/docs/images/famous-desk-light.webp" width="760">
</picture>
</p>

## Draw one, and read what it is

A named trophy is an emblem like any other: its id is its name, so it takes the same options (size, style, colours, turning). `namedTrophy(id)` gives the facts of the trophy the drawing stands for.

```js
import { renderEmblem } from "@johnmorrisdotca/dougu-sports";
import { namedTrophy } from "@johnmorrisdotca/dougu-sports/emblems";

const svg = renderEmblem("trophy:stanley-cup", { size: 160 });
console.log(svg.includes("<title>Stanley Cup</title>")); // true

const facts = namedTrophy("trophy:stanley-cup");
console.log(facts.name, facts.sport, facts.first); // Stanley Cup hockey 1893
```

`NAMED_TROPHIES` lists them all, with each one's sport, competition and what it honours, so a results page can pick the emblem for an award by its name.

## What is drawn

- **The world's most famous trophies:** the FIFA World Cup, the Woodlawn Vase, the Borg-Warner Trophy, the FA Cup, the America's Cup, the Cricket World Cup, the Gentlemen's Singles Trophy of Wimbledon, the Venus Rosewater Dish, the Ballon d'Or, the DFB-Pokal, the Ashes urn, the Webb Ellis Cup and the UEFA Champions League trophy.
- **The NHL's:** the Stanley Cup and the Hart, Vezina, Norris, Calder, Art Ross, Conn Smythe, Lady Byng, Selke, Jennings, Masterton, King Clancy, Jack Adams, Presidents', Prince of Wales, Campbell Bowl, Rocket Richard, Ted Lindsay, Lester Patrick and Jim Gregory trophies, and the Paterson Cup of the PCHA (1912).
- **The other leagues':** the Lombardi Trophy, the Larry O'Brien Championship Trophy, the Commissioner's Trophy, the Grey Cup, the Cy Young, Gold Glove, Silver Slugger, MLB MVP, World Series MVP, Jackie Robinson, Manager of the Year, Relief Man and Hank Aaron awards, the Michael Jordan, Bill Russell, Olajuwon, Chamberlain, Havlicek, Auerbach and Mikan trophies, the Pete Rozelle and George Halas trophies, the Walter Cup, the WNBA Championship Trophy, the Lamar Hunt Trophy, the Avco World Trophy and the O'Brien Cup.

What is still to draw, for want of a usable photograph, is listed in the [trophy audit](./trophy-audit.md), which also says which award of which league has an emblem.
