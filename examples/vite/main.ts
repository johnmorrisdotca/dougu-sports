import "@johnmorrisdotca/dougu-sports/element";
import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

const cup = document.querySelector("dougu-emblem")!;
cup.setAttribute("turnable", "");
console.log(renderEmblem("medal:gold", { size: 48 }).startsWith("<svg"));
