/// <reference lib="dom" />
// <dougu-emblem>: any emblem as a web component, still or turning by hand or by itself. Importing this entry point registers the tag once.
import { emblemFrame, renderEmblem, type EmblemRef } from "./emblems/emblem.api.ts";
import type { EmblemStyle, EmblemTheme } from "./emblems/emblem.core.ts";
import { bindTurn } from "./turn-full.ts";
import type { TurnController, TurnControlOptions } from "./turn-control.ts";

const STYLE = ":host{display:inline-block;line-height:0;max-width:100%}.stage{display:block;line-height:0}.stage svg{display:block;max-width:100%;height:auto}";

const number = (value: string | null): number | undefined => {
  if (value === null || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};
const flag = (value: string | null): boolean => value !== null && value !== "false" && value !== "0";

/** `HTMLElement` where there is one; a bare class on a server, so that importing this module there does not throw. */
const Base: typeof HTMLElement = typeof HTMLElement === "undefined" ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

/**
 * The `<dougu-emblem>` custom element: one emblem drawn as SVG in its shadow root. Importing this entry point registers the tag once. It takes the attributes `emblem` (an id such as `trophy:cup`, or a short name), `variant` (`metal`, `line` or `color`), `size` (pixels, 64 by default), `tint`, `accent`, `initials`, `theme` (`inherit`, `auto`, `light` or `dark`), `locale` (`en` or `ja`), `title`, `yaw`, `pitch` and `roll` (the angle it is drawn at), `turnable` (a drag, the arrow keys and Space turn it), `autoplay` (it turns by itself, unless the reader prefers reduced motion; it waits while it is off screen) and `speed` (degrees a second). Change any attribute and it is drawn again. An emblem that cannot turn is drawn still whatever `turnable` says.
 *
 * @example
 * ```ts no-run
 * import type { DouguEmblem } from "@johnmorrisdotca/dougu-sports/element";
 *
 * const cup = document.createElement("dougu-emblem") as DouguEmblem;
 * cup.setAttribute("emblem", "trophy:stanley-cup");
 * cup.setAttribute("size", "160");
 * cup.setAttribute("turnable", "");
 * document.body.append(cup);
 * ```
 */
export class DouguEmblem extends Base {
  static observedAttributes = ["emblem", "variant", "size", "tint", "accent", "initials", "theme", "locale", "title", "yaw", "pitch", "roll", "turnable", "autoplay", "speed"];

  #stage: HTMLElement | undefined;
  #turner: TurnController | undefined;
  #watch: IntersectionObserver | undefined;
  #resume = false;
  #queued = false;

  /** The controller of the turning while the emblem is turnable and drawn, or `undefined`: its angles, `play()`, `pause()` and `setAngles()`. */
  get turner(): TurnController | undefined {
    return this.#turner;
  }

  connectedCallback(): void {
    this.#shell();
    this.#draw();
    if (typeof IntersectionObserver === "function") {
      this.#watch = new IntersectionObserver((seen) => {
        const visible = seen[seen.length - 1]?.isIntersecting !== false;
        if (!visible && this.#turner?.playing) {
          this.#turner.pause();
          this.#resume = true;
        } else if (visible && this.#resume) {
          this.#resume = false;
          this.#turner?.play();
        }
      });
      this.#watch.observe(this);
    }
  }

  disconnectedCallback(): void {
    this.#watch?.disconnect();
    this.#watch = undefined;
    this.#resume = false;
    this.#turner?.destroy();
    this.#turner = undefined;
  }

  attributeChangedCallback(): void {
    if (!this.isConnected || this.#queued) return;
    this.#queued = true;
    queueMicrotask(() => {
      this.#queued = false;
      if (this.isConnected) this.#draw();
    });
  }

  #shell(): void {
    if (this.#stage) return;
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    if (typeof CSSStyleSheet === "function" && "adoptedStyleSheets" in root) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLE);
      root.adoptedStyleSheets = [sheet];
    } else root.innerHTML = `<style>${STYLE}</style>`;
    const stage = document.createElement("div");
    stage.className = "stage";
    stage.setAttribute("part", "stage");
    root.append(stage);
    this.#stage = stage;
  }

  #options(): TurnControlOptions {
    const get = (name: string) => this.getAttribute(name);
    const options: TurnControlOptions = {};
    const variant = get("variant");
    if (variant === "metal" || variant === "line" || variant === "color") options.style = variant as EmblemStyle;
    const theme = get("theme");
    if (theme === "inherit" || theme === "auto" || theme === "light" || theme === "dark") options.theme = theme as EmblemTheme;
    const size = number(get("size"));
    if (size !== undefined && size > 0) options.size = size;
    const tint = get("tint");
    if (tint) options.tint = tint;
    const accent = get("accent");
    if (accent) options.accent = accent;
    const initials = get("initials");
    if (initials) options.initials = initials;
    if (get("locale") === "ja") options.locale = "ja";
    const title = get("title");
    if (title !== null) options.title = title === "" ? false : title;
    const speed = number(get("speed"));
    if (speed !== undefined) options.speed = speed;
    const yaw = number(get("yaw"));
    const pitch = number(get("pitch"));
    const roll = number(get("roll"));
    if (yaw !== undefined) options.yaw = yaw;
    if (pitch !== undefined) options.pitch = pitch;
    if (roll !== undefined) options.roll = roll;
    return options;
  }

  #draw(): void {
    const stage = this.#stage;
    if (!stage) return;
    const ref: EmblemRef | null = this.getAttribute("emblem");
    this.dataset["state"] = "empty";
    if (!ref) {
      this.#turner?.destroy();
      this.#turner = undefined;
      stage.innerHTML = "";
      return;
    }
    const options = this.#options();
    try {
      if (flag(this.getAttribute("turnable")) || flag(this.getAttribute("autoplay"))) {
        const { yaw, pitch, roll, ...rest } = options;
        const angles = { ...(yaw === undefined ? {} : { yaw }), ...(pitch === undefined ? {} : { pitch }), ...(roll === undefined ? {} : { roll }) };
        if (this.#turner) {
          this.#turner.update(ref, rest);
          if (Object.keys(angles).length > 0) this.#turner.setAngles(angles);
          if (flag(this.getAttribute("autoplay")) && !this.#turner.playing) this.#turner.play();
          else if (!flag(this.getAttribute("autoplay")) && this.#turner.playing) this.#turner.pause();
        } else this.#turner = bindTurn(stage, ref, { ...rest, ...angles, autoPlay: flag(this.getAttribute("autoplay")) });
        this.dataset["state"] = "live";
        return;
      }
      this.#turner?.destroy();
      this.#turner = undefined;
      const turned = options.yaw !== undefined || options.pitch !== undefined || options.roll !== undefined;
      stage.innerHTML = turned ? emblemFrame(ref, options) : renderEmblem(ref, options);
      this.dataset["state"] = "still";
    } catch {
      stage.innerHTML = "";
      this.dataset["state"] = "error";
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dougu-emblem": DouguEmblem;
  }
}

if (typeof customElements !== "undefined" && !customElements.get("dougu-emblem")) customElements.define("dougu-emblem", DouguEmblem);
