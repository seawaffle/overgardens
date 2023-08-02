import { Game } from "../game";
import { GameState } from "../game-state";

export function newGame(game: Game) {
  if (game.gameState.state !== GameState.MainMenu) {
    return;
  }

  game.gameState.state = GameState.AwaitingInput;
}
