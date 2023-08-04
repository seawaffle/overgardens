import { Vector2 } from "malwoden";
import { Entity } from "../components";
import { Game } from "../game";

export function tryMoveEntity(
  game: Game,
  entity: Entity,
  position: Vector2,
  absolute = false,
) {
  if (!entity.position) {
    console.warn("Attempted to move an entity without position");
  }
  const level = game.map.getCurrentLevel();
  const pos = entity.position!.pos;
  const destination = absolute
    ? position
    : { x: pos.x + position.x, y: pos.y + position.y };
  if (!level.isBlocked(destination)) {
    level.setBlocked(pos, false);
    level.setBlocked(destination);
    entity.position!.pos = destination;
    if (entity.viewshed) {
      entity.viewshed.dirty = true;
    }
  }
}
