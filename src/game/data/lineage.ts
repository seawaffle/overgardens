import type { Category } from ".";
import type { Entity, Renderable, Slot } from "../components";

export interface Lineage {
  name: string;
  faction: string;
  categories: Category[];
  minDifficulty: number;
  baseStats: {
    might: number;
    agility: number;
    stability: number;
    intellect: number;
  };
  usesEquipment: boolean;
  slots: Slot[];
  equipment: Entity[];
  renderable: Renderable;
}
