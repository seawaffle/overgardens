import type { Entity } from "../../components";
import { Game } from "../../game";

export class Goal {
  constructor(public game: Game) {}
  run(_me: Entity) {}
}
