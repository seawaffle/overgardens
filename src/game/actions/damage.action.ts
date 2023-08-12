import { Entity } from "../components";
import { Game } from "../game";

export function inflictDamage(game: Game, e: Entity, amount: number) {
  if (e.incomingDamage) {
    e.incomingDamage += amount;
  } else {
    game.ecs.world.addComponent(e, "incomingDamage", amount);
  }
}
