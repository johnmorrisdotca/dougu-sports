// One panel that shows the call of the card whose "Show the call" button was pressed, in place of a fold in every card (John, 2026-11-02:
// no long pages of fold-open sections). It sits at the bottom of the window, over the page, so the card pressed stays in sight beside its
// call, and it closes with its button or Escape. It is made here, so a page only needs `showCalls()` once and `refreshCall()` after each draw.

let panel: HTMLElement | undefined;
let openId = "";

function make(): HTMLElement {
  const aside = document.createElement("aside");
  aside.className = "call-panel";
  aside.id = "call-panel";
  aside.dataset.testid = "call-panel";
  aside.setAttribute("aria-label", "The call");
  aside.hidden = true;
  aside.innerHTML = `<div class="call-head"><strong id="call-title"></strong><span class="call-actions"><button type="button" class="fam-button copy" id="call-copy">Copy it</button><button type="button" class="fam-button" id="call-close">Close</button></span></div><pre><code id="call-code"></code></pre>`;
  document.body.append(aside);
  return aside;
}

/** Fill the panel from the button that names the card, or hide it when that card is gone. */
function fill(button: HTMLButtonElement | null): void {
  panel ??= make();
  if (!button) {
    panel.hidden = true;
    openId = "";
    return;
  }
  openId = button.dataset.card ?? "";
  const code = button.dataset.code ?? "";
  panel.querySelector("#call-title")!.textContent = button.dataset.title ?? "The call";
  panel.querySelector("#call-code")!.textContent = code;
  panel.querySelector<HTMLElement>("#call-copy")!.dataset.code = code;
  panel.hidden = false;
}

/** The button of a card, by its id. */
const buttonOf = (id: string) => (id ? document.querySelector<HTMLButtonElement>(`button.show-call[data-card="${CSS.escape(id)}"]`) : null);

/** Call once: the buttons open the panel, its Close button and Escape shut it. */
export function showCalls(): void {
  document.addEventListener("click", (event) => {
    const target = event.target as Element;
    const show = target.closest<HTMLButtonElement>("button.show-call");
    if (show) {
      fill(show);
      return;
    }
    if (target.closest("#call-close")) fill(null);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel && !panel.hidden) fill(null);
  });
}

/** After the cards are drawn again: keep the panel on the same card, with its new call. */
export function refreshCall(): void {
  if (panel && !panel.hidden) fill(buttonOf(openId));
}

/** The two buttons every card has: show its call in the panel, copy it. `label` names the card for a screen reader. */
export function callButtons(id: string, title: string, code: string, label: string, esc: (text: unknown) => string): string {
  return `<p class="copies"><button type="button" class="fam-button show-call" data-card="${esc(id)}" data-title="${esc(title)}" data-code="${esc(code)}" aria-label="Show the call for ${esc(label)}">Show the call</button><button type="button" class="fam-button copy" data-code="${esc(code)}" aria-label="Copy the call for ${esc(label)}">Copy the call</button></p>`;
}
