import { GameState } from "../data";
import { Game } from "../game";

export function openContextMenu(game: Game) {
    if (game.gameState.state !== GameState.AwaitingInput) {
        return;
      }
    
      game.gameState.setState(GameState.ContextMenu);   
}

export function closeContextMenu(game: Game) {
    if (game.gameState.state !== GameState.ContextMenu) {
        return;
      }
    
      game.gameState.setState(GameState.AwaitingInput);   
}