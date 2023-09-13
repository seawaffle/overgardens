import type { Entity } from "../components";
import { FleeGoal, MeleeGoal } from "./goals";
import { Reaction } from "../data";
import { AI } from "./ai";
import { wieldingRangedWeapon } from "../utils";

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
            const rangedWeapon = wieldingRangedWeapon(e);
            // if we have a ranged weapon, we want to try and kite
            if (rangedWeapon) {
              e.goal = new FleeGoal(this.game, other.position!);
            } else {
              e.goal = new MeleeGoal(this.game, other);
              break;
            }
          }
        }
      }
    }
  }
}
