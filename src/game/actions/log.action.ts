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

  game.gameState.setState(GameState.AwaitingInput);
}

export function scrollUpFullLog(game: Game) {
  if (game.gameState.state !== GameState.FullLog) {
    return;
  }
  if (game.logLineNumber > 0) {
    game.logLineNumber--;
  }
}

export function scrollDownFullLog(game: Game) {
  if (game.gameState.state !== GameState.FullLog) {
    return;
  }
  if (game.logLineNumber < game.log.logs.length) {
    game.logLineNumber++;
  }
}
