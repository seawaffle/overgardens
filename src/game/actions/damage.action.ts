import type { Entity } from "../components";
import { Game } from "../game";

export function inflictDamage(
  game: Game,
  attacker: Entity,
  defender: Entity,
  amount: number,
) {
  if (defender.incomingDamage) {
    defender.incomingDamage.amount += amount;
    defender.incomingDamage.attacker = attacker;
  } else {
    game.ecs.world.addComponent(defender, "incomingDamage", {
      amount,
      attacker,
    });
  }
}
