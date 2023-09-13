import type { Entity } from "../components";
import { Reaction } from "../data";
import { isTargetInRange, wieldingRangedWeapon } from "../utils";
import { AI } from "./ai";
import { ApproachGoal, FleeGoal, RangedGoal } from "./goals";

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
            // if they're aggressive, check if they have a ranged weapon
            const rangedWeapon = wieldingRangedWeapon(e);
            if (rangedWeapon) {
              // if we have a ranged weapon, fire if they're in range, otherwise
              // approach
              if (
                isTargetInRange(
                  e.position!,
                  pos,
                  rangedWeapon.itemProperties!.targeting!.range,
                )
              ) {
                e.goal = new RangedGoal(this.game, other);
                return;
              }
            }
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
