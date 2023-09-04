import type { Entity } from ".";

export interface IncomingDamage {
  amount: number;
  attacker: Entity;
}
