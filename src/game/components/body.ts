import { Attribute, Pool, Slot } from ".";

export interface Body {
  might?: Attribute;
  agility?: Attribute;
  stability?: Attribute;
  intellect?: Attribute;
  dodgeValue?: number;
  damageReduction?: number;
  hp?: Pool;
  xp?: Pool;
  level?: Pool;
  slots?: Slot[];
}
