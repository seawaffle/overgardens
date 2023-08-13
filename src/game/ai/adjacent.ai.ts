import { Entity } from "../components";
import { MeleeGoal } from "../components/goals";
import { AI } from "./ai";

export class AdjacentAI extends AI {
  run(e: Entity): void {
    const level = this.game.map.getCurrentLevel()!;
    const adjacents = level.tiles.getNeighbors(
      e.position!.pos,
      undefined,
      "eight",
    );
    for (const adjPos of adjacents) {
      const content = level.tileContent.get(adjPos)!;
      for (const other of content) {
        if (other.body) {
          // we'll just fight for now, but check factions in the future
          e.goal = new MeleeGoal(this.game, other);
        }
      }
    }
  }
}
