import type { Ability, Entity } from "../components";
import { AbilityFunctions, GameState } from "../data";
import type { Game } from "../game";
import { startTargeting } from "./targeting.action";

export function openAbilities(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.Abilities);
}

export function closeAbilities(game: Game) {
  if (game.gameState.state !== GameState.Abilities) {
    return;
  }
  game.gameState.setState(GameState.AwaitingInput);
}

export function activateAbility(game: Game, entity: Entity, ability: Ability) {
  if (ability.turnsLeft > 0) {
    return;
  }
  // if it needs to be targeted, go to targeting state
  if (ability.targetingProperties && entity.player!) {
    if (game.gameState.state !== GameState.Targeting) {
      game.targetingAbility = ability;
      startTargeting(game);
      return;
    }
  }
  // fire ability
  const abilityFunctions = new AbilityFunctions();
  const func = abilityFunctions.returnFunction(ability.function);
  func(game, entity, ability.args);
  // reset cooldown
  ability.turnsLeft = ability.cooldownAmount;
  // end turn
  if (entity.player!) {
    game.gameState.setState(GameState.Ticking);
  } else {
    game.ecs.world.removeComponent(entity, "currentTurn");
  }
}
