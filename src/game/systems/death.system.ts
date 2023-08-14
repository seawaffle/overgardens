import { Query, With } from "miniplex";
import { Entity } from "../components";
import { System } from "./system";
import { Game } from "../game";
import { Palette } from "../data";

export class DeathSystem extends System {
  statsQuery: Query<With<Entity, "body">>;

  constructor(game: Game) {
    super(game);
    this.statsQuery = this.game.ecs.world.with("body");
  }

  update(): void {
    const dead: Entity[] = [];
    const level = this.game.map.getCurrentLevel();
    for (const e of this.statsQuery) {
      if (e.body.hp <= 0) {
        dead.push(e);
      }
    }
    for (const d of dead) {
      this.game.log.addMessage(`${d.name} has died`);
      if (level) {
        const tile = level.tiles.get(d.position!.pos)!;
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
