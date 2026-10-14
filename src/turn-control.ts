// `bindTurn`: an emblem that a pointer, the arrow keys, the Space bar or a clock can turn. It draws `emblemFrame` into an element and listens to that element, and it is a module of its own, so importing an
// emblem never pulls it in. Nothing here moves by itself: an auto-turn starts only when the caller asks for it, and not at all under `prefers-reduced-motion` unless the caller forces it.
import { emblemFrame, emblemOf, renderEmblem, type EmblemRef } from "./emblems/emblem.api.ts";
import type { Emblem, FrameOptions } from "./emblems/emblem.core.ts";

/** The three angles of a turn, in degrees. */
export interface TurnAngles {
  /** About the vertical axis, from -180 (excluded) to 180. */
  yaw: number;
  /** The tilt toward the eye, within `pitchRange`. */
  pitch: number;
  /** A ball: the turn about the line of sight, from -180 (excluded) to 180. */
  roll: number;
}

/** What `bindTurn` takes: the frame options (`style`, `size`, `tint`, `theme`, and the first `yaw`, `pitch` and `roll`) and how the turning behaves. */
export interface TurnControlOptions extends FrameOptions {
  /** Degrees of turn for each pixel the pointer moves (1.5 by default). */
  sensitivity?: number;
  /** The least and most tilt, in degrees (`[-60, 60]` by default). */
  pitchRange?: readonly [number, number];
  /** Degrees an arrow key turns (5 by default); with Shift it is three times as much (15). */
  keyStep?: number;
  /** Called after each turn the pointer, a key or the auto-turn makes, with the new angles. It is not called for `setAngles` or `update`, which the caller makes itself. */
  onTurn?: (angles: TurnAngles) => void;
  /**
   * `true` starts the auto-turn when the emblem is bound, unless the reader prefers reduced motion, when it starts paused; `"force"` starts it anyway. By default (`false`) nothing turns until `play()` is called.
   * Only read by `bindTurn`.
   */
  autoPlay?: boolean | "force";
  /** Degrees of yaw each second the auto-turn advances (36 by default; negative turns the other way). */
  speed?: number;
  /** When true (the default), a drag holds the auto-turn while the pointer is down, and an arrow key, Home or `setAngles` pauses it. When false nothing but `pause()` stops it. */
  pauseOnInteract?: boolean;
  /** Called with `true` when the auto-turn starts and `false` when it stops, whatever stopped it. */
  onPlayChange?: (playing: boolean) => void;
}

/** What `bindTurn` returns. */
export interface TurnController {
  /** The angles now (a copy). */
  readonly angles: TurnAngles;
  /** Whether the auto-turn is running. */
  readonly playing: boolean;
  /** Whether the emblem now drawn can be turned at all (read from the registry, so an emblem that gains a turn is turnable here without a change). */
  readonly turnable: boolean;
  /** Sets some of the angles (wrapped or clamped as a drag would) and draws. Pauses the auto-turn when `pauseOnInteract` is on. */
  setAngles(angles: Partial<TurnAngles>): void;
  /** Draws another emblem, or the same one with other options, and keeps the angles (unless the options carry some). */
  update(ref: EmblemRef, options?: TurnControlOptions): void;
  /** Starts the auto-turn. An emblem that cannot turn does nothing and gives `false`. */
  play(): boolean;
  /** Stops the auto-turn. */
  pause(): void;
  /** Starts or stops the auto-turn and gives the new state; `false` for an emblem that cannot turn. */
  togglePlay(): boolean;
  /** Removes the listeners and the attributes and styles `bindTurn` added; the last drawing stays. */
  destroy(): void;
}

/** An event, as much of it as `bindTurn` reads: a pointer's or a key's. */
export interface TurnEvent {
  button?: number;
  isPrimary?: boolean;
  pointerId?: number;
  clientX?: number;
  clientY?: number;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  key?: string;
  preventDefault(): void;
}

/** What `bindTurn` needs of an element: any `HTMLElement` is one, and so is a small fake in a test. */
export interface TurnContainer {
  innerHTML: string;
  style: { touchAction: string; userSelect: string; cursor: string; webkitUserSelect?: string };
  addEventListener(type: string, listener: (event: TurnEvent) => void): void;
  removeEventListener(type: string, listener: (event: TurnEvent) => void): void;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  setPointerCapture?(pointerId: number): void;
  releasePointerCapture?(pointerId: number): void;
}

