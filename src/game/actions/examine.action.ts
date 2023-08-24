import { Vector2 } from "malwoden";
import { GameState } from "../data";
import { Game } from "../game";

export function exitExamine(game: Game) {
  if (game.gameState.state !== GameState.Examine) {
    return;
  }
  game.examinePosition = { x: -1, y: -1 };
  game.log.clearOverride();
  game.gameState.setState(GameState.AwaitingInput);
}

export function startExamine(game: Game) {
  if (game.gameState.state !== GameState.AwaitingInput) {
    return;
  }
  game.examinePosition = game.player!.position!;
  game.gameState.setState(GameState.Examine);
}

export function moveExamine(game: Game, pos: Vector2, absolute = false) {
  if (game.gameState.state !== GameState.Examine) {
    return;
  }
  const destination = absolute
    ? pos
    : { x: game.examinePosition.x + pos.x, y: game.examinePosition.y + pos.y };
  if (
    destination.x >= 0 &&
    destination.x < game.map.areaWidth &&
    destination.y >= 0 &&
    destination.y < game.map.areaHeight
  ) {
    game.examinePosition = destination;
    const level = game.map.getCurrentLevel()!;
    const tile = level.tiles.get(destination)!;
    const visible = level.visibleTiles.get(destination);
    const tileContent = level.tileContent.get(destination);
    const strings: string[] = [];
    const spacer = " ";
    if (tileContent && tileContent.length > 0) {
      for (const e of tileContent) {
        if (visible && e.body) {
          strings.push(`Name: ${e.name}`);
          const health = e.body.hp!.current / e.body.hp!.max;
          let status = "Uninjured";
          if (health < 0.25) {
            status = "Near Death";
          } else if (health < 0.5) {
            status = "Wounded";
          } else if (health < 0.75) {
            status = "Lightly Wounded";
          }
          strings.push(`Status: ${status}`);
          strings.push(spacer);
        } else if (visible && e.itemProperties) {
          strings.push(`Item: ${e.name}`);
        }
      }
    }
    const explored = level.exploredTiles.get(destination);
    strings.push(explored ? `Terrain: ${tile.type}` : "Unexplored");
    game.log.setOverride(...strings);
  }
}
