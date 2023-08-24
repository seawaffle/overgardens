import { Game } from "../game";
import { GameState } from "../data/game-state";
import { Entity } from "../components";

export function openEquipment(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.Equipment);
}

export function closeEquipment(game: Game) {
  if (game.gameState.state !== GameState.Equipment) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}

export function equipItem(game: Game, me: Entity, item: Entity) {
  
}

export function unequipItem(game: Game, me: Entity, item: Entity) {
  
}
