import { Game } from "../game";
import { GameState } from "../data";

export function openCharacterSheet(game: Game) {
  if (game.gameState.state === GameState.Ticking) return;
  game.gameState.setState(GameState.Character);
}

export function closeCharacterSheet(game: Game) {
  if (game.gameState.state !== GameState.Character) {
    return;
  }

  game.gameState.setState(GameState.AwaitingInput);
}
