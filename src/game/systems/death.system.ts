import { Query, type With } from "miniplex";
import type { Entity } from "../components";
import { System } from "./system";
import { Game } from "../game";
import { GameState, Palette } from "../data";

export class DeathSystem extends System {
  dyingQuery: Query<With<Entity, "dying">>;

  constructor(game: Game) {
    super(game);
    this.dyingQuery = this.game.ecs.world.with("dying");
  }

  update(): void {
    const level = this.game.map.getCurrentLevel();
    for (const d of this.dyingQuery) {
      this.game.log.addMessage(`${d.name} has died`);
      if (d.player) {
        this.game.gameState.setState(GameState.GameOver);
      }
      if (level) {
        const tile = level.tiles.get(d.position!)!;
        const bloodStain = tile.bg_color_light.blend(
          Palette.MilanoRed,
          this.game.rng.next(),
        );
        tile.bg_color_light = bloodStain;
        if (!tile.type.includes("blood")) {
          tile.type = `bloody ${tile.type}`;
        }
      }
      this.game.ecs.world.remove(d);
    }
  }
}
