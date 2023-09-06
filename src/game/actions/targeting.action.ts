import { Pathfinding, type Vector2 } from "malwoden";
import { GameState } from "../data";
import { Game } from "../game";
import { activateAbility } from ".";

export function exitTargeting(game: Game) {
  if (game.gameState.state !== GameState.Targeting) {
    return;
  }
  game.targetPosition = { x: -1, y: -1 };
  game.log.clearOverride();
  game.gameState.setState(GameState.AwaitingInput);
}

export function startTargeting(game: Game) {
  if (
    ![GameState.AwaitingInput, GameState.Abilities].includes(
      game.gameState.state,
    )
  ) {
    return;
  }
  game.targetPosition = game.player!.position!;
  game.log.setOverride("Targeting...");
  game.gameState.setState(GameState.Targeting);
}

export function moveTargeting(game: Game, pos: Vector2, absolute = false) {
  if (game.gameState.state !== GameState.Targeting) {
    return;
  }
  const destination = absolute
    ? pos
    : { x: game.targetPosition.x + pos.x, y: game.targetPosition.y + pos.y };
  if (
    destination.x >= 0 &&
    destination.x < game.map.areaWidth &&
    destination.y >= 0 &&
    destination.y < game.map.areaHeight
  ) {
    const level = game.map.getCurrentLevel()!;
    const rangeFinder = new Pathfinding.RangeFinder({
      topology: "eight",
    });
    const range = rangeFinder.compute({
      start: game.player!.position!,
      maxRange: game.targetingAbility!.targetingProperties!.range,
    });
    if (range.find((r) => r.x === destination.x && r.y === destination.y)) {
      const visible = level.visibleTiles.get(destination)!;
      if (visible) {
        game.targetPosition = destination;
      }
    }
  }
}

export function selectTarget(game: Game) {
  if (game.gameState.state !== GameState.Targeting) {
    return;
  }
  activateAbility(game, game.player!, game.targetingAbility!);
}
