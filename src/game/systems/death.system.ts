import { Query, With } from "miniplex";
import { Entity } from "../components";
import { System } from "./system";
import { Game } from "../game";

export class DeathSystem extends System {
  statsQuery: Query<With<Entity, "body">>;

  constructor(game: Game) {
    super(game);
    this.statsQuery = this.game.ecs.world.with("body");
  }

  update(): void {
    const dead: Entity[] = [];
    for (const e of this.statsQuery) {
      if (e.body.hp <= 0) {
        dead.push(e);
      }
    }
    for (const d of dead) {
      this.game.log.addMessage(`${d.name} has died`);
      this.game.ecs.world.remove(d);
    }
  }
}
