import { Pathfinding, type Vector2 } from "malwoden";
import type { Entity } from "../components";
import { Game } from "../game";
import { GameState, Reaction } from "../data";
import { meleeAttack } from ".";
import { DijkstraMap } from "../data/djikstra-map";

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
  const pos = entity.position!;
  const destination = absolute
    ? position
    : { x: pos.x + position.x, y: pos.y + position.y };
  if (level) {
    for (const e of level.getTileContent(destination)) {
      if (entity.player && e.body) {
        meleeAttack(game, entity, e);
        return;
      }
    }
    const phasing = entity.statuses?.find((s) => s.function === "shadowMerge")
      ? true
      : false;
    if (!level.isBlocked(destination) || phasing) {
      level.setBlocked(pos, false);
      level.setBlocked(destination);
      entity.position! = destination;
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
  const pos = entity.position;
  const astar = new Pathfinding.AStar({
    topology: "eight",
    isBlockedCallback: (p) => {
      return !level.tiles.get(p)!.walkable;
    },
  });
  const path = astar.compute(pos, destination);
  if (path && path.length > 1) {
    tryMoveEntity(game, entity, path[1], true);
  }
}

export function flee(game: Game, entity: Entity, target: Vector2) {
  if (!entity) return;
  if (!entity.position) {
    console.warn("Attempted to move an entity without position");
    return;
  }
  const level = game.map.getCurrentLevel();
  if (!level) return;
  const pos = entity.position;
  const djikstraMap = new DijkstraMap({
    start: pos,
    topology: "eight",
    flee: true,
    isBlockedCallback: (p) => {
      const tile = level.tiles.get(p)!;
      return !tile.walkable;
    },
  });
  djikstraMap.add(target, 100, true);
  const next = djikstraMap.compute();
  if (next) {
    tryMoveEntity(game, entity, next, true);
  }
}

export function autoExplore(game: Game, entity: Entity) {
  if (!entity) return;
  if (!entity.position) {
    console.warn("Attempted to move an entity without position");
    return;
  }
  const level = game.map.getCurrentLevel();
  if (!level) return;
  const pos = entity.position;
  const djikstraMap = new DijkstraMap({
    start: pos,
    topology: "eight",
    isBlockedCallback: (p) => {
      const tile = level.tiles.get(p)!;
      return !tile || !tile.walkable;
    },
  });
  const targets: Vector2[] = [];
  for (let x = 0; x < level.width; x++) {
    for (let y = 0; y < level.height; y++) {
      if (level.exploredTiles.get({ x, y }) === false) {
        targets.push({ x, y });
      }
    }
  }
  if (targets.length === 0) {
    return;
  }
  for (const t of targets) {
    djikstraMap.add(t, 0, true);
  }
  const next = djikstraMap.compute();
  if (next && next !== pos) {
    tryMoveEntity(game, entity, next, true);

    game.extendedActionSystem.setAction(autoExplore, [game, entity]);
  } else {
    game.extendedActionSystem.endAction();
  }
}

export function autoAttack(game: Game, entity: Entity) {
  if (!entity) return;
  if (!entity.position) {
    console.warn("Attempted to move an entity without position");
    return;
  }
  const level = game.map.getCurrentLevel();
  if (!level) return;
  for (const v of entity.viewshed!.visibleTiles!) {
    const tileContent = level.getTileContent(v);
    for (const c of tileContent) {
      if (c.body && game.faction.getReaction(c, entity) === Reaction.Attack) {
        approach(game, entity, v);
        return;
      }
    }
  }
}
