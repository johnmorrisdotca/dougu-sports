// The playground: choose an emblem, a style, a look, a size and a tint, engrave it, and turn it (drag it, use the sliders or the arrow keys, or press the auto-turn); the drawing and the call that makes it are redrawn.
// The turning is `bindTurn`: the stage is the element it draws into, and the sliders and their readouts follow it both ways.
import * as D from "./dist/index.js";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const FIRST = "trophy:hockey-cup";
const DEFAULTS = { style: "metal", theme: "inherit", size: "128", tint: "", speed: "36" };
const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
const number = (value, low, high) => { const n = Number(value); return Number.isFinite(n) ? Math.max(low, Math.min(high, n)) : 0; };

const state = {
  id: D.isEmblemId(params.get("id")) ? params.get("id") : FIRST,
  style: pick(params.get("style"), D.EMBLEM_STYLES, DEFAULTS.style),
  theme: pick(params.get("theme"), ["inherit", "light", "dark", "auto"], DEFAULTS.theme),
  size: pick(params.get("size"), ["32", "64", "128", "256"], DEFAULTS.size),
  tint: pick(params.get("tint"), ["", "#c8102e", "#1f4e9c", "#0b6e4f"], DEFAULTS.tint),
  speed: pick(params.get("speed"), ["18", "36", "90"], DEFAULTS.speed),
  engrave: (params.get("engrave") ?? "").slice(0, 24),
};

$("emblem").innerHTML = Object.entries(D.EMBLEM_GROUPS)
  .filter(([, ids]) => ids.length > 0)
  .map(([group, ids]) => `<optgroup label="${group}">${ids.map((id) => `<option value="${id}">${D.emblemName(id)} (${id})</option>`).join("")}</optgroup>`)
  .join("");

const locale = () => (document.documentElement.lang === "ja" ? "ja" : "en");
/** What the stage draws with: the look, and how the turning behaves. Nothing turns until the reader presses the auto-turn. */
function turnOptions() {
  // A spin and a drag turn many times a second: they follow with a slow address. A choice is written at once.
  const options = { style: state.style, size: Number(state.size), theme: state.theme, speed: Number(state.speed), locale: locale(), onTurn: () => sync(false), onPlayChange: () => sync(true) };
  if (state.tint) options.tint = state.tint;
  if (state.engrave.trim() !== "") options.engrave = state.engrave;
  return options;
}

const turner = D.bindTurn($("stage"), state.id, {
  ...turnOptions(),
  yaw: number(params.get("yaw"), -180, 180),
  pitch: number(params.get("pitch"), -60, 60),
  roll: number(params.get("roll"), -180, 180),
});

let urlTimer;
/** The address follows, but a spin changes it sixty times a second, and Safari refuses more than a hundred changes in thirty seconds: it is written once things settle. */
function writeAddress() {
  const next = new URLSearchParams();
  if (state.id !== FIRST) next.set("id", state.id);
  for (const key of ["style", "theme", "size", "tint", "speed"]) if (state[key] !== DEFAULTS[key]) next.set(key, state[key]);
  const a = turner.angles;
  for (const key of ["yaw", "pitch", "roll"]) if (a[key] !== 0) next.set(key, String(a[key]));
  if (state.engrave.trim() !== "") next.set("engrave", state.engrave);
  try {
    history.replaceState(null, "", next.size === 0 ? location.pathname : `?${next}`);
  } catch {
    /* the address stays where it was */
  }
}

/** Brings everything but the drawing in line with the turner: the sliders and readouts, the rows that apply, the button and the call. */
function sync(settled = true) {
  const a = turner.angles;
  const info = D.emblemInfo(state.id);
  const canTurn = turner.turnable;
  const ball = info.kind === "ball";
  $("turn-row").hidden = !canTurn;
  $("tilt-row").hidden = !canTurn;
  $("roll-row").hidden = !(canTurn && ball);
  $("spin-row").hidden = !canTurn;
  for (const [name, key] of [["yaw", "yaw"], ["pitch", "pitch"], ["roll", "roll"]]) {
    $(name).value = String(a[key]);
    $(`${name}-out`).textContent = `${Math.round(a[key])}°`;
  }
  $("play").setAttribute("aria-pressed", String(turner.playing));
  const turned = a.yaw !== 0 || a.pitch !== 0 || a.roll !== 0;
  const options = { style: state.style, size: Number(state.size), theme: state.theme };
  if (state.tint) options.tint = state.tint;
  if (state.engrave.trim() !== "") options.engrave = state.engrave;
  const shown = JSON.stringify(options).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ").replace(/^\{/, "{ ").replace(/\}$/, " }");
  const angles = `yaw: ${Math.round(a.yaw)}, pitch: ${Math.round(a.pitch)}${ball && a.roll !== 0 ? `, roll: ${Math.round(a.roll)}` : ""}`;
  $("code").firstChild.textContent = turned && canTurn
    ? `import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";\n\nconst svg = emblemFrame("${state.id}", { ${shown.slice(2, -2)}, ${angles} });\n`
    : `import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = renderEmblem("${state.id}", ${shown});\n`;
  clearTimeout(urlTimer);
  if (settled) writeAddress();
  else urlTimer = setTimeout(writeAddress, 250);
}

