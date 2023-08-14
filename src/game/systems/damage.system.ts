import { Query, With } from "miniplex";
import { Game } from "../game";
import { System } from "./system";
import { Entity } from "../components";

export class DamageSystem extends System {
  damageQuery: Query<With<Entity, "body" | "incomingDamage">>;

  constructor(game: Game) {
    super(game);
    this.damageQuery = this.game.ecs.world.with("body", "incomingDamage");
  }

  update(): void {
    for (const e of this.damageQuery) {
      e.body.hp -= e.incomingDamage;
      this.game.ecs.world.removeComponent(e, "incomingDamage");
    }
  }
}
