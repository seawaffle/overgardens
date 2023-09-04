import type { Entity } from "../components";
import { WanderGoal } from "./goals";
import { AI } from "./ai";

export class MovementAI extends AI {
  run(e: Entity) {
    // randomly choose to wander
    if (this.game.rng.next() > 0.5) {
      e.goal = new WanderGoal(this.game);
    }
  }
}
