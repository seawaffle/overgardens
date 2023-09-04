import type { Vector2 } from "malwoden";
import { Goal } from ".";
import type { Entity } from "../../components";
import { Game } from "../../game";
import * as Actions from "../../actions";

export class FleeGoal extends Goal {
  target: Vector2;

  constructor(game: Game, target: Vector2) {
    super(game);
    this.target = target;
  }

  run(me: Entity): void {
    Actions.flee(this.game, me, this.target);
  }
}
