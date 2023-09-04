import { Query, type With } from "miniplex";
import { Game } from "../game";
import { System } from "./system";
import type { Entity } from "../components";
import { experienceForKilling } from "../mechanics";

export class DamageSystem extends System {
  damageQuery: Query<With<Entity, "body" | "incomingDamage">>;

  constructor(game: Game) {
    super(game);
    this.damageQuery = this.game.ecs.world.with("body", "incomingDamage");
  }

  update(): void {
    for (const e of this.damageQuery) {
      e.body.hp!.current -= e.incomingDamage.amount;
      if (e.body.hp!.current <= 0) {
        this.game.ecs.world.addComponent(e, "dying", true);
        const gainedExperience = experienceForKilling(e);
        if (e.incomingDamage.attacker.gainedExperience) {
          e.incomingDamage.attacker.gainedExperience += gainedExperience;
        } else {
          this.game.ecs.world.addComponent(
            e.incomingDamage.attacker,
            "gainedExperience",
            gainedExperience,
          );
        }
      }
      this.game.ecs.world.removeComponent(e, "incomingDamage");
    }
  }
}
