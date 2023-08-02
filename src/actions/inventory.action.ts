import { Game } from "../game";
import { GameState } from "../game-state";

export function openInventory(game: Game) {
  if (game.gameState.state !== GameState.AwaitingInput) {
    return;
  }

  game.gameState.state = GameState.Inventory;
}

export function closeInventory(game: Game) {
  if (game.gameState.state !== GameState.Inventory) {
    return;
  }

  game.gameState.state = GameState.AwaitingInput;
}
