// The composing API on one page: a podium, an award case, a sprite sheet, a data address in an <img>, a CSS background and a canvas, and a sport's equipment. Every card draws from the built package and shows
// the call that made it, with a button that copies it.
// The package is imported from ../src here so that the editor and `pnpm typecheck` see its types; the build of the demo (scripts/page.ts) turns the import into ./dist/index.js, the built package.
import * as D from "../src/index.ts";
import { FLAGS as HATA } from "./flags-data.ts";

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;
const esc = (text: unknown) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const params = new URLSearchParams(location.search);
type Look = "inherit" | "light" | "dark";
const looks: readonly string[] = ["inherit", "light", "dark"];
const lookAsked = params.get("look") ?? "";
const sportAsked = params.get("sport") ?? "";
const state: { look: Look; sport: D.SportName; locale: "en" | "ja" } = { look: looks.includes(lookAsked) ? (lookAsked as Look) : "inherit", sport: D.SPORT_NAMES.find((name) => name === sportAsked) ?? "nhl", locale: "en" };

// Three round flags from Hata (demo/flags-data.ts, made by `pnpm flags`); the podium takes SVG markup or a URL for a flag, and draws it as an image.
const FLAGS = { jp: HATA.JP, fr: HATA.FR, it: HATA.IT };

const card = (id: string, title: string, art: string, code: string, extra = "") =>
  `<article class="compose-card" id="${id}" data-testid="${id}"><h3>${esc(title)}</h3><div class="art" data-look="${state.look === "inherit" ? "page" : state.look}">${art}</div>${extra}<details><summary>The call</summary><pre><code>${esc(code)}</code></pre></details><p class="copies"><button type="button" class="fam-button copy" data-code="${esc(code)}" aria-label="Copy the call for ${esc(title)}">Copy the call</button></p></article>`;

function podiumCard() {
  const options = { theme: state.look, locale: state.locale, width: 340 };
  const art = D.podium([{ name: "Aoki", flag: FLAGS.jp, label: "9.80 s" }, { name: "Dupont", flag: FLAGS.fr, label: "9.84 s" }, { name: "Rossi", flag: FLAGS.it, label: "9.91 s" }], options);
  const code = `import { podium } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = podium([\n  { name: "Aoki", flag: japanFlagSvg, label: "9.80 s" },\n  { name: "Dupont", flag: "https://example.com/flags/fr.svg", label: "9.84 s" },\n  { name: "Rossi", label: "9.91 s" },\n], { theme: "${state.look}", locale: "${state.locale}" });\n`;
  const cups = D.podium([{ emblem: "trophy:hockey-cup", name: "Canada" }, { emblem: "trophy:rugby-cup", name: "Sweden" }, { emblem: "trophy:cup", name: "Finland" }], { theme: state.look, locale: state.locale, style: "line", width: 340 });
  return card("podium", "Podium", `${art}${cups}`, code);
}

function caseCard() {
  const items = [{ emblem: "trophy:hockey-cup", count: 4, label: "1994 to 2010" }, { emblem: "medal:gold", count: 12 }, { emblem: "trophy:basketball", count: 2, label: "2001, 2004" }, { emblem: "crest:shield" }, { emblem: "ball:soccer" }, { emblem: "trophy:soccer-globe", count: 3 }, { emblem: "award:crown" }];
  const art = D.awardCase(items, { theme: state.look, locale: state.locale, width: 560 });
  const code = `import { awardCase } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = awardCase([\n  { emblem: "trophy:hockey-cup", count: 4, label: "1994 to 2010" },\n  { emblem: "medal:gold", count: 12 },\n  { emblem: "crest:shield" },\n], { perRow: 5, layout: "shelf" });\n`;
  return card("case", "Award case", art, code);
}

/** The number of elements a piece of markup makes, counted by a real parser. */
function nodes(markup: string) {
  const box = document.createElement("div");
  box.innerHTML = markup;
  return box.getElementsByTagName("*").length;
}
const kB = (n: number) => `${(n / 1024).toFixed(1)} kB`;