const WORDS = {
  en: { role: "turnable emblem", hint: "Drag, or use the arrow keys, to turn it. Space starts and stops the turning." },
  ja: { role: "回せるエンブレム", hint: "ドラッグするか矢印キーで回せます。スペースキーで自動回転を始めたり止めたりできます。" },
} as const;

/** An angle wrapped into -180 (excluded) to 180, as the demo's slider is. */
export function wrapAngle(value: number): number {
  const turn = ((value % 360) + 360) % 360;
  return turn > 180 ? turn - 360 : turn;
}

const finite = (value: unknown, fallback: number): number => (typeof value === "number" && Number.isFinite(value) ? value : fallback);
const clamp = (value: number, low: number, high: number): number => Math.max(low, Math.min(high, value));

type Frames = (callback: (time: number) => void) => number;
const globals = globalThis as unknown as {
  requestAnimationFrame?: Frames;
  cancelAnimationFrame?: (id: number) => void;
  matchMedia?: (query: string) => { matches: boolean };
  document?: { hidden?: boolean; addEventListener(type: string, listener: () => void): void; removeEventListener(type: string, listener: () => void): void };
};

/** Whether an emblem turns at all, read from the registry's own frames: a turned view that differs from the resting one. An emblem may say so itself with a `turnable` flag. */
const turns = new WeakMap<Emblem, boolean>();
function canTurn(emblem: Emblem): boolean {
  const flag = (emblem as { turnable?: unknown }).turnable;
  if (typeof flag === "boolean") return flag;
  let known = turns.get(emblem);
  if (known === undefined) {
    known = emblem.frame({ size: 16, yaw: 90 }) !== emblem.frame({ size: 16 });
    turns.set(emblem, known);
  }
  return known;
}

/**
 * Binds an emblem to an element so that it can be turned: it draws `emblemFrame` into `container`, and a drag turns it (left and right are yaw, up and down are pitch, and Shift on a ball is roll), the arrow keys turn
 * it, Home or 0 puts it back, and Space starts and stops an auto-turn. An emblem that cannot turn is drawn as it is, and nothing is listened to. Nothing moves by itself: `autoPlay` is off by default and, under
 * `prefers-reduced-motion`, only starts when it is `"force"`. The element gets `touch-action: none`, `user-select: none`, a grab cursor, a tab stop, a role description and a hint; `destroy()` takes them away.
 * @example
 * ```ts
 * import { bindTurn } from "@johnmorrisdotca/dougu-sports/turn";
 * const turner = bindTurn(document.getElementById("cup")!, "trophy:tennis-cup", { size: 160 });
 * turner.setAngles({ yaw: 40 });
 * console.log(turner.angles.yaw);
 * // 40
 * ```
 */
