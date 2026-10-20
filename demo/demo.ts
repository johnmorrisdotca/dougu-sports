// The playground: choose an emblem, a style, a look, a size and a tint, engrave it, and turn it (drag it, use the sliders or the arrow keys, or press the auto-turn); the drawing and the call that makes it are redrawn.
// The turning is `bindTurn`: the stage is the element it draws into, and the sliders and their readouts follow it both ways.
// The package is imported from ../src here so that the editor and `pnpm typecheck` see its types; the build of the demo (scripts/page.ts) turns the import into ./dist/index.js, the built package.
import * as D from "../src/index.ts";
import type { BackgroundPresetName } from "../scripts/family-backgrounds.ts";

declare global {
  interface Window {
    /** The family's language chooser, made by the page (scripts/family-template.mjs). */
    familyPage?: { say(): void };
  }
}

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;
const params = new URLSearchParams(location.search);
const FIRST: D.EmblemId = "trophy:stanley-cup";
const DEFAULTS: Record<(typeof CHOICES)[number] | "background", string> = { style: "metal", theme: "inherit", size: "256", tint: "", speed: "36", background: "" };
const BACKGROUNDS = [...document.querySelectorAll<HTMLOptionElement>("#background option")].map((o) => o.value);
const pick = <T extends string>(value: string | null, allowed: readonly T[], fallback: T): T => allowed.find((one) => one === value) ?? fallback;
const number = (value: string | null, low: number, high: number) => { const n = Number(value); return Number.isFinite(n) ? Math.max(low, Math.min(high, n)) : 0; };

/** What the page has chosen; the address says the same. */
interface State {
  id: D.EmblemId;
  style: D.EmblemStyle;
  theme: D.EmblemTheme;
  size: string;
  tint: string;
  speed: string;
  background: string;
  engrave: string;
  /** "1" while it turns by itself (the default), "0" once it has been paused: the address says so. */
  turn: string;
}
/** The choices made with a row of buttons. */
const CHOICES = ["style", "theme", "size", "tint", "speed"] as const;
const state: State = {
  id: D.isEmblemId(params.get("id")) ? (params.get("id") as D.EmblemId) : FIRST,
  style: pick(params.get("style"), D.EMBLEM_STYLES, DEFAULTS.style as D.EmblemStyle),
  theme: pick<D.EmblemTheme>(params.get("theme"), ["inherit", "light", "dark", "auto"], "inherit"),
  size: pick(params.get("size"), ["32", "64", "128", "256"], DEFAULTS.size),
  tint: pick(params.get("tint"), ["", "#c8102e", "#1f4e9c", "#0b6e4f"], DEFAULTS.tint),
  speed: pick(params.get("speed"), ["18", "36", "90"], DEFAULTS.speed),
  background: pick(params.get("background"), BACKGROUNDS, DEFAULTS.background),
  engrave: (params.get("engrave") ?? "").slice(0, 24),
  turn: params.get("turn") === "0" ? "0" : "1",
};

$("emblem").innerHTML = Object.entries(D.EMBLEM_GROUPS)
  .filter(([, ids]) => ids.length > 0)
  .map(([group, ids]) => `<optgroup label="${group}">${ids.map((id) => `<option value="${id}">${D.emblemName(id)} (${id})</option>`).join("")}</optgroup>`)
  .join("");

/** False until the stage is bound and drawn once: the auto-turn starts inside `bindTurn`, before there is a `turner` to read. */
let booted = false;
const locale = () => (document.documentElement.lang === "ja" ? "ja" : "en");
/** What the stage draws with: the look, and how the turning behaves. The emblem turns by itself when the page opens (not for a reader who prefers reduced motion), unless the address holds an angle or says turn=0. */
function turnOptions(): D.TurnControlOptions {
  // A spin and a drag turn many times a second: they follow with a slow address. A choice is written at once.
  const options: D.TurnControlOptions = { style: state.style, size: Number(state.size), theme: state.theme, speed: Number(state.speed), locale: locale(), onTurn: () => sync(false), onPlayChange: (playing) => { state.turn = playing ? "1" : "0"; if (booted) sync(true); } };
  if (state.tint) options.tint = state.tint;
  if (state.engrave.trim() !== "") options.engrave = state.engrave;
  return options;
}

const turner = D.bindTurn($("stage"), state.id, {
  ...turnOptions(),
  autoPlay: state.turn === "1" && !["yaw", "pitch", "roll"].some((key) => params.has(key)),
  yaw: number(params.get("yaw"), -180, 180),
  pitch: number(params.get("pitch"), -60, 60),
  roll: number(params.get("roll"), -180, 180),
});

