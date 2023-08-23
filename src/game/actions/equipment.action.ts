import { Game } from "../game";
import { GameState } from "../data/game-state";

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
