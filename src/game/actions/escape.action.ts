import { Game } from "../game";
import { GameState } from "../data";

export function openEscapeMenu(game: Game) {
  if (game.gameState.state !== GameState.AwaitingInput) {
    return;
  }

  game.gameState.setState(GameState.EscapeMenu);
}

export function closeEscapeMenu(game: Game) {
  if (game.gameState.state !== GameState.EscapeMenu) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}

export function quitToMainMenu(game: Game) {
  if (game.gameState.state !== GameState.EscapeMenu) {
    return;
  }

  game.quitGame();
  game.gameState.setState(GameState.MainMenu);
}
