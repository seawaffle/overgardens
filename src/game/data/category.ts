import type { Entity } from "../components";

export interface Category {
  name: string;
  addedDifficulty: number;
  equipment: Entity[];
}
