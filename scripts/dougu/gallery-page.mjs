// The gallery page of every ball and every piece of gear: its id, its names, its size and the rule that gives it, both styles, and for a ball a turning demo. The page is one static HTML file: the
// cards are drawn here, so it reads with no script; a small module in it imports the library (`libBase`, a path from the page to the built files) to turn a ball when it is clicked or focused.
const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SIZE_LINE = (size) => {
  if (size === undefined) return "";
  const parts = [];
  if (size.diameterMm !== undefined) parts.push(`${size.diameterMm} mm across`);
  if (size.lengthMm !== undefined) parts.push(`${size.lengthMm} mm long`);
  if (size.thicknessMm !== undefined) parts.push(`${size.thicknessMm} mm thick`);
  if (size.circumferenceMm !== undefined) parts.push(`${size.circumferenceMm} mm round`);
  if (size.massG !== undefined) parts.push(size.massG[0] === size.massG[1] ? `${size.massG[0]} g` : `${size.massG[0]} to ${size.massG[1]} g`);
  return parts.join(", ");
};

const STYLE = `
:root{color-scheme:light dark;--bg:#fff;--ink:#20262d;--sub:#5a6270;--line:#dfe3e8;--card:#f7f8fa;--accent:#2f5d4a}
@media (prefers-color-scheme:dark){:root{--bg:#14181c;--ink:#eef1f3;--sub:#9aa3ae;--line:#2a3038;--card:#1b2026;--accent:#7fc4a4}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,-apple-system,"Segoe UI","Hiragino Sans","Noto Sans JP",sans-serif}
main{max-width:1200px;margin:0 auto;padding:16px}
h1{font-size:1.5rem;margin:.4em 0}h2{font-size:1.15rem;margin:1.6em 0 .4em;border-bottom:1px solid var(--line);padding-bottom:.2em}
p.lede{color:var(--sub);max-width:70ch}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
figure{margin:0;padding:10px;background:var(--card);border:1px solid var(--line);border-radius:10px;display:flex;flex-direction:column;gap:6px}
.pic{display:flex;gap:10px;align-items:center;justify-content:center;min-height:116px}
.pic .turn{width:112px;height:112px;border:0;background:none;padding:0;cursor:pointer;color:inherit;border-radius:8px}
.pic .turn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.pic .line{width:56px;height:56px;color:var(--ink)}
.pic svg{display:block}
figcaption{font-size:.82rem;color:var(--sub);word-break:break-word}
figcaption code{color:var(--ink);font-size:.85rem}
figcaption .en{display:block;color:var(--ink);font-weight:600}
figcaption .ja{display:block}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;margin:.6em 0}
.bar{display:flex;gap:12px;align-items:center;margin:8px 0}
button.pill{border:1px solid var(--line);background:var(--card);color:var(--ink);padding:.35em .9em;border-radius:99px;cursor:pointer;font:inherit}
button.pill[aria-pressed="true"]{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.sources{font-size:.8rem;color:var(--sub)}
`;

const SCRIPT = (libBase) => `
import { ballFrame } from ${JSON.stringify(`${libBase}/emblems/ball/ball.index.js`)};
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
// A ball turns while the pointer is over it, or after it was clicked until it is clicked again, or while "Turn all" is on.
const turning = new Map();
const hover = new Set();
const pinned = new Set();
let all = false;
function step(now) {
  for (const [button, state] of turning) button.querySelector("[data-slot]").innerHTML = ballFrame(button.dataset.ball, { yaw: (now - state.start) * 0.09, size: 112 });
  if (turning.size > 0) requestAnimationFrame(step);
}
function refresh(button) {
  const on = all || pinned.has(button) || hover.has(button);
  const slot = button.querySelector("[data-slot]");
  if (on && !turning.has(button)) {
    turning.set(button, { start: performance.now(), still: slot.innerHTML });
    if (turning.size === 1) requestAnimationFrame(step);
  } else if (!on && turning.has(button)) {
    slot.innerHTML = turning.get(button).still;
    turning.delete(button);
  }
  button.setAttribute("aria-pressed", String(pinned.has(button) || all));
}
for (const button of document.querySelectorAll("button.turn")) {
  button.addEventListener("click", () => {
    if (pinned.has(button)) pinned.delete(button);
    else pinned.add(button);
    refresh(button);
  });
  if (!reduce) {
    button.addEventListener("pointerenter", () => { hover.add(button); refresh(button); });
    button.addEventListener("pointerleave", () => { hover.delete(button); refresh(button); });
  }
}
const spin = document.getElementById("spin-all");
spin.addEventListener("click", () => {
  all = spin.getAttribute("aria-pressed") !== "true";
  spin.setAttribute("aria-pressed", String(all));
  for (const button of document.querySelectorAll("button.turn")) refresh(button);
});
if (reduce) spin.title = "Your device asks for less motion: a ball turns only when you click it";
`;

