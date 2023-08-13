import { Goal } from ".";
import { Entity } from "../../components";
import { Game } from "../../game";
import * as Actions from "../../actions";

export class MeleeGoal extends Goal {
  target: Entity;

  constructor(game: Game, target: Entity) {
    super(game);
    this.target = target;
  }

  run(me: Entity): void {
    Actions.meleeCombat(this.game, me, this.target);
  }
}
