// The contact sheet of the fictional logos: twelve makers and ten teams, each in colour, in one colour and small, with its note; a maker on a ball; and a logo placed inside a drawing of a T-shirt. Every picture is drawn from the built
// package, and every card shows the call that made it with a button that copies it.
// The package is imported from ../src here so that the editor and `pnpm typecheck` see its types; the build of the demo (scripts/page.ts) turns the import into ./dist/brands-entry.js.
import * as B from "../src/brands-entry.ts";

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;
const esc = (text: unknown) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const params = new URLSearchParams(location.search);
type Look = "light" | "dark";
const LAYOUTS: readonly B.LogoLayout[] = ["mark", "horizontal", "stacked", "wordmark"];
const lookAsked = params.get("look");
const layoutAsked = params.get("layout") ?? "";
const state: { look: Look; layout: B.LogoLayout; maker: B.MakerId; ball: string } = {
  look: lookAsked === "dark" ? "dark" : "light",
  layout: LAYOUTS.find((layout) => layout === layoutAsked) ?? "mark",
  maker: B.MAKER_IDS.find((id) => id === params.get("maker")) ?? "arvane",
  ball: ["ball:baseball", "ball:softball", "ball:soccer"].find((id) => id === params.get("ball")) ?? "ball:baseball",
};

const SIZES = [16, 24, 32, 48];

function makerCard(id: B.MakerId): string {
  const data = B.MAKERS[id];
  const theme = state.look;
  const layout = state.layout;
  const big = B.makerLogo(id, { layout, theme, size: layout === "wordmark" ? 40 : layout === "mark" ? 132 : 112 });
  const small = SIZES.map((size) => B.makerLogo(id, { theme, size, title: false })).join("");
  const mono = [B.makerLogo(id, { color: "mono", size: 48, title: false }), B.makerLogo(id, { color: "mono", layout: "horizontal", size: 40, title: false })].join("");
  const code = `import { makerLogo } from "@johnmorrisdotca/dougu-sports/brands";\n\nconst svg = makerLogo("${id}", { layout: "${layout}", theme: "${theme}" });\nconst oneColour = makerLogo("${id}", { color: "mono", ink: "#111827" });\n`;
  return `<article class="brand-card" id="maker-${id}" data-testid="maker-${id}"><h3>${esc(data.name)} <span>${esc(data.genre)}</span></h3><div class="brand-art" data-look="${theme}"><div class="big">${big}</div><div class="small" aria-hidden="true">${small}</div><div class="mono" aria-hidden="true">${mono}</div></div><p class="brand-note">${esc(data.note)}</p><details><summary>The call</summary><pre><code>${esc(code)}</code></pre></details><p class="copies"><button type="button" class="fam-button copy" data-code="${esc(code)}" aria-label="Copy the call for ${esc(data.name)}">Copy the call</button></p></article>`;
}

function teamCard(id: B.TeamId): string {
  const data = B.TEAMS[id];
  const theme = state.look;
  const big = B.teamLogo(id, { theme, size: 132 });
  const small = SIZES.map((size) => B.teamLogo(id, { theme, size, title: false })).join("");
  const mono = B.teamLogo(id, { color: "mono", size: 48, title: false });
  const code = `import { teamLogo } from "@johnmorrisdotca/dougu-sports/brands";\n\nconst svg = teamLogo("${id}", { theme: "${theme}" });\n`;
  return `<article class="brand-card" id="team-${id}" data-testid="team-${id}"><h3>${esc(data.city)} ${esc(data.nickname)} <span>${esc(data.genre)}</span></h3><div class="brand-art" data-look="${theme}"><div class="big">${big}</div><div class="small" aria-hidden="true">${small}</div><div class="mono" aria-hidden="true">${mono}</div></div><p class="brand-note">${esc(data.note)}</p><details><summary>The call</summary><pre><code>${esc(code)}</code></pre></details><p class="copies"><button type="button" class="fam-button copy" data-code="${esc(code)}" aria-label="Copy the call for ${esc(data.city)} ${esc(data.nickname)}">Copy the call</button></p></article>`;
}

