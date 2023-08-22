import { Attribute, Pool } from ".";

export interface Body {
  might?: Attribute;
  agility?: Attribute;
  stability?: Attribute;
  intellect?: Attribute;
  hp: Pool;
  xp?: Pool;
  level?: Pool;
}
