import { EMBLEM_IDS, renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";

// A server draws the same SVG a browser does: pure, no DOM, no browser globals.
const svg = renderEmblem("trophy:stanley-cup", { size: 160, style: "line" });
const page = `<!doctype html><title>The cup</title>${svg}`;
console.log(page.length > 1000, EMBLEM_IDS.length);