/** The emblem or its look changed: the stage draws again at the same angles. */
function draw() {
  turner.update(state.id, turnOptions());
  const info = D.emblemInfo(state.id);
  const stage = $("stage");
  stage.dataset.look = state.theme === "light" || state.theme === "dark" ? state.theme : "page";
  $("note").textContent = `${info.en} · ${info.ja} · ${info.kind}, from ${info.source}.`;
  $("emblem").value = state.id;
  for (const group of ["style", "theme", "size", "tint", "speed"]) for (const b of $(group).querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset.value === state[group]));
  sync();
}

$("emblem").addEventListener("change", () => { state.id = $("emblem").value; draw(); });
for (const group of ["style", "theme", "size", "tint", "speed"]) {
  $(group).addEventListener("click", (event) => { const b = event.target.closest("button"); if (b) { state[group] = b.dataset.value; draw(); } });
}
$("engrave").value = state.engrave;
$("engrave").addEventListener("input", () => { state.engrave = $("engrave").value; draw(); });
// A slider takes over from the auto-turn: setAngles pauses it.
for (const name of ["yaw", "pitch", "roll"]) {
  $(name).addEventListener("input", () => { turner.setAngles({ [name]: Number($(name).value) }); sync(true); });
}
$("play").addEventListener("click", () => { turner.togglePlay(); sync(true); });
// The language chooser changes <html lang>; the stage's spoken description follows it.
new MutationObserver(() => turner.update(state.id, turnOptions())).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

draw();

// A trophy case: a few emblems that turn, each with its own button. Nothing turns until a button is pressed.
const CASE = ["trophy:hockey-cup", "trophy:tennis-cup", "medal:gold", "ball:rugby"];
for (const id of CASE) {
  const cell = document.createElement("li");
  cell.innerHTML = `<div class="case-stage" data-testid="case-stage"></div><button type="button" class="fam-button case-play" aria-pressed="false" data-testid="case-play"><span class="when-off" data-say="play">Auto-turn</span><span class="when-on" data-say="stop">Stop</span></button>`;
  $("case").append(cell);
  const button = cell.querySelector("button");
  const control = D.bindTurn(cell.querySelector(".case-stage"), id, { size: 96, speed: 45, onPlayChange: (playing) => button.setAttribute("aria-pressed", String(playing)), locale: locale() });
  button.addEventListener("click", () => control.togglePlay());
}
// The words of the buttons just added, in the page's language.
window.familyPage?.say();

// The puck workshop: a printed puck whose face is made from the fields beside it, turned by dragging it.
const PUCK_IDS = D.PUCK_IDS;
$("puck-design").innerHTML = PUCK_IDS.map((id) => `<option value="${id}">${D.emblemName(id)} (${id})</option>`).join("");
const puck = { id: PUCK_IDS[0], ring: "", text: "", name: "", number: "", sign: "", seed: 7 };
const puckTurner = D.bindTurn($("puck-stage"), puck.id, { size: 256, speed: 36 });
/** What the fields ask for: only what was typed, so the puck's own words show through until they are replaced. */
function puckFace() {
  const face = {};
  if (puck.ring.trim() !== "") face.ringText = puck.ring.trim();
  if (puck.text.trim() !== "") face.text = puck.text.trim();
  if (puck.name.trim() !== "") face.name = puck.name.trim();
  if (puck.number.trim() !== "") face.number = puck.number.trim();
  if (puck.sign !== "") {
    face.signature = puck.seed;
    face.colors = { signature: puck.sign === "black" ? "#16171a" : "#e8b923" };
  }
  return face;
}
function drawPuck() {
  const face = puckFace();
  puckTurner.update(puck.id, { size: 256, face });
  $("puck-design").value = puck.id;
  for (const b of $("puck-sign").querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset.value === puck.sign));
  $("puck-seed-out").textContent = String(puck.seed);
  $("puck-code").firstChild.textContent = `import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = renderEmblem("${puck.id}", { size: 256, face: ${JSON.stringify(face).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ")} });\n`;
}
$("puck-design").addEventListener("change", () => { puck.id = $("puck-design").value; drawPuck(); });
for (const key of ["ring", "text", "name", "number"]) $(`puck-${key}`).addEventListener("input", () => { puck[key] = $(`puck-${key}`).value; drawPuck(); });
$("puck-sign").addEventListener("click", (event) => { const b = event.target.closest("button"); if (b) { puck.sign = b.dataset.value; drawPuck(); } });
$("puck-seed").addEventListener("input", () => { puck.seed = Number($("puck-seed").value); drawPuck(); });
drawPuck();
