// The frame a page puts in an iframe. The address says what it shows, and the frame fetches nothing but its own files:
//   ?emblem=trophy:cup (or id=)   the emblem, by id or short name
//   &variant=metal|line|color     &size=160   &tint=#c8102e   &accent=#f2c230   &initials=AB   &theme=inherit|auto|light|dark   &locale=en|ja
//   &yaw=40 &pitch=10 &roll=0     the angle it is drawn at
//   &turnable=1                   a drag, the arrow keys and Space turn it
//   &autoplay=1&speed=24          it turns by itself (not for a reader who prefers reduced motion), with a small Pause button
// It draws when something changes, and nothing while it is out of sight or the tab is hidden.
import "../src/element.ts";
import type { DouguEmblem } from "../src/element.ts";

const query = new URLSearchParams(location.search);
const frame = document.getElementById("frame")!;
const pause = document.getElementById("pause") as HTMLButtonElement;
const element = document.createElement("dougu-emblem") as DouguEmblem;
element.setAttribute("emblem", query.get("emblem") ?? query.get("id") ?? "trophy:cup");
for (const name of ["variant", "tint", "accent", "initials", "theme", "locale", "yaw", "pitch", "roll", "speed"]) {
  const value = query.get(name);
  if (value !== null) element.setAttribute(name, value);
}
const size = Number(query.get("size"));
element.setAttribute("size", String(Number.isFinite(size) && size > 0 ? size : Math.max(32, Math.floor(Math.min(innerWidth, innerHeight)) - 16)));
const on = (name: string) => query.get(name) === "1" || query.get(name) === "true";
if (on("turnable") || on("autoplay")) element.setAttribute("turnable", "");
if (on("autoplay")) element.setAttribute("autoplay", "");
frame.append(element);

if (on("autoplay")) {
  const ja = query.get("locale") === "ja";
  const words = ja ? { stop: "一時停止", play: "再生" } : { stop: "Pause", play: "Play" };
  pause.hidden = false;
  const show = () => {
    const playing = element.turner?.playing ?? false;
    pause.textContent = playing ? words.stop : words.play;
    pause.setAttribute("aria-pressed", String(!playing));
  };
  pause.addEventListener("click", () => {
    element.turner?.togglePlay();
    show();
  });
  element.turner?.ready.then(show, show);
  show();
}
