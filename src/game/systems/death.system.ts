import { Query, type With } from "miniplex";
import type { Entity } from "../components";
import { System } from "./system";
import { Game } from "../game";
import { GameState, Palette } from "../data";
import * as Actions from "../actions";

export class DeathSystem extends System {
  dyingQuery: Query<With<Entity, "dying">>;

  constructor(game: Game) {
    super(game);
    this.dyingQuery = this.game.ecs.world.with("dying");
  }

  update(): void {
    const level = this.game.map.getCurrentLevel();
    if (this.game.gameState.state === GameState.GameOver) {
      return;
    }
    for (const d of this.dyingQuery) {
      this.game.log.addMessage(`${d.name} has died`);
      if (d.player) {
        this.game.gameState.setState(GameState.GameOver);
        return;
      }
      if (level) {
        const tile = level.tiles.get(d.position!)!;
        // blood stains on death
        const bloodStain = tile.bg_color_light.blend(
          Palette.MilanoRed,
          this.game.rng.next(),
        );
        tile.bg_color_light = bloodStain;
        if (!tile.type.includes("blood")) {
          tile.type = `bloody ${tile.type}`;
        }
        // drop inventory on death
        if (d.inventory) {
          Actions.unequipAll(this.game, d);
          for (const item of d.inventory.items) {
            if (item.itemProperties!.droppedOnDeath) {
              Actions.dropItem(this.game, d, item);
            }
          }
        }
      }
      this.game.ecs.world.remove(d);
    }
  }
}
