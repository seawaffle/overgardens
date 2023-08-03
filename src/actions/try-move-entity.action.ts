import { Vector2 } from "malwoden";
import { Entity } from "../components";

export function tryMoveEntity(
  entity: Entity,
  position: Vector2,
  absolute = false,
) {
  if (!entity.position) {
    console.warn("Attempted to move an entity without position");
  }

  const pos = entity.position!.pos;
  const destination = absolute
    ? position
    : { x: pos.x + position.x, y: pos.y + position.y };
  entity.position!.pos = destination;
  if (entity.viewshed) {
    entity.viewshed.dirty = true;
  }
}
