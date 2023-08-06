import { Game } from "../game";
import { GameState } from "../game-state";

export function openInventory(game: Game) {
  console.log("open inv action");

  if (game.gameState.state !== GameState.AwaitingInput) {
    return;
  }

  game.gameState.setState(GameState.Inventory);
}

export function closeInventory(game: Game) {
  if (game.gameState.state !== GameState.Inventory) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}
