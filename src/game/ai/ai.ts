import type { Entity } from "../components";
import { Game } from "../game";

export class AI {
  constructor(public game: Game) {}

  run(_e: Entity) {}
}
