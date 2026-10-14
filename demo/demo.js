// The playground: choose an emblem, a style, a look, a size and a tint, and turn it; the drawing and the call that makes it are redrawn.
import * as D from "./dist/index.js";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const FIRST = "trophy:hockey-cup";
const DEFAULTS = { style: "metal", theme: "inherit", size: "128", tint: "", yaw: 0, pitch: 0 };
const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);
const number = (value, low, high) => { const n = Number(value); return Number.isFinite(n) ? Math.max(low, Math.min(high, n)) : 0; };

const state = {
  id: D.isEmblemId(params.get("id")) ? params.get("id") : FIRST,
  style: pick(params.get("style"), D.EMBLEM_STYLES, DEFAULTS.style),
  theme: pick(params.get("theme"), ["inherit", "light", "dark", "auto"], DEFAULTS.theme),
  size: pick(params.get("size"), ["32", "64", "128", "256"], DEFAULTS.size),
  tint: pick(params.get("tint"), ["", "#c8102e", "#1f4e9c", "#0b6e4f"], DEFAULTS.tint),
  yaw: number(params.get("yaw"), -180, 180),
  pitch: number(params.get("pitch"), -80, 80),
};

$("emblem").innerHTML = Object.entries(D.EMBLEM_GROUPS)
  .filter(([, ids]) => ids.length > 0)
  .map(([group, ids]) => `<optgroup label="${group}">${ids.map((id) => `<option value="${id}">${D.emblemName(id)} (${id})</option>`).join("")}</optgroup>`)
  .join("");

function draw() {
  const options = { style: state.style, size: Number(state.size), theme: state.theme };
  if (state.tint) options.tint = state.tint;
  const turned = state.yaw !== 0 || state.pitch !== 0;
  const info = D.emblemInfo(state.id);
  const svg = turned ? D.emblemFrame(state.id, { ...options, yaw: state.yaw, pitch: state.pitch }) : D.renderEmblem(state.id, options);
  const stage = $("stage");
  stage.innerHTML = svg;
  stage.dataset.look = state.theme === "light" || state.theme === "dark" ? state.theme : "page";
  $("note").textContent = `${info.en} · ${info.ja} · ${info.kind}, from ${info.source}.`;
  $("emblem").value = state.id;
  for (const group of ["style", "theme", "size", "tint"]) for (const b of $(group).querySelectorAll("button")) b.setAttribute("aria-pressed", String(b.dataset.value === state[group]));
  const canTurn = info.kind !== "icon" && info.kind !== "gear";
  $("turn-row").hidden = !canTurn;
  $("tilt-row").hidden = !canTurn;
  $("yaw").value = String(state.yaw);
  $("pitch").value = String(state.pitch);
  $("yaw-out").textContent = `${state.yaw}°`;
  $("pitch-out").textContent = `${state.pitch}°`;
  const shown = JSON.stringify(options).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ").replace(/^\{/, "{ ").replace(/\}$/, " }");
  $("code").firstChild.textContent = turned
    ? `import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";\n\nconst svg = emblemFrame("${state.id}", { ${shown.slice(2, -2)}, yaw: ${state.yaw}, pitch: ${state.pitch} });\n`
    : `import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = renderEmblem("${state.id}", ${shown});\n`;
  const next = new URLSearchParams();
  if (state.id !== FIRST) next.set("id", state.id);
  for (const key of ["style", "theme", "size", "tint"]) if (state[key] !== DEFAULTS[key]) next.set(key, state[key]);
  for (const key of ["yaw", "pitch"]) if (state[key] !== 0) next.set(key, String(state[key]));
  // Safari refuses more than a hundred of these in thirty seconds; the address is a convenience, so a refusal must not stop the drawing.
  try {
    history.replaceState(null, "", next.size === 0 ? location.pathname : `?${next}`);
  } catch {
    /* the address stays where it was */
  }
}

$("emblem").addEventListener("change", () => { state.id = $("emblem").value; state.yaw = 0; state.pitch = 0; draw(); });
for (const group of ["style", "theme", "size", "tint"]) {
  $(group).addEventListener("click", (event) => { const b = event.target.closest("button"); if (b) { state[group] = b.dataset.value; draw(); } });
}
$("yaw").addEventListener("input", () => { state.yaw = Number($("yaw").value); draw(); });
$("pitch").addEventListener("input", () => { state.pitch = Number($("pitch").value); draw(); });

draw();
