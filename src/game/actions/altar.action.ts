import { Entity } from "../components";
import { GameState } from "../data";
import { Game } from "../game";

export function kneelAtAltar(game: Game, me: Entity) {
  // find altar
  const level = game.map.getCurrentLevel()!;
  const neighbors = level.tiles.getNeighbors(me.position!);
  for (const n of neighbors) {
    const tileContent = level.getTileContent(n);
    for (const c of tileContent) {
      if (c.altarProperties) {
        // found altar
        game.log.addMessage(
          `${me.name} kneels at an altar of ${c.altarProperties.ageless}`,
        );
        openCommunion(game, c);
        return;
      }
    }
  }
}

export function openCommunion(game: Game, altar: Entity) {
  if (game.gameState.state === GameState.Ticking) return;
  game.pantheon.setAltar(altar);
  game.gameState.setState(GameState.Communion);
}

export function closeCommunion(game: Game) {
  if (game.gameState.state !== GameState.Communion) {
    return;
  }
  game.gameState.setState(GameState.AwaitingInput);
  game.pantheon.removeAltar(game.pantheon.sacrificed);
}
