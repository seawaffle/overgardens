import { Game } from "../game";
import { GameState } from "../data/game-state";

export function newGame(game: Game) {
  if (game.gameState.state !== GameState.MainMenu) {
    return;
  }

  game.startNewGame();
}

export function loadGame(game: Game) {
  game.database.loadGame();
}

export function saveGame(game: Game) {
  game.database.saveGame();
}
