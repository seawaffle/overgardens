import { Entity } from "../components";
import { MeleeGoal } from "./goals";
import { Reaction } from "../data/faction";
import { AI } from "./ai";

export class AdjacentAI extends AI {
  run(e: Entity): void {
    const level = this.game.map.getCurrentLevel()!;
    const adjacents = level.tiles.getNeighbors(e.position!, undefined, "eight");
    for (const adjPos of adjacents) {
      const content = level.tileContent.get(adjPos)!;
      for (const other of content) {
        if (other.body) {
          const reaction = this.game.faction.getReaction(e, other);
          if (reaction === Reaction.Attack) {
            e.goal = new MeleeGoal(this.game, other);
          }
        }
      }
    }
  }
}
