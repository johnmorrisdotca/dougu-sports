// The playground: choose an emblem, a style, a look, a size and a tint, engrave it, and turn it (drag it, use the sliders or the arrow keys, or press the auto-turn); the drawing and the call that makes it are redrawn.
// The turning is `bindTurn`: the stage is the element it draws into, and the sliders and their readouts follow it both ways.
// The package is imported from ../src here so that the editor and `pnpm typecheck` see its types; the build of the demo (scripts/page.ts) turns the import into ./dist/index.js, the built package.
import { createAddressState } from "@johnmorrisdotca/kazoku-ui/address-state";
import * as D from "../src/index.ts";
import "../src/element.ts";
import "@johnmorrisdotca/kazoku-ui/view-controls/define";
import type { ViewControlsElement } from "@johnmorrisdotca/kazoku-ui/view-controls/element";
import type { ViewState } from "@johnmorrisdotca/kazoku-ui/view-controls";
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
const DEFAULTS: Record<(typeof CHOICES)[number] | "background", string> = { style: "metal", theme: "inherit", size: "256", tint: "", background: "" };
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
  background: string;
  engrave: string;
  /** "1" while it turns by itself because the reader asked (`?turn=1`, or Auto-turn), "0" otherwise; the pointer over the stage turns it without changing this. */
  turn: string;
}
/** The choices made with a row of buttons. */
const CHOICES = ["style", "theme", "size", "tint"] as const;
const state: State = {
  id: D.isEmblemId(params.get("id")) ? (params.get("id") as D.EmblemId) : FIRST,
  style: pick(params.get("style"), D.EMBLEM_STYLES, DEFAULTS.style as D.EmblemStyle),
  theme: pick<D.EmblemTheme>(params.get("theme"), ["inherit", "light", "dark", "auto"], "inherit"),
  size: pick(params.get("size"), ["32", "64", "128", "256"], DEFAULTS.size),
  tint: pick(params.get("tint"), ["", "#c8102e", "#1f4e9c", "#0b6e4f"], DEFAULTS.tint),
  background: pick(params.get("background"), BACKGROUNDS, DEFAULTS.background),
  engrave: (params.get("engrave") ?? "").slice(0, 24),
  turn: params.get("turn") === "1" ? "1" : "0",
};

$("emblem").innerHTML = Object.entries(D.EMBLEM_GROUPS)
  .filter(([, ids]) => ids.length > 0)
  .map(([group, ids]) => `<optgroup label="${group}">${ids.map((id) => `<option value="${id}">${D.emblemName(id)} (${id})</option>`).join("")}</optgroup>`)
  .join("");

const locale = () => (document.documentElement.lang === "ja" ? "ja" : "en");
/** True while the stage turns only because the mouse is over it (leaving stops it); Auto-turn and `?turn=1` are the reader's own. */
let hoverPlay = false;
/** What the stage draws with: the look, and how the turning behaves. The emblem waits still when the page opens and turns while the mouse is over it; `?turn=1` has it turn by itself from the start (not for a reader who prefers reduced motion), unless the address holds an angle. */
function turnOptions(): D.TurnControlOptions {
  // The hands (drag, wheel, pinch, keys, the bar) are the family's <kazoku-view-controls>; the emblem is drawn and turned by `setAngles`.
  const options: D.TurnControlOptions = { style: state.style, size: Number(state.size), theme: state.theme, locale: locale(), hands: false };
  if (state.tint) options.tint = state.tint;
  if (state.engrave.trim() !== "") options.engrave = state.engrave;
  return options;
}

/** The "Put it in your page" panel: which way, and whether the embedded emblem turns. */
const embedState = { way: pick(params.get("embed"), ["element", "iframe", "module", "img", "svg"] as const, "element"), turn: pick(params.get("eturn"), ["still", "turnable", "autoplay"] as const, "still") };

let embedKey = "";
const view = $("stage-view");
const turner = D.bindTurn(view, state.id, { ...turnOptions(), roll: number(params.get("roll"), -180, 180) });
const bar = $<ViewControlsElement>("view-bar");

