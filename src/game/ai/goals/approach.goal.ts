import { Vector2 } from "malwoden";
import { Goal } from ".";
import { Game } from "../../game";
import { Entity } from "../../components";
import * as Actions from "../../actions";

export class ApproachGoal extends Goal {
  target: Vector2;

  constructor(game: Game, target: Vector2) {
    super(game);
    this.target = target;
  }

  run(me: Entity): void {
    Actions.approach(this.game, me, this.target);
  }
}
