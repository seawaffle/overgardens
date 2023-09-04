import type { Entity } from "../components";
import { Reaction } from "../data/faction";
import { AI } from "./ai";
import { ApproachGoal } from "./goals";
import { FleeGoal } from "./goals/flee.goal";

export class VisibleAI extends AI {
  run(e: Entity): void {
    if (!e.viewshed) {
      return;
    }
    const visibleTiles = e.viewshed.visibleTiles!;
    const level = this.game.map.getCurrentLevel()!;
    for (const pos of visibleTiles) {
      const content = level.getTileContent(pos);
      for (const other of content) {
        if (other === e) continue;
        if (other.body) {
          const reaction = this.game.faction.getReaction(e, other);
          if (reaction === Reaction.Attack) {
            e.goal = new ApproachGoal(this.game, other.position!);
            break;
          }
          if (reaction === Reaction.Flee) {
            e.goal = new FleeGoal(this.game, other.position!);
            break;
          }
        }
      }
    }
  }
}
