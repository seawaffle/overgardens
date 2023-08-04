import { Game } from "../game";
import { GameState } from "../game-state";

export function openEscapeMenu(game: Game) {
  if (game.gameState.state !== GameState.AwaitingInput) {
    return;
  }

  game.gameState.state = GameState.EscapeMenu;
}

export function closeEscapeMenu(game: Game) {
  if (game.gameState.state !== GameState.EscapeMenu) {
    return;
  }

  game.gameState.state = GameState.AwaitingInput;
}

export function quitToMainMenu(game: Game) {
  if (game.gameState.state !== GameState.EscapeMenu) {
    return;
  }

  game.gameState.state = GameState.MainMenu;
}