let urlTimer: ReturnType<typeof setTimeout> | undefined;
/** The address follows, but a spin changes it sixty times a second, and Safari refuses more than a hundred changes in thirty seconds: it is written once things settle. */
function writeAddress() {
  const next = new URLSearchParams();
  if (state.id !== FIRST) next.set("id", state.id);
  for (const key of [...CHOICES, "background"] as const) if (state[key] !== DEFAULTS[key]) next.set(key, state[key]);
  if (state.turn === "0") next.set("turn", "0");
  // While it turns by itself the angles change every frame: the address then leaves them out, so a reload starts the turn again.
  const a = turner.angles;
  if (!turner.playing) for (const key of ["yaw", "pitch", "roll"] as const) if (a[key] !== 0) next.set(key, String(a[key]));
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
  for (const name of ["yaw", "pitch", "roll"] as const) {
    $<HTMLInputElement>(name).value = String(a[name]);
    $(`${name}-out`).textContent = `${Math.round(a[name])}°`;
  }
  $("play").setAttribute("aria-pressed", String(turner.playing));
  const turned = a.yaw !== 0 || a.pitch !== 0 || a.roll !== 0;
  const options: D.EmblemOptions = { style: state.style, size: Number(state.size), theme: state.theme };
  if (state.tint) options.tint = state.tint;
  if (state.engrave.trim() !== "") options.engrave = state.engrave;
  const shown = JSON.stringify(options).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ").replace(/^\{/, "{ ").replace(/\}$/, " }");
  const angles = `yaw: ${Math.round(a.yaw)}, pitch: ${Math.round(a.pitch)}${ball && a.roll !== 0 ? `, roll: ${Math.round(a.roll)}` : ""}`;
  $("code").firstChild!.textContent = turned && canTurn
    ? `import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";\n\nconst svg = emblemFrame("${state.id}", { ${shown.slice(2, -2)}, ${angles} });\n`
    : `import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = renderEmblem("${state.id}", ${shown});\n`;
  clearTimeout(urlTimer);
  if (settled) writeAddress();
  else urlTimer = setTimeout(writeAddress, 250);
}

let backgrounds: typeof import("../scripts/family-backgrounds.ts") | undefined;
const dark = matchMedia("(prefers-color-scheme: dark)");
/**
 * The optional background behind the stage: one of the family's twenty-five, drawn in code (scripts/family-backgrounds.ts, loaded only when one is chosen), in the variant of the look, and the stage's
 * text takes the ink it returns. It is a picture behind the stage and nothing more: the emblem the package draws is the same with or without it.
 */