const address = createAddressState({ defaults: { ...DEFAULTS, id: FIRST, embed: "element", eturn: "still" } });
/** The address follows. A spin changes it sixty times a second: the shared address state writes it once things settle. */
function writeAddress() {
  const next: Record<string, string | null> = { id: state.id, turn: state.turn === "1" ? "1" : null, engrave: state.engrave.trim() === "" ? null : state.engrave };
  for (const key of [...CHOICES, "background"] as const) next[key] = state[key];
  // The angle, the tilt and the zoom are the view controls' own, in the address beside these; the roll of a ball is this page's.
  next["roll"] = turner.angles.roll !== 0 ? String(turner.angles.roll) : null;
  next["embed"] = embedState.way;
  next["eturn"] = embedState.turn;
  address.setMany(next);
}

/** Brings everything but the drawing in line with the turner: the roll slider, the rows that apply, the bar and the call. */
function sync() {
  const a = turner.angles;
  const info = D.emblemInfo(state.id);
  const canTurn = turner.turnable;
  const ball = info.kind === "ball";
  $("roll-row").hidden = !(canTurn && ball);
  bar.toggleAttribute("flat", !canTurn);
  bar.hidden = !canTurn;
  $<HTMLInputElement>("roll").value = String(a.roll);
  $("roll-out").textContent = `${Math.round(a.roll)}°`;
  const turned = a.yaw !== 0 || a.pitch !== 0 || a.roll !== 0;
  const options: D.EmblemOptions = { style: state.style, size: Number(state.size), theme: state.theme };
  if (state.tint) options.tint = state.tint;
  if (state.engrave.trim() !== "") options.engrave = state.engrave;
  const shown = JSON.stringify(options).replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ").replace(/^\{/, "{ ").replace(/\}$/, " }");
  const angles = `yaw: ${Math.round(a.yaw)}, pitch: ${Math.round(a.pitch)}${ball && a.roll !== 0 ? `, roll: ${Math.round(a.roll)}` : ""}`;
  $("code").firstChild!.textContent = turned && canTurn
    ? `import { emblemFrame } from "@johnmorrisdotca/dougu-sports/turn";\n\nconst svg = emblemFrame("${state.id}", { ${shown.slice(2, -2)}, ${angles} });\n`
    : `import { renderEmblem } from "@johnmorrisdotca/dougu-sports/emblems";\n\nconst svg = renderEmblem("${state.id}", ${shown});\n`;
  drawEmbed();
  writeAddress();
}

/** The "Put it in your page" panel: the same emblem as the stage, as the code for the way chosen, and that code running beside it. */
function drawEmbed() {
  const a = turner.angles;
  const still = embedState.turn === "still" && !bar.state.turning;
  const options: D.EmbedOptions = { style: state.style, size: Number(state.size), theme: state.theme, locale: locale() };
  if (state.tint) options.tint = state.tint;
  if (still && turner.turnable) Object.assign(options, a.yaw !== 0 ? { yaw: Math.round(a.yaw) } : {}, a.pitch !== 0 ? { pitch: Math.round(a.pitch) } : {});
  if (embedState.turn !== "still") options.turnable = true;
  if (embedState.turn === "autoplay") options.autoplay = true;
  const key = JSON.stringify([embedState, state.id, options]);
  for (const b of $("embed-way").querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === embedState.way));
  for (const b of $("embed-turn").querySelectorAll<HTMLButtonElement>("button")) b.setAttribute("aria-pressed", String(b.dataset.value === embedState.turn));
  if (key === embedKey) return;
  embedKey = key;
  const shown = D.emblemEmbedCode(state.id, options);
  const code = { element: shown.html, iframe: shown.iframe, module: shown.module, img: shown.img, svg: shown.svg }[embedState.way];
  $("embed-code").firstChild!.textContent = code;
  const here = D.emblemEmbedCode(state.id, { ...options, site: new URL(".", location.href).href });
  $("embed-stage").innerHTML = { element: here.element, iframe: here.iframe, module: here.element, img: here.img, svg: here.svg }[embedState.way];
}
$("embed-way").addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { embedState.way = b.dataset.value as typeof embedState.way; drawEmbed(); writeAddress(); } });
$("embed-turn").addEventListener("click", (event) => { const b = (event.target as Element).closest("button"); if (b) { embedState.turn = b.dataset.value as typeof embedState.turn; drawEmbed(); writeAddress(); } });
$("embed-copy").addEventListener("click", () => { void navigator.clipboard?.writeText($("embed-code").textContent ?? ""); });
$("embed-download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([D.renderEmblem(state.id, { style: state.style, size: Number(state.size), theme: state.theme, ...(state.tint ? { tint: state.tint } : {}) })], { type: "image/svg+xml" }));
  link.download = `${state.id.replace(":", "-")}.svg`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});

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
$("roll").addEventListener("input", () => { turner.setAngles({ roll: Number($<HTMLInputElement>("roll").value) }); sync(); });
/** What the view bar tells the emblem: its angle and tilt turn it (a tilt up is a drag up, which lifts the front: the package's `pitch` goes down), its zoom and pan move the view. */
bar.addEventListener("kazoku-viewchange", (event) => {
  const v = (event as CustomEvent<ViewState>).detail;
  if (turner.turnable) turner.setAngles({ yaw: v.yaw, pitch: 0 - v.tilt });
  view.style.transform = v.zoom === 1 && v.panX === 0 && v.panY === 0 ? "" : `translate(${v.panX}px, ${v.panY}px) scale(${v.zoom})`;
  state.turn = v.turning && !hoverPlay ? "1" : "0";
  sync();
});
/** The bar as the thing the pointer over the stage plays and pauses. */
const barTurn = {
  get playing() { return bar.state.turning; },
  get angles() { return { yaw: bar.state.yaw }; },
  play() { bar.play(); return true; },
  pause() { bar.pause(); },
  togglePlay() { if (bar.state.turning) bar.pause(); else bar.play(); return bar.state.turning; },
};
/**
 * The mouse over a stage turns it and leaving stops it; a tap (a touch or a pen, not a drag) turns it and a second tap holds it. A reader who prefers reduced motion is never turned for by the pointer.
 * `hover` says whether the turn it started is the pointer's (and so is undone by leaving).
 */
