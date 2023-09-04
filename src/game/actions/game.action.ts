import { Game } from "../game";
import { GameState } from "../data";

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

export function gameOver(game: Game) {
  game.quitGame();
  game.gameState.setState(GameState.MainMenu);
}

export function scrollUpScreen(game: Game) {
  if (game.screenLineNumber > 0) {
    game.screenLineNumber--;
    game.updateScreen = true;
  }
}

export function scrollDownScreen(game: Game, max_length: number) {
  if (game.screenLineNumber < max_length - 1) {
    game.screenLineNumber++;
    game.updateScreen = true;
  }
}
