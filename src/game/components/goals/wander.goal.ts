import { Entity } from "..";
import { Goal } from "./goal";
import * as Actions from "../../actions";

export class WanderGoal extends Goal {
  run(me: Entity): void {
    // random movement for now
    const roll = this.game.rng.nextInt(0, 5);
    const dest = { x: 0, y: 0 };
    switch (roll) {
      case 1: {
        dest.x += 1;
        break;
      }
      case 2: {
        dest.x -= 1;
        break;
      }
      case 3: {
        dest.y += 1;
        break;
      }
      case 4: {
        dest.y -= 1;
        break;
      }
      default: {
        break;
      }
    }
    Actions.tryMoveEntity(this.game, me, dest);
  }
}
