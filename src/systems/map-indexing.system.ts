import { Query, With } from "miniplex";
import { System } from "./system";
import { Entity } from "../components";
import { Game } from "../game";

export class MapIndexingSystem extends System {
  blockerQuery: Query<With<Entity, "position" | "blocksTile">>;

  constructor(game: Game) {
    super(game);

    this.blockerQuery = this.game.ecs.world.with("position", "blocksTile");
  }

  update(): void {
    const level = this.game.map.getCurrentLevel();
    if (level) {
      level.populateBlocked();

      for (const e of this.blockerQuery) {
        level.setBlocked(e.position.pos);
      }
    }
  }
}
