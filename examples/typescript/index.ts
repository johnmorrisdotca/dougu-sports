import { EMBLEM_IDS, emblemInfo, renderEmblem, type EmblemId, type EmblemOptions } from "@johnmorrisdotca/dougu-sports/emblems";
import type { DouguEmblem } from "@johnmorrisdotca/dougu-sports/element";

const options: EmblemOptions = { style: "line", size: 96 };
const id: EmblemId = "trophy:stanley-cup";
const svg: string = renderEmblem(id, options);
console.log(svg.length, emblemInfo(id).en, EMBLEM_IDS.length);

export function turnIt(cup: DouguEmblem): void {
  cup.setAttribute("turnable", "");
}

// @ts-expect-error "neon" is not a style
renderEmblem(id, { style: "neon" });
