import { heal } from ".";
import { Entity } from "..//components";
import { GameState } from "../data";
import { Game } from "../game";

export function wait(game: Game, entity: Entity | undefined) {
  if (!entity) {
    return;
  }
  if (entity.player) {
    if (game.waitHealTick) {
      heal(entity, 1);
    }
    game.waitHealTick = !game.waitHealTick;
    game.gameState.setState(GameState.Ticking);
  }
}

export function waitUntilHealed(game: Game, entity: Entity) {
  wait(game, entity);
  if (entity.body) {
    const hp = entity.body.hp!;
    if (hp.current < hp.max) {
      game.extendedActionSystem.setAction(waitUntilHealed, [game, entity]);
    } else {
      game.extendedActionSystem.endAction();
    }
  }
}
