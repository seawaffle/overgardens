import { Game } from "../game";
import { GameState } from "../data/game-state";

export function openInventory(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.Inventory);
}

export function closeInventory(game: Game) {
  if (game.gameState.state !== GameState.Inventory) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}
