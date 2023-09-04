import type { Entity } from "../components";

export function heal(entity: Entity, amount: number) {
  if (entity.body) {
    const maxHp = entity.body.hp!.max;
    if (entity.body.hp!.current + amount <= maxHp) {
      entity.body.hp!.current += amount;
    } else {
      entity.body.hp!.current = maxHp;
    }
  }
}
