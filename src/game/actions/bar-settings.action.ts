import { Game } from "../game";
import { GameState } from "../data";

export function openBarSettings(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.BarSettings);
}

export function closeBarSettings(game: Game) {
  if (game.gameState.state !== GameState.BarSettings) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}
