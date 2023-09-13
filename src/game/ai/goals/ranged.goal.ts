import { Goal } from ".";
import type { Entity } from "../../components";
import { Game } from "../../game";
import * as Actions from "../../actions";

export class RangedGoal extends Goal {
  target: Entity;

  constructor(game: Game, target: Entity) {
    super(game);
    this.target = target;
  }

  run(me: Entity): void {
    if (me.body && me.body.slots) {
      Actions.rangedAttack(this.game, me, this.target);
    }
  }
}
