import { Pathfinding, Vector2 } from "malwoden";
import { Entity } from "../components";
import { Game } from "../game";
import { GameState } from "../data";
import { meleeCombat } from ".";

export function tryMoveEntity(
  game: Game,
  entity: Entity | undefined,
  position: Vector2,
  absolute = false,
) {
  if (!entity) return;
  if (!entity.position) {
    console.warn("Attempted to move an entity without position");
  }
  const level = game.map.getCurrentLevel();
  const pos = entity.position!.pos;
  const destination = absolute
    ? position
    : { x: pos.x + position.x, y: pos.y + position.y };
  if (level) {
    for (const e of level.getTileContent(destination)) {
      if (entity.player && e.body) {
        meleeCombat(game, entity, e);
        return;
      }
    }
    if (!level.isBlocked(destination)) {
      level.setBlocked(pos, false);
      level.setBlocked(destination);
      entity.position!.pos = destination;
      if (entity.viewshed) {
        entity.viewshed.dirty = true;
      }
      if (entity.player) {
        game.gameState.setState(GameState.Ticking);
      }
    }
  }
}

export function approach(game: Game, entity: Entity, destination: Vector2) {
  if (!entity) return;
  if (!entity.position) {
    console.warn("Attempted to move an entity without position");
    return;
  }
  const level = game.map.getCurrentLevel();
  if (!level) return;
  const pos = entity.position.pos;
  const astar = new Pathfinding.AStar({
    topology: "eight",
    isBlockedCallback: (p) => {
      // if (p === destination) return false;
      return !level.tiles.get(p)!.walkable;
    },
  });
  const path = astar.compute(pos, destination);
  if (path && path.length > 1) {
    tryMoveEntity(game, entity, path[1], true);
  }
}

export function flee(game: Game, entity: Entity, target: Vector2) {
  console.log(`${entity.name} wants to flee`)
}