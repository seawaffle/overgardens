import { Game } from "../game";
import { GameState } from "../game-state";

export function openHelp(game: Game) {
  if (game.gameState.state !== GameState.AwaitingInput) {
    return;
  }

  game.gameState.setState(GameState.HelpScreen);
}

export function closeHelp(game: Game) {
  if (game.gameState.state !== GameState.HelpScreen) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}