async function paintBackground() {
  const stage = $("stage");
  if (state.background === "") {
    stage.style.backgroundImage = "";
    stage.style.color = "";
    return;
  }
  backgrounds ??= await import("../scripts/family-backgrounds.ts");
  if (state.background === "") return;
  const theme = state.theme === "dark" || (state.theme !== "light" && dark.matches) ? "dark" : "light";
  const { defs, body, ink } = backgrounds.backgroundSvg(state.background as BackgroundPresetName, { width: 1200, height: 675, theme, id: "stage-bg" });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><rect width="1200" height="675" fill="${ink.base}"/>${body}</svg>`;
  stage.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  stage.style.backgroundSize = "cover";
  stage.style.backgroundPosition = "center";
  stage.style.color = ink.text;
}
dark.addEventListener("change", () => { if (state.background !== "") paintBackground(); });

/** The emblem or its look changed: the stage draws again at the same angles. */
function draw() {
  turner.update(state.id, turnOptions());
  const info = D.emblemInfo(state.id);
  const stage = $("stage");
  stage.dataset.look = state.background !== "" ? "background" : state.theme === "light" || state.theme === "dark" ? state.theme : "page";
  paintBackground();
  $("note").textContent = `${info.en} · ${info.ja} · ${info.kind}, from ${info.source}.`;
  $<HTMLSelectElement>("emblem").value = state.id;
  $<HTMLSelectElement>("background").value = state.background;
  for (const b of $("picks").querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.id === state.id));
  for (const group of CHOICES) for (const b of $(group).querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === state[group]));
  sync();
}

/** A few emblems one press away, beside the stage: the Stanley Cup and the World Cup, balls that roll, a medal and a banner that flip like coins, and a skate. */
const PICKS: D.EmblemId[] = ["trophy:stanley-cup", "trophy:fifa-world-cup", "ball:soccer", "ball:basketball", "ball:baseball", "medal:gold", "trophy:championship-banner", "gear:hockey-skate"];
function drawPicks() {
  $("picks").replaceChildren(...PICKS.map((id) => {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.id = id;
    b.textContent = D.emblemName(id, locale());
    b.setAttribute("aria-pressed", String(id === state.id));
    return b;
  }));
}
$("picks").addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b?.dataset.id) { state.id = b.dataset.id as D.EmblemId; draw(); } });
$("emblem").addEventListener("change", () => { state.id = $<HTMLSelectElement>("emblem").value as D.EmblemId; draw(); });
for (const group of CHOICES) {
  $(group).addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { (state as Record<typeof group, string>)[group] = b.dataset.value ?? ""; draw(); } });
}
$("background").addEventListener("change", () => { state.background = $<HTMLSelectElement>("background").value; draw(); });
$<HTMLInputElement>("engrave").value = state.engrave;
$("engrave").addEventListener("input", () => { state.engrave = $<HTMLInputElement>("engrave").value; draw(); });
// A slider takes over from the auto-turn: setAngles pauses it.
for (const name of ["yaw", "pitch", "roll"]) {
  $(name).addEventListener("input", () => { turner.setAngles({ [name]: Number($<HTMLInputElement>(name).value) }); sync(true); });
}
$("play").addEventListener("click", () => { turner.togglePlay(); sync(true); });
// The language chooser changes <html lang>; the stage's spoken description follows it.
new MutationObserver(() => { turner.update(state.id, turnOptions()); drawPicks(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

drawPicks();
booted = true;
draw();

// A trophy case: a few emblems that turn by themselves (a reader who prefers reduced motion gets them still), each with its own button to hold or start it.
const CASE = ["trophy:hockey-cup", "trophy:tennis-cup", "medal:gold", "ball:rugby"];
for (const id of CASE) {
  const cell = document.createElement("li");
  cell.innerHTML = `<div class="case-stage" data-testid="case-stage"></div><button type="button" class="fam-button case-play" aria-pressed="false" data-testid="case-play"><span class="when-off" data-say="play">Auto-turn</span><span class="when-on" data-say="stop">Stop</span></button>`;
  $("case").append(cell);
  const button = cell.querySelector("button")!;
  const control = D.bindTurn(cell.querySelector<HTMLElement>(".case-stage")!, id, { size: 96, speed: 45, autoPlay: true, onPlayChange: (playing) => button.setAttribute("aria-pressed", String(playing)), locale: locale() });
  button.addEventListener("click", () => control.togglePlay());
}
// The words of the buttons just added, in the page's language.
window.familyPage?.say();

// The puck workshop: a printed puck whose face is made from the fields beside it, turned by dragging it.
const PUCK_IDS = D.PUCK_IDS;
$("puck-design").innerHTML = PUCK_IDS.map((id) => `<option value="${id}">${D.emblemName(id)} (${id})</option>`).join("");
const puck: { id: D.PuckId; ring: string; text: string; name: string; number: string; sign: string; seed: number } = { id: PUCK_IDS[0], ring: "", text: "", name: "", number: "", sign: "", seed: 7 };
const puckTurner = D.bindTurn($("puck-stage"), puck.id, { size: 256, speed: 36 });
/** What the fields ask for: only what was typed, so the puck's own words show through until they are replaced. */
function puckFace() {
  const face: D.PuckFace = {};
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
  $<HTMLSelectElement>("puck-design").value = puck.id;
  for (const b of $("puck-sign").querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === puck.sign));
  $("puck-seed-out").textContent = String(puck.seed);
  $("puck-code").firstChild!.textContent = `import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = renderEmblem("${puck.id}", { size: 256, face: ${JSON.stringify(face).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ")} });\n`;
}
$("puck-design").addEventListener("change", () => { puck.id = $<HTMLSelectElement>("puck-design").value as D.PuckId; drawPuck(); });
for (const key of ["ring", "text", "name", "number"] as const) $(`puck-${key}`).addEventListener("input", () => { puck[key] = $<HTMLInputElement>(`puck-${key}`).value; drawPuck(); });
$("puck-sign").addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { puck.sign = b.dataset.value ?? ""; drawPuck(); } });
$("puck-seed").addEventListener("input", () => { puck.seed = Number($<HTMLInputElement>("puck-seed").value); drawPuck(); });
drawPuck();

// The custom ball: a baseball, a softball or a soccer ball painted and printed from the fields beside it, turned by dragging it. A logo that is picked is read in the browser into a data URI and never sent anywhere.
/** A neutral placeholder logo and mark, drawn for this demo: a ring, a chevron and a star; and a diamond. They stand in for the logo and the mark you would pass. */
const SAMPLE_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#1f4e8c"/><circle cx="50" cy="50" r="37" fill="none" stroke="#fff" stroke-width="3"/><path d="M24 64 L50 38 L76 64" fill="none" stroke="#f2b705" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><polygon points="50,14 54,25 66,25 56,32 60,43 50,36 40,43 44,32 34,25 46,25" fill="#fff"/></svg>`;
const SAMPLE_MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,6 94,50 50,94 6,50" fill="#1b2a5c"/><circle cx="50" cy="50" r="16" fill="#fff"/></svg>`;
const BALL_WORDS: Record<string, string> = { "ball:baseball": "Baseball", "ball:softball": "Softball", "ball:soccer": "Soccer" };
const ball = { id: "ball:baseball", colour: "", two: "", second: "#c4262e", stamp: true, sign: false, line1: "", line2: "", script: true, word: "", mark: "letter", logo: "" };
const ballTurner = D.bindTurn($("ball-stage"), ball.id, { size: 320, speed: 36 });
/** What the fields ask for: only what was set, so the ball's own words and colours show through until they are replaced. */
function ballOptions(): D.EmblemOptions {
  const o: D.EmblemOptions = { size: 320 };
  const paint: D.BallPaint = {};
  if (ball.colour !== "") paint.body = ball.colour;
  if (ball.two !== "") {
    paint.second = ball.second;
    paint.split = ball.two === "half" ? "half" : "seam";
  }
  if (paint.body !== undefined || paint.second !== undefined) o.paint = paint;
  if (ball.logo !== "") o.decal = ball.logo;
  if (ball.stamp) {
    const stamp: D.BallStamp = {};
    const lines = [ball.line1.trim(), ball.line2.trim()];
    if (lines[0] !== "" || lines[1] !== "") stamp.lines = lines[0] === "" ? [lines[1] as string] : lines[1] === "" ? [lines[0] as string] : lines;
    if (ball.sign) stamp.sign = true;
    o.stamp = Object.keys(stamp).length === 0 ? true : stamp;
  }
  if (ball.script) o.script = ball.word.trim() === "" ? true : ball.word.trim();
  if (ball.mark === "sample") o.mark = { svg: SAMPLE_MARK };
  else if (ball.mark === "none") o.mark = false;
  else if (ball.mark === "letter" && !ball.script) o.mark = true;
  return o;
}
function drawBall() {
  const options = ballOptions();
  ballTurner.update(ball.id, options);
  $<HTMLSelectElement>("ball-id").value = ball.id;
  $<HTMLInputElement>("ball-line2").placeholder = `DIGITAL ${(BALL_WORDS[ball.id] ?? "").toUpperCase()}`;
  $<HTMLInputElement>("ball-word").placeholder = BALL_WORDS[ball.id] ?? "";
  for (const key of ["colour", "two", "second", "mark"] as const) for (const b of $(`ball-${key}`).querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === ball[key]));
  const shown = JSON.stringify(options, (_k, v: unknown) => (typeof v === "string" && v.startsWith("data:") ? "data:image/…" : typeof v === "string" && v.startsWith("<svg") ? "<svg …>" : v)).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ").replace(/^\{/, "{ ").replace(/\}$/, " }");
  $("ball-code").firstChild!.textContent = `import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = renderEmblem("${ball.id}", ${shown});\n`;
}
$("ball-id").addEventListener("change", () => { ball.id = $<HTMLSelectElement>("ball-id").value; drawBall(); });
for (const key of ["colour", "two", "second", "mark"] as const) {
  $(`ball-${key}`).addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { ball[key] = b.dataset.value ?? ""; drawBall(); } });
}
for (const [key, id] of [["stamp", "ball-stamp"], ["sign", "ball-sign"], ["script", "ball-script"]] as const) $(id).addEventListener("change", () => { ball[key] = $<HTMLInputElement>(id).checked; drawBall(); });
for (const [key, id] of [["line1", "ball-line1"], ["line2", "ball-line2"], ["word", "ball-word"]] as const) $(id).addEventListener("input", () => { ball[key] = $<HTMLInputElement>(id).value; drawBall(); });
$("ball-sample").addEventListener("click", () => { ball.logo = SAMPLE_LOGO; $("ball-note").textContent = "Sample logo."; drawBall(); });
$("ball-clear").addEventListener("click", () => { ball.logo = ""; $<HTMLInputElement>("ball-logo").value = ""; $("ball-note").textContent = ""; drawBall(); });
$("ball-logo").addEventListener("change", () => {
  const file = $<HTMLInputElement>("ball-logo").files?.[0];
  if (file === undefined) return;
  if (file.size > 300000) { $("ball-note").textContent = "That file is over 300 kB: pick a smaller one."; return; }
  const reader = new FileReader();
  // The file is read in the browser into a data URI, and the package draws it on the ball; nothing leaves the page.
  reader.addEventListener("load", () => { ball.logo = String(reader.result); $("ball-note").textContent = file.type.includes("svg") ? "SVG: wrapped onto the ball exactly." : "Picture: laid on in small pieces."; drawBall(); });
  reader.readAsDataURL(file);
});
drawBall();
