import { Game } from "../game";
import { GameState } from "../data/game-state";

export function newGame(game: Game) {
  if (game.gameState.state !== GameState.MainMenu) {
    return;
  }
  
  game.gameId = Date.now.toString();
  game.procgen.generate();
  game.gameState.setState(GameState.AwaitingInput);
}

export function loadGame(game: Game) {
  game.database.loadGame();
}

export function saveGame(game: Game) {
  game.database.saveGame();
}
