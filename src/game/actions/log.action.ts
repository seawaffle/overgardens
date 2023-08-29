import { GameState } from "../data";
import { Game } from "../game";

export function openFullLog(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.FullLog);
}

export function closeFullLog(game: Game) {
  if (game.gameState.state !== GameState.FullLog) {
    return;
  }

  game.screenLineNumber = 0;
  game.gameState.setState(GameState.AwaitingInput);
}
