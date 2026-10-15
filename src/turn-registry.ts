// What `bindTurn` loads when it is given an id: the three functions that read the registry. A module of its own, so that the dynamic import has a target no static import of `./turn` shares, and a bundler
// makes it a chunk of its own.
export { emblemFrame, emblemOf, renderEmblem } from "./emblems/emblem.api.ts";