function balls(): string {
  const id = state.maker;
  const layouts: B.LogoLayout[] = ["mark", "horizontal"];
  const pictures = layouts.map((layout) => `<figure>${B.renderMakerBall(state.ball, id, { layout, theme: "light" }, { size: 200, title: `${B.MAKERS[id].name}${layout === "mark" ? "" : " with its name"} on a ball` })}<figcaption>${layout === "mark" ? "Mark" : "Mark and name"}</figcaption></figure>`).join("");
  const spread = B.MAKER_IDS.map((other) => `<figure>${B.renderMakerBall(state.ball, other, {}, { size: 96, title: `${B.MAKERS[other].name} on a ball` })}<figcaption>${esc(B.MAKERS[other].name)}</figcaption></figure>`).join("");
  const code = `import { renderMakerBall, makerBall } from "@johnmorrisdotca/dougu-sports/brands";\nimport { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst ball = renderMakerBall("${state.ball}", "${id}", { layout: "mark" }, { size: 320 });\n// or spread the print into any other call:\nconst same = renderEmblem("${state.ball}", { size: 320, ...makerBall("${id}") });\n`;
  return `<div class="compose-card"><div class="brand-ball-row">${pictures}</div><div class="brand-ball-row small">${spread}</div><details><summary>The call</summary><pre><code>${esc(code)}</code></pre></details><p class="copies"><button type="button" class="fam-button copy" data-code="${esc(code)}">Copy the call</button></p></div>`;
}

const TEE = "M62 18 L88 10 Q100 30 112 10 L138 18 L186 44 L168 82 L142 70 L142 188 L58 188 L58 70 L32 82 L14 44 Z";

function shirts(): string {
  const dark = state.look === "dark";
  const colours = dark ? ["#20262d", "#0f3d2e", "#7a1f33"] : ["#ffffff", "#e8e4da", "#1d2d78"];
  const pairs: [B.MakerId, B.TeamId, number][] = [["arvane", "saltmere", 0], ["kovreth", "larkmoor", 1], ["tarsin", "redfern", 2]];
  return pairs
    .map(([maker, team, index]) => {
      const shirt = colours[index];
      const onDark = dark || index === 2;
      const theme = onDark ? "dark" : "light";
      const art = `<svg viewBox="0 0 200 200" width="240" height="240" role="img" aria-label="A T-shirt with ${esc(B.MAKERS[maker].name)} on the chest and ${esc(B.TEAMS[team].city)} ${esc(B.TEAMS[team].nickname)} on the sleeve"><path d="${TEE}" fill="${shirt}" stroke="${dark ? "#4a525c" : "#b9b2a0"}" stroke-width="1.5" stroke-linejoin="round"/>${B.makerLogoGroup(maker, { x: 73, y: 58, size: 82 }, { theme, layout: "stacked" })}${B.teamLogoGroup(team, { x: 22, y: 46, size: 22 }, { theme })}</svg>`;
      return `<figure>${art}<figcaption>${esc(B.MAKERS[maker].name)} and ${esc(B.TEAMS[team].nickname)}</figcaption></figure>`;
    })
    .join("");
}

function render() {
  $("makers").innerHTML = B.MAKER_IDS.map(makerCard).join("");
  $("teams").innerHTML = B.TEAM_IDS.map(teamCard).join("");
  $("balls").innerHTML = balls();
  $("shirts").innerHTML = shirts();
  for (const b of $("look").querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === state.look));
  for (const b of $("layout").querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === state.layout));
  const next = new URLSearchParams();
  if (state.look !== "light") next.set("look", state.look);
  if (state.layout !== "mark") next.set("layout", state.layout);
  if (state.maker !== "arvane") next.set("maker", state.maker);
  if (state.ball !== "ball:baseball") next.set("ball", state.ball);
  try {
    history.replaceState(null, "", next.size === 0 ? location.pathname : `?${next}`);
  } catch {
    /* the address stays where it was */
  }
}

$("ball-maker").innerHTML = B.MAKER_IDS.map((id) => `<option value="${id}">${esc(B.MAKERS[id].name)}</option>`).join("");
($("ball-maker") as HTMLSelectElement).value = state.maker;
($("ball-kind") as HTMLSelectElement).value = state.ball;
$("look").addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { state.look = b.dataset.value as Look; render(); } });
$("layout").addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { state.layout = b.dataset.value as B.LogoLayout; render(); } });
$("ball-maker").addEventListener("change", (event) => { state.maker = (event.target as HTMLSelectElement).value as B.MakerId; render(); });
$("ball-kind").addEventListener("change", (event) => { state.ball = (event.target as HTMLSelectElement).value; render(); });
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