function turnOnHover(stage: HTMLElement, control: { readonly playing: boolean; readonly angles: { yaw: number }; play(): boolean; pause(): void; togglePlay(): boolean }, hover: { on: boolean }) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let lastPointer = "mouse";
  let downYaw = 0;
  stage.addEventListener("pointerdown", (event) => { lastPointer = event.pointerType; downYaw = control.angles.yaw; });
  stage.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse" || reduced.matches || control.playing) return;
    hover.on = true;
    if (!control.play()) hover.on = false;
  });
  stage.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse" || !hover.on) return;
    hover.on = false;
    control.pause();
  });
  stage.addEventListener("click", () => {
    if (lastPointer === "mouse") return;
    if (Math.abs(((control.angles.yaw - downYaw + 540) % 360) - 180) > 3) return;
    hover.on = false;
    control.togglePlay();
  });
}
{
  // `hoverPlay` is a module variable the options read, so the stage's flag is a view on it.
  const hover = { get on() { return hoverPlay; }, set on(value: boolean) { hoverPlay = value; } };
  turnOnHover($("stage"), barTurn, hover);
}
// The language chooser changes <html lang>; the stage's spoken description follows it.
new MutationObserver(() => { turner.update(state.id, turnOptions()); drawPicks(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

drawPicks();
draw();
// `?turn=1` has it turn by itself from the start (the bar leaves a reader who prefers reduced motion still).
if (state.turn === "1" && !["yaw", "tilt"].some((key) => params.has(key)) && !matchMedia("(prefers-reduced-motion: reduce)").matches) bar.play();

// A trophy case: a few emblems that wait still and turn while the pointer is over them (or when tapped), each with its own button to keep it turning or hold it.
const CASE = ["trophy:hockey-cup", "trophy:tennis-cup", "medal:gold", "ball:rugby"];
for (const id of CASE) {
  const cell = document.createElement("li");
  cell.innerHTML = `<div class="case-stage" data-testid="case-stage"></div><button type="button" class="fam-button case-play" aria-pressed="false" data-testid="case-play"><span class="when-off" data-say="play">Auto-turn</span><span class="when-on" data-say="stop">Stop</span></button>`;
  $("case").append(cell);
  const button = cell.querySelector("button")!;
  const hover = { on: false };
  const stage = cell.querySelector<HTMLElement>(".case-stage")!;
  const control = D.bindTurn(stage, id, { size: 96, speed: 22, onPlayChange: (playing) => button.setAttribute("aria-pressed", String(playing)), locale: locale() });
  button.addEventListener("click", () => { hover.on = false; control.togglePlay(); });
  turnOnHover(stage, control, hover);
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
