// The gallery: every emblem of the built package, by group, with its id, its three styles, five turns, and buttons that copy its id and the call that draws it. A filter narrows the list by id or name.
import * as D from "./dist/index.js";

const $ = (id) => document.getElementById(id);
const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const TURNS = [-120, -60, 0, 60, 120];

function card(id) {
  const info = D.emblemInfo(id);
  const styles = D.EMBLEM_STYLES.map((style) => `<figure>${D.renderEmblem(id, { style, size: 72, grain: false })}<figcaption>${style}</figcaption></figure>`).join("");
  const turns = `<div class="turns" role="group" aria-label="${esc(info.en)} turned">${TURNS.map((yaw) => D.emblemFrame(id, { yaw, size: 48 })).join("")}</div>`;
  // An emblem that takes an engraving shows one: the front, then turned a third of a turn, then its back.
  const takes = D.renderEmblem(id, { engrave: "MVP" }) !== D.renderEmblem(id) || D.renderEmblem(id, { year: 2026 }) !== D.renderEmblem(id);
  const cut = { engrave: "MVP 2026", engraveBack: "2026", size: 72 };
  const engraved = takes ? `<div class="turns engraved" role="group" aria-label="${esc(info.en)} engraved">${[0, 50, 180].map((yaw) => D.emblemFrame(id, { ...cut, yaw })).join("")}<code>engrave: "MVP 2026"</code></div>` : "";
  const call = `renderEmblem("${id}")`;
  const text = `${id} ${info.en} ${info.ja} ${info.kind} ${info.source}`.toLowerCase();
  return `<li id="${esc(id.replace(":", "-"))}" data-text="${esc(text)}"><h3>${esc(info.en)} <span lang="ja">${esc(info.ja)}</span></h3><p><code>${esc(id)}</code> · ${info.kind} · ${info.source}</p><div class="styles">${styles}</div>${turns}${engraved}<p class="copies"><button type="button" class="fam-button copy" data-code="${esc(id)}" aria-label="Copy the id ${esc(id)}">Copy id</button> <button type="button" class="fam-button copy" data-code="${esc(call)}" aria-label="Copy the call for ${esc(id)}">Copy call</button></p></li>`;
}

$("sections").innerHTML = Object.entries(D.EMBLEM_GROUPS)
  .filter(([, ids]) => ids.length > 0)
  .map(([group, ids]) => `<section class="more" id="g-${group}" aria-labelledby="h-${group}"><h2 id="h-${group}">${group}</h2><ul class="cards">${ids.map(card).join("")}</ul></section>`)
  .join("");

function filter() {
  const words = $("find").value.toLowerCase().split(/\s+/).filter(Boolean);
  let shown = 0;
  for (const li of document.querySelectorAll(".cards li")) {
    const match = words.every((w) => li.dataset.text.includes(w));
    li.hidden = !match;
    if (match) shown++;
  }
  for (const section of document.querySelectorAll("#sections section")) section.hidden = section.querySelectorAll("li:not([hidden])").length === 0;
  $("count").textContent = `${shown} of ${D.EMBLEM_IDS.length} emblems`;
}
$("find").addEventListener("input", filter);
filter();

/** Copies text with the clipboard, or with a hidden field where the page may not use it. */
async function copy(text) {
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
  const button = event.target.closest("button.copy");
  if (!button) return;
  const label = button.textContent;
  await copy(button.dataset.code);
  button.textContent = "Copied";
  setTimeout(() => { button.textContent = label; }, 1400);
});
