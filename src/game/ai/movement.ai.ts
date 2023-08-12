import { Entity } from "../components";
import { WanderGoal } from "../components/goals";
import { AI } from "./ai";

export class MovementAI extends AI {
  run(e: Entity) {
    // randomly choose to wander
    if (this.game.rng.next() > 0.5) {
      e.goal = new WanderGoal(this.game);
    }
  }
}