const ballCard = (b) => `<figure id="${esc(b.id.replace(":", "-"))}"><div class="pic"><button type="button" class="turn" data-ball="${esc(b.id)}" aria-pressed="false" aria-label="Turn ${esc(b.en)}"><span data-slot>${b.svg({ size: 112 })}</span></button><span class="line">${b.svg({ size: 56, style: "line" })}</span></div><figcaption><span class="en">${esc(b.en)}</span><span class="ja" lang="ja">${esc(b.ja)}</span><code>${esc(b.id)}</code><br>${esc(SIZE_LINE(b.size))}</figcaption></figure>`;
const gearCard = (g) => `<figure id="${esc(g.id.replace(":", "-"))}"><div class="pic"><span style="width:112px;height:112px">${g.svg({ size: 112 })}</span><span class="line">${g.svg({ size: 56, style: "line" })}</span></div><figcaption><span class="en">${esc(g.en)}</span><span class="ja" lang="ja">${esc(g.ja)}</span><code>${esc(g.id)}</code><br>${g.source === "drawn" ? "drawn by us" : `from ${esc({ noto: "Noto Emoji", commons: "Wikimedia Commons", gameicons: "game-icons.net" }[g.source] ?? g.source)}`}</figcaption></figure>`;

/** The page. `pieces` holds BALLS, GEARS and lineup; `libBase` is the path from the page to the folder of built files (default `./dist`). */
export function galleryHtml({ BALLS, GEARS, lineup }, libBase = "./dist") {
  const row = (ids, scale, height) => lineup(ids, { scale, height, gap: 10, style: "colour" });
  const sample = ["golf", "table-tennis", "squash", "tennis", "baseball", "puck", "soccer", "basketball", "football", "shot", "discus"];
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Balls and gear</title><style>${STYLE}</style></head>
<body><main>
<h1>Balls and gear <span lang="ja">球と道具</span></h1>
<p class="lede">${BALLS.length} balls and implements, drawn in true 3D (click one to turn it), and ${GEARS.length} pieces of gear. Every one comes in a colour style and a line style (<code>currentColor</code>); each ball carries its official size and the rule it comes from.</p>
<div class="bar"><button type="button" class="pill" id="spin-all" aria-pressed="false">Turn all</button></div>
<h2>Balls and implements <span lang="ja">ボール</span></h2>
<div class="grid">${BALLS.map(ballCard).join("")}</div>
<h2>At their true sizes <span lang="ja">実寸の比較</span></h2>
<p class="lede">The same balls side by side at the sizes the rulebooks give them, and then each as large as the largest.</p>
<div class="row">${row(sample, "true", 200)}</div>
<div class="row">${row(sample, "same", 64)}</div>
<h2>Gear <span lang="ja">道具</span></h2>
<div class="grid">${GEARS.map(gearCard).join("")}</div>
<p class="sources">Sizes are read from each sport's rulebook (see NOTICE.md); gear is drawn by us or copied, with changes, from Noto Emoji (Apache-2.0), Wikimedia Commons (CC0 or public domain) and game-icons.net (baseball glove, by Delapouite, CC BY 3.0).</p>
</main>
<script type="module">${SCRIPT(libBase)}</script>
</body></html>
`;
}
