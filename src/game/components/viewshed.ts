import type { Vector2 } from "malwoden";

export interface Viewshed {
  visibleTiles?: Vector2[];
  range: number;
  dirty?: boolean;
}