export function bindTurn(container: TurnContainer, ref: EmblemRef, options: TurnControlOptions = {}): TurnController {
  let current = ref;
  let emblem: Emblem = emblemOf(ref).emblem;
  let turnable = false;
  let sensitivity = 1.5;
  let range: readonly [number, number] = [-60, 60];
  let keyStep = 5;
  let speed = 36;
  let pauseOnInteract = true;
  let locale: "en" | "ja" = "en";
  let onTurn: TurnControlOptions["onTurn"];
  let onPlayChange: TurnControlOptions["onPlayChange"];
  let frame: FrameOptions = {};
  const angles: TurnAngles = { yaw: 0, pitch: 0, roll: 0 };
  let playing = false;
  let held = false;
  let frameId: number | undefined;
  let renderId: number | undefined;
  let last: number | undefined;
  let attached = false;
  let drag: { pointer: number; x: number; y: number } | undefined;
  let destroyed = false;
  /** What `bindTurn` changed on the element, to put back. */
  let saved: { attributes: Map<string, string | null>; style: TurnContainer["style"] } | undefined;

  const configure = (o: TurnControlOptions): void => {
    sensitivity = clamp(finite(o.sensitivity, 1.5), 0.05, 20);
    const low = finite(o.pitchRange?.[0], -60);
    const high = finite(o.pitchRange?.[1], 60);
    range = low <= high ? [low, high] : [high, low];
    keyStep = clamp(finite(o.keyStep, 5), 0.5, 90);
    speed = clamp(finite(o.speed, 36), -720, 720);
    pauseOnInteract = o.pauseOnInteract !== false;
    locale = o.locale === "ja" ? "ja" : "en";
    onTurn = typeof o.onTurn === "function" ? o.onTurn : undefined;
    onPlayChange = typeof o.onPlayChange === "function" ? o.onPlayChange : undefined;
    const rest: Record<string, unknown> = { ...o };
    for (const name of ["sensitivity", "pitchRange", "keyStep", "onTurn", "autoPlay", "speed", "pauseOnInteract", "onPlayChange", "yaw", "pitch", "roll"]) delete rest[name];
    frame = rest as FrameOptions;
  };
  const place = (partial: Partial<TurnAngles>): void => {
    if (partial.yaw !== undefined) angles.yaw = wrapAngle(finite(partial.yaw, angles.yaw));
    if (partial.pitch !== undefined) angles.pitch = clamp(finite(partial.pitch, angles.pitch), range[0], range[1]);
    if (partial.roll !== undefined) angles.roll = wrapAngle(finite(partial.roll, angles.roll));
  };
  const copy = (): TurnAngles => ({ yaw: angles.yaw, pitch: angles.pitch, roll: angles.roll });

  const draw = (): void => {
    if (renderId !== undefined) {
      globals.cancelAnimationFrame?.(renderId);
      renderId = undefined;
    }
    const at = angles.yaw === 0 && angles.pitch === 0 && angles.roll === 0;
    container.innerHTML = !turnable || at ? renderEmblem(current, frame) : emblemFrame(current, { ...frame, ...angles });
  };
  /** One drawing for any number of changes within a frame. */
  const schedule = (): void => {
    if (renderId !== undefined || destroyed) return;
    if (globals.requestAnimationFrame === undefined) draw();
    else
      renderId = globals.requestAnimationFrame(() => {
        renderId = undefined;
        draw();
      });
  };
  const changed = (): void => {
    schedule();
    onTurn?.(copy());
  };

  const setPlaying = (value: boolean): void => {
    if (playing === value) return;
    playing = value;
    if (!value && frameId !== undefined) {
      globals.cancelAnimationFrame?.(frameId);
      frameId = undefined;
    }
    last = undefined;
    if (value) loop();
    onPlayChange?.(value);
  };
  const hidden = (): boolean => globals.document?.hidden === true;
  const tick = (time: number): void => {
    frameId = undefined;
    if (!playing || destroyed) return;
    if (hidden()) {
      last = undefined;
      return;
    }
    const dt = last === undefined ? 0 : clamp((time - last) / 1000, 0, 0.1);
    last = time;
    if (!held && dt > 0) {
      place({ yaw: angles.yaw + speed * dt });
      draw();
      onTurn?.(copy());
    }
    loop();
  };
  const loop = (): void => {
    if (frameId === undefined && playing && !destroyed && globals.requestAnimationFrame !== undefined) frameId = globals.requestAnimationFrame(tick);
  };
  const visibility = (): void => {
    if (playing && !hidden()) {
      last = undefined;
      loop();
    }
  };
  /** Something the reader did takes over from the auto-turn. */
  const interrupt = (): void => {
    if (pauseOnInteract) setPlaying(false);
  };

  const down = (event: TurnEvent): void => {
    if (event.button !== 0 || event.isPrimary === false) return;
    drag = { pointer: finite(event.pointerId, 0), x: finite(event.clientX, 0), y: finite(event.clientY, 0) };
    container.setPointerCapture?.(drag.pointer);
    container.style.cursor = "grabbing";
    held = pauseOnInteract;
  };
  const move = (event: TurnEvent): void => {
    if (drag === undefined || finite(event.pointerId, 0) !== drag.pointer) return;
    const x = finite(event.clientX, drag.x);
    const y = finite(event.clientY, drag.y);
    const dx = (x - drag.x) * sensitivity;
    const dy = (y - drag.y) * sensitivity;
    drag.x = x;
    drag.y = y;
    if (dx === 0 && dy === 0) return;
    if (event.shiftKey === true && emblem.kind === "ball") place({ roll: angles.roll + dx, pitch: angles.pitch - dy });
    else place({ yaw: angles.yaw + dx, pitch: angles.pitch - dy });
    changed();
  };
  const up = (event: TurnEvent): void => {
    if (drag === undefined || finite(event.pointerId, 0) !== drag.pointer) return;
    container.releasePointerCapture?.(drag.pointer);
    drag = undefined;
    held = false;
    last = undefined;
    container.style.cursor = "grab";
  };
  const key = (event: TurnEvent): void => {
    if (event.ctrlKey === true || event.metaKey === true || event.altKey === true) return;
    const step = event.shiftKey === true ? keyStep * 3 : keyStep;
    switch (event.key) {
      case "ArrowLeft":
        place({ yaw: angles.yaw - step });
        break;
      case "ArrowRight":
        place({ yaw: angles.yaw + step });
        break;
      case "ArrowUp":
        place({ pitch: angles.pitch + step });
        break;
      case "ArrowDown":
        place({ pitch: angles.pitch - step });
        break;
      case "Home":
      case "0":
        place({ yaw: 0, pitch: 0, roll: 0 });
        break;
      case " ":
      case "Spacebar":
        event.preventDefault();
        setPlaying(!playing);
        return;
      default:
        return;
    }
    event.preventDefault();
    interrupt();
    changed();
  };

  const LISTENERS: readonly (readonly [string, (event: TurnEvent) => void])[] = [
    ["pointerdown", down],
    ["pointermove", move],
    ["pointerup", up],
    ["pointercancel", up],
    ["lostpointercapture", up],
    ["keydown", key],
  ];
  const attach = (): void => {
    if (attached) return;
    attached = true;
    const attributes = new Map<string, string | null>();
    const wanted: [string, string][] = [
      ["tabindex", "0"],
      ["role", "group"],
      ["aria-roledescription", WORDS[locale].role],
      ["aria-description", WORDS[locale].hint],
    ];
    for (const [name, value] of wanted) {
      const before = container.getAttribute(name);
      attributes.set(name, before);
      // A tab stop or a role the page gave the element stays; the two descriptions are ours.
      if (before === null || name.startsWith("aria-")) container.setAttribute(name, value);
    }
    const style = container.style;
    saved = { attributes, style: { touchAction: style.touchAction, userSelect: style.userSelect, cursor: style.cursor, webkitUserSelect: style.webkitUserSelect } };
    style.touchAction = "none";
    style.userSelect = "none";
    if (style.webkitUserSelect !== undefined) style.webkitUserSelect = "none";
    style.cursor = "grab";
    for (const [type, listener] of LISTENERS) container.addEventListener(type, listener);
    globals.document?.addEventListener("visibilitychange", visibility);
  };
  const detach = (): void => {
    if (!attached) return;
    attached = false;
    for (const [type, listener] of LISTENERS) container.removeEventListener(type, listener);
    globals.document?.removeEventListener("visibilitychange", visibility);
    if (saved !== undefined) {
      for (const [name, before] of saved.attributes) {
        if (before === null) container.removeAttribute(name);
        else container.setAttribute(name, before);
      }
      container.style.touchAction = saved.style.touchAction;
      container.style.userSelect = saved.style.userSelect;
      if (saved.style.webkitUserSelect !== undefined) container.style.webkitUserSelect = saved.style.webkitUserSelect;
      container.style.cursor = saved.style.cursor;
      saved = undefined;
    }
    drag = undefined;
    held = false;
  };
  const settle = (): void => {
    emblem = emblemOf(current).emblem;
    turnable = canTurn(emblem);
    if (turnable) attach();
    else {
      detach();
      setPlaying(false);
    }
  };

  configure(options);
  place({ yaw: options.yaw, pitch: options.pitch, roll: options.roll });
  settle();
  draw();
  if (turnable && options.autoPlay !== undefined && options.autoPlay !== false) {
    const reduced = globals.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
    if (options.autoPlay === "force" || !reduced) setPlaying(true);
  }

  return {
    get angles() {
      return copy();
    },
    get playing() {
      return playing;
    },
    get turnable() {
      return turnable;
    },
    setAngles(partial) {
      if (destroyed) return;
      place(partial);
      interrupt();
      draw();
    },
    update(next, o = {}) {
      if (destroyed) return;
      current = next;
      configure(o);
      place({ yaw: o.yaw, pitch: o.pitch, roll: o.roll });
      // The pitch the new range allows.
      place({ pitch: angles.pitch });
      detach();
      settle();
      draw();
    },
    play() {
      if (!turnable || destroyed) return false;
      setPlaying(true);
      return true;
    },
    pause() {
      setPlaying(false);
    },
    togglePlay() {
      if (!turnable || destroyed) return false;
      setPlaying(!playing);
      return playing;
    },
    destroy() {
      if (destroyed) return;
      setPlaying(false);
      destroyed = true;
      if (renderId !== undefined) globals.cancelAnimationFrame?.(renderId);
      renderId = undefined;
      detach();
    },
  };
}
