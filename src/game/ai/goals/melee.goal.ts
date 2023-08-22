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
    if (me.body && me.body.slots) {
      for (const slot of me.body.slots) {
        const weapon = slot.equippedItem;
        if (weapon && weapon.itemProperties && weapon.itemProperties.melee) {
          Actions.meleeCombat(this.game, me, weapon, this.target);
        }
      }
    }
  }
}