function spriteCard() {
  const ids = ["ball:soccer", "medal:gold"];
  const sprite = D.emblemSprite(ids, { theme: state.look });
  const list = Array.from({ length: 64 }, (_, i) => ids[i % 2]);
  const uses = list.map((id) => sprite.use(id, { size: 36 })).join("");
  const inline = list.map((id) => D.renderEmblem(id, { size: 36, theme: state.look })).join("");
  const spriteMarkup = sprite.sheet + uses;
  const stats = `<p class="sprite-stats" data-testid="sprite-stats">64 drawn inline: <b>${nodes(inline)}</b> nodes, ${kB(inline.length)}. From one sprite sheet: <b>${nodes(spriteMarkup)}</b> nodes, ${kB(spriteMarkup.length)}.</p>`;
  const art = `<div class="sprite-grid" data-testid="sprite-grid">${spriteMarkup}</div>`;
  const code = `import { emblemSprite } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst sprite = emblemSprite(["ball:soccer", "medal:gold"]);\ndocument.body.insertAdjacentHTML("afterbegin", sprite.sheet);\n\nconst html = sprite.use("ball:soccer", { size: 36, title: false }); // as many times as you like\n`;
  return card("sprite", "Sprite sheet", art, code, stats);
}

function uriCard() {
  const color = state.look === "dark" ? "#eef1f3" : "#c8102e";
  const uri = D.emblemDataUri("sport:nhl", { size: 96, color });
  const medal = D.emblemDataUri("medal:gold", { size: 96 });
  const art = `<img class="uri" id="uri-img" data-testid="uri-img" alt="Hockey pictogram, from a data address" width="96" height="96" src="${uri}"><div class="backdrop" id="uri-bg" data-testid="uri-bg" role="img" aria-label="Gold medal, as a CSS background" style="background-image:url('${medal}')"></div><canvas id="uri-canvas" data-testid="uri-canvas" width="96" height="96" aria-label="Hockey pictogram drawn on a canvas" role="img"></canvas>`;
  const code = `import { emblemDataUri } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst src = emblemDataUri("sport:nhl", { size: 96, color: "${color}" });\nimg.src = src;\nelement.style.backgroundImage = \`url("\${emblemDataUri("medal:gold")}")\`;\nconst picture = new Image();\npicture.onload = () => context.drawImage(picture, 0, 0);\npicture.src = src;\n`;
  setTimeout(() => {
    const canvas = $<HTMLCanvasElement>("uri-canvas");
    const picture = new Image();
    picture.onload = () => canvas.getContext("2d")!.drawImage(picture, 0, 0, 96, 96);
    picture.src = uri;
  }, 0);
  return card("uri", "Data address", art, code);
}

function equipmentCard() {
  const e = D.sportEquipment(state.sport);
  const ids = [e.ball, ...e.gear, e.trophy, e.medal].filter((id) => id !== undefined);
  const options = D.SPORT_NAMES.map((s) => `<option value="${s}"${s === state.sport ? " selected" : ""}>${s}</option>`).join("");
  const art = `<div class="sprite-grid" data-testid="equipment-art" style="gap:12px;line-height:1.3">${ids.map((id) => `<figure style="margin:0;text-align:center;font-size:.7rem;line-height:1.3">${D.renderEmblem(id, { size: 64, theme: state.look, locale: state.locale, grain: false })}<figcaption>${esc(id)}</figcaption></figure>`).join("")}</div>`;
  const extra = `<p><label class="fam-label" for="sport">Sport</label> <select class="fam-field" id="sport" data-testid="sport">${options}</select></p>`;
  const code = `import { renderEmblem, sportEquipment } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst equipment = sportEquipment("${state.sport}");\n// ${JSON.stringify(e)}\nconst svgs = [equipment.ball, ...equipment.gear, equipment.trophy].map((id) => renderEmblem(id));\n`;
  return card("equipment", "A sport's equipment", art, code, extra);
}

function render() {
  $("cards").innerHTML = [podiumCard(), caseCard(), spriteCard(), uriCard(), equipmentCard()].join("");
  for (const b of $("look").querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === state.look));
  for (const b of $("locale").querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === state.locale));
  const next = new URLSearchParams();
  if (state.look !== "inherit") next.set("look", state.look);
  if (state.sport !== "nhl") next.set("sport", state.sport);
  try {
    history.replaceState(null, "", next.size === 0 ? location.pathname : `?${next}`);
  } catch {
    /* the address stays where it was */
  }
}

$("look").addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { state.look = b.dataset.value as Look; render(); } });
$("locale").addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { state.locale = b.dataset.value as "en" | "ja"; render(); } });
document.addEventListener("change", (event) => { const field = event.target as HTMLSelectElement; if (field.id === "sport") { state.sport = field.value as D.SportName; render(); $("sport").focus(); } });
render();

/** Copies text with the clipboard, or with a hidden field where the page may not use it. */
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    /* fall through to the field */
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  try {
    document.execCommand("copy");
  } finally {
    field.remove();
  }
}
document.addEventListener("click", async (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>("button.copy");
  if (!button) return;
  const label = button.textContent;
  await copy(button.dataset.code ?? "");
  button.textContent = "Copied";
  setTimeout(() => { button.textContent = label; }, 1400);
});
