import { Query, type With } from "miniplex";
import { System } from "./system";
import type { Entity } from "../components";
import { Game } from "../game";

export class MapIndexingSystem extends System {
  query: Query<With<Entity, "position">>;

  constructor(game: Game) {
    super(game);

    this.query = this.game.ecs.world.with("position");
  }

  update(): void {
    const level = this.game.map.getCurrentLevel();
    if (level) {
      level.clearTileContent();
      level.populateBlocked();

      for (const e of this.query) {
        level.addTileContent(e.position, e);
        if (e.blocksTile) {
          level.setBlocked(e.position);
        }
      }
    }
  }
}
