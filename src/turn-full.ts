// `bindTurn` of the main entry: the same as the light one of `./turn`, with the registry already in hand, so an id is drawn at once (as it always was) and an emblem object works too. It is a function of its own, so
// a page that imports only emblems from the main entry does not pull it in; one that imports `bindTurn` from here has the registry in the bundle anyway.
import { emblemFrame, emblemOf, renderEmblem, type EmblemRef } from "./emblems/emblem.api.ts";
import { bindTurnWith, type TurnContainer, type TurnControlOptions, type TurnController } from "./turn-control.ts";

/**
 * Binds an emblem to an element so that a drag, the arrow keys, Space or a clock turn it; see `bindTurn` of `@johnmorrisdotca/dougu-sports/turn`, which takes an emblem object and loads nothing else. This one is
 * from the main entry: an id is read from the registry and drawn at once, with no `await`.
 * @example
 * ```ts
 * import { bindTurn } from "@johnmorrisdotca/dougu-sports";
 * const turner = bindTurn(document.getElementById("cup")!, "trophy:tennis-cup", { size: 160 });
 * turner.setAngles({ yaw: 40 });
 * console.log(turner.angles.yaw);
 * // 40
 * ```
 */
export function bindTurn(container: TurnContainer, ref: EmblemRef, options: TurnControlOptions = {}): TurnController {
  return bindTurnWith({ emblemOf, renderEmblem, emblemFrame }, container, ref, options);
}
